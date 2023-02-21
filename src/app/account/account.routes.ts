import { Routes } from '@angular/router';

import { AuthGuard } from '../shared/guards/auth.guard';

export const routes: Routes = [{
    path: '',
    canActivate: [AuthGuard],
    title: 'My Account | Example Website',
    loadComponent: () => import('./containers/account-shell/account-shell.component').then((x) => x.AccountShellComponent),
    children: [{
        path: 'change-password',
        title: 'My Account - Change Password | Example Website',
        loadComponent: () => import('./containers/change-password-shell/change-password-shell.component').then((x) => x.ChangePasswordShellComponent)
    }, {
        path: '',
        title: 'My Account | Example Website',
        loadComponent: () => import('./containers/edit-shell/edit-shell.component').then((x) => x.EditShellComponent)
    }]
}];
