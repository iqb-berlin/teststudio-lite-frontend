import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import {
  Subscription, Observable, BehaviorSubject, of
} from 'rxjs';
import {
  Component, OnInit, Inject, OnDestroy
} from '@angular/core';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { ConfirmDialogComponent, ConfirmDialogData } from 'iqb-components';
import { BackendService, UnitDesignData } from '../backend.service';
import { MainDatastoreService } from '../../maindatastore.service';
import { DatastoreService, SaveDataComponent } from '../datastore.service';

@Component({
  selector: 'app-unitdesign',
  templateUrl: './unitdesign.component.html',
  styleUrls: ['./unitdesign.component.css']
})

export class UnitDesignComponent implements OnInit, OnDestroy, SaveDataComponent {
  private routingSubscription: Subscription;
  private myUnitDesign$ = new BehaviorSubject<UnitDesignData>(null);
  hasAuthoringToolDef = false;
  private hasChanged$ = new BehaviorSubject<boolean>(false);
  private authoringSessionId = '';
  private currentAuthoringTool = '';

  private iFrameHostElement: HTMLElement;
  private iFrameElement: HTMLElement = null;
  private unitWindow: Window = null;
  private pendingUnitDefinition = '';
  private postMessageSubscription: Subscription = null;

  constructor(
    @Inject('SERVER_URL') private serverUrl: string,
    private mds: MainDatastoreService,
    private bs: BackendService,
    private ds: DatastoreService,
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public confirmDialog: MatDialog
  ) {
    this.postMessageSubscription = this.mds.postMessage$.subscribe((m: MessageEvent) => {
      const msgData = m.data;
      const msgType = msgData.type;

      if ((msgType !== undefined) && (msgType !== null)) {
        this.unitWindow = m.source as Window;
        switch (msgType) {
          // // // // // // //
          case 'vo.FromAuthoringModule.ReadyNotification':
            this.unitWindow.postMessage({
              type: 'vo.ToAuthoringModule.DataTransfer',
              unitDefinition: this.pendingUnitDefinition,
              sessionId: this.authoringSessionId
            }, '*');
            this.pendingUnitDefinition = null;
            break;

            // // // // // // //
          case 'vo.FromAuthoringModule.ChangedNotification':
            if (msgData.sessionId === this.authoringSessionId) {
              this.hasChanged$.next(true);
              this.ds.unitDesignToSave$.next(this);
            }
            break;

            // // // // // // //
          case 'vo.FromAuthoringModule.DataTransfer':
            if (msgData.sessionId === this.authoringSessionId) {
              const UnitDef = msgData.unitDefinition;
              const myLocalUnitdata = this.myUnitDesign$.getValue();
              if ((myLocalUnitdata !== null) &&
                          (UnitDef !== undefined) && (UnitDef !== null)) {
                this.bs.setUnitDefinition(
                  this.ds.selectedWorkspace,
                  myLocalUnitdata.id,
                  UnitDef,
                  msgData.player
                ).subscribe(saveResult => {
                  const myreturn = (typeof saveResult === 'boolean') ? saveResult : false;
                  if (myreturn) {
                    this.hasChanged$.next(false);
                    this.ds.unitDesignToSave$.next(null);
                  }
                });
              }
            }
            break;

            // // // // // // //
          default:
            console.log(`processMessagePost ignored message: ${msgType}`);
            break;
        }
      }
    });
  }

  ngOnInit() {
    this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameHost');

    this.myUnitDesign$.subscribe((ud: UnitDesignData) => {
      if (ud === null) {
        this.hasAuthoringToolDef = false;
      } else {
        this.hasAuthoringToolDef = (ud.authoringtoolLink !== null) && (ud.authoringtoolLink.length > 0);
      }

      if (this.hasAuthoringToolDef) {
        if ((this.iFrameElement !== null) && (ud.authoringtoolLink === this.currentAuthoringTool)) {
          // reuse the authoring tool: load new data
          this.pendingUnitDefinition = null;
          this.authoringSessionId = Math.floor(Math.random() * 20000000 + 10000000).toString();

          this.unitWindow.postMessage({
            type: 'vo.ToAuthoringModule.DataTransfer',
            unitDefinition: ud.def,
            sessionId: this.authoringSessionId
          }, '*');
        } else {
          while (this.iFrameHostElement.hasChildNodes()) {
            this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
          }
          this.pendingUnitDefinition = ud.def;
          this.authoringSessionId = Math.floor(Math.random() * 20000000 + 10000000).toString();
          this.currentAuthoringTool = ud.authoringtoolLink;

          this.iFrameElement = <HTMLIFrameElement>document.createElement('iframe');
          this.iFrameElement.setAttribute('src', this.serverUrl + ud.authoringtoolLink);
          this.iFrameElement.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin');
          this.iFrameElement.setAttribute('class', 'unitHost');
          this.iFrameElement.setAttribute('height', String(this.iFrameHostElement.clientHeight));

          this.iFrameHostElement.appendChild(this.iFrameElement);
          // the iFrame will now be loaded and when it's ready, it will send a message to get the
          // pending unit definition
          this.hasChanged$.next(false);
        }
      } else {
        console.log('hasAuthoringToolDef is false');
      }
    });

    this.routingSubscription = this.route.params.subscribe(
      () => {
        // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        const newUnit = this.route.snapshot.data.unitDesignData as UnitDesignData;

        this.hasChanged$.next(false);
        this.ds.unitDesignToSave$.next(null);
        if (newUnit) {
          if ((newUnit as UnitDesignData).id !== undefined) {
            this.myUnitDesign$.next(newUnit as UnitDesignData);
          } else {
            this.myUnitDesign$.next(null);
          }
        } else {
          this.myUnitDesign$.next(null);
        }

        if (this.myUnitDesign$.getValue() === null) {
          this.ds.updatePageTitle('Ändern Gestaltung');
          this.ds.selectedUnit$.next(0);
        } else {
          this.ds.updatePageTitle(`Ändern Gestaltung: ${(newUnit as UnitDesignData).key}`);
          this.ds.selectedUnit$.next((newUnit as UnitDesignData).id);
        }
      }
    );
  }

  ngOnDestroy() {
    this.routingSubscription.unsubscribe();
    this.postMessageSubscription.unsubscribe();
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // for interface 'SaveDataComponent'
  saveOrDiscard(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.hasChanged$.getValue() === false) {
      return true;
    }
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      width: '500px',
      height: '300px',
      data: <ConfirmDialogData>{
        title: 'Speichern',
        content: 'Sie haben Daten dieser Aufgabe geändert. Möchten Sie diese Änderungen speichern?',
        confirmbuttonlabel: 'Speichern',
        showcancel: true
      }
    });
    return dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (result === false) {
          return of(false);
        }
        if (result === 'NO') {
          return of(true);
        } // 'YES'

        return this.saveData();
      })
    );
  }

  // not nice: Just sending get unitdata request an hope
  saveData(): Observable<boolean> {
    this.unitWindow.postMessage({
      type: 'vo.ToAuthoringModule.DataRequest',
      sessionId: this.authoringSessionId
    }, '*');

    return of(true);
  }
}
