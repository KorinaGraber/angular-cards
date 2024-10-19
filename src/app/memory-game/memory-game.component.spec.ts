import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { faker } from '@faker-js/faker'
import routes, { MemoryGameComponent } from './memory-game.component';
import Card, { CardState } from '../card/card.model';

function makeTestCard(value?: number, state?: CardState): Card {
  const testCard = new Card();
  testCard.id = faker.number.int();

  if (value) {
    testCard.value = value;
  }

  if (state) {
    testCard.state = state;
  }

  return testCard;
}

describe('MemoryGameComponent', () => {
  let component: MemoryGameComponent;
  let fixture: ComponentFixture<MemoryGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemoryGameComponent],
      providers: [provideRouter(routes)]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemoryGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('flipCard', () => {
    let fakeEvent: { stopPropagation: jasmine.Spy };
    let checkSpy: jasmine.Spy;

    beforeEach(() => {
      fakeEvent = { stopPropagation: jasmine.createSpy() };
      checkSpy = jasmine.createSpy();
      component.checkForMatch = checkSpy;
    });

    afterEach(() => {
      expect(fakeEvent.stopPropagation).toHaveBeenCalledTimes(1);
    });

    it('should reveal the card and assign it to firstCard if no card has been flipped', () => {
      component.firstCard = undefined;
      component.secondCard = undefined;
      const cardToFlip = makeTestCard(faker.number.int(), CardState.hidden);

      component.flipCard(cardToFlip, fakeEvent as any);

      expect(cardToFlip.state).toBe(CardState.revealed);
      expect(component.firstCard as unknown as Card).toBe(cardToFlip);
      expect(component.secondCard).toBeUndefined();
      expect(checkSpy).toHaveBeenCalledTimes(0);
    });

    it('should reveal the card and assign it to secondCard if one card has been flipped', () => {
      const firstCard = makeTestCard();
      component.firstCard = firstCard;
      component.secondCard = undefined;
      const cardToFlip = makeTestCard(faker.number.int(), CardState.hidden);

      component.flipCard(cardToFlip, fakeEvent as any);

      expect(cardToFlip.state).toBe(CardState.revealed);
      expect(component.firstCard).toBe(firstCard);
      expect(component.secondCard as unknown as Card).toBe(cardToFlip);
      expect(checkSpy).toHaveBeenCalledTimes(0);
    });

    it('should do nothing if the first card is being flipped again', () => {
      const firstCard = makeTestCard();
      component.firstCard = firstCard;
      component.secondCard = undefined;

      component.flipCard(firstCard, fakeEvent as any);

      expect(component.firstCard).toBe(firstCard);
      expect(component.secondCard).toBeUndefined();
      expect(checkSpy).toHaveBeenCalledTimes(0);
    });

    describe('check for match', () => {
      let firstCard: Card;
      let secondCard: Card;

      beforeEach(() => {
        firstCard = makeTestCard();
        secondCard = makeTestCard();
        component.firstCard = firstCard;
        component.secondCard = secondCard;
      });

      it('should check for a match when the first card is picked if both cards are flipped', () => {
        component.flipCard(firstCard, fakeEvent as any);

        expect(checkSpy).toHaveBeenCalledTimes(1);
      });

      it('should check for a match when the second card is picked if both cards are flipped', () => {
        component.flipCard(secondCard, fakeEvent as any);

        expect(checkSpy).toHaveBeenCalledTimes(1);
      });

      it('should check for a match when a random card is picked if both cards are flipped', () => {
        component.flipCard(makeTestCard(), fakeEvent as any);

        expect(checkSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('checkForMatch', () => {
    it('should do nothing if no card has been flipped', () => {
      component.firstCard = undefined;
      component.secondCard = undefined;

      component.checkForMatch();

      expect(component.firstCard).toBeUndefined();
      expect(component.secondCard).toBeUndefined();
    });

    it('should do nothing if one card has been flipped', () => {
      const firstCard = makeTestCard();
      component.firstCard = firstCard;
      component.secondCard = undefined;

      component.checkForMatch();

      expect(component.firstCard).toBe(firstCard);
      expect(component.secondCard).toBeUndefined();
    });

    it('should hide both cards if their values dont match', () => {
      const firstCard = makeTestCard(faker.number.int(), CardState.revealed);
      const secondCard = makeTestCard(faker.number.int(), CardState.revealed);
      component.firstCard = firstCard;
      component.secondCard = secondCard;

      component.checkForMatch();

      expect(firstCard.state).toBe(CardState.hidden);
      expect(secondCard.state).toBe(CardState.hidden);
      expect(component.firstCard).toBeUndefined();
      expect(component.secondCard).toBeUndefined();
    });

    it('should remove both cards if their values match', () => {
      const firstCard = makeTestCard(faker.number.int(), CardState.revealed);
      const secondCard = makeTestCard(firstCard.value, CardState.revealed);
      component.firstCard = firstCard;
      component.secondCard = secondCard;

      component.checkForMatch();

      expect(firstCard.state).toBe(CardState.removed);
      expect(secondCard.state).toBe(CardState.removed);
      expect(component.firstCard).toBeUndefined();
      expect(component.secondCard).toBeUndefined();
    });
  });
});
