import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/shared/services/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { MessageService } from 'src/app/shared/services/message.service';

interface IFormGroup {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-shell.component.html',
  styleUrls: ['./login-shell.component.scss']
})
export class LoginShellComponent implements OnInit {
  public isSubmitting = false;
  public failedLogin = false;

  public form = this.fb.group<IFormGroup>({
    email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
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
      try {
        const formDetails = this.form.getRawValue();

        this.isSubmitting = true;
        this.failedLogin = false;
        this.spinner.show();

        if (await this.authService.loginAsync(formDetails.email, formDetails.password)) {
          const redirect = this.localStorageService.redirect.get();
          this.localStorageService.redirect.clear();
          if (redirect) {
            this.router.navigateByUrl(redirect);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.messageService.danger('Failed to login, please try again!');
          this.form.controls.password.reset();
          this.failedLogin = true;
          this.isSubmitting = false;
        }
      } catch (error) {
        this.messageService.exception(error, 'Failed to login, please try again!');
        this.form.controls.password.reset();
        this.failedLogin = true;
        this.isSubmitting = false;
      } finally {
        this.spinner.hide();
      }
    }
  }

}
