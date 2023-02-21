import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle, faKey, faSterlingSign } from '@fortawesome/free-solid-svg-icons';

import { Subscription } from 'rxjs';
import { IOrderDTO } from 'src/app/shared/api/models/v1/order';

import { ApiService } from 'src/app/shared/api/api.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-order-view-shell',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './order-view-shell.component.html',
  styleUrls: ['./order-view-shell.component.scss']
})
export class OrderViewShellComponent implements OnInit, OnDestroy {
  faCircle = faCircle;
  faSterlingSign = faSterlingSign;
  faKey = faKey;

  public order!: IOrderDTO;

  private subscriptions: Subscription[] = [];

  constructor(private api: ApiService,
    private messageService: MessageService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute) { }

  async ngOnInit() {
    const orderId = +this.route.snapshot.params['id'];

    if (!orderId) {
      this.router.navigate(['/']);
      return;
    }

    try {
      this.order = await this.api.orders.getByIdAsync(orderId);
      this.title.setTitle(`View Order #${orderId} | Example Website`);
    } catch (error) {
      this.messageService.exception(error, 'Failed to load order');
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }
}
