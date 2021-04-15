import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { BackendService, LoginData } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class MainDatastoreService {
  loginStatus: LoginData = null;
  pageTitle = 'Willkommen!';
  errorMessage = '';
  postMessage$ = new Subject<MessageEvent>();

  constructor(private bs: BackendService) { }

  processMessagePost(postData: MessageEvent): void {
    const msgData = postData.data;
    const msgType = msgData.type;
    if ((typeof msgType !== 'undefined') && (msgType !== null)) {
      this.postMessage$.next(postData);
    }
  }
}
