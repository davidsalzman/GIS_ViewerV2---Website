import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ApiService } from 'src/app/shared/api/api.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-confirm-account-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './confirm-account-shell.component.html',
  styleUrls: ['./confirm-account-shell.component.scss']
})
export class ConfirmAccountShellComponent implements OnInit {
  public isSubmitting = true;
  public confirmFailed = false;

  constructor(private api: ApiService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router) { }

  async ngOnInit() {
    const email = this.route.snapshot.queryParams['email'];
    const token = this.route.snapshot.queryParams['token'];
    if (!email || !token) {
      this.isSubmitting = false;
      this.confirmFailed = true;
      return;
    }

    try {
      await this.api.users.confirmAccountAsync({
        email,
        token
      });

      this.messageService.success('Account confirmed');
      this.router.navigate(['/', 'auth', 'login'], {
        queryParams: {
          email
        }
      });
    } catch (error) {
      this.isSubmitting = false;
      this.confirmFailed = true;
    }
  }

}
