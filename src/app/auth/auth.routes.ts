import { Routes } from '@angular/router';

import { NoAuthGuard } from '../shared/guards/no-auth.guard';

export const routes: Routes = [{
    path: 'login',
    canActivate: [NoAuthGuard],
    title: 'Login | Pay360 Local',
    loadComponent: () => import('./containers/login-shell/login-shell.component').then((x) => x.LoginShellComponent)
}];
