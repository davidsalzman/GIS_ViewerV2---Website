import { Routes } from '@angular/router';

import { NoAuthGuard } from '../shared/guards/no-auth.guard';

export const routes: Routes = [{
    path: 'login',
    canActivate: [NoAuthGuard],
    title: 'Login | Example Website',
    loadComponent: () => import('./containers/login-shell/login-shell.component').then((x) => x.LoginShellComponent)
}, {
    path: 'forgot-password',
    canActivate: [NoAuthGuard],
    title: 'Forgot Password | Example Website',
    loadComponent: () => import('./containers/forgot-password-shell/forgot-password-shell.component').then((x) => x.ForgotPasswordShellComponent)
}, {
    path: 'reset-password',
    canActivate: [NoAuthGuard],
    title: 'Reset Password | Example Website',
    loadComponent: () => import('./containers/reset-password-shell/reset-password-shell.component').then((x) => x.ResetPasswordShellComponent)
}, {
    path: 'confirm-account',
    canActivate: [NoAuthGuard],
    title: 'Confirm Account | Example Website',
    loadComponent: () => import('./containers/confirm-account-shell/confirm-account-shell.component').then((x) => x.ConfirmAccountShellComponent)
}, {
    path: 'register',
    canActivate: [NoAuthGuard],
    title: 'Register | Example Website',
    loadComponent: () => import('./containers/register-shell/register-shell.component').then((x) => x.RegisterShellComponent)
}];
