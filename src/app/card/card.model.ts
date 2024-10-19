export enum CardState {
  hidden,
  revealed,
  removed
}

export default class Card {
  id: number = 0;
  name: string = 'Sample card';
  image: string = '';
  state: CardState = CardState.hidden;

  constructor(rawData?: { id: number, name: string, image: string }) {
    if (rawData) {
      this.id = rawData.id;
      this.name = rawData.name;
      this.image = rawData.image;
    }
  }
}
