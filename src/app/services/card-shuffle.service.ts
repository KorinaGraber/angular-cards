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

  parseJsonCardData(jsonData: Object): Card[] {
    if (jsonData) {
      const rawList = jsonData as RawCard[];
      return rawList.map(rawCard => new Card(rawCard));
    }
    return [];
  }
}

@NgModule({
  providers: [CardShuffleService, provideHttpClient(withInterceptorsFromDi())],
})
export default class CardShuffleModule {}
