import { TestBed, inject } from '@angular/core/testing';

import { UnitDesignActivateGuard, UnitDesignDeactivateGuard } from './unitdesign-routing';
import {BackendService} from "../backend.service";
import { MatDialogModule} from "@angular/material/dialog";
import {HttpClientModule} from "@angular/common/http";

describe('UnitDesignActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitDesignActivateGuard, BackendService],
      imports: [MatDialogModule, HttpClientModule]
    });
  });

  it('should ...', inject([UnitDesignActivateGuard], (guard: UnitDesignActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});


describe('UnitDesignDeactivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [UnitDesignDeactivateGuard]
    });
  });

  it('should ...', inject([UnitDesignDeactivateGuard], (guard: UnitDesignDeactivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
