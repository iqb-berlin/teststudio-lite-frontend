import { MainDatastoreService } from './../maindatastore.service';
import { DataSource } from '@angular/cdk/table';
import { BackendService, UnitShortData, WorkspaceData } from './backend.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {
  public workspaceList$ = new BehaviorSubject<WorkspaceData[]>([]);
  public workspaceId$ = new BehaviorSubject<number>(0);
  public workspaceName$ = new BehaviorSubject<string>('');

  constructor(
    private bs: BackendService,
    private mds: MainDatastoreService) {
    this.workspaceId$.next(+localStorage.getItem('ws'));

    this.workspaceId$.subscribe((wsId: number) => {
      localStorage.setItem('ws', String(wsId));
      if (wsId > 0) {
        let wsFound = false;
        const myWorkspaces = this.workspaceList$.getValue();
        for (let i = 0; i < myWorkspaces.length; i++) {
          if (myWorkspaces[i].id === wsId) {
            this.workspaceName$.next(myWorkspaces[i].name);
            wsFound = true;
            break;
          }
        }

        if (!wsFound) {
          this.workspaceName$.next('');
        }
      } else {
        this.workspaceName$.next('');
      }
    });

    this.mds.token$.subscribe(t => {
      this.updateWorkspaceList();
    });
  }

  private updateWorkspaceList() {
    const myToken = this.mds.token$.getValue();
    if (myToken === '') {
      this.workspaceList$.next([]);
      this.workspaceId$.next(this.workspaceId$.getValue()); // to trigger reload
    } else {
      this.bs.getWorkspaceList(this.mds.token$.getValue()).subscribe(
        (wsresponse: WorkspaceData[]) => {
          this.workspaceList$.next(wsresponse);
          const wsId = this.workspaceId$.getValue();
          if (wsId > 0) {
            let wsFound = false;
            for (let i = 0; i < wsresponse.length; i++) {
              if (wsresponse[i].id === wsId) {
                this.workspaceId$.next(wsId); // to trigger reload
                wsFound = true;
                break;
              }
            }

            if (!wsFound) {
              this.workspaceId$.next(0);
            }
          } else {
            this.workspaceId$.next(0); // to trigger reload
          }
        });
      }
    }
}