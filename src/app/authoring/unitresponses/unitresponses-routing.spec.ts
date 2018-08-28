import { TestBed, async, inject } from '@angular/core/testing';

import { UnitResponsesActivateGuard } from './unitresponses-routing';

describe('UnitDesignActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitResponsesActivateGuard]
    });
  });

  it('should ...', inject([UnitResponsesActivateGuard], (guard: UnitResponsesActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
