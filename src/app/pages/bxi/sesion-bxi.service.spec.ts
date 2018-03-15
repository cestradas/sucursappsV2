import { TestBed, inject } from '@angular/core/testing';

import { SesionBxiService } from './sesion-bxi.service';

describe('SesionBxiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SesionBxiService]
    });
  });

  it('should be created', inject([SesionBxiService], (service: SesionBxiService) => {
    expect(service).toBeTruthy();
  }));
});
