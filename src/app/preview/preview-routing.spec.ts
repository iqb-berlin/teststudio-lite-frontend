import { TestBed, inject } from '@angular/core/testing';

import { PreviewActivateGuard } from './preview-routing';

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


