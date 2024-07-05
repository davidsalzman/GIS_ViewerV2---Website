import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) { }
  async ngOnInit() {
    //localStorage.clear()

    console.log(this.authService.isAuthenticated())
    if (this.authService.isAuthenticated()) {
      
      if (!await this.authService.refreshToken()) {
        this.authService.logout();
      }
    }
    
  }
}
