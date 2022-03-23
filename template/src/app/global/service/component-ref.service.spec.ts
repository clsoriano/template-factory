import { TestBed } from '@angular/core/testing';

import { ComponentRefService } from './component-ref.service';

describe('ComponentRefService', () => {
  let service: ComponentRefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentRefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
