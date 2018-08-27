import { SelectAuthoringToolComponent } from './../select-authoring-tool/select-authoring-tool.component';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent, ConfirmDialogData } from './../../iqb-common/confirm-dialog/confirm-dialog.component';
import { Router, ActivatedRoute, Resolve } from '@angular/router';
import { DatastoreService, SaveDataComponent } from './../datastore.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainDatastoreService } from './../../maindatastore.service';
import { Subscriber, Subscription, Observable, BehaviorSubject, of } from 'rxjs';
import { BackendService, UnitDesignData, StrIdLabelSelectedData, ServerError } from './../backend.service';
import { Component, OnInit, Inject } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Location } from '@angular/common';
import { switchMap, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-unitdesign',
  templateUrl: './unitdesign.component.html',
  styleUrls: ['./unitdesign.component.css']
})

export class UnitDesignComponent implements OnInit, OnDestroy, SaveDataComponent {
  private routingSubscription: Subscription;
  private myUnitDesign$ = new BehaviorSubject<UnitDesignData>(null);
  private hasAuthoringToolDef = false;
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
    private selectAuthoringToolDialog: MatDialog,
    public confirmDialog: MatDialog
  ) {

    this.postMessageSubscription = this.mds.postMessage$.subscribe((m: MessageEvent) => {
        const msgData = m.data;
        const msgType = msgData['type'];

        if ((msgType !== undefined) && (msgType !== null)) {
          this.unitWindow = m.source;
          switch (msgType) {

            // // // // // // //
            case 'OpenCBA.UnitAuthoring.Ready':
              this.unitWindow.postMessage({
                type: 'OpenCBA.UnitAuthoring.LoadUnitDefinition',
                unitDefinition: this.pendingUnitDefinition,
                authoringSessionId: this.authoringSessionId,
              }, '*');
              this.pendingUnitDefinition = null;
              break;

            // // // // // // //
            case 'OpenCBA.UnitAuthoring.HasChanged':
              if (msgData['authoringSessionId'] === this.authoringSessionId) {
                this.hasChanged$.next(true);
                this.ds.unitDesignToSave$.next(this);
              }
              break;

            // // // // // // //
            case 'OpenCBA.UnitAuthoring.UnitDefinition':
              if (msgData['authoringSessionId'] === this.authoringSessionId) {
                const UnitDef = msgData['unitDefinition'];
                const myLocalUnitdata = this.myUnitDesign$.getValue();
                if ((myLocalUnitdata !== null) &&
                          (UnitDef !== undefined) && (UnitDef !== null)) {
                  this.bs.setUnitDefinition(
                    this.mds.token$.getValue(),
                    this.ds.workspaceId$.getValue(),
                    myLocalUnitdata.id,
                    UnitDef,
                    msgData['unitPlayerId']
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
              console.log('processMessagePost ignored message: ' + msgType);
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
          this.authoringSessionId = ud.uid;

          this.unitWindow.postMessage({
            type: 'OpenCBA.UnitAuthoring.LoadUnitDefinition',
            unitDefinition: ud.def,
            authoringSessionId: this.authoringSessionId,
          }, '*');

        } else {
          while (this.iFrameHostElement.hasChildNodes()) {
            this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
          }
          this.pendingUnitDefinition = ud.def;
          this.authoringSessionId = ud.uid;
          this.currentAuthoringTool = ud.authoringtoolLink;

          this.iFrameElement = <HTMLIFrameElement>document.createElement('iframe');
          this.iFrameElement.setAttribute('src', this.serverUrl + ud.authoringtoolLink);
          this.iFrameElement.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin');
          this.iFrameElement.setAttribute('class', 'unitHost');
          this.iFrameElement.setAttribute('height', String(this.iFrameHostElement.clientHeight));

          this.iFrameHostElement.appendChild(this.iFrameElement);
          // the iFrame will now be loaded and when it's ready, it will send a message to get the
          // pending unit definition
        }

      } else {
        console.log('hasAuthoringToolDef is false');
      }
    });

    this.routingSubscription = this.route.params.subscribe(
      params => {
        // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        const newUnit: UnitDesignData | ServerError = this.route.snapshot.data['unitDesignData'];

        this.hasChanged$.next(false);
        this.ds.unitDesignToSave$.next(null);
        this.ds.unitViewMode$.next('ud');
        if (newUnit !== null) {
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
          this.ds.selectedUnitId$.next(0);
        } else {
          this.ds.updatePageTitle('Ändern Gestaltung: ' + (newUnit as UnitDesignData).key);
          this.ds.selectedUnitId$.next((newUnit as UnitDesignData).id);
        }
      });
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
    } else {
      const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
        width: '500px',
        height: '300px',
        data:  <ConfirmDialogData>{
          title: 'Speichern',
          content: 'Sie haben Daten dieser Aufgabe geändert. Möchten Sie diese Änderungen speichern?',
          confirmbuttonlabel: 'Speichern',
          confirmbuttonreturn: 'YES',
          confirmbutton2label: 'Änderungen verwerfen',
          confirmbutton2return: 'NO'
        }
      });
      return dialogRef.afterClosed().pipe(
        switchMap(result => {
            if (result === false) {
              return of(false);
            } else {
              if (result === 'NO') {
                return of(true);
              } else { // 'YES'

                return this.saveData();
              }
            }
          }
      ));
    }
  }

  // not nice: Just sending get unitdata request an hope
  saveData(): Observable<boolean> {
    this.unitWindow.postMessage({
      type: 'OpenCBA.UnitAuthoring.UnitDefinitionRequest',
      authoringSessionId: this.authoringSessionId
    }, '*');

    return of(true);
  }
}
