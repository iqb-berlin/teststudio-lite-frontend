import { TestBed, async, inject } from '@angular/core/testing';

import { UnitDesignActivateGuard, UnitDesignDeactivateGuard } from './unitdesign-routing';

describe('UnitDesignActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitDesignActivateGuard]
    });
  });

  it('should ...', inject([UnitDesignActivateGuard], (guard: UnitDesignActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});


describe('UnitDesignDeactivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitDesignDeactivateGuard]
    });
  });

  it('should ...', inject([UnitDesignDeactivateGuard], (guard: UnitDesignDeactivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
