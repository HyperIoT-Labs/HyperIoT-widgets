import { TestBed } from '@angular/core/testing';

import { WidgetsService } from './widgets.service';

describe('WidgetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WidgetsService = TestBed.get(WidgetsService);
    expect(service).toBeTruthy();
  });
});
