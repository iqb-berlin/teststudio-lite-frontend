import { MainDatastoreService } from './../maindatastore.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {
  public pendingItemDefinition$ = new BehaviorSubject(null);

  constructor(
    private mds: MainDatastoreService
  ) { }

  updatePageTitle(unitName: string) {
    this.mds.updatePageTitle('Voransicht: ' + unitName);
  }
}
