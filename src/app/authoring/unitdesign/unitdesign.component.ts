import { Router, ActivatedRoute, Resolve } from '@angular/router';
import { DatastoreService, SaveDataComponent } from './../datastore.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainDatastoreService } from './../../maindatastore.service';
import { Subscriber, Subscription, Observable, BehaviorSubject, of } from 'rxjs';
import { BackendService, UnitDesignData, StrIdLabelSelectedData, ServerError } from './../backend.service';
import { Component, OnInit, Inject } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Location } from '@angular/common';

@Component({
  selector: 'app-unitdesign',
  templateUrl: './unitdesign.component.html',
  styleUrls: ['./unitdesign.component.css']
})

export class UnitDesignComponent implements OnInit, OnDestroy, SaveDataComponent {
  private routingSubscription: Subscription;
  private myUnitDesign$ = new BehaviorSubject<UnitDesignData>(null);
  private unitDesignDataToShow: UnitDesignData = null;
  private hasAuthoringToolDef = false;
  private authoringToolList: StrIdLabelSelectedData[] = [];
  private hasChanged$ = new BehaviorSubject<boolean>(false);


  private iFrameHostElement: HTMLElement;
  private iFrameItemplayer: HTMLIFrameElement;
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
    private route: ActivatedRoute
  ) {
    this.bs.getItemAuthoringToolList().subscribe((atL: StrIdLabelSelectedData[] | ServerError) => {
      if (atL !== null) {
        if ((atL as ServerError).code === undefined) {
          this.authoringToolList = atL as StrIdLabelSelectedData[];
        }
      }
    });

    this.postMessageSubscription = this.mds.postMessage$.subscribe((m: MessageEvent) => {
        const msgData = m.data;
        const msgType = msgData['type'];

        if ((msgType !== undefined) || (msgType !== null)) {
          const targetWindow = m.source;
          switch (msgType) {

            // // // // // // //
            case 'OpenCBA.UnitAuthoring.Ready':
              const myData = this.pendingUnitDefinition$.getValue();
              if (myData !== null) {
                targetWindow.postMessage({
                  type: 'OpenCBA.UnitAuthoring.LoadUnitData',
                  data: myData
                }, '*');
                this.pendingUnitDefinition$.next(null);
              }
              break;

          // // // // // // //
          default:
            console.log('processMessagePost unknown message type: ' + msgType);
            break;
        }
      }
    });

  }

  ngOnInit() {
    this.myUnitDesign$.subscribe((ud: UnitDesignData) => {
      this.unitDesignDataToShow = ud;

      if (ud === null) {
        this.hasAuthoringToolDef = false;
      } else {
        this.hasAuthoringToolDef = (ud.authoringtoolLink !== null) && (ud.authoringtoolLink.length > 0);
      }

      if (this.hasAuthoringToolDef) {
        this.iFrameHostElement = <HTMLElement>document.querySelector('#iFrameHost');
        this.iFrameItemplayer = null;

        while (this.iFrameHostElement.hasChildNodes()) {
          this.iFrameHostElement.removeChild(this.iFrameHostElement.lastChild);
        }

        this.iFrameItemplayer = <HTMLIFrameElement>document.createElement('iframe');
        this.iFrameItemplayer.setAttribute('src', this.serverUrl + ud.authoringtoolLink);
        this.iFrameItemplayer.setAttribute('sandbox', 'allow-forms allow-scripts allow-same-origin');
        this.iFrameItemplayer.setAttribute('class', 'unitHost');
        this.iFrameItemplayer.setAttribute('height', String(this.iFrameHostElement.clientHeight));

        this.pendingUnitDefinition$.next(ud.def);

        this.iFrameHostElement.appendChild(this.iFrameItemplayer);
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
            console.log('pass');
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
      this.bs.setUnitAuthoringTool(
        this.mds.token$.getValue(),
        this.ds.workspaceId$.getValue(),
        myLocalUnitdata.id,
        tool_id
      ).subscribe(result => {
        const myLocalUnitdataaa = this.myUnitDesign$.getValue();
        if (myLocalUnitdataaa !== null) {
          this.router.navigate([this.ds.unitViewMode$.getValue() + '/' + myLocalUnitdataaa.id],
              {relativeTo: this.route.parent});
        }
      });
    }
  }

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // for interface 'SaveDataComponent'
  saveOrDiscard(): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  saveData(): Observable<boolean> {
    return of(true);
  }

}
