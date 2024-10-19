import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { inject, Injectable, NgModule } from '@angular/core';
import { map, Observable } from 'rxjs';
import Card, { RawCard } from '../card/card.model';

@Injectable()
export class CardShuffleService {
  http = inject(HttpClient);

  getSortedDeck(): Observable<Card[]> {
    return this.http.get('/card-deck.json')
      .pipe(map(this.parseJsonCardData));
  }

  getShuffledDeck(): Observable<Card[]> {
    return this.getSortedDeck()
      .pipe(map(this.shuffleDeck));
  }

  parseJsonCardData(jsonData: Object): Card[] {
    if (jsonData) {
      const rawList = jsonData as RawCard[];
      return rawList.map(rawCard => new Card(rawCard));
    }
    return [];
  }

  shuffleDeck(deck: Card[]): Card[] {
    let currentIndex = deck.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [deck[currentIndex], deck[randomIndex]] = [
        deck[randomIndex], deck[currentIndex]];
    }

    return deck;
  }
}

@NgModule({
  providers: [CardShuffleService, provideHttpClient(withInterceptorsFromDi())],
})
export default class CardShuffleModule {}
