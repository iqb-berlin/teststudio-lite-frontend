import { LoginStatusResponseData } from './../backend.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute } from '@angular/router';
import { BackendService, UnitPreviewData } from './backend.service';
import { DatastoreService } from './datastore.service';
import { MainDatastoreService } from './../maindatastore.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';

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
  private statusVisual: StatusVisual[] = [
      {id: 'presentation', label: 'P', color: 'Teal', description: 'Status: Vollständigkeit der Präsentation'},
      {id: 'responses', label: 'R', color: 'Teal', description: 'Status: Vollständigkeit der Antworten'}
    ];

  private dataLoading = false;
  private showPageNav = false;
  private pageList: PageData[] = [];
  private player = '';

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
      const msgType = msgData['type'];
      console.log(msgData);

      if ((msgType !== undefined) && (msgType !== null)) {
        switch (msgType) {

          // // // // // // //
          case 'vo.FromPlayer.ReadyNotification':
            let hasData = false;
            const initParams = {};

            const pendingSpec = this.ds.pendingItemDefinition$.getValue();
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
            this.setPageList(msgData['validPages'], msgData['currentPage']);
            this.setPresentationStatus(msgData['presentationComplete']);
            this.setResponsesStatus(msgData['responsesGiven']);
            break;

          // // // // // // //
          case 'vo.FromPlayer.ChangedDataTransfer':
            this.setPageList(msgData['validPages'], msgData['currentPage']);
            this.setPresentationStatus(msgData['presentationComplete']);
            this.setResponsesStatus(msgData['responsesGiven']);

            break;

          // // // // // // //
          case 'vo.FromPlayer.NavigationRequestedNotification':
            this.snackBar.open('Player sendet NavigationRequestedNotification: "' +
                    msgData['navigationTarget'] + '"', '', {duration: 3000});
            break;

          // // // // // // // ;-)
          case 'vo.FromPlayer.PageNavigationRequestedNotification':
            this.gotoPage(msgData['newPage']);
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

    this.iFrameItemplayer = null;
    this.showPageNav = false;

    this.routingSubscription = this.route.params.subscribe(
      params => {
        const paramSplit = params['u'].split('##');
        this.ds.updatePageTitle(paramSplit[1]);
        this.dataLoading = true;
        this.setPageList([], '');
        this.setPresentationStatus('');
        this.setResponsesStatus('');

        this.bs.getUnitDesignData(this.mds.token$.getValue(), paramSplit[0], paramSplit[1]).subscribe((data: UnitPreviewData) => {
          // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
          while (this.iFrameHostElement.hasChildNodes()) {
            this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
          }

          this.iFrameItemplayer = <HTMLIFrameElement>document.createElement('iframe');
          this.iFrameItemplayer.setAttribute('srcdoc', data.player);
          this.iFrameItemplayer.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin');
          this.iFrameItemplayer.setAttribute('class', 'unitHost');
          this.iFrameItemplayer.setAttribute('height', String(this.iFrameHostElement.clientHeight));

          this.ds.pendingItemDefinition$.next(data.def);

          this.iFrameHostElement.appendChild(this.iFrameItemplayer);
          this.ds.updatePageTitle(data.key + '-' + data.label);
          this.dataLoading = false;
          this.player = data.player_id;
        });
    });
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
        if (currentPageIndex === this.pageList.length - 2) {
          this.pageList[this.pageList.length - 1].disabled = true;
        } else {
          this.pageList[this.pageList.length - 1].disabled = false;
        }
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
        type: 'OpenCBA.ToItemPlayer.PageNavigationRequest',
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

export interface PageData {
  index: number;
  id: string;
  type: '#next' | '#previous' | '#goto';
  disabled: boolean;
}

export interface StatusVisual {
  id: string;
  label: string;
  color: string;
  description: string;
}
