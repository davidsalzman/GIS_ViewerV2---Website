import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';

import { AuthRoles } from '../common/auth-roles';

@Injectable({
    providedIn: 'root',
})
export class AdminGuard implements CanActivate {

    constructor(private router: Router,
        private authService: AuthService,
        private localStorageService: LocalStorageService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.hasRole(AuthRoles.WEBSITE_ADMIN)) {
            this.localStorageService.redirect.set(state.url);
            this.router.navigate(['/']);
            return false;
        } else {
            return true;
        }
    }
}
