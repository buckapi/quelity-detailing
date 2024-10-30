import { TestBed } from '@angular/core/testing';

import { LoadStyleService } from './load-style.service';

describe('LoadStyleService', () => {
  let service: LoadStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
