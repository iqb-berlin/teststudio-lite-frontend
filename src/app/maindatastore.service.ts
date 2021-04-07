import {Observable, Subject} from 'rxjs';
import { Injectable } from '@angular/core';
import {
  BackendService, LoginData
} from './backend.service';
import {HttpErrorResponse} from "@angular/common/http";
import {ServerError} from "./authoring/backend.service";

@Injectable({
  providedIn: 'root'
})
export class MainDatastoreService {
  loginStatus: LoginData = null;
  pageTitle = 'Willkommen!';
  postMessage$ = new Subject<MessageEvent>();

  constructor(private bs: BackendService) { }

  processMessagePost(postData: MessageEvent): void {
    const msgData = postData.data;
    const msgType = msgData.type;
    if ((typeof msgType !== 'undefined') && (msgType !== null)) {
      if (msgType.substr(0, 3) === 'vo.') {
        this.postMessage$.next(postData);
      }
    }
  }

  static serverErrorMessageText(errCode: number) : string {
    if (errCode === 401) {
      return 'Fehler: Zugriff verweigert - bitte (neu) anmelden!';
    }
    if (errCode === 503) {
      return 'Fehler: Server meldet Datenbankproblem.';
    }
    return `Server meldet Problem ${errCode}`;
  }
}
