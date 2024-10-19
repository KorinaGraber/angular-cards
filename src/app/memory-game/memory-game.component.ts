import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import Card from '../card/card.model';

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './memory-game.component.html',
  styleUrl: './memory-game.component.scss'
})
export class MemoryGameComponent {
  cardList: Card[] = [
    new Card(),
  ];
}

export default [
  {
    path: '',
    component: MemoryGameComponent,
  },
];
