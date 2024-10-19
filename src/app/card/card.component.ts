import { Component, EventEmitter, Input, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import Card, { CardState } from './card.model';

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
  @Output() cardClicked = new EventEmitter<Event>();
  CardState = CardState;
}
