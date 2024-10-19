import { Component, Input } from '@angular/core';
import Card, { CardState } from './card.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
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
