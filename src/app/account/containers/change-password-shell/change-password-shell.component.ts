import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { ApiService } from 'src/app/shared/api/api.service';
import { MessageService } from 'src/app/shared/services/message.service';

import { ValidateFormControlDirective } from 'src/app/shared/directives/validate-form-control.directive';

interface IFormGroup {
  currentPassword: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-change-password-shell',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidateFormControlDirective
  ],
  templateUrl: './change-password-shell.component.html',
  styleUrls: ['./change-password-shell.component.scss']
})
export class ChangePasswordShellComponent {
  public isSubmitting = false;

  public form = this.fb.group<IFormGroup>({
    currentPassword: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    password: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    confirmPassword: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(private fb: FormBuilder,
    private api: ApiService,
    private messageService: MessageService) { }

  public async onSubmit() {
    if (this.form.valid && !this.isSubmitting) {
      try {
        const formDetails = this.form.getRawValue();

        if(formDetails.password != formDetails.confirmPassword){
          this.messageService.danger('Passwords don\'t match');
          return;
        }

        this.isSubmitting = true;

        await this.api.users.changePasswordAsync({
          currentPassword: formDetails.currentPassword,
          newPassword: formDetails.password
        });

        this.messageService.success('Password changed');        
      } catch (error) {
        this.messageService.exception(error, 'Failed to change your password, please try again!');
        this.form.reset();
      } finally {        
        this.isSubmitting = false;
      }
    }
  }
}
