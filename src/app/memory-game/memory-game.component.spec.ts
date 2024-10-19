import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { allLocales, faker } from '@faker-js/faker'
import routes, { MemoryGameComponent } from './memory-game.component';
import Card, { CardState } from '../card/card.model';
import MemoryGameMessages from './memory-game.messages';

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
    let resolveSpy: jasmine.Spy;

    beforeEach(() => {
      fakeEvent = { stopPropagation: jasmine.createSpy() };
      checkSpy = jasmine.createSpy();
      resolveSpy = jasmine.createSpy();
      component.checkForMatch = checkSpy;
      component.resolveMatches = resolveSpy;
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
      expect(component.message).toBe(MemoryGameMessages.pickSecondCard);
      expect(resolveSpy).not.toHaveBeenCalled();
      expect(checkSpy).not.toHaveBeenCalled();
    });

    describe('pickSecondCard', () => {
      let firstCard: Card;
      let cardToFlip: Card;

      beforeEach(() => {
        firstCard = makeTestCard();
        component.firstCard = firstCard;
        component.secondCard = undefined;
        cardToFlip = makeTestCard(faker.number.int(), CardState.hidden);
      });

      it('should reveal the card and assign it to secondCard if one card has been flipped', () => {
        component.flipCard(cardToFlip, fakeEvent as any);

        expect(cardToFlip.state).toBe(CardState.revealed);
        expect(component.firstCard).toBe(firstCard);
        expect(component.secondCard as unknown as Card).toBe(cardToFlip);
        expect(resolveSpy).not.toHaveBeenCalled();
        expect(checkSpy).toHaveBeenCalledTimes(1);
      });

      it('should show a success message to the user if the cards match', () => {
        checkSpy.and.returnValue(true);

        component.flipCard(cardToFlip, fakeEvent as any);

        expect(component.message).toBe(MemoryGameMessages.matchSuccess);
      });

      it('should show a failure message to the user if the cards do not match', () => {
        checkSpy.and.returnValue(false);

        component.flipCard(cardToFlip, fakeEvent as any);

        expect(component.message).toBe(MemoryGameMessages.matchFailure);
      });
    });

    it('should show an error if the first card is being flipped again', () => {
      const firstCard = makeTestCard();
      component.firstCard = firstCard;
      component.secondCard = undefined;

      component.flipCard(firstCard, fakeEvent as any);

      expect(component.firstCard).toBe(firstCard);
      expect(component.secondCard).toBeUndefined();
      expect(resolveSpy).not.toHaveBeenCalled();
      expect(component.message).toBe(MemoryGameMessages.repickError);
      expect(checkSpy).not.toHaveBeenCalled();
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

        expect(resolveSpy).toHaveBeenCalledTimes(1);
        expect(checkSpy).not.toHaveBeenCalled();
      });

      it('should check for a match when the second card is picked if both cards are flipped', () => {
        component.flipCard(secondCard, fakeEvent as any);

        expect(resolveSpy).toHaveBeenCalledTimes(1);
        expect(checkSpy).not.toHaveBeenCalled();
      });

      it('should check for a match when a random card is picked if both cards are flipped', () => {
        component.flipCard(makeTestCard(), fakeEvent as any);

        expect(resolveSpy).toHaveBeenCalledTimes(1);
        expect(checkSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('resolveMatches', () => {
    let originalMessage: string;
    let originalCardsRemaining: number;

    beforeEach(() => {
      originalMessage = faker.string.uuid();
      component.message = originalMessage;
      originalCardsRemaining = faker.number.int();
      component.cardsRemaining = originalCardsRemaining;
    });

    it('should do nothing if no card has been flipped', () => {
      component.firstCard = undefined;
      component.secondCard = undefined;

      component.resolveMatches();

      expect(component.firstCard).toBeUndefined();
      expect(component.secondCard).toBeUndefined();
      expect(component.message).toBe(originalMessage);
      expect(component.cardsRemaining).toBe(originalCardsRemaining);
    });

    it('should do nothing if one card has been flipped', () => {
      const firstCard = makeTestCard();
      component.firstCard = firstCard;
      component.secondCard = undefined;

      component.resolveMatches();

      expect(component.firstCard).toBe(firstCard);
      expect(component.secondCard).toBeUndefined();
      expect(component.message).toBe(originalMessage);
      expect(component.cardsRemaining).toBe(originalCardsRemaining);
    });

    it('should hide both cards if their values dont match', () => {
      const firstCard = makeTestCard(faker.number.int(), CardState.revealed);
      const secondCard = makeTestCard(faker.number.int(), CardState.revealed);
      component.firstCard = firstCard;
      component.secondCard = secondCard;

      component.resolveMatches();

      expect(firstCard.state).toBe(CardState.hidden);
      expect(secondCard.state).toBe(CardState.hidden);
      expect(component.firstCard).toBeUndefined();
      expect(component.secondCard).toBeUndefined();
      expect(component.message).toBe(MemoryGameMessages.pickACard);
      expect(component.cardsRemaining).toBe(originalCardsRemaining);
    });

    describe('removeCards', () => {
      let firstCard: Card;
      let secondCard: Card;

      beforeEach(() => {
        firstCard = makeTestCard(faker.number.int(), CardState.revealed);
        secondCard = makeTestCard(firstCard.value, CardState.revealed);
        component.firstCard = firstCard;
        component.secondCard = secondCard;
      });

      it('should remove both cards if their values match', () => {
        component.resolveMatches();

        expect(firstCard.state).toBe(CardState.removed);
        expect(secondCard.state).toBe(CardState.removed);
        expect(component.firstCard).toBeUndefined();
        expect(component.secondCard).toBeUndefined();
        expect(component.message).toBe(MemoryGameMessages.pickACard);
        expect(component.cardsRemaining).toBe(originalCardsRemaining - 2);
      });

      it('should not end the game if there are cards left', () => {
        component.cardsRemaining = faker.number.int({ min: 3 });

        component.resolveMatches();

        expect(component.gameOver).toBeFalse();
      });

      it('should end the game if there are no cards left', () => {
        component.cardsRemaining = 2;

        component.resolveMatches();

        expect(component.gameOver).toBeTrue();
      });
    });
  });

  describe('checkForMatches', () => {
    it('should return false no card has been flipped', () => {
      component.firstCard = undefined;
      component.secondCard = undefined;

      const result = component.checkForMatch();

      expect(result).toBeFalse();
    });

    it('should return false if the second card has been flipped', () => {
      const firstCard = makeTestCard();
      component.firstCard = firstCard;
      component.secondCard = undefined;

      const result = component.checkForMatch();

      expect(result).toBeFalse();
    });

    it('should return false if the card values dont match', () => {
      const firstCard = makeTestCard(faker.number.int(), CardState.revealed);
      const secondCard = makeTestCard(faker.number.int(), CardState.revealed);
      component.firstCard = firstCard;
      component.secondCard = secondCard;

      const result = component.checkForMatch();

      expect(result).toBeFalse();
    });

    it('should return true if the card values match', () => {
      const firstCard = makeTestCard(faker.number.int(), CardState.revealed);
      const secondCard = makeTestCard(firstCard.value, CardState.revealed);
      component.firstCard = firstCard;
      component.secondCard = secondCard;

      const result = component.checkForMatch();

      expect(result).toBeTrue();
    });
  });
});
