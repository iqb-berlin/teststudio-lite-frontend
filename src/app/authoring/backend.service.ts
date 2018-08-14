import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor() { }
}

export interface UnitShortData {
  db_id: number;
  key: string;
  label: string;
}
