import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MainDatastoreService } from '../maindatastore.service';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {
  pendingItemDefinition$ = new BehaviorSubject(null);

  constructor(
    private mds: MainDatastoreService
  ) { }

  updatePageTitle(unitName: string) {
    this.mds.pageTitle = `Voransicht: ${unitName}`;
  }
}
