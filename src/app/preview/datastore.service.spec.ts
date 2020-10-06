import { TestBed, inject } from '@angular/core/testing';

import { DatastoreService } from './datastore.service';
import {MainDatastoreService} from "../maindatastore.service";
import { MatDialogModule} from "@angular/material/dialog";
import {HttpClientModule} from "@angular/common/http";

describe('DatastoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatDialogModule],
      providers: [DatastoreService, MainDatastoreService]
    });
  });

  it('should be created', inject([DatastoreService], (service: DatastoreService) => {
    expect(service).toBeTruthy();
  }));
});
