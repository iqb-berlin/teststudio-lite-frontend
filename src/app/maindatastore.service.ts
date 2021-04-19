import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppConfig, LoginData } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class MainDatastoreService {
  loginStatus: LoginData = null;
  pageTitle = 'IQB-Teststudio - Willkommen!';
  errorMessage = '';
  postMessage$ = new Subject<MessageEvent>();
  appConfig: AppConfig = null;
  dataLoading = false;

  processMessagePost(postData: MessageEvent): void {
    const msgData = postData.data;
    const msgType = msgData.type;
    if ((typeof msgType !== 'undefined') && (msgType !== null)) {
      this.postMessage$.next(postData);
    }
  }
}
