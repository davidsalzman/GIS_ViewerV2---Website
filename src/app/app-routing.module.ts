import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutShellComponent } from './core/containers/layout-shell/layout-shell.component';

const routes: Routes = [{
  path: 'auth',
  loadChildren: () => import('./auth/auth.routes').then(m => m.routes)
}, {
  path: '',
  component: LayoutShellComponent,
  children: [{
    path: 'game',
    loadChildren: () => import('./game/game.routes').then(m => m.routes)
  }, {
    path: 'order',
    loadChildren: () => import('./order/order.routes').then(m => m.routes)
  }, {
    path: 'account',
    loadChildren: () => import('./account/account.routes').then(m => m.routes)
  }, {
    path: 'chart',
    loadChildren: () => import('./chart/chart.routes').then(m => m.routes)
  }, {
    path: 'user',
    loadChildren: () => import('./user/user.routes').then(m => m.routes)
  }, {
    path: '**',
    redirectTo: 'game'
  }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
