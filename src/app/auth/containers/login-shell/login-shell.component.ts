import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/shared/api/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-login-shell',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule
  ],
  templateUrl: './login-shell.component.html',
  styleUrls: ['./login-shell.component.scss']
})
export class LoginShellComponent implements OnInit {
  faExclamationTriangle = faExclamationTriangle;
  
  public errorText = '';
  public isLoading = true;

  constructor(private api: ApiService, private authService: AuthService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private spinner: NgxSpinnerService) { }

  async ngOnInit() {
    this.adLogin();
  }

  private async adLogin() {
    try {
      this.spinner.show();
      const auth = await this.api.auth.login();
      console.log('adLogin auth = ' + JSON.stringify(auth))
      if (!auth) {
        this.spinner.hide();
        this.errorText = 'Account not found, please contact the system admin';
      } else {
        
        await this.authService.login(auth);
        this.authService.startRefresh();
        const redirect = this.localStorageService.redirect.get();
        this.localStorageService.redirect.clear();
        this.spinner.hide();
        if (redirect) {
          this.router.navigateByUrl(redirect);
        } else {
          this.router.navigate(['/']);
        }
      }
    } catch (error) {
      this.spinner.hide();
      this.errorText = 'Account not found, please contact the system admin';
    }
  }

}
