import { Routes } from '@angular/router';

import { AdminGuard } from '../shared/guards/admin.guard';
import { AuthGuard } from  '../shared/guards/auth.guard';

export const routes: Routes = [
   
    {
    path: 'download',
    canActivate: [AuthGuard],
        title: 'File Download | Pay360 Local',
        data: {
            showGroups: false
        },
        loadComponent: () => import('./containers/file-download-shell.component/file-download-shell.component').then((x) => x.FileDownloadShellComponent)
    },
    {
        path: '',
        canActivate: [AuthGuard],
            title: 'File Download | Pay360 Local',
            data: {
                showGroups: false
            },
            loadComponent: () => import('./containers/file-download-shell.component/file-download-shell.component').then((x) => x.FileDownloadShellComponent)
        }


];
