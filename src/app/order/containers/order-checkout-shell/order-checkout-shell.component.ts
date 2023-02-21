import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faPlus, faSterlingSign, faTimes } from '@fortawesome/free-solid-svg-icons';

import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { IGameDTO } from 'src/app/shared/api/models/v1/game';
import { IUserDTO } from 'src/app/shared/api/models/v1/user';
import { IUserBasketDTO } from 'src/app/shared/api/models/v1/user-basket';

import { ApiService } from 'src/app/shared/api/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BasketService } from 'src/app/shared/services/basket.service';
import { MessageService } from 'src/app/shared/services/message.service';

import { ValidateFormControlDirective } from 'src/app/shared/directives/validate-form-control.directive';

interface IFormGroup {
  name: FormControl<string>;
  email: FormControl<string>;
}

@Component({
  selector: 'app-order-checkout-shell',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule,
    ValidateFormControlDirective
  ],
  templateUrl: './order-checkout-shell.component.html',
  styleUrls: ['./order-checkout-shell.component.scss']
})
export class OrderCheckoutShellComponent implements OnInit, OnDestroy {
  faCircle = faCircle;
  faSterlingSign = faSterlingSign;
  faPlus = faPlus;
  faTimes = faTimes;

  public isSubmitting = false;
  public basket: IUserBasketDTO[] = [];
  public totalCharge: number = 0;
  public orderId?: number;
  public form = this.fb.group<IFormGroup>({
    name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] })
  });

  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService,
    private api: ApiService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private basketService: BasketService) { }

  ngOnInit(): void {
    this.basket = this.basketService.getBasket();
    this.calcTotalCharge();

    this.subscriptions.push(this.basketService.basket$.subscribe((basket: IUserBasketDTO[]) => {
      this.basket = basket;
      this.calcTotalCharge();
    }));

    if (this.authService.isAuthenticated()) {
      const authUser = this.authService.getUser();
      this.form.patchValue({
        name: authUser?.name,
        email: authUser?.email
      });

      this.subscriptions.push(this.authService.user$.subscribe((authUser: IUserDTO | null) => {
        this.form.patchValue({
          name: authUser?.name,
          email: authUser?.email
        });
      }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  public async onIncreaseBasket(game: IGameDTO) {
    try {
      await this.basketService.addAsync(game);
    } catch (error) {
      this.messageService.exception(error, 'Failed to add game to basket');
    }
  }

  public async onDecreaseBasket(game: IGameDTO) {
    try {
      await this.basketService.removeAsync(game);
    } catch (error) {
      this.messageService.exception(error, 'Failed to remove game from basket');
    }
  }

  public async onSubmit() {
    if (!this.form.valid || !this.basket || this.basket.length == 0 || this.isSubmitting) return;
    try {
      this.isSubmitting = true;
      this.spinner.show();
      const formDetails = this.form.getRawValue();

      this.orderId = await this.api.orders.createAsync({
        name: formDetails.name,
        email: formDetails.email,
        totalCharge: this.totalCharge,
        games: this.basket.map(x => {
          return {
            gameId: x.game.id,
            quantity: x.quantity
          }
        })
      });
      this.messageService.success('Order Placed');
      try { await this.basketService.emptyAsync(); } catch (error) { }
    } catch (error) {
      this.messageService.exception(error, 'Failed to place order, please try again!');
    } finally {
      this.isSubmitting = false;
      this.spinner.hide();
    }
  }

  private calcTotalCharge() {
    this.totalCharge = 0;

    if (this.basket && this.basket.length > 0) {
      for (let item of this.basket) {
        this.totalCharge += item.game.price * item.quantity;
      }
    }
  }
}
