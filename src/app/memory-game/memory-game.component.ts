import { Component } from '@angular/core';

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [],
  templateUrl: './memory-game.component.html',
  styleUrl: './memory-game.component.scss'
})
export class MemoryGameComponent {

}

export default [
  {
    path: '',
    component: MemoryGameComponent,
  },
];
