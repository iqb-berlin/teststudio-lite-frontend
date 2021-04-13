import { catchError, map } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { ApiError } from '../backend.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(
    @Inject('SERVER_URL') private readonly serverUrlUnit: string,
    @Inject('SERVER_URL') private readonly serverUrlPreview: string,
    private http: HttpClient
  ) {
    this.serverUrlUnit += 'php_authoring/';
    this.serverUrlPreview += 'php_preview/';
  }

  getUnitList(workspaceId: number): Observable <UnitShortData[] | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .put<UnitShortData[]>(`${this.serverUrlUnit}getUnitList.php`, { t: authToken, ws: workspaceId })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`getUnitList Api-Error: ${err.code} ${err.info} `);
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
      .put<boolean>(`${this.serverUrlUnit}addUnit.php`,
      {
        t: authToken, ws: workspaceId, k: key, l: label
      })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`addUnit Api-Error: ${err.code} ${err.info} `);
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
      .put<boolean>(`${this.serverUrlUnit}addUnit.php`,
      {
        t: authToken, ws: workspaceId, u: fromUnit, k: key, l: label
      })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`copyUnit Api-Error: ${err.code} ${err.info} `);
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
      .put<boolean>(`${this.serverUrlUnit}deleteUnits.php`, { t: authToken, ws: workspaceId, u: units })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`deleteUnits Api-Error: ${err.code} ${err.info} `);
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
      .put<UnitShortData[]>(`${this.serverUrlUnit}moveUnits.php`,
      {
        t: authToken, ws: workspaceId, u: units, tws: targetWorkspace
      })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`moveUnits Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        }),
        map((unMovableUnits: UnitShortData[]) => {
          if (unMovableUnits.length === 0) return true;
          return unMovableUnits.length;
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
    return this.http.get<Blob>(`${this.serverUrlUnit}downloadUnits.php`, httpOptions);
  }

  getUnitProperties(workspaceId: number, unitId: number): Observable<UnitProperties | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .put<UnitProperties>(`${this.serverUrlUnit}getUnitProperties.php`, { t: authToken, ws: workspaceId, u: unitId })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`getUnitProperties Api-Error: ${err.code} ${err.info} `);
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
      .put<UnitDesignData>(`${this.serverUrlUnit}getUnitDesignData.php`, { t: authToken, ws: workspaceId, u: unitId })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`getUnitDesignData Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  getEditorList(): Observable<EditorData[] | number> {
    return this.http
      .get<EditorData[]>(`${this.serverUrlUnit}getItemAuthoringToolList.php`)
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`getEditorList Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  hasValidAuthoringTool(unitId: number): Observable<boolean | number> {
    return this.http
      .post<boolean>(`${this.serverUrlUnit}hasValidAuthoringTool.php`, { u: unitId })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`hasValidAuthoringTool Api-Error: ${err.code} ${err.info} `);
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
      .put<boolean>(`${this.serverUrlUnit}changeUnitProperties.php`, {
      t: authToken,
      ws: workspaceId,
      u: unitId,
      k: unitKey,
      l: unitLabel,
      d: unitDescription
    })
      .pipe(
        catchError(err => {
          console.warn(`setUnitMetaData Api-Error: ${err.status}.`);
          return of(err.status);
        })
      );
  }

  setUnitEditor(workspaceId: number,
                unitId: number, editorId: string): Observable<boolean | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .post<boolean>(`${this.serverUrlUnit}setUnitAuthoringTool.php`, {
      t: authToken,
      ws: workspaceId,
      u: unitId,
      ati: editorId
    })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`setUnitEditor Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  setUnitPlayer(workspaceId: number,
                unitId: number, playerId: string): Observable<boolean | number> {
    const authToken = localStorage.getItem('t');
    if (!authToken) {
      return of(401);
    }
    return this.http
      .post<boolean>(`${this.serverUrlUnit}setUnitPlayer.php`, {
      t: authToken,
      ws: workspaceId,
      u: unitId,
      pl: playerId
    })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`setUnitPlayer Api-Error: ${err.code} ${err.info} `);
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
      .put<boolean>(`${this.serverUrlUnit}setUnitDefinition.php`, {
      t: authToken,
      ws: workspaceId,
      u: unitId,
      ud: unitDef,
      pl: unitPlayerId
    })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`setUnitDefinition Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        })
      );
  }

  getUnitPlayerByUnitId(workspaceId: number, unitId: number): Observable<string | number> {
    return this.http
      .post<UnitPlayerData>(`${this.serverUrlPreview}getUnitPreviewData.php`,
      { t: localStorage.getItem('t'), ws: workspaceId, u: unitId })
      .pipe(
        catchError((err: ApiError) => {
          console.warn(`setUnitDefinition Api-Error: ${err.code} ${err.info} `);
          return of(err.code);
        }),
        map((playerData: UnitPlayerData) => playerData.player)
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

export interface PlayerData {
  id: string;
  label: string;
  html: string;
}

export interface EditorData {
  id: string;
  label: string;
  link: string;
}

export interface UnitPlayerData {
  id: number;
  key: string;
  label: string;
  def: string;
  player: string;
  player_id: string;
}
