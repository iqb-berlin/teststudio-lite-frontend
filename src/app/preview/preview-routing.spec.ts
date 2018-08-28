import { TestBed, async, inject } from '@angular/core/testing';

import { PreviewActivateGuard, PreviewDeactivateGuard } from './preview-routing';

describe('PreviewActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreviewActivateGuard]
    });
  });

  it('should ...', inject([PreviewActivateGuard], (guard: PreviewActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});


describe('PreviewDeactivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreviewDeactivateGuard]
    });
  });

  it('should ...', inject([PreviewDeactivateGuard], (guard: PreviewDeactivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
