import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppConfig, LoginData } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class MainDatastoreService {
  loginStatus: LoginData = null;
  pageTitle = 'Willkommen!';
  errorMessage = '';
  globalWarning = '';
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

  static warningIsExpired(appConfig: AppConfig): boolean {
    if (appConfig.global_warning_expired_day) {
      const calcTimePoint = new Date(appConfig.global_warning_expired_day);
      calcTimePoint.setHours(calcTimePoint.getHours() + Number(appConfig.global_warning_expired_hour));
      const now = new Date(Date.now());
      return calcTimePoint < now;
    }
    return false;
  }
}
