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
  public isLoggedIn = false;
  isError = false;
  errorMessage = '';

  constructor(private fb: FormBuilder,
    private mds: MainDatastoreService,
    private router: Router) { }

  ngOnInit() {
    this.mds.isLoggedIn$.subscribe(is => {
        this.isLoggedIn = is;
        if (this.isLoggedIn) {
          this.mds.pageTitle$.next('IQB-Itembanking - Bitte wählen!');
        } else {
          this.mds.pageTitle$.next('IQB-Itembanking - Bitte anmelden!');
        }
    });

    this.mds.notLoggedInMessage$.subscribe(
      m => this.errorMessage = m);
    this.loginform = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(1)]),
      pw: this.fb.control('', [Validators.required, Validators.minLength(1)])
    });
  }

  login() {
    this.isError = false;
    this.errorMessage = '';

    this.mds.login(this.loginform.get('name').value, this.loginform.get('pw').value);
  }
}
