import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { faker } from '@faker-js/faker'
import routes, { MemoryGameComponent } from './memory-game.component';
import Card, { CardState } from '../card/card.model';

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
      const cardToFlip = new Card();
      cardToFlip.state = CardState.hidden;

      component.flipCard(cardToFlip, fakeEvent as any);

      expect(cardToFlip.state).toBe(CardState.revealed);
      expect(component.firstCard as unknown as Card).toBe(cardToFlip);
      expect(component.secondCard).toBeUndefined();
      expect(checkSpy).toHaveBeenCalledTimes(0);
    });

    it('should reveal the card and assign it to secondCard if one card has been flipped', () => {
      const firstCard = new Card();
      component.firstCard = firstCard;
      component.secondCard = undefined;
      const cardToFlip = new Card();
      cardToFlip.state = CardState.hidden;

      component.flipCard(cardToFlip, fakeEvent as any);

      expect(cardToFlip.state).toBe(CardState.revealed);
      expect(component.firstCard).toBe(firstCard);
      expect(component.secondCard as unknown as Card).toBe(cardToFlip);
      expect(checkSpy).toHaveBeenCalledTimes(0);
    });

    describe('check for match', () => {
      let firstCard: Card;
      let secondCard: Card;

      beforeEach(() => {
        firstCard = new Card();
        secondCard = new Card();
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
        component.flipCard(new Card(), fakeEvent as any);

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
      const firstCard = new Card();
      component.firstCard = firstCard;
      component.secondCard = undefined;

      component.checkForMatch();

      expect(component.firstCard).toBe(firstCard);
      expect(component.secondCard).toBeUndefined();
    });

    it('should hide both cards if their values dont match', () => {
      const firstCard = new Card();
      const secondCard = new Card();
      firstCard.value = faker.number.int();
      firstCard.state = CardState.revealed;
      secondCard.value = faker.number.int();
      secondCard.state = CardState.revealed;
      component.firstCard = firstCard;
      component.secondCard = secondCard;

      component.checkForMatch();

      expect(firstCard.state).toBe(CardState.hidden);
      expect(secondCard.state).toBe(CardState.hidden);
      expect(component.firstCard).toBeUndefined();
      expect(component.secondCard).toBeUndefined();
    });

    it('should remove both cards if their values match', () => {
      const firstCard = new Card();
      const secondCard = new Card();
      firstCard.value = faker.number.int();
      firstCard.state = CardState.revealed;
      secondCard.value = firstCard.value;
      secondCard.state = CardState.revealed;
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
