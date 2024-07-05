import { Routes } from '@angular/router';

import { AdminGuard } from '../shared/guards/admin.guard';
import { AuthGuard } from  '../shared/guards/auth.guard';

export const routes: Routes = [{
    path: '',
    canActivate: [AuthGuard],
    title: 'Home | Pay360 Local',
    loadComponent: () => import('./home.component').then((x) => x.HomeComponent)
}];
