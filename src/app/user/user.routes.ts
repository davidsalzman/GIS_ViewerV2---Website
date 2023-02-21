import { Routes } from '@angular/router';

import { AdminGuard } from '../shared/guards/admin.guard';
import { AuthGuard } from '../shared/guards/auth.guard';

export const routes: Routes = [{
    path: 'create',
    canActivate: [AuthGuard, AdminGuard],
    title: 'User Create | Example Website',
    loadComponent: () => import('./containers/user-edit-shell/user-edit-shell.component').then((x) => x.UserEditShellComponent)
}, {
    path: ':id/edit',
    canActivate: [AuthGuard, AdminGuard],
    title: 'User Edit | Example Website',
    loadComponent: () => import('./containers/user-edit-shell/user-edit-shell.component').then((x) => x.UserEditShellComponent)
}, {
    path: '',
    canActivate: [AuthGuard, AdminGuard],
    title: 'User Search | Example Website',
    loadComponent: () => import('./containers/user-search-shell/user-search-shell.component').then((x) => x.UserSearchShellComponent)
}];
