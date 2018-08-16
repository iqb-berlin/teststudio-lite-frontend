import { TestBed, async, inject } from '@angular/core/testing';

import { UnitpropertiesActivateGuard, UnitpropertiesDeactivateGuard } from './unitproperties-routing';

describe('UnitpropertiesActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitpropertiesActivateGuard]
    });
  });

  it('should ...', inject([UnitpropertiesActivateGuard], (guard: UnitpropertiesActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});


describe('UnitpropertiesDeactivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitpropertiesDeactivateGuard]
    });
  });

  it('should ...', inject([UnitpropertiesDeactivateGuard], (guard: UnitpropertiesDeactivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
