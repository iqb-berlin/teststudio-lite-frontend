import {
  Component, EventEmitter, HostListener, Inject, Input, OnChanges, OnDestroy, OnInit, Output
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackendService } from '../../backend.service';
import { UnitData } from '../../authoring.classes';
import { MainDatastoreService } from '../../../maindatastore.service';

@Component({
  selector: 'app-unit-editor',
  templateUrl: './unit-editor.component.html',
  styleUrls: ['./unit-editor.component.css']
})
export class UnitEditorComponent implements OnInit, OnDestroy, OnChanges {
  @Input() workspaceId: number;
  @Input() unitDataOld: UnitData;
  @Input() unitDataNew!: UnitData;
  @Output() unitDataChanged = new EventEmitter();
  private readonly postMessageSubscription: Subscription = null;
  private iFrameHostElement: HTMLElement;
  private iFrameElement: HTMLElement = null;
  private unitWindow: Window = null;
  private sessionId = '';
  private lastEditorId = '';

  constructor(
    @Inject('SERVER_URL') private serverUrl: string,
    private bs: BackendService,
    private snackBar: MatSnackBar,
    private mds: MainDatastoreService
  ) {
    this.postMessageSubscription = this.mds.postMessage$.subscribe((m: MessageEvent) => {
      const msgData = m.data;
      const msgType = msgData.type;
      console.log('###fnü666');

      if ((msgType !== undefined) && (msgType !== null)) {
        this.unitWindow = m.source as Window;
        switch (msgType) {
          // // // // // // //
          case 'vo.FromAuthoringModule.ReadyNotification':
            this.sendUnitDataToEditor();
            break;

          // // // // // // //
          case 'vo.FromAuthoringModule.ChangedNotification':
            if (msgData.sessionId === this.sessionId) {
              console.log('###fnü');
              this.unitWindow.postMessage({
                type: 'vo.ToAuthoringModule.DataRequest',
                sessionId: this.sessionId
              }, '*');
            }
            break;

          // // // // // // //
          case 'vo.FromAuthoringModule.DataTransfer':
            console.log('###fnü2');
            if (msgData.sessionId === this.sessionId) {
              this.unitDataNew.def = msgData.unitDefinition;
              this.unitDataChanged.emit();
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
    if (this.unitDataNew) {
      if (this.unitDataNew.playerId !== this.lastEditorId) {
        this.buildEditor(this.unitDataNew.playerId);
      }
      if (this.unitDataNew.def) {
        this.unitWindow.postMessage({
          type: 'vo.ToAuthoringModule.DataTransfer',
          unitDefinition: this.unitDataNew.def,
          sessionId: this.sessionId
        }, '*');
      } else {
        this.bs.getUnitDesignData(this.workspaceId, this.unitDataOld.id).subscribe(ued => {
          if (typeof ued === 'number') {
            this.snackBar.open('Konnte Aufgabendefinition nicht laden', 'Fehler', { duration: 1000 });
          } else {
            this.unitDataOld.def = ued.def;
            this.unitDataNew.def = ued.def;
            if (this.lastEditorId === ued.authoringtoolLink) {
              this.unitWindow.postMessage({
                type: 'vo.ToAuthoringModule.DataTransfer',
                unitDefinition: this.unitDataNew.def,
                sessionId: this.sessionId
              }, '*');
            } else {
              this.buildEditor(ued.authoringtoolLink);
            }
          }
        });
      }
    }
  }

  private buildEditor(editorLink: string) {
    while (this.iFrameHostElement.hasChildNodes()) {
      this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
    }
    this.sessionId = Math.floor(Math.random() * 20000000 + 10000000).toString();
    this.iFrameElement = <HTMLIFrameElement>document.createElement('iframe');
    this.iFrameElement.setAttribute('src', this.serverUrl + editorLink);
    this.iFrameElement.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin');
    this.iFrameElement.setAttribute('class', 'unitHost');
    this.iFrameElement.setAttribute('height', String(this.iFrameHostElement.clientHeight));

    this.iFrameHostElement.appendChild(this.iFrameElement);
    this.lastEditorId = editorLink;
  }

  ngOnInit(): void {
    this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameHost');
  }

  ngOnChanges(): void {
    this.sendUnitDataToEditor();
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
