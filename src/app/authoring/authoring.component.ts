import { Router, ActivatedRoute } from '@angular/router';
import { NewunitComponent } from './newunit/newunit.component';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar, MatChipList, MatChipListChange, MatChipSelectionChange } from '@angular/material';
import { MainDatastoreService } from './../maindatastore.service';
import { BehaviorSubject } from 'rxjs';
import { UnitShortData, BackendService, WorkspaceData } from './backend.service';
import { DatastoreService, UnitViewMode } from './datastore.service';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './authoring.component.html',
  styleUrls: ['./authoring.component.css']
})
export class AuthoringComponent implements OnInit {
  private dataLoading = false;
  private unitId$ = new BehaviorSubject<number>(0);
  private unitList$ = new BehaviorSubject<UnitShortData[]>([]);
  private workspaceList: WorkspaceData[] = [];
  private workspaceId = 0;

  private wsSelector = new FormControl();
  private unitSelector = new FormControl();
  private selectedUnitViewMode = '';
  private unitViewModes: UnitViewMode[] = [];

  constructor(
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    private bs: BackendService,
    private newunitDialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ds.workspaceList$.subscribe(wsList => this.workspaceList = wsList);
    this.ds.workspaceId$.subscribe(wsint => {
      this.workspaceId = wsint;
      this.updateUnitList();
      this.wsSelector.setValue(wsint, {emitEvent: false});
    });
    this.unitViewModes = this.ds.unitViewModes;
    this.ds.unitViewMode$.subscribe(uvm => {
      this.selectedUnitViewMode = uvm;
    });
  }

  ngOnInit() {
    this.wsSelector.valueChanges
      .subscribe(wsId => {
        this.ds.workspaceId$.next(wsId);
    });

    this.unitId$.subscribe((uId: number) => {
      this.unitSelector.setValue(uId, {emitEvent: false});
      this.router.navigate(['up/' + uId], {relativeTo: this.route});
    });

    this.unitSelector.valueChanges
      .subscribe(uId => {
        this.unitId$.next(uId);
    });


  }

  selectUnitViewMode(uvm: string) {
    this.ds.unitViewMode$.next(uvm);
    this.router.navigate([uvm + '/' + this.unitId$.getValue()], {relativeTo: this.route});
  }

  updateUnitList() {
    const myToken = this.mds.token$.getValue();
    const myWorkspace = this.ds.workspaceId$.getValue();
    if ((myToken === '') || (myWorkspace === 0)) {
      this.unitList$.next([]);
      this.unitId$.next(0);
    } else {
      this.dataLoading = true;
      this.bs.getUnitList(myToken, myWorkspace).subscribe(
        (uresponse: UnitShortData[]) => {
          this.dataLoading = false;
          this.unitList$.next(uresponse);
          const uIdStr = localStorage.getItem('u');
          if (uIdStr == null) {
            this.unitId$.next(0);
          } else {
            const uId = +uIdStr;
            if (uId > 0) {
              let uFound = false;
              for (let i = 0; i < uresponse.length; i++) {
                if (uresponse[i].id === uId) {
                  this.unitId$.next(uId);
                  uFound = true;
                  break;
                }
              }

              if (!uFound) {
                this.unitId$.next(0);
              }
            } else {
              this.unitId$.next(0);
            }
          }
      });
    }
  }

  // HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
  addUnit() {
    const dialogRef = this.newunitDialog.open(NewunitComponent, {
      width: '600px',
      data: {
        key: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        if (result !== false) {
          this.dataLoading = true;
          this.bs.addUnit(
              this.mds.token$.getValue(),
              this.workspaceId,
              (<FormGroup>result).get('key').value,
              (<FormGroup>result).get('label').value).subscribe(
                respOk => {
                  if (respOk) {
                    this.snackBar.open('Aufgabe hinzugefügt', '', {duration: 1000});
                    this.updateUnitList();
                  } else {
                    this.snackBar.open('Konnte Aufgabe nicht hinzufügen', 'Fehler', {duration: 1000});
                  }
                  this.dataLoading = false;
                });
        }
      }
    });
  }
}
