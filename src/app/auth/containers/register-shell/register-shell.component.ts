import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { ApiService } from 'src/app/shared/api/api.service';
import { MessageService } from 'src/app/shared/services/message.service';

import { BotCheckerComponent } from 'src/app/shared/components/bot-checker/bot-checker.component';

interface IFormGroup {
  email: FormControl<string>;
  name: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-register-shell',
  standalone: true, 
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    BotCheckerComponent
  ],
  templateUrl: './register-shell.component.html',
  styleUrls: ['./register-shell.component.scss']
})
export class RegisterShellComponent implements OnInit {
  public isSubmitting = false;
  public hasRegistered = false;
  public isBotValid = false;

  public form = this.fb.group<IFormGroup>({
    email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    password: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    confirmPassword: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(private fb: FormBuilder,
    private api: ApiService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    const email = this.route.snapshot.queryParams['email'];
    if (email) {
      this.form.patchValue({
        email: email
      });
    }
  }

  public async onSubmit() {
    if (this.form.valid && !this.isSubmitting) {
      if (!this.isBotValid) {
        this.messageService.warning('The code you have entered does not match the required value, please check you have enter the code correctly');
        return;
      }
      try {
        const formDetails = this.form.getRawValue();

        if (formDetails.password != formDetails.confirmPassword) {
          this.messageService.danger('Passwords don\'t match');
          return;
        }
        
        this.spinner.show();
        this.isSubmitting = true;
        this.hasRegistered = false;

        await this.api.users.signUpAsync({
          email: formDetails.email,
          name: formDetails.name,
          password: formDetails.password,
        });

        this.hasRegistered = true;
        this.isSubmitting = false;

      } catch (error) {
        this.messageService.exception(error, 'Failed to register, please try again!');
        this.form.controls.password.reset();
        this.hasRegistered = false;
        this.isSubmitting = false;
      } finally {
        this.spinner.hide();
      }
    }
  }

}
