import { TestBed } from '@angular/core/testing';

import { LazyLibService } from './lazy-lib.service';

describe('LazyLibService', () => {
  let service: LazyLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LazyLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
