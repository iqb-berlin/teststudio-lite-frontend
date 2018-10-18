import { DatastoreService } from './../authoring/datastore.service';
import { WorkspaceData } from './../authoring';
import { MainDatastoreService } from '../maindatastore.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginform: FormGroup;
  isLoggedIn = false;
  isError = false;
  errorMessage = '';
  isSuperadmin = false;
  loginName = '';
  workspaceList: WorkspaceData[] = [];

  constructor(private fb: FormBuilder,
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    private router: Router) { }

  ngOnInit() {
    this.mds.pageTitle$.next('');

    this.mds.notLoggedInMessage$.subscribe(
      m => this.errorMessage = m);
    this.loginform = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(1)]),
      pw: this.fb.control('', [Validators.required, Validators.minLength(1)])
    });

    this.ds.workspaceList$.subscribe(list => {
      if (list.length > 0) {
        list.sort((ws1, ws2) => {
          if (ws1.name.toLowerCase() > ws2.name.toLowerCase()) {
            return 1;
          } else if (ws1.name.toLowerCase() < ws2.name.toLowerCase()) {
            return -1;
          } else {
            return 0;
          }
        });
      }
      this.workspaceList = list;
    });
    this.mds.isSuperadmin$.subscribe(is => this.isSuperadmin = is);
    this.mds.loginName$.subscribe(n => this.loginName = n);
    this.mds.isLoggedIn$.subscribe(is => this.isLoggedIn = is);
  }

  login() {
    this.isError = false;
    this.errorMessage = '';

    if (this.loginform.valid) {
      this.mds.login(this.loginform.get('name').value, this.loginform.get('pw').value);
    }
  }

  changeLogin() {
    this.mds.logout();
  }

  buttonGotoWorkspace(selectedWorkspace: WorkspaceData) {
    if (this.router.navigate(['/a'])) {
      this.ds.workspaceId$.next(selectedWorkspace.id);
    }
  }

}
