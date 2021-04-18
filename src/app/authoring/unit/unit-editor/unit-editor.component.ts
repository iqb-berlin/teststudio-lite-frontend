import {
  Component, HostListener, Inject, Input, OnChanges, OnDestroy, OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackendService } from '../../backend.service';
import { MainDatastoreService } from '../../../maindatastore.service';
import { DatastoreService } from '../../datastore.service';

declare let srcDoc: any;

@Component({
  selector: 'app-unit-editor',
  templateUrl: './unit-editor.component.html',
  styleUrls: ['./unit-editor.component.css']
})
export class UnitEditorComponent implements OnInit, OnDestroy, OnChanges {
  @Input() unitId!: number;
  @Input() editorId = '';
  private readonly postMessageSubscription: Subscription = null;
  private iFrameHostElement: HTMLElement = null;
  private iFrameElement: HTMLElement = null;
  private postMessageTarget: Window = null;
  private sessionId = '';
  private lastEditorId = '';
  editorVersion = 1;

  constructor(
    @Inject('SERVER_URL') private serverUrl: string,
    private bs: BackendService,
    private ds: DatastoreService,
    private snackBar: MatSnackBar,
    private mds: MainDatastoreService
  ) {
    this.postMessageSubscription = this.mds.postMessage$.subscribe((m: MessageEvent) => {
      const msgData = m.data;
      const msgType = msgData.type;
      console.log(`got message to process: ${msgType}`);

      if ((msgType !== undefined) && (msgType !== null)) {
        this.postMessageTarget = m.source as Window;
        switch (msgType) {
          // // // // // // //
          case 'vo.FromAuthoringModule.ReadyNotification':
            this.sendUnitDataToEditor();
            break;

          // // // // // // //
          case 'vo.FromAuthoringModule.ChangedNotification':
            if (msgData.sessionId === this.sessionId) {
              this.postMessageTarget.postMessage({
                type: 'vo.ToAuthoringModule.DataRequest',
                sessionId: this.sessionId
              }, '*');
            }
            break;

          // // // // // // //
          case 'vo.FromAuthoringModule.DataTransfer':
            if (msgData.sessionId === this.sessionId) {
              this.ds.unitDefinitionNew = msgData.unitDefinition;
              this.ds.setUnitDataChanged();
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

  sendUnitDataToEditor(): void {
    if (this.unitId > 0) {
      if ((this.editorId === this.lastEditorId) && this.postMessageTarget) {
        if (this.ds.unitDefinitionNew) {
          this.postUnitDef(this.ds.unitDefinitionNew);
        } else {
          this.bs.getUnitDefinition(this.ds.selectedWorkspace, this.unitId).subscribe(
            ued => {
              this.ds.unitDefinitionNew = ued;
              this.ds.unitDefinitionOld = ued;
              this.postUnitDef(this.ds.unitDefinitionNew);
            },
            err => {
              this.snackBar.open(`Konnte Aufgabendefinition nicht laden (${err.code})`, 'Fehler', { duration: 3000 });
            }
          );
        }
      } else {
        this.buildEditor(this.editorId);
        // editor gets unit data via ReadyNotification
      }
    } else {
      this.buildEditor('');
    }
  }

  private postUnitDef(unitDef: string): void {
    if (this.editorVersion === 1) {
      this.postMessageTarget.postMessage({
        type: 'vo.ToAuthoringModule.DataTransfer',
        sessionId: this.sessionId,
        unitDefinition: unitDef
      }, '*');
    } else {
      console.error('editor version 2 coming soon');
      /*
      this.postMessageTarget.postMessage({
        type: 'vopStartCommand',
        sessionId: this.sessionId,
        unitState: {
          dataParts: {},
          presentationProgress: 'none',
          responseProgress: 'none'
        },
        playerConfig: {
          stateReportPolicy: 'eager'
        },
        unitDefinition: unitDef
      }, '*');
       */
    }
  }

  private buildEditor(editorId: string) {
    this.iFrameElement = null;
    this.postMessageTarget = null;
    while (this.iFrameHostElement.hasChildNodes()) {
      this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
    }
    if (editorId && this.ds.editorList[editorId]) {
      const editorData = this.ds.editorList[editorId];
      if (editorData.html) {
        this.setupEditorIFrame(editorData.html);
        this.lastEditorId = editorId;
      } else {
        this.bs.getModuleHtml(editorId).subscribe(
          editorResponse => {
            editorData.html = editorResponse;
            this.setupEditorIFrame(editorResponse);
            this.lastEditorId = editorId;
          },
          () => {
            const messageElement = <HTMLIFrameElement>document.createElement('p');
            messageElement.innerText = `Für Editor "${editorData.label}" konnte kein Modul geladen werden.`;
            this.iFrameHostElement.appendChild(messageElement);
            this.lastEditorId = '';
          }
        );
      }
    } else {
      const messageElement = <HTMLIFrameElement>document.createElement('p');
      messageElement.innerText = editorId ? `Editor-Modul "${editorId}" nicht in Datenbank` : 'Kein Editor festgelegt.';
      this.iFrameHostElement.appendChild(messageElement);
      this.lastEditorId = '';
    }
  }

  private setupEditorIFrame(editorHtml: string): void {
    this.sessionId = Math.floor(Math.random() * 20000000 + 10000000).toString();
    this.iFrameElement = <HTMLIFrameElement>document.createElement('iframe');
    this.iFrameElement.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin');
    this.iFrameElement.setAttribute('class', 'unitHost');
    this.iFrameElement.setAttribute('height', String(this.iFrameHostElement.clientHeight));
    this.iFrameHostElement.appendChild(this.iFrameElement);
    srcDoc.set(this.iFrameElement, editorHtml);
  }

  ngOnInit(): void {
    this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameHost');
    // if (this.unitDataNew) this.sendUnitDataToEditor();
  }

  ngOnChanges(): void {
    if (this.iFrameHostElement) this.sendUnitDataToEditor();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.iFrameElement && this.iFrameHostElement) {
      const divHeight = this.iFrameHostElement.clientHeight;
      this.iFrameElement.setAttribute('height', String(divHeight - 5));
      // TODO: Why minus 5px?
    }
  }

  ngOnDestroy(): void {
    if (this.postMessageSubscription !== null) this.postMessageSubscription.unsubscribe();
  }
}
