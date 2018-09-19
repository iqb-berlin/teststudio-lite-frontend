import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute } from '@angular/router';
import { BackendService, UnitPreviewData } from './backend.service';
import { DatastoreService } from './datastore.service';
import { MainDatastoreService } from './../maindatastore.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

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

  private dataLoading = false;

  constructor(
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    private bs: BackendService,
    private route: ActivatedRoute,
  ) {
    this.mds.itemplayerPageRequest$.subscribe((newPage: string) => {
      if (newPage.length > 0) {
        this.postMessageTarget.postMessage({
          type: 'OpenCBA.ToItemPlayer.PageNavigationRequest',
          sessionId: this.itemplayerSessionId,
          newPage: newPage
        }, '*');
      }
    });
    this.postMessageSubscription = this.mds.postMessage$.subscribe((m: MessageEvent) => {
      const msgData = m.data;
      const msgType = msgData['type'];
      console.log(msgData);

      if ((msgType !== undefined) && (msgType !== null)) {
        switch (msgType) {

          // // // // // // //
          case 'OpenCBA.FromItemPlayer.ReadyNotification':
            let hasData = false;
            const initParams = {};

            const pendingSpec = this.ds.pendingItemDefinition$.getValue();
            if ((pendingSpec !== null) && (pendingSpec.length > 0)) {
              hasData = true;
              this.ds.pendingItemDefinition$.next(null);
            }

            if (hasData) {
              this.itemplayerSessionId = Math.floor(Math.random() * 20000000 + 10000000).toString();
              this.postMessageTarget = m.source;
              this.postMessageTarget.postMessage({
                type: 'OpenCBA.ToItemPlayer.DataTransfer',
                sessionId: this.itemplayerSessionId,
                unitDefinition: pendingSpec
              }, '*');
            }
            break;

          // // // // // // //
          case 'OpenCBA.FromItemPlayer.StartedNotification':
            const validPages = msgData['validPages'];
            if ((validPages instanceof Array) && (validPages.length > 1)) {
              this.mds.itemplayerValidPages$.next(validPages);
              let currentPage = msgData['currentPage'];
              if (currentPage  === undefined) {
                currentPage = validPages[0];
              }
              this.mds.itemplayerCurrentPage$.next(currentPage);
            } else {
              this.mds.itemplayerValidPages$.next([]);
              this.mds.itemplayerCurrentPage$.next('');
            }
            break;

          // // // // // // //
          case 'OpenCBA.FromItemPlayer.ChangedDataTransfer':
            const validPagesChanged = msgData['validPages'];
            let currentPageChanged = msgData['currentPage'];
            if ((validPagesChanged instanceof Array)) {
              this.mds.itemplayerValidPages$.next(validPagesChanged);
              if (currentPageChanged  === undefined) {
                currentPageChanged = validPagesChanged[0];
              }
            }
            if (currentPageChanged  !== undefined) {
              this.mds.itemplayerCurrentPage$.next(currentPageChanged);
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

    this.iFrameItemplayer = null;

    this.routingSubscription = this.route.params.subscribe(
      params => {
        const paramSplit = params['u'].split('##');
        this.ds.updatePageTitle(paramSplit[1]);
        this.dataLoading = true;

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
        });
    });
  }

  ngOnDestroy() {
    this.routingSubscription.unsubscribe();
    this.postMessageSubscription.unsubscribe();
  }
}
