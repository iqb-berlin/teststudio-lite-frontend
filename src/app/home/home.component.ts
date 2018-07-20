import { DatastoreService } from './../datastore.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  testtakerloginform: FormGroup;
  public isLoggedIn = false;
  isError = false;
  errorMessage = '';

  constructor(private fb: FormBuilder,
    private ds: DatastoreService,
    private router: Router) { }

  ngOnInit() {
    this.ds.pageTitle$.next('IQB-Testcenter - Willkommen!');
    this.ds.isLoggedIn$.subscribe(
      is => this.isLoggedIn = is);

    this.testtakerloginform = this.fb.group({
      testname: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      testpw: this.fb.control('', [Validators.required, Validators.minLength(3)])
    });
  }

  login() {
    this.isError = false;
    this.errorMessage = '';

    this.ds.login(this.testtakerloginform.get('testname').value, this.testtakerloginform.get('testpw').value);
  }
}
