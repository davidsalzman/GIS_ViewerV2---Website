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
}

@Component({
  selector: 'app-forgot-password-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    BotCheckerComponent
  ],
  templateUrl: './forgot-password-shell.component.html',
  styleUrls: ['./forgot-password-shell.component.scss']
})
export class ForgotPasswordShellComponent implements OnInit {
  public isSubmitting = false;
  public resetSent = false;
  public isBotValid = false;

  public form = this.fb.group<IFormGroup>({
    email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] })
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
        this.isSubmitting = true;
        this.spinner.show();

        await this.api.users.requestResetPasswordAsync({
          email: formDetails.email
        });
        this.resetSent = true;
      } catch (error) {
        this.messageService.exception(error, 'Failed to request a password reset, please try again!');
        this.form.controls.email.reset();
        this.resetSent = false;
        this.isSubmitting = false;
      } finally {
        this.spinner.hide();
      }
    }
  }

}
