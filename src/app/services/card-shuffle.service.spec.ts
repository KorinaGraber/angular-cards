import { TestBed } from '@angular/core/testing';

import { CardShuffleService } from './card-shuffle.service';

describe('CardShuffleService', () => {
  let service: CardShuffleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardShuffleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
