import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { CardComponent } from '../card/card.component';
import Card, { CardState } from '../card/card.model';
import CardShuffleModule, { CardShuffleService } from '../services/card-shuffle.service';
import MemoryGameMessages from './memory-game.messages';

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [AsyncPipe, MatAnchor, RouterLink, CardComponent, CardShuffleModule],
  templateUrl: './memory-game.component.html',
  styleUrl: './memory-game.component.scss'
})
export class MemoryGameComponent {
  cardShuffleService = inject(CardShuffleService);
  cardList$: Observable<Card[]> = this.loadCards();
  firstCard?: Card;
  secondCard?: Card;
  message: string = MemoryGameMessages.pickACard;
  cardsRemaining: number = 0;
  gameOver = false;

  loadCards(): Observable<Card[]> {
    return this.cardShuffleService.getSortedDeck()
      .pipe(tap(deck => this.cardsRemaining = deck.length));
  }

  flipCard(card: Card, event: Event) {
    event.stopPropagation();
    if (card && card.state !== CardState.removed) {
      if (this.firstCard && this.secondCard) {
        this.resolveMatches();
      } else if (this.firstCard) {
        if (this.firstCard.id != card.id) {
          card.state = CardState.revealed;
          this.secondCard = card;

          if (this.checkForMatch()) {
            this.message = MemoryGameMessages.matchSuccess;
          } else {
            this.message = MemoryGameMessages.matchFailure;
          }
        } else {
          this.message = MemoryGameMessages.repickError;
        }
      } else {
        card.state = CardState.revealed;
        this.firstCard = card;
        this.message = MemoryGameMessages.pickSecondCard;
      }
    }
  }

  resolveMatches() {
    if (this.firstCard && this.secondCard) {
      if (this.checkForMatch()) {
        this.firstCard.state = CardState.removed;
        this.secondCard.state = CardState.removed;
        this.cardsRemaining -= 2;

        if (this.cardsRemaining <= 0) {
          this.gameOver = true;
        }
      } else {
        this.firstCard.state = CardState.hidden;
        this.secondCard.state = CardState.hidden;
      }

      this.firstCard = undefined;
      this.secondCard = undefined;
      this.message = MemoryGameMessages.pickACard;
    }
  }

  checkForMatch(): boolean {
    if (this.firstCard && this.secondCard) {
      if (this.firstCard.value == this.secondCard.value) {
        return true;
      }
    }
    return false;
  }
}

export default [
  {
    path: '',
    component: MemoryGameComponent,
  },
];
