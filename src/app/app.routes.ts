import { Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';

export const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
  },
  {
    path: 'memory',
    loadChildren: () => import('./memory-game/memory-game.component'),
  },
];
