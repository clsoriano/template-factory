import { TestBed } from '@angular/core/testing';

import { EngineConfigurationService } from './engine-configuration.service';

describe('EngineConfigurationService', () => {
  let service: EngineConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EngineConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
