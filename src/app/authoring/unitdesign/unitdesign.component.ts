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
  private authoringSessionId$ = new BehaviorSubject<string>('');


  private iFrameHostElement: HTMLElement;
  private unitWindow: Window = null;
  private pendingUnitDefinition$ = new BehaviorSubject<string>('');
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
              const myData = this.pendingUnitDefinition$.getValue();

              if (myData !== null) {
                this.unitWindow.postMessage({
                  type: 'OpenCBA.UnitAuthoring.LoadUnitDefinition',
                  unitDefinition: myData,
                  authoringSessionId: this.authoringSessionId$.getValue(),
                }, '*');
                this.pendingUnitDefinition$.next(null);
              }
              break;

            // // // // // // //
            case 'OpenCBA.UnitAuthoring.HasChanged':
              if (msgData['authoringSessionId'] === this.authoringSessionId$.getValue()) {
                this.hasChanged$.next(true);
                this.ds.unitDesignToSave$.next(this);
              }
              break;

            // // // // // // //
            case 'OpenCBA.UnitAuthoring.UnitDefinition':
              console.log('ich war hier: ' + msgData);
              if (msgData['authoringSessionId'] === this.authoringSessionId$.getValue()) {
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
    this.myUnitDesign$.subscribe((ud: UnitDesignData) => {
      if (ud === null) {
        this.hasAuthoringToolDef = false;
      } else {
        this.hasAuthoringToolDef = (ud.authoringtoolLink !== null) && (ud.authoringtoolLink.length > 0);
      }

      if (this.hasAuthoringToolDef) {
        this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameHost');

        while (this.iFrameHostElement.hasChildNodes()) {
          this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
        }

        const iFrameUnit = <HTMLIFrameElement>document.createElement('iframe');
        iFrameUnit.setAttribute('src', this.serverUrl + ud.authoringtoolLink);
        iFrameUnit.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin');
        iFrameUnit.setAttribute('class', 'unitHost');
        iFrameUnit.setAttribute('height', String(this.iFrameHostElement.clientHeight));

        this.iFrameHostElement.appendChild(iFrameUnit);

        this.pendingUnitDefinition$.next(ud.def);
        this.authoringSessionId$.next(ud.uid);
      } else {
        const dialogRef = this.selectAuthoringToolDialog.open(SelectAuthoringToolComponent, {
          width: '400px',
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result !== false) {
            this.bs.setUnitAuthoringTool(
              this.mds.token$.getValue(),
              this.ds.workspaceId$.getValue(),
              ud.id,
              (<FormGroup>result).get('atSelector').value
            ).subscribe(setAuthoringTollResult => {
              console.log('Unit neu laden!');
            });
          }
        });
      }
    });

    this.routingSubscription = this.route.params.subscribe(
      params => {
        // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        const newUnit: UnitDesignData | ServerError = this.route.snapshot.data['unitDesignData'];

        this.hasChanged$.next(false);
        this.ds.unitDesignToSave$.next(null);
        if (newUnit !== null) {
          if ((newUnit as UnitDesignData).id !== undefined) {
            this.myUnitDesign$.next(newUnit as UnitDesignData);
          } else {
            this.myUnitDesign$.next(null);
          }
        } else {
          this.myUnitDesign$.next(null);
        }
      });
  }

  ngOnDestroy() {
    this.routingSubscription.unsubscribe();
    this.postMessageSubscription.unsubscribe();
  }
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  selectAuthoringTool(tool_id) {
    const myLocalUnitdata = this.myUnitDesign$.getValue();
    if (myLocalUnitdata !== null) {
    }
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
      authoringSessionId: this.authoringSessionId$.getValue()
    }, '*');

    return of(true);
  }
}
