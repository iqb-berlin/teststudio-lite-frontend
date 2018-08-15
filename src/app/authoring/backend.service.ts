import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(
    @Inject('SERVER_URL') private serverUrl: string,
    private http: HttpClient) {
      this.serverUrl = this.serverUrl + 'php_authoring/';
    }

  // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
  public getUnitList (sessiontoken: string, workspaceId: number): Observable <UnitShortData[] | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http
      .post<UnitShortData[]>(this.serverUrl + 'getUnitList.php', {t: sessiontoken, ws: workspaceId}, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
  }

  // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
  public getWorkspaceList (sessiontoken: string): Observable<WorkspaceData[] | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http
      .post<WorkspaceData[]>(this.serverUrl + 'getWorkspaceList.php', {t: sessiontoken}, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
  }

  // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
  public addUnit (sessiontoken: string, workspaceId: number, key: string, label: string): Observable<Boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http
      .post<Boolean>(this.serverUrl + 'addUnit.php', {t: sessiontoken, ws: workspaceId, k: key, l: label}, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
  }

  // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
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
      myreturn.label = 'Fehler: ' + (<ErrorEvent>errorObj.error).message;
    } else {
      myreturn.label = 'Fehler: ' + errorObj.message;
    }

    return Observable.throw(myreturn.label);
  }
}

// # # # # # # # # # # # # # # # # # # # # # # # # # #
export interface ServerError {
  code: number;
  label: string;
}

export interface UnitShortData {
  id: number;
  key: string;
  label: string;
}

export interface WorkspaceData {
  id: number;
  name: string;
}
