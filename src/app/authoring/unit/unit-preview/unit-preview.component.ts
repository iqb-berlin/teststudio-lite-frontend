import {
  Component, HostListener, Input, OnChanges, OnDestroy, OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  PageData,
  StatusVisual
} from './unit-preview.classes';
import { MainDatastoreService } from '../../../maindatastore.service';
import { BackendService, PlayerData } from '../../backend.service';
import { DatastoreService } from '../../datastore.service';
import { UnitData } from '../../authoring.classes';

declare let srcDoc: any;

@Component({
  selector: 'app-unit-preview',
  templateUrl: './unit-preview.component.html',
  styleUrls: ['./unit-preview.component.css']
})
export class UnitPreviewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() workspaceId: number;
  @Input() unitDataOld: UnitData;
  @Input() unitDataNew!: UnitData;
  private iFrameHostElement: HTMLElement;
  private iFramePlayer: HTMLIFrameElement;
  private readonly postMessageSubscription: Subscription = null;
  private sessionId = '';
  private postMessageTarget: Window = null;
  private lastPlayerId = '';
  statusVisual: StatusVisual[] = [
    {
      id: 'presentation', label: 'P', color: 'Teal', description: 'Status: Vollständigkeit der Präsentation'
    },
    {
      id: 'responses', label: 'R', color: 'Teal', description: 'Status: Vollständigkeit der Antworten'
    }
  ];

  showPageNav = false;
  pageList: PageData[] = [];
  player = '';

  constructor(
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    private snackBar: MatSnackBar,
    private bs: BackendService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.postMessageSubscription = this.mds.postMessage$.subscribe((m: MessageEvent) => {
      const msgData = m.data;
      const msgType = msgData.type;
      console.log(msgData);

      if ((msgType !== undefined) && (msgType !== null)) {
        switch (msgType) {
          case 'vo.FromPlayer.ReadyNotification':
            if (this.unitDataNew) {
              this.sessionId = Math.floor(Math.random() * 20000000 + 10000000).toString();
              this.postMessageTarget = m.source as Window;
              this.sendUnitDataToPlayer();
            }
            break;

          case 'vo.FromPlayer.StartedNotification':
            this.setPageList(msgData.validPages, msgData.currentPage);
            this.setPresentationStatus(msgData.presentationComplete);
            this.setResponsesStatus(msgData.responsesGiven);
            break;

          case 'vo.FromPlayer.ChangedDataTransfer':
            this.setPageList(msgData.validPages, msgData.currentPage);
            this.setPresentationStatus(msgData.presentationComplete);
            this.setResponsesStatus(msgData.responsesGiven);
            break;

          case 'vo.FromPlayer.PageNavigationRequest':
            this.snackBar.open(`Player sendet PageNavigationRequest: "${
              msgData.navigationTarget}"`, '', { duration: 3000 });
            this.gotoPage(msgData.newPage);
            break;

          case 'vo.FromPlayer.UnitNavigationRequest':
            this.snackBar.open(`Player sendet UnitNavigationRequest: "${
              msgData.navigationTarget}"`, '', { duration: 3000 });
            break;

          default:
            console.log(`processMessagePost ignored message: ${msgType}`);
            break;
        }
      }
    });
  }

  sendUnitDataToPlayer(): void {
    if (this.unitDataNew) {
      if ((this.unitDataNew.playerId === this.lastPlayerId) && this.postMessageTarget) {
        if (this.unitDataNew.def) {
          this.postMessageTarget.postMessage({
            type: 'vo.ToPlayer.DataTransfer',
            sessionId: this.sessionId,
            unitDefinition: this.unitDataNew.def
          }, '*');
        } else {
          this.bs.getUnitDesignData(this.workspaceId, this.unitDataNew.id).subscribe(
            ued => {
              this.unitDataOld.def = ued.def;
              this.unitDataNew.def = ued.def;
              this.postMessageTarget.postMessage({
                type: 'vo.ToPlayer.DataTransfer',
                sessionId: this.sessionId,
                unitDefinition: this.unitDataNew.def
              }, '*');
            },
            err => {
              this.snackBar.open(`Konnte Aufgabendefinition nicht laden (${err.code})`, 'Fehler', { duration: 3000 });
            }
          );
        }
      } else {
        this.buildPlayer(this.unitDataNew.playerId);
        // player gets unit data via ReadyNotification
      }
    } else {
      this.buildPlayer('');
    }
  }

  private buildPlayer(playerId: string) {
    this.iFramePlayer = null;
    this.postMessageTarget = null;
    while (this.iFrameHostElement.hasChildNodes()) {
      this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
    }
    if (playerId) {
      let playerData: PlayerData = null;
      this.ds.playerList.forEach(p => {
        console.log(p, playerId);
        if (p.id === playerId) playerData = p;
      });

      if (playerData) {
        if (playerData.html) {
          this.setupPlayerIFrame(playerData.html);
          this.lastPlayerId = playerData.id;
        } else {
          this.bs.getUnitPlayerByUnitId(this.ds.selectedWorkspace, this.unitDataNew.id).subscribe(playerResponse => {
            if (typeof playerResponse === 'number') {
              const messageElement = <HTMLIFrameElement>document.createElement('p');
              messageElement.innerText = `Für Player "${playerData.label}" konnte kein Modul geladen werden.`;
              this.iFrameHostElement.appendChild(messageElement);
              this.lastPlayerId = '';
            } else {
              playerData.html = playerResponse;
              this.setupPlayerIFrame(playerResponse);
              this.lastPlayerId = playerData.id;
            }
          });
        }
      } else {
        const messageElement = <HTMLIFrameElement>document.createElement('p');
        messageElement.innerText = `Für Player "${playerId}" wurde kein Modul gefunden.`;
        this.iFrameHostElement.appendChild(messageElement);
        this.lastPlayerId = '';
      }
    } else {
      const messageElement = <HTMLIFrameElement>document.createElement('p');
      messageElement.innerText = 'Kein Player festgelegt';
      this.iFrameHostElement.appendChild(messageElement);
      this.lastPlayerId = '';
    }
  }

  private setupPlayerIFrame(playerHtml: string): void {
    this.setPageList([], '');
    this.setPresentationStatus('');
    this.setResponsesStatus('');
    this.sessionId = Math.floor(Math.random() * 20000000 + 10000000).toString();
    this.iFramePlayer = <HTMLIFrameElement>document.createElement('iframe');
    this.iFramePlayer.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin');
    this.iFramePlayer.setAttribute('class', 'unitHost');
    this.iFramePlayer.setAttribute('height', String(this.iFrameHostElement.clientHeight));
    this.iFrameHostElement.appendChild(this.iFramePlayer);
    srcDoc.set(this.iFramePlayer, playerHtml);
  }

  ngOnInit(): void {
    this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameHost');
    if (this.unitDataNew) this.sendUnitDataToPlayer();
  }

  ngOnChanges(): void {
    if (this.iFrameHostElement) this.sendUnitDataToPlayer();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.iFramePlayer && this.iFrameHostElement) {
      const divHeight = this.iFrameHostElement.clientHeight;
      this.iFramePlayer.setAttribute('height', String(divHeight - 5));
      // TODO: Why minus 5px?
    }
  }

  // ++++++++++++ page nav ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  setPageList(validPages: string[], currentPage: string): void {
    if ((validPages instanceof Array)) {
      const newPageList: PageData[] = [];
      if (validPages.length > 1) {
        for (let i = 0; i < validPages.length; i++) {
          if (i === 0) {
            newPageList.push({
              index: -1,
              id: '#previous',
              disabled: validPages[i] === currentPage,
              type: '#previous'
            });
          }

          newPageList.push({
            index: i + 1,
            id: validPages[i],
            disabled: validPages[i] === currentPage,
            type: '#goto'
          });

          if (i === validPages.length - 1) {
            newPageList.push({
              index: -1,
              id: '#next',
              disabled: validPages[i] === currentPage,
              type: '#next'
            });
          }
        }
      }
      this.pageList = newPageList;
    } else if ((this.pageList.length > 1) && (currentPage !== undefined)) {
      let currentPageIndex = 0;
      for (let i = 0; i < this.pageList.length; i++) {
        if (this.pageList[i].type === '#goto') {
          if (this.pageList[i].id === currentPage) {
            this.pageList[i].disabled = true;
            currentPageIndex = i;
          } else {
            this.pageList[i].disabled = false;
          }
        }
      }
      if (currentPageIndex === 1) {
        this.pageList[0].disabled = true;
        this.pageList[this.pageList.length - 1].disabled = false;
      } else {
        this.pageList[0].disabled = false;
        this.pageList[this.pageList.length - 1].disabled = currentPageIndex === this.pageList.length - 2;
      }
    }
    this.showPageNav = this.pageList.length > 0;
  }

  gotoPage(action: string, index = 0): void {
    let nextPageId = '';
    // currentpage is detected by disabled-attribute of page
    if (action === '#next') {
      let currentPageIndex = 0;
      for (let i = 0; i < this.pageList.length; i++) {
        if ((this.pageList[i].index > 0) && (this.pageList[i].disabled)) {
          currentPageIndex = i;
          break;
        }
      }
      if ((currentPageIndex > 0) && (currentPageIndex < this.pageList.length - 2)) {
        nextPageId = this.pageList[currentPageIndex + 1].id;
      }
    } else if (action === '#previous') {
      let currentPageIndex = 0;
      for (let i = 0; i < this.pageList.length; i++) {
        if ((this.pageList[i].index > 0) && (this.pageList[i].disabled)) {
          currentPageIndex = i;
          break;
        }
      }
      if (currentPageIndex > 1) {
        nextPageId = this.pageList[currentPageIndex - 1].id;
      }
    } else if (action === '#goto') {
      if ((index > 0) && (index < this.pageList.length - 1)) {
        nextPageId = this.pageList[index].id;
      }
    } else if (index === 0) {
      // call from player
      nextPageId = action;
    }

    if (nextPageId.length > 0) {
      this.postMessageTarget.postMessage({
        type: 'vo.ToPlayer.NavigateToPage',
        sessionId: this.sessionId,
        newPage: nextPageId
      }, '*');
    }
  }

  // ++++++++++++ Status ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  setPresentationStatus(status: string): void { // 'yes' | 'no' | '' | undefined;
    if (status === 'yes') {
      this.changeStatusColor('presentation', 'LimeGreen');
    } else if (status === 'no') {
      this.changeStatusColor('presentation', 'LightCoral');
    } else if (status === '') {
      this.changeStatusColor('presentation', 'DarkGray');
    }
    // if undefined: no change
  }

  setResponsesStatus(status: string): void { // 'yes' | 'no' | 'all' | '' | undefined
    if (status === 'yes') {
      this.changeStatusColor('responses', 'Gold');
    } else if (status === 'no') {
      this.changeStatusColor('responses', 'LightCoral');
    } else if (status === 'all') {
      this.changeStatusColor('responses', 'LimeGreen');
    } else if (status === '') {
      this.changeStatusColor('responses', 'DarkGray');
    }
    // if undefined: no change
  }

  changeStatusColor(id: string, newcolor: string): void {
    for (let i = 0; i < this.statusVisual.length; i++) {
      if (this.statusVisual[i].id === id) {
        if (this.statusVisual[i].color !== newcolor) {
          this.statusVisual[i].color = newcolor;
          break;
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.postMessageSubscription !== null) this.postMessageSubscription.unsubscribe();
  }
}
