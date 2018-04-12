import { TestBed, inject } from '@angular/core/testing';

import { TemporalService } from './temporal.service';

describe('TemporalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemporalService]
    });
  });

  it('should be created', inject([TemporalService], (service: TemporalService) => {
    expect(service).toBeTruthy();
  }));
});
