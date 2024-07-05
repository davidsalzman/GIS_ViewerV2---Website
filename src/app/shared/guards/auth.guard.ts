import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard  {

    constructor(private router: Router,
        private authService: AuthService,
        private localStorageService: LocalStorageService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.isAuthenticated()) {
            this.localStorageService.redirect.set(state.url);
            this.router.navigate(['/', 'auth', 'login']);
            return false;
        } else {
            return true;
        }
    }
}
