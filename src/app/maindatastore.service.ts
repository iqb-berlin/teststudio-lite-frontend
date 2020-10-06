import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { BackendService, LoginStatusResponseData, ServerError } from './backend.service';


@Injectable({
  providedIn: 'root'
})
export class MainDatastoreService {
  public isSuperadmin$ = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public loginName$ = new BehaviorSubject<string>('');
  public pageTitle$ = new BehaviorSubject<string>('IQB-Itembanking - Willkommen!');
  public notLoggedInMessage$ = new BehaviorSubject<string>('');
  public token$ = new BehaviorSubject<string>('');
  public postMessage$ = new Subject<MessageEvent>();

  constructor(
    private bs: BackendService,
  ) {
    const myToken = localStorage.getItem('t');
    if ((myToken === null) || (myToken === undefined)) {
      this.updateStatus('', '', false, '');
    } else {
      this.bs.getStatus(myToken).subscribe(
        (userdata: LoginStatusResponseData) => {
          this.updateStatus(userdata.token, userdata.name, userdata.is_superadmin, '');
        }, (err: ServerError) => {
          this.updateStatus('', '', false, err.label);
      });
    }
  }


  // *******************************************************************************************************
  login(name: string, password: string) {
    this.bs.login(name, password).subscribe(
      (userdata: LoginStatusResponseData) => {
        this.updateStatus(userdata.token, userdata.name, userdata.is_superadmin, '');
      }, (err: ServerError) => {
        this.updateStatus('', '', false, err.label);
      }
    );
  }

  // *******************************************************************************************************
  updatePageTitle(newTitle: string) {
    this.pageTitle$.next(newTitle);
  }

  updateStatus(token: string, name: string, is_superadmin: boolean, message: string) {

    if ((token === null) || (token.length === 0)) {
      this.isLoggedIn$.next(false);
      this.isSuperadmin$.next(false);
      this.pageTitle$.next('IQB-Itembanking - Bitte anmelden!');
      localStorage.removeItem('t');
      this.token$.next('');
      this.loginName$.next('');
      this.notLoggedInMessage$.next(message);
    } else {
      this.isLoggedIn$.next(true);
      this.isSuperadmin$.next(is_superadmin);
      localStorage.setItem('t', token);
      this.token$.next(token);
      this.loginName$.next(name);
      this.notLoggedInMessage$.next('');
    }
  }

  processMessagePost(postData: MessageEvent) {
    const msgData = postData.data;
    const msgType = msgData['type'];
    if ((typeof msgType !== 'undefined') && (msgType !== null)) {
      if (msgType.substr(0, 3) === 'vo.') {
        this.postMessage$.next(postData);
      }
    }
  }
}
