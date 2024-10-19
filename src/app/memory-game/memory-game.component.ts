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
  firstCard?: Card;
  secondCard?: Card;

  flipCard(card: Card, event: Event) {
    event.stopPropagation();
    if (card && card.state !== CardState.removed) {
      if (this.firstCard && this.secondCard) {
        this.checkForMatch();
      } else if (this.firstCard) {
        if (this.firstCard.id != card.id) {
          card.state = CardState.revealed;
          this.secondCard = card;
        }
      } else {
        card.state = CardState.revealed;
        this.firstCard = card;
      }
    }
  }

  checkForMatch() {
    if (this.firstCard && this.secondCard) {
      if (this.firstCard.value == this.secondCard.value) {
        this.firstCard.state = CardState.removed;
        this.secondCard.state = CardState.removed;
      } else {
        this.firstCard.state = CardState.hidden;
        this.secondCard.state = CardState.hidden;
      }

      this.firstCard = undefined;
      this.secondCard = undefined;
    }
  }
}

export default [
  {
    path: '',
    component: MemoryGameComponent,
  },
];
