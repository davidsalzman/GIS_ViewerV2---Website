import { Routes } from '@angular/router';

import { AdminGuard } from '../shared/guards/admin.guard';
import { AuthGuard } from  '../shared/guards/auth.guard';

export const routes: Routes = [
   
    {
    path: 'allpay',
    canActivate: [AuthGuard],
        title: 'Allpay | Pay360 Local',
        data: {
            showGroups: false
        },
        loadComponent: () => import('./containers/allpay-shell.component/allpay-shell.component').then((x) => x.AllpayShellComponent)
    },
    {
        path: '',
        canActivate: [AuthGuard],
            title: 'Allpay | Pay360 Local',
            data: {
                showGroups: false
            },
            loadComponent: () => import('./containers/allpay-shell.component/allpay-shell.component').then((x) => x.AllpayShellComponent)
        }


];
