import { TestBed, inject } from '@angular/core/testing';

import { PreviewActivateGuard } from './preview-routing';
import { MatDialogModule} from "@angular/material/dialog";
import {BackendService} from "./backend.service";
import {MainDatastoreService} from "../maindatastore.service";
import {HttpClientModule} from "@angular/common/http";

describe('PreviewActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientModule],
      providers: [PreviewActivateGuard, BackendService, MainDatastoreService]
    });
  });

  it('should ...', inject([PreviewActivateGuard], (guard: PreviewActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});


