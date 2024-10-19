import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { CardComponent } from '../card/card.component';
import Card from '../card/card.model';
import CardShuffleModule, { CardShuffleService } from '../services/card-shuffle.service';

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [AsyncPipe, CardComponent, CardShuffleModule],
  templateUrl: './memory-game.component.html',
  styleUrl: './memory-game.component.scss'
})
export class MemoryGameComponent {
  cardShuffleService = inject(CardShuffleService);

  cardList$: Observable<Card[]> = this.cardShuffleService.getSortedDeck();
}

export default [
  {
    path: '',
    component: MemoryGameComponent,
  },
];
