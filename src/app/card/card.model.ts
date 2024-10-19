export enum CardState {
  hidden = 'hidden',
  revealed = 'revealed',
  removed = 'removed'
}

export interface RawCard {
  id: number;
  name: string;
  image: string;
  suit: string;
  value: number;
}

export default class Card {
  id: number = 0;
  name: string = 'Sample card';
  image: string = '';
  suit: string = '';
  value: number = 0;
  state: CardState = CardState.hidden;

  constructor(rawData?: RawCard) {
    if (rawData) {
      this.id = rawData.id;
      this.name = rawData.name;
      this.image = rawData.image;
      this.suit = rawData.suit;
      this.value = rawData.value;
    }
  }
}
