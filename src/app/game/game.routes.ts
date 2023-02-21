import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: ':id/view',
    title: 'View Game | Example Website',
    loadComponent: () => import('./containers/game-view-shell/game-view-shell.component').then((x) => x.GameViewShellComponent)
}, {
    path: '',
    title: 'Game Search | Example Website',
    loadComponent: () => import('./containers/game-search-shell/game-search-shell.component').then((x) => x.GameSearchShellComponent)
}];
