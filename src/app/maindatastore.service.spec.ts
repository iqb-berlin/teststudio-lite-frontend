import { TestBed, inject } from '@angular/core/testing';

import { MainDatastoreService } from './maindatastore.service';
import {BackendService} from "./backend.service";
import {HttpClientModule} from "@angular/common/http";

describe('MainDatastoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [BackendService, MainDatastoreService]
    });
  });

  it('should be created', inject([MainDatastoreService], (service: MainDatastoreService) => {
    expect(service).toBeTruthy();
  }));
});
