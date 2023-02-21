import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { IUserDTO } from 'src/app/shared/api/models/v1/user';

import { ApiService } from 'src/app/shared/api/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';

import { ValidateFormControlDirective } from 'src/app/shared/directives/validate-form-control.directive';

interface IFormGroup {
  name: FormControl<string>;
}

@Component({
  selector: 'app-edit-shell',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidateFormControlDirective
  ],
  templateUrl: './edit-shell.component.html',
  styleUrls: ['./edit-shell.component.scss']
})
export class EditShellComponent implements OnInit, OnDestroy {
  public isSubmitting = false;

  public form = this.fb.group<IFormGroup>({
    name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
  });

  private subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder,
    private api: ApiService,
    private authService: AuthService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.patchForm(this.authService.getUser());
    this.subscriptions.push(this.authService.user$.subscribe((user: IUserDTO | null) => {
      this.patchForm(user);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  public async onSubmit() {
    if (this.form.valid && !this.isSubmitting) {
      try {
        this.isSubmitting = true;
        const formDetails = this.form.getRawValue();

        await this.api.users.updateAsync({
          name: formDetails.name
        });

        this.authService.refreshAuthUserAsync();
        this.messageService.success('Details updated');
      } catch (error) {
        this.messageService.exception(error, 'Failed to update your details, please try again!');
        this.form.reset();
        this.isSubmitting = false;
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  private patchForm(user: IUserDTO | null) {
    if (user) {
      this.form.patchValue({
        name: user.name
      });
    }
  }
}
