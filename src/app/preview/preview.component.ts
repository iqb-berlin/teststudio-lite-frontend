import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  Component, HostListener, OnDestroy, OnInit
} from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MainDatastoreService } from '../maindatastore.service';
import { DatastoreService } from './datastore.service';
import { BackendService, UnitPreviewData } from './backend.service';
import {
  KeyValuePairString, PageData, PendingUnitData, StateReportEntry, StatusVisual
} from './preview.interfaces';

declare let srcDoc: any;

@Component({
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit, OnDestroy {
  private routingSubscription: Subscription;
  private iFrameHostElement: HTMLElement;
  private iFrameItemplayer: HTMLIFrameElement;
  private postMessageSubscription: Subscription = null;
  private itemplayerSessionId = '';
  private postMessageTarget: Window = null;
  statusVisual: StatusVisual[] = [
    {
      id: 'presentation', label: 'P', color: 'Teal', description: 'Status: Vollständigkeit der Präsentation'
    },
    {
      id: 'responses', label: 'R', color: 'Teal', description: 'Status: Vollständigkeit der Antworten'
    }
  ];

  private pendingUnitData: PendingUnitData = null;
  dataLoading = false;
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
        let hasData = false;
        const pendingSpec = this.ds.pendingItemDefinition$.getValue();
        switch (msgType) {
          // // // // // // //
          case 'vo.FromPlayer.ReadyNotification':
            if ((pendingSpec !== null) && (pendingSpec.length > 0)) {
              hasData = true;
              this.ds.pendingItemDefinition$.next(null);
            }

            if (hasData) {
              this.itemplayerSessionId = Math.floor(Math.random() * 20000000 + 10000000).toString();
              this.postMessageTarget = m.source as Window;
              this.postMessageTarget.postMessage({
                type: 'vo.ToPlayer.DataTransfer',
                sessionId: this.itemplayerSessionId,
                unitDefinition: pendingSpec
              }, '*');
            }
            break;

          // // // // // // //
          case 'vo.FromPlayer.StartedNotification':
            this.setPageList(msgData.validPages, msgData.currentPage);
            this.setPresentationStatus(msgData.presentationComplete);
            this.setResponsesStatus(msgData.responsesGiven);
            break;

          // // // // // // //
          case 'vo.FromPlayer.ChangedDataTransfer':
            this.setPageList(msgData.validPages, msgData.currentPage);
            this.setPresentationStatus(msgData.presentationComplete);
            this.setResponsesStatus(msgData.responsesGiven);

            break;

          // // // // // // //
          case 'vo.FromPlayer.PageNavigationRequest':
            this.snackBar.open(`Player sendet PageNavigationRequest: "${
              msgData.navigationTarget}"`, '', { duration: 3000 });
            this.gotoPage(msgData.newPage);
            break;

          // // // // // // // ;-)
          case 'vo.FromPlayer.UnitNavigationRequest':
            this.snackBar.open(`Player sendet UnitNavigationRequest: "${
              msgData.navigationTarget}"`, '', { duration: 3000 });
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
    setTimeout(() => {
      this.postMessageSubscription = this.mds.postMessage$.subscribe((m: MessageEvent) => {
        const msgData = m.data;
        const msgType = msgData.type;
        let msgPlayerId = msgData.sessionId;
        if ((msgPlayerId === undefined) || (msgPlayerId === null)) {
          msgPlayerId = this.itemplayerSessionId;
        }

        if ((msgType !== undefined) && (msgType !== null)) {
          let pendingUnitDef = '';
          const pendingUnitDataToRestore: KeyValuePairString = {};
          switch (msgType) {
            case 'vopReadyNotification':
              // TODO add apiVersion check
              if (this.pendingUnitData && this.pendingUnitData.playerId === msgPlayerId) {
                pendingUnitDef = this.pendingUnitData.unitDefinition;
                pendingUnitDataToRestore.all = this.pendingUnitData.unitState;
                this.pendingUnitData = null;
              }
              this.postMessageTarget = m.source as Window;
              if (typeof this.postMessageTarget !== 'undefined') {
                this.postMessageTarget.postMessage({
                  type: 'vopStartCommand',
                  sessionId: this.itemplayerSessionId,
                  unitDefinition: pendingUnitDef,
                  unitState: {
                    dataParts: []
                  },
                  playerConfig: {
                    logPolicy: 'rich',
                    stateReportPolicy: 'eager'
                  }
                }, '*');
              }
              break;

            case 'vopStateChangedNotification':
              if (msgPlayerId === this.itemplayerSessionId) {
                if (msgData.playerState) {
                  const playerState = msgData.playerState;
                  this.setPageList(Object.keys(playerState.validPages), playerState.currentPage);
                }
                if (msgData.unitState) {
                  const unitState = msgData.unitState;
                  if (unitState) {
                    this.setPresentationStatus(unitState.presentationProgress);
                    this.setResponsesStatus(unitState.responseProgress);
                  }
                }
                if (msgData.log) {
                  (msgData.log as StateReportEntry[]).forEach(entry => {
                    console.log(`PLAYER LOG ${entry.key}: ${entry.content}`);
                  });
                }
              }
              break;

            default:
              console.log(`processMessagePost ignored message: ${msgType}`);
              break;
          }
        }
      });
      this.iFrameItemplayer = null;
      this.showPageNav = false;

      this.routingSubscription = this.route.params.subscribe(params => {
        this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameHost');
        while (this.iFrameHostElement.hasChildNodes()) {
          this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
        }
        if (params.u) {
          const paramSplit = params.u.split('##');
          this.ds.updatePageTitle(paramSplit[1]);
          this.dataLoading = true;

          this.itemplayerSessionId = Math.floor(Math.random() * 20000000 + 10000000).toString();
          this.setPageList([], '');
          this.setPresentationStatus('');
          this.setResponsesStatus('');

          this.bs.getUnitDesignData(paramSplit[0], paramSplit[1]).subscribe((data: UnitPreviewData) => {
            this.iFrameItemplayer = <HTMLIFrameElement>document.createElement('iframe');
            this.iFrameItemplayer.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin');
            this.iFrameItemplayer.setAttribute('class', 'unitHost');
            this.iFrameItemplayer.setAttribute('height', String(this.iFrameHostElement.clientHeight - 5));

            this.pendingUnitData = {
              playerId: this.itemplayerSessionId,
              unitDefinition: data.def,
              unitState: null
            };

            this.iFrameHostElement.appendChild(this.iFrameItemplayer);
            this.ds.updatePageTitle(`${data.key}-${data.label}`);
            this.dataLoading = false;
            this.player = data.player_id;
            srcDoc.set(this.iFrameItemplayer, data.player);
          });
        }
      });
    });
  }

  @HostListener('window:resize')
  onResize(): any {
    if (this.iFrameItemplayer && this.iFrameHostElement) {
      const divHeight = this.iFrameHostElement.clientHeight;
      this.iFrameItemplayer.setAttribute('height', String(divHeight - 5));
      // TODO: Why minus 5px?
    }
  }

  // ++++++++++++ page nav ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  setPageList(validPages: string[], currentPage: string) {
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

  gotoPage(action: string, index = 0) {
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
        sessionId: this.itemplayerSessionId,
        newPage: nextPageId
      }, '*');
    }
  }

  // ++++++++++++ Status ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  setPresentationStatus(status: string) { // 'yes' | 'no' | '' | undefined;
    if (status === 'yes') {
      this.changeStatusColor('presentation', 'LimeGreen');
    } else if (status === 'no') {
      this.changeStatusColor('presentation', 'LightCoral');
    } else if (status === '') {
      this.changeStatusColor('presentation', 'DarkGray');
    }
    // if undefined: no change
  }

  setResponsesStatus(status: string) { // 'yes' | 'no' | 'all' | '' | undefined
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

  changeStatusColor(id: string, newcolor: string) {
    for (let i = 0; i < this.statusVisual.length; i++) {
      if (this.statusVisual[i].id === id) {
        if (this.statusVisual[i].color !== newcolor) {
          this.statusVisual[i].color = newcolor;
          break;
        }
      }
    }
  }

  return() {
    this.location.back();
  }

  ngOnDestroy() {
    this.routingSubscription.unsubscribe();
    this.postMessageSubscription.unsubscribe();
  }
}
