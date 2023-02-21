import { Routes } from '@angular/router';

import { AuthGuard } from '../shared/guards/auth.guard';

export const routes: Routes = [{
    path: ':id/view',
    title: 'View Order | Example Website',
    loadComponent: () => import('./containers/order-view-shell/order-view-shell.component').then((x) => x.OrderViewShellComponent)
}, {
    path: 'checkout',
    title: 'Checkout | Example Website',
    loadComponent: () => import('./containers/order-checkout-shell/order-checkout-shell.component').then((x) => x.OrderCheckoutShellComponent)
}, {
    path: '',
    canActivate: [AuthGuard],
    title: 'Orders | Example Website',
    loadComponent: () => import('./containers/order-search-shell/order-search-shell.component').then((x) => x.OrderSearchShellComponent)
}];
