import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { ApiService } from 'src/app/shared/api/api.service';
import { MessageService } from 'src/app/shared/services/message.service';

interface IFormGroup {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-reset-password-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reset-password-shell.component.html',
  styleUrls: ['./reset-password-shell.component.scss']
})
export class ResetPasswordShellComponent implements OnInit {
  public isSubmitting = false;

  public form = this.fb.group<IFormGroup>({
    password: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    confirmPassword: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
  });

  private email!: string;
  private token!: string;

  constructor(private fb: FormBuilder,
    private api: ApiService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParams['email'];
    this.token = this.route.snapshot.queryParams['token'];

    if(!this.email || !this.token){
      this.router.navigate(['/', 'auth', 'login']);
    }
  }

  public async onSubmit() {
    if (this.form.valid && !this.isSubmitting) {
      try {
        const formDetails = this.form.getRawValue();

        if(formDetails.password != formDetails.confirmPassword){
          this.messageService.danger('Passwords don\'t match');
          return;
        }

        this.spinner.show();
        this.isSubmitting = true;

        await this.api.users.resetPasswordAsync({
          email: this.email,
          token: this.token,
          password: formDetails.password
        });
        this.messageService.success('Password reset');
        this.router.navigate(['/', 'auth', 'login'], {
          queryParams: {
            email: this.email
          }
        });
        
      } catch (error) {
        this.messageService.exception(error, 'Failed to reset password, please try again!');
        this.form.reset();
        this.isSubmitting = false;
      } finally {        
        this.spinner.hide();
      }
    }
  }

}
