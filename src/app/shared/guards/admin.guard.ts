import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';

import { UserRoleEnum } from '../enums/user-role';

@Injectable({
    providedIn: 'root',
})
export class AdminGuard  {

    constructor(private router: Router,
        private authService: AuthService,
        private localStorageService: LocalStorageService) { }

        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
            return this.authService.getAuthUser().then((authUser) => {
                if (authUser!.role === UserRoleEnum.Admin) {
                    return true;
                } else {
                    this.router.navigate(['/']);
                    return false;
                }
            }).catch(() => {
                this.router.navigate(['/']);
                return false;
            });
        }
}
