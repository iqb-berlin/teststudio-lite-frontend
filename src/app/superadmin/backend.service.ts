import { Injectable, Inject } from '@angular/core';
import {
  HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(
    @Inject('SERVER_URL') private serverUrl: string,
    private http: HttpClient
  ) {
    this.serverUrl += 'php_superadmin/';
  }

  // eslint-disable-next-line class-methods-use-this
  private errorHandler(error: Error | any): Observable<any> {
    return Observable.throw(error);
  }

  // *******************************************************************
  // *******************************************************************
  // users
  // *******************************************************************
  // *******************************************************************
  getUsers(): Observable<GetUserDataResponse[] | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<GetUserDataResponse[]>(`${this.serverUrl}getUsers.php`, { t: localStorage.getItem('t') }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  addUser(name: string, password: string): Observable<boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<boolean>(`${this.serverUrl}addUser.php`, { t: localStorage.getItem('t'), n: name, p: password }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  changePassword(name: string, password: string): Observable<boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<boolean>(`${this.serverUrl}setPassword.php`, { t: localStorage.getItem('t'), n: name, p: password }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteUsers(users: string[]): Observable<boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<boolean>(`${this.serverUrl}deleteUsers.php`, { t: localStorage.getItem('t'), u: users }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // *******************************************************************
  getWorkspacesByUser(username: string): Observable<IdLabelSelectedData[] | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<IdLabelSelectedData[]>(`${this.serverUrl}getUserWorkspaces.php`, { t: localStorage.getItem('t'), u: username }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  setWorkspacesByUser(user: string, accessTo: IdLabelSelectedData[]): Observable<boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<boolean>(`${this.serverUrl}setUserWorkspaces.php`, { t: localStorage.getItem('t'), u: user, w: accessTo }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // *******************************************************************
  // *******************************************************************
  // workspaces
  // *******************************************************************
  // *******************************************************************
  getWorkspaces(): Observable<IdLabelSelectedData[] | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<IdLabelSelectedData[]>(`${this.serverUrl}getWorkspaces.php`, { t: localStorage.getItem('t') }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  addWorkspace(name: string): Observable<boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<boolean>(`${this.serverUrl}addWorkspace.php`, { t: localStorage.getItem('t'), n: name }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  changeWorkspace(wsId: number, wsName: string): Observable<boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<boolean>(`${this.serverUrl}setWorkspace.php`, { t: localStorage.getItem('t'), ws_id: wsId, ws_name: wsName }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteWorkspaces(workspaces: number[]): Observable<boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<boolean>(`${this.serverUrl}deleteWorkspaces.php`, { t: localStorage.getItem('t'), ws: workspaces }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // *******************************************************************
  getUsersByWorkspace(workspaceId: number): Observable<IdLabelSelectedData[] | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<IdLabelSelectedData[]>(`${this.serverUrl}getWorkspaceUsers.php`, { t: localStorage.getItem('t'), ws: workspaceId }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  setUsersByWorkspace(workspace: number, accessing: IdLabelSelectedData[]): Observable<boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<boolean>(`${this.serverUrl}setWorkspaceUsers.php`, { t: localStorage.getItem('t'), w: workspace, u: accessing }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // *******************************************************************
  // *******************************************************************
  // itemauthoringtools
  // *******************************************************************
  // *******************************************************************
  getItemAuthoringTools(): Observable<StrIdLabelSelectedData[] | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<StrIdLabelSelectedData[]>(`${this.serverUrl}getItemAuthoringTools.php`, { t: localStorage.getItem('t') }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  addItemAuthoringTool(id: string, name: string): Observable<boolean | ServerError> {
    return this.http
      .post<boolean>(`${this.serverUrl}addItemAuthoringTool.php`, { t: localStorage.getItem('t'), i: id, n: name })
      .pipe(
        catchError(this.handleError)
      );
  }

  changeItemAuthoringTool(oldid: string, id: string, name: string): Observable<boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<boolean>(`${this.serverUrl}renameItemAuthoringTool.php`, {
      t: localStorage.getItem('t'), old_i: oldid, new_i: id, n: name
    }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteItemAuthoringTools(ids: string[]): Observable<boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<boolean>(`${this.serverUrl}deleteItemAuthoringTools.php`, { t: localStorage.getItem('t'), i: ids }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // *******************************************************************
  // itemauthoringtools - Files
  getItemAuthoringToolFiles(id: string): Observable<GetFileResponseData[] | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<GetFileResponseData[]>(`${this.serverUrl}getItemAuthoringToolFiles.php`, { t: localStorage.getItem('t'), i: id }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteItemAuthoringToolFiles(id: string, files: string[]): Observable<string | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<string>(`${this.serverUrl}deleteItemAuthoringToolFiles.php`, { t: localStorage.getItem('t'), i: id, f: files }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getItemPlayerFiles(): Observable<GetFileResponseData[] | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<GetFileResponseData[]>(`${this.serverUrl}getItemPlayerFiles.php`, { t: localStorage.getItem('t') }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteItemPlayerFiles(files: string[]): Observable<string | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<string>(`${this.serverUrl}deleteItemPlayerFiles.php`, { t: localStorage.getItem('t'), f: files }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
  // eslint-disable-next-line class-methods-use-this
  private handleError(errorObj: HttpErrorResponse): Observable<ServerError> {
    const myreturn: ServerError = {
      label: 'Fehler bei Datenübertragung',
      code: errorObj.status
    };
    if (errorObj.status === 401) {
      myreturn.label = 'Fehler: Zugriff verweigert - bitte (neu) anmelden!';
    } else if (errorObj.status === 503) {
      myreturn.label = 'Fehler: Server meldet Datenbankproblem.';
    } else if (errorObj.error instanceof ErrorEvent) {
      myreturn.label = `Fehler: ${(<ErrorEvent>errorObj.error).message}`;
    } else {
      myreturn.label = `Fehler: ${errorObj.message}`;
    }

    return Observable.throw(myreturn.label);
  }
}

// / / / / / /
export interface ServerError {
  code: number;
  label: string;
}

export interface GetUserDataResponse {
  name: string;
}

export interface IdLabelSelectedData {
  id: number;
  label: string;
  selected: boolean;
}

export interface StrIdLabelSelectedData {
  id: string;
  label: string;
  selected: boolean;
}

export interface GetFileResponseData {
  filename: string;
  filesize: number;
  filesizestr: string;
  filedatetime: string;
  filedatetimestr: string;
  selected: boolean;
}
