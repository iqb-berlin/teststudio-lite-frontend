import { TestBed, inject } from '@angular/core/testing';

import { UnitPropertiesActivateGuard, UnitPropertiesDeactivateGuard } from './unitproperties-routing';

describe('UnitpropertiesActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitPropertiesActivateGuard]
    });
  });

  it('should ...', inject([UnitPropertiesActivateGuard], (guard: UnitPropertiesActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});


describe('UnitpropertiesDeactivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitPropertiesDeactivateGuard]
    });
  });

  it('should ...', inject([UnitPropertiesDeactivateGuard], (guard: UnitPropertiesDeactivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
