import { Component, Input } from '@angular/core';
import Card, { CardState } from './card.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  animations: [
    trigger('cardFlip', [
      state(CardState.hidden, style({
        transform: 'none'
      })),
      state(CardState.revealed, style({
        transform: 'rotateY(180deg)'
      })),
      transition(`${CardState.hidden} -> ${CardState.revealed}`, [
        animate('400ms')
      ]),
      transition(`${CardState.revealed} -> ${CardState.hidden}`, [
        animate('200ms')
      ]),
    ])
  ]
})
export class CardComponent {
  @Input() card?: Card;
  CardState = CardState;

  cardClicked() {
    if (this.card) {
      switch(this.card.state) {
        case CardState.hidden:
          this.card.state = CardState.revealed;
          break;
        case CardState.revealed:
          this.card.state = CardState.removed;
          break;
        default:
          this.card.state = CardState.hidden;
          break;
      }
    }
  }
}
