import { Routes } from '@angular/router';

import { AdminGuard } from '../shared/guards/admin.guard';
import { AuthGuard } from  '../shared/guards/auth.guard';

export const routes: Routes = [
   
    {
    path: 'upload',
    canActivate: [AuthGuard],
        title: 'File Upload | Pay360 Local',
        data: {
            showGroups: false
        },
        loadComponent: () => import('./containers/file-upload-shell.component/file-upload-shell.component').then((x) => x.FileUploadShellComponent)
    },
    {
        path: '',
        canActivate: [AuthGuard],
            title: 'File Upload | Pay360 Local',
            data: {
                showGroups: false
            },
            loadComponent: () => import('./containers/file-upload-shell.component/file-upload-shell.component').then((x) => x.FileUploadShellComponent)
        }


];
