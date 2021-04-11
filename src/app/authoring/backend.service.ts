import { catchError } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { ApiError } from '../backend.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(
    @Inject('SERVER_URL') private readonly serverUrl: string,
    private http: HttpClient
  ) {
    this.serverUrl += 'php_authoring/';
  }

  getUnitList(workspaceId: number): Observable <UnitShortData[] | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .put<UnitShortData[]>(`${this.serverUrl}getUnitList.php`, { t: authToken, ws: workspaceId })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`login Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  addUnit(workspaceId: number, key: string, label: string): Observable<boolean | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .put<boolean>(`${this.serverUrl}addUnit.php`,
      {
        t: authToken, ws: workspaceId, k: key, l: label
      })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`login Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  copyUnit(workspaceId: number,
           fromUnit: number, key: string, label: string): Observable<boolean | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .put<boolean>(`${this.serverUrl}addUnit.php`,
      {
        t: authToken, ws: workspaceId, u: fromUnit, k: key, l: label
      })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`login Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  deleteUnits(workspaceId: number, units: number[]): Observable<boolean | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .put<boolean>(`${this.serverUrl}deleteUnits.php`, { t: authToken, ws: workspaceId, u: units })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`login Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  moveUnits(workspaceId: number,
            units: number[], targetWorkspace: number): Observable<boolean | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .put<boolean>(`${this.serverUrl}moveUnits.php`,
      {
        t: authToken, ws: workspaceId, u: units, tws: targetWorkspace
      })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`login Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  downloadUnits(workspaceId: number, units: number[]): Observable<Blob | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    const httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        options: JSON.stringify({ t: authToken, ws: workspaceId, u: units })
      })
    };
    return this.http.get<Blob>(`${this.serverUrl}downloadUnits.php`, httpOptions);
  }

  getUnitProperties(workspaceId: number, unitId: number): Observable<UnitProperties | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .put<UnitProperties>(`${this.serverUrl}getUnitProperties.php`, { t: authToken, ws: workspaceId, u: unitId })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`login Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  getUnitDesignData(workspaceId: number, unitId: number): Observable<UnitDesignData | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .put<UnitDesignData>(`${this.serverUrl}getUnitDesignData.php`, { t: authToken, ws: workspaceId, u: unitId })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`login Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  getItemAuthoringToolList(): Observable<StrIdLabelSelectedData[] | number> {
    return this.http
      .get<StrIdLabelSelectedData[]>(`${this.serverUrl}getItemAuthoringToolList.php`)
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`login Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  hasValidAuthoringTool(unitId: number): Observable<boolean | number> {
    return this.http
      .post<boolean>(`${this.serverUrl}hasValidAuthoringTool.php`, { u: unitId })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`login Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  setUnitMetaData(workspaceId: number, unitId: number, unitKey: string,
                  unitLabel: string, unitDescription: string): Observable<boolean | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .put<boolean>(`${this.serverUrl}changeUnitProperties.php`, {
      t: authToken,
      ws: workspaceId,
      u: unitId,
      k: unitKey,
      l: unitLabel,
      d: unitDescription
    })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`login Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  setUnitAuthoringTool(workspaceId: number,
                       unitId: number, authoringtoolId: string): Observable<boolean | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .post<boolean>(`${this.serverUrl}setUnitAuthoringTool.php`, {
      t: authToken,
      ws: workspaceId,
      u: unitId,
      ati: authoringtoolId
    })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`login Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  setUnitDefinition(workspaceId: number,
                    unitId: number, unitDef: string, unitPlayerId: string): Observable<boolean | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .put<boolean>(`${this.serverUrl}setUnitDefinition.php`, {
      t: authToken,
      ws: workspaceId,
      u: unitId,
      ud: unitDef,
      pl: unitPlayerId
    })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`login Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  setUnitPlayer(workspaceId: number,
                unitId: number, unitPlayerId: string): Observable<boolean | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .put<boolean>(`${this.serverUrl}setUnitPlayer.php`, {
      t: authToken,
      ws: workspaceId,
      u: unitId,
      pl: unitPlayerId
    })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`login Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }
}

// # # # # # # # # # # # # # # # # # # # # # # # # # #
export interface UnitShortData {
  id: number;
  key: string;
  label: string;
}

export interface UnitProperties {
  id: number;
  key: string;
  label: string;
  lastchangedStr: string;
  authoringtoolid: string;
  playerid: string;
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
