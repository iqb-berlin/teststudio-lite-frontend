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

  constructor(
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    private bs: BackendService,
    private route: ActivatedRoute,
  ) {
    this.postMessageSubscription = this.mds.postMessage$.subscribe((m: MessageEvent) => {
      const msgData = m.data;
      const msgType = msgData['type'];

      if ((msgType !== undefined) && (msgType !== null)) {
        switch (msgType) {

          // // // // // // //
          case 'OpenCBA.stateChanged':
            if (msgData['newState'] === 'readyToInitialize') {
              let hasData = false;
              const initParams = {};

              const pendingSpec = this.ds.pendingItemDefinition$.getValue();
              if ((pendingSpec !== null) || (pendingSpec.length > 0)) {
                initParams['itemSpecification'] = pendingSpec;
                hasData = true;
                this.ds.pendingItemDefinition$.next(null);
              }

              if (hasData) {
                const targetWindow = m.source;
                targetWindow.postMessage({
                  type: 'OpenCBA.initItemPlayer',
                  initParameters: initParams
                }, '*');
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

    this.iFrameItemplayer = null;

    this.routingSubscription = this.route.params.subscribe(
      params => {
        const paramSplit = params['u'].split('##');
        this.ds.updatePageTitle(paramSplit[1]);
        this.bs.getUnitDesignData(this.mds.token$.getValue(), paramSplit[0], paramSplit[1]).subscribe((data: UnitPreviewData) => {
          // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
          while (this.iFrameHostElement.hasChildNodes()) {
            this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
          }

          // this.tss.updatePageTitle(newUnit.title);
          // this.tss.updateUnitId(newUnit.sequenceId);

          this.iFrameItemplayer = <HTMLIFrameElement>document.createElement('iframe');
          this.iFrameItemplayer.setAttribute('srcdoc', data.player);
          this.iFrameItemplayer.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin');
          this.iFrameItemplayer.setAttribute('class', 'unitHost');
          this.iFrameItemplayer.setAttribute('height', String(this.iFrameHostElement.clientHeight));

          this.ds.pendingItemDefinition$.next(data.def);

          this.iFrameHostElement.appendChild(this.iFrameItemplayer);
          this.ds.updatePageTitle(data.key + '-' + data.label);
        });
    });
  }

  ngOnDestroy() {
    this.routingSubscription.unsubscribe();
    this.postMessageSubscription.unsubscribe();
  }
}
