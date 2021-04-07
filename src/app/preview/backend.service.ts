import { Observable } from 'rxjs';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(
    @Inject('SERVER_URL') private serverUrl: string,
    private http: HttpClient
  ) {
    this.serverUrl += 'php_preview/';
  }

  // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
  getUnitDesignData(workspaceId: number, unitId: number): Observable<UnitPreviewData | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<UnitPreviewData>(`${this.serverUrl}getUnitPreviewData.php`, { t: localStorage.getItem('t'), ws: workspaceId, u: unitId }, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
  hasValidItemplayer(unitId: number): Observable<boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<boolean>(`${this.serverUrl}hasValidItemplayer.php`, { u: unitId }, httpOptions)
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

// # # # # # # # # # # # # # # # # # # # # # # # # # #
export interface ServerError {
  code: number;
  label: string;
}

export interface UnitPreviewData {
  id: number;
  key: string;
  label: string;
  def: string;
  player: string;
  player_id: string;
}
