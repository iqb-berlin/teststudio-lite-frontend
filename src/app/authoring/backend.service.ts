import { catchError, map } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { AppHttpError } from '../backend.service';

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

  getUnitList(workspaceId: number): Observable <UnitShortData[]> {
    return this.http
      .put<UnitShortData[]>(`${this.serverUrlUnit}getUnitList.php`, { t: localStorage.getItem('t'), ws: workspaceId })
      .pipe(
        catchError(err => throwError(new AppHttpError(err)))
      );
  }

  addUnit(workspaceId: number, key: string, label: string): Observable<boolean> {
    return this.http
      .put<boolean>(`${this.serverUrlUnit}addUnit.php`,
      {
        t: localStorage.getItem('t'), ws: workspaceId, k: key, l: label
      })
      .pipe(
        catchError(err => throwError(new AppHttpError(err)))
      );
  }

  copyUnit(workspaceId: number,
           fromUnit: number, key: string, label: string): Observable<boolean> {
    return this.http
      .put<boolean>(`${this.serverUrlUnit}addUnit.php`,
      {
        t: localStorage.getItem('t'), ws: workspaceId, u: fromUnit, k: key, l: label
      })
      .pipe(
        catchError(err => throwError(new AppHttpError(err)))
      );
  }

  deleteUnits(workspaceId: number, units: number[]): Observable<boolean> {
    return this.http
      .put<boolean>(`${this.serverUrlUnit}deleteUnits.php`, { t: localStorage.getItem('t'), ws: workspaceId, u: units })
      .pipe(
        catchError(err => throwError(new AppHttpError(err)))
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
        catchError(err => throwError(new AppHttpError(err))),
        map((unMovableUnits: UnitShortData[]) => {
          if (unMovableUnits.length === 0) return true;
          return unMovableUnits.length;
        })
      );
  }

  downloadUnits(workspaceId: number, units: number[]): Observable<Blob> {
    const httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        options: JSON.stringify({ t: localStorage.getItem('t'), ws: workspaceId, u: units })
      })
    };
    return this.http.get<Blob>(`${this.serverUrlUnit}downloadUnits.php`, httpOptions);
  }

  getUnitProperties(workspaceId: number, unitId: number): Observable<UnitProperties> {
    return this.http
      .put<UnitProperties>(`${this.serverUrlUnit}getUnitProperties.php`,
      { t: localStorage.getItem('t'), ws: workspaceId, u: unitId })
      .pipe(
        catchError(err => throwError(new AppHttpError(err)))
      );
  }

  getUnitDesignData(workspaceId: number, unitId: number): Observable<UnitDesignData> {
    return this.http
      .put<UnitDesignData>(`${this.serverUrlUnit}getUnitDesignData.php`,
      { t: localStorage.getItem('t'), ws: workspaceId, u: unitId })
      .pipe(
        catchError(err => throwError(new AppHttpError(err)))
      );
  }

  getEditorList(): Observable<EditorData[]> {
    return this.http
      .get<EditorData[]>(`${this.serverUrlUnit}getItemAuthoringToolList.php`)
      .pipe(
        catchError(err => throwError(new AppHttpError(err)))
      );
  }

  setUnitMetaData(workspaceId: number, unitId: number, unitKey: string,
                  unitLabel: string, unitDescription: string): Observable<boolean> {
    return this.http
      .put<boolean>(`${this.serverUrlUnit}changeUnitProperties.php`, {
      t: localStorage.getItem('t'),
      ws: workspaceId,
      u: unitId,
      k: unitKey,
      l: unitLabel,
      d: unitDescription
    })
      .pipe(
        catchError(() => of(false))
      );
  }

  setUnitEditor(workspaceId: number,
                unitId: number, editorId: string): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.serverUrlUnit}setUnitAuthoringTool.php`, {
      t: localStorage.getItem('t'),
      ws: workspaceId,
      u: unitId,
      ati: editorId
    })
      .pipe(
        catchError(() => of(false))
      );
  }

  setUnitPlayer(workspaceId: number,
                unitId: number, playerId: string): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.serverUrlUnit}setUnitPlayer.php`, {
      t: localStorage.getItem('t'),
      ws: workspaceId,
      u: unitId,
      pl: playerId
    })
      .pipe(
        catchError(() => of(false))
      );
  }

  startUnitUploadProcessing(workspaceId: number, processId: string): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.serverUrlUnit}startUnitUploadProcessing.php`, {
      t: localStorage.getItem('t'),
      ws: workspaceId,
      p: processId
    })
      .pipe(
        catchError(err => throwError(new AppHttpError(err)))
      );
  }

  setUnitDefinition(workspaceId: number,
                    unitId: number, unitDef: string, unitPlayerId: string): Observable<boolean> {
    return this.http
      .put<boolean>(`${this.serverUrlUnit}setUnitDefinition.php`, {
      t: localStorage.getItem('t'),
      ws: workspaceId,
      u: unitId,
      ud: unitDef,
      pl: unitPlayerId
    })
      .pipe(
        catchError(err => throwError(new AppHttpError(err)))
      );
  }

  getUnitPlayerByUnitId(workspaceId: number, unitId: number): Observable<string> {
    return this.http
      .post<UnitPlayerData>(`${this.serverUrlPreview}getUnitPreviewData.php`,
      { t: localStorage.getItem('t'), ws: workspaceId, u: unitId })
      .pipe(
        catchError(err => throwError(new AppHttpError(err))),
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
