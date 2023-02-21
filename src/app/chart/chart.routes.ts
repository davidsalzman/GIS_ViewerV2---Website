import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    title: 'Charts | Example Website',
    loadComponent: () => import('./containers/chart-shell/chart-shell.component').then((x) => x.ChartShellComponent)
  }];
