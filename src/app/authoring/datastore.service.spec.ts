import { TestBed, inject } from '@angular/core/testing';

import { DatastoreService } from './datastore.service';
import {BackendService} from "./backend.service";
import {HttpClientModule} from "@angular/common/http";

describe('DatastoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [DatastoreService, BackendService]
    });
  });

  it('should be created', inject([DatastoreService], (service: DatastoreService) => {
    expect(service).toBeTruthy();
  }));
});
