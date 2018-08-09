import { MainDatastoreService } from './../maindatastore.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {
  public isSuperadmin$ = new BehaviorSubject(false);
  public token$ = new BehaviorSubject('');

  constructor(
    private mds: MainDatastoreService
  ) {
    this.mds.isSuperadmin$.subscribe(is => {
      this.isSuperadmin$.next(is);
    });
    this.mds.token$.subscribe(t => {
      this.token$.next(t);
    });
  }

  updatePageTitle(newTitle: string) {
    this.mds.updatePageTitle('Verwaltung: ' + newTitle);
  }
}
