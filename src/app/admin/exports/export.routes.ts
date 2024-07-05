import { Routes } from '@angular/router';

import { AdminGuard } from '../../shared/guards/admin.guard';
import { AuthGuard } from  '../../shared/guards/auth.guard';

export const routes: Routes = [{
    path: 'create',
    canActivate: [AuthGuard, AdminGuard],
    title: 'Export Create | Pay360 Local',
    loadComponent: () => import('./containers/export-edit-shell/export-edit-shell.component').then((x) => x.ExportEditShellComponent)
}, {
    path: ':id/edit',
    canActivate: [AuthGuard, AdminGuard],
    title: 'Export Edit | Pay360 Local',
    loadComponent: () => import('./containers/export-edit-shell/export-edit-shell.component').then((x) => x.ExportEditShellComponent)
    },
   
    {
    path: '',
    canActivate: [AuthGuard, AdminGuard],
        title: 'Export Search | Pay360 Local',
        data: {
            showGroups: false
        },
    loadComponent: () => import('./containers/export-search-shell/export-search-shell.component').then((x) => x.ExportSearchShellComponent)
}];
