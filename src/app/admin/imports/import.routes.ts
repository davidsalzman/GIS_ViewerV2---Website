import { Routes } from '@angular/router';

import { AdminGuard } from '../../shared/guards/admin.guard';
import { AuthGuard } from  '../../shared/guards/auth.guard';

export const routes: Routes = [{
    path: 'create',
    canActivate: [AuthGuard, AdminGuard],
    title: 'Import Create | Pay360 Local',
    loadComponent: () => import('./containers/import-edit-shell/import-edit-shell.component').then((x) => x.ImportEditShellComponent)
}, {
    path: ':id/edit',
    canActivate: [AuthGuard, AdminGuard],
    title: 'Import Edit | Pay360 Local',
    loadComponent: () => import('./containers/import-edit-shell/import-edit-shell.component').then((x) => x.ImportEditShellComponent)
    },
   
    {
    path: '',
    canActivate: [AuthGuard, AdminGuard],
        title: 'Import Search | Pay360 Local',
        data: {
            showGroups: false
        },
    loadComponent: () => import('./containers/import-search-shell/import-search-shell.component').then((x) => x.ImportSearchShellComponent)
}];
