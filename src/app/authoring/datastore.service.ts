import { BackendService, UnitShortData } from './backend.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataSource } from '../../../node_modules/@angular/cdk/table';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {
  public unitname$ = new BehaviorSubject<UnitShortData[]>([]);
  public u = new DataSource<UnitShortData>([]);

  constructor(private bs: BackendService) { }
}
