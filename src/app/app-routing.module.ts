import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutShellComponent } from './core/containers/layout-shell/layout-shell.component';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [{
  path: 'auth',
  loadChildren: () => import('./auth/auth.routes').then(m => m.routes)
}, {
  path: '',

  component: LayoutShellComponent,
  children: [

    {
      path: 'home',
      canActivate: [AuthGuard],
      loadChildren: () => import('./home/home.routes').then(m => m.routes)
    },
    {
      path: 'allpay',
      canActivate: [AuthGuard],
      loadChildren: () => import('./allpay/allpay.routes').then(m => m.routes)
    },
    {
      path: 'download',
      canActivate: [AuthGuard],
      loadChildren: () => import('./download/download.routes').then(m => m.routes)
    },
    {
      path: 'upload',
      canActivate: [AuthGuard],
      loadChildren: () => import('./upload/upload.routes').then(m => m.routes)
    },
    
    {
      path: 'user',
      canActivate: [AuthGuard],
      loadChildren: () => import('./admin/users/user.routes').then(m => m.routes)
    },
   
    {
      path: 'export',
      canActivate: [AuthGuard],
      loadChildren: () => import('./admin/exports/export.routes').then(m => m.routes)
    },
    {
      path: 'import',
      canActivate: [AuthGuard],
      loadChildren: () => import('./admin/imports/import.routes').then(m => m.routes)
    },
   
    
    {
      path: '**',
      redirectTo: '/home'
    }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

