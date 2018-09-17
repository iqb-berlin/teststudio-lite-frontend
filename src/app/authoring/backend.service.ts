import { UnitShortData } from './backend.service';
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

  // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
  public copyUnit (sessiontoken: string, workspaceId: number,
                  fromUnit: number, key: string, label: string): Observable<Boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http
      .post<Boolean>(this.serverUrl + 'addUnit.php', {t: sessiontoken, ws: workspaceId, u: fromUnit, k: key, l: label}, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
  }

  // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
  public deleteUnits (sessiontoken: string, workspaceId: number, units: number[]): Observable<Boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http
      .post<Boolean>(this.serverUrl + 'deleteUnits.php', {t: sessiontoken, ws: workspaceId, u: units}, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
  }

  // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
  public getUnitProperties (sessiontoken: string, workspaceId: number, unitId: number): Observable<UnitProperties | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http
      .post<UnitProperties>(this.serverUrl + 'getUnitProperties.php', {t: sessiontoken, ws: workspaceId, u: unitId}, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
  }

  // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
  public getUnitDesignData (sessiontoken: string, workspaceId: number, unitId: number): Observable<UnitDesignData | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http
      .post<UnitDesignData>(this.serverUrl + 'getUnitDesignData.php', {t: sessiontoken, ws: workspaceId, u: unitId}, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
  }

  // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
  public getItemAuthoringToolList (): Observable<StrIdLabelSelectedData[] | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http
      .post<StrIdLabelSelectedData[]>(this.serverUrl + 'getItemAuthoringToolList.php', httpOptions)
        .pipe(
          catchError(this.handleError)
        );
  }

  // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
  public hasValidAuthoringTool (unitId: number): Observable<boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http
      .post<boolean>(this.serverUrl + 'hasValidAuthoringTool.php', {u: unitId}, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
  }

  // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
  public changeUnitProperties (sessiontoken: string, workspaceId: number, props: UnitProperties): Observable<Boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http
      .post<Boolean>(this.serverUrl + 'changeUnitProperties.php', {
              t: sessiontoken,
              ws: workspaceId,
              u: props.id,
              k: props.key,
              l: props.label,
              d: props.description
            }, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
  }

  // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
  public setUnitAuthoringTool (sessiontoken: string, workspaceId: number,
            unitId: number, authoringtoolId: string): Observable<Boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http
      .post<Boolean>(this.serverUrl + 'setUnitAuthoringTool.php', {
              t: sessiontoken,
              ws: workspaceId,
              u: unitId,
              ati: authoringtoolId
            }, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
  }
  // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
  public setUnitDefinition (sessiontoken: string, workspaceId: number,
            unitId: number, unitDef: string, unitPlayerId: string): Observable<Boolean | ServerError> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http
      .post<Boolean>(this.serverUrl + 'setUnitDefinition.php', {
          t: sessiontoken,
          ws: workspaceId,
          u: unitId,
          ud: unitDef,
          pl: unitPlayerId
        }, httpOptions)
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

export interface UnitProperties {
  id: number;
  key: string;
  label: string;
  lastchangeStr: string;
  authoringtoolid: string;
  description: string;
}

export interface UnitDesignData {
  id: number;
  key: string;
  label: string;
  def: string;
  authoringtoolLink: string;
  playerLink: string;
}

export interface StrIdLabelSelectedData {
  id: string;
  label: string;
  selected: boolean;
}

export interface WorkspaceData {
  id: number;
  name: string;
}
