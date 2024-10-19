import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CardComponent } from '../card/card.component';
import Card, { CardState } from '../card/card.model';
import CardShuffleModule, { CardShuffleService } from '../services/card-shuffle.service';

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [AsyncPipe, MatAnchor, RouterLink, CardComponent, CardShuffleModule],
  templateUrl: './memory-game.component.html',
  styleUrl: './memory-game.component.scss'
})
export class MemoryGameComponent {
  cardShuffleService = inject(CardShuffleService);

  cardList$: Observable<Card[]> = this.cardShuffleService.getSortedDeck();

  flipCard(card: Card) {
    if (card) {
      switch(card.state) {
        case CardState.hidden:
          card.state = CardState.revealed;
          break;
        case CardState.revealed:
          card.state = CardState.removed;
          break;
        default:
          card.state = CardState.hidden;
          break;
      }
    }
  }
}

export default [
  {
    path: '',
    component: MemoryGameComponent,
  },
];
