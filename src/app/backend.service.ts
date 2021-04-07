// eslint-disable-next-line max-classes-per-file
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { WorkspaceData } from './authoring';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(
    @Inject('SERVER_URL') private readonly serverUrl: string,
    private http: HttpClient
  ) { }

  private getWorkspaceList(authData: LoginStatusResponseData | number): Observable<LoginData | number> {
    if (typeof authData === 'number') {
      localStorage.removeItem('t');
      return of(authData);
    }
    const loginStatusResponseData = authData as LoginStatusResponseData;
    localStorage.setItem('t', loginStatusResponseData.token);
    return this.http
      .put<WorkspaceData[]>(`${this.serverUrl}getWorkspaceList.php`, { t: loginStatusResponseData.token })
      .pipe(
        catchError((err: ApiError) => {
          localStorage.removeItem('t');
          return of(err.code);
        }),
        switchMap(workspaceList => {
          if (typeof workspaceList === 'number') {
            return of(workspaceList);
          }
          if (workspaceList.length > 1) {
            workspaceList.sort((ws1, ws2) => {
              if (ws1.name.toLowerCase() > ws2.name.toLowerCase()) {
                return 1;
              }
              if (ws1.name.toLowerCase() < ws2.name.toLowerCase()) {
                return -1;
              }
              return 0;
            });
          }
          return of(<LoginData>{
            name: loginStatusResponseData.name,
            isSuperAdmin: loginStatusResponseData.is_superadmin,
            workspaces: workspaceList
          });
        })
      );
  }

  login(name: string, password: string): Observable<LoginData | number> {
    if (name && password) {
      return this.http
        .put<LoginStatusResponseData>(`${this.serverUrl}login.php`, { n: name, p: password })
        .pipe(
          catchError((err: ApiError) => {
            console.warn(`login Api-Error: ${err.code} ${err.info} `);
            localStorage.removeItem('t');
            return of(err.code);
          }),
          switchMap(authData => this.getWorkspaceList(authData))
        );
    }
    return of(0);
  }

  logout(): Observable<boolean> {
    return this.http
      .put<boolean>(`${this.serverUrl}logout.php`, { t: localStorage.getItem('t') })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`login Api-Error: ${err.code} ${err.info} `);
          return of(false);
        })
      );
  }

  getStatus(): Observable<LoginData | number> {
    const storageEntry = localStorage.getItem('t');
    if (storageEntry !== null) {
      return this.http
        .put<LoginStatusResponseData>(`${this.serverUrl}getStatus.php`, { t: storageEntry })
        .pipe(
          catchError((err: ApiError) => {
            console.warn(`login Api-Error: ${err.code} ${err.info} `);
            localStorage.removeItem('t');
            return of(err.code);
          }),
          switchMap(authData => this.getWorkspaceList(authData))
        );
    }
    return of(0);
  }
}

export interface LoginStatusResponseData {
  token: string;
  name: string;
  is_superadmin: boolean;
}

export interface WorkspaceData {
  id: number;
  name: string;
}

export interface LoginData {
  name: string;
  isSuperAdmin: boolean;
  workspaces: WorkspaceData[]
}

export class ApiError {
  code: number;
  info: string;
  constructor(code: number, info = '') {
    this.code = code;
    this.info = info;
  }
}
