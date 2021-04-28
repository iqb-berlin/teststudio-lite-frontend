import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppConfig, BackendService as MainDataService } from '../../backend.service';
import { BackendService } from '../backend.service';
import { MainDatastoreService } from '../../maindatastore.service';

@Component({
  selector: 'app-app-config',
  templateUrl: 'app-config.component.html',
  styles: [
    '.example-chip-list {width: 100%;}',
    '.block-ident {margin-left: 40px}',
    '.warning-warning { color: darkgoldenrod }'
  ]
})

export class AppConfigComponent implements OnInit, OnDestroy {
  appConfig: AppConfig = null;
  configForm: FormGroup;
  dataChanged = false;
  private configDataChangedSubscription: Subscription = null;
  warningIsExpired = false;
  expiredHours = {
    '': '',
    '01': '01:00 Uhr',
    '02': '02:00 Uhr',
    '03': '03:00 Uhr',
    '04': '04:00 Uhr',
    '05': '05:00 Uhr',
    '06': '06:00 Uhr',
    '07': '07:00 Uhr',
    '08': '08:00 Uhr',
    '09': '09:00 Uhr',
    10: '10:00 Uhr',
    11: '11:00 Uhr',
    12: '12:00 Uhr',
    13: '13:00 Uhr',
    14: '14:00 Uhr',
    15: '15:00 Uhr',
    16: '16:00 Uhr',
    17: '17:00 Uhr',
    18: '18:00 Uhr',
    19: '19:00 Uhr',
    20: '20:00 Uhr',
    21: '21:00 Uhr',
    22: '22:00 Uhr',
    23: '23:00 Uhr'
  };

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private mbs: MainDataService,
    private bs: BackendService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.configForm = this.fb.group({
        appTitle: this.fb.control(''),
        introHtml: this.fb.control(''),
        impressumHtml: this.fb.control(''),
        globalWarningText: this.fb.control(''),
        globalWarningExpiredDay: this.fb.control(''),
        globalWarningExpiredHour: this.fb.control('')
      });
      this.updateFormFields();
    });
  }

  updateFormFields(): void {
    this.mbs.getConfig().subscribe(appConfig => {
      if (this.configDataChangedSubscription !== null) {
        this.configDataChangedSubscription.unsubscribe();
        this.configDataChangedSubscription = null;
      }
      this.appConfig = appConfig;
      this.warningIsExpired = MainDatastoreService.warningIsExpired(this.appConfig);
      this.configForm.setValue({
        appTitle: this.appConfig.app_title,
        introHtml: this.appConfig.intro_html,
        impressumHtml: this.appConfig.impressum_html,
        globalWarningText: this.appConfig.global_warning ? this.appConfig.global_warning : '',
        globalWarningExpiredDay:
          this.appConfig.global_warning_expired_day ? this.appConfig.global_warning_expired_day : '',
        globalWarningExpiredHour:
          this.appConfig.global_warning_expired_hour ? this.appConfig.global_warning_expired_hour : '0'
      }, { emitEvent: false });
      this.configDataChangedSubscription = this.configForm.valueChanges.subscribe(() => {
        this.appConfig.global_warning_expired_day = this.configForm.get('globalWarningExpiredDay').value;
        this.appConfig.global_warning_expired_hour = this.configForm.get('globalWarningExpiredHour').value;
        this.warningIsExpired = MainDatastoreService.warningIsExpired(this.appConfig);
        this.dataChanged = true;
      });
    },
    () => {
      this.appConfig = null;
      this.configForm.setValue({
        appTitle: '',
        introHtml: '',
        impressumHtml: '',
        globalWarningText: '',
        globalWarningExpiredDay: ''
      }, { emitEvent: false });
      this.snackBar.open('Konnte Konfigurationsdaten der Anwendung nicht laden', 'Fehler', { duration: 3000 });
    });
  }

  saveData(): void {
    this.snackBar.open('tbd', 'coming soon', { duration: 3000 });
    this.appConfig.app_title = this.configForm.get('appTitle').value;
    this.appConfig.intro_html = this.configForm.get('introHtml').value;
    this.appConfig.impressum_html = this.configForm.get('impressumHtml').value;
    this.appConfig.global_warning = this.configForm.get('globalWarningText').value;
    this.appConfig.global_warning_expired_day = this.configForm.get('globalWarningExpiredDay').value;
    this.appConfig.global_warning_expired_hour = this.configForm.get('globalWarningExpiredHour').value;
    this.bs.setAppConfig(this.appConfig).subscribe(isOk => {
      if (isOk) {
        this.snackBar.open(
          'Konfigurationsdaten der Anwendung gespeichert - bitte neu laden!', 'Info', { duration: 3000 }
        );
        this.dataChanged = false;
      } else {
        this.snackBar.open('Konnte Konfigurationsdaten der Anwendung nicht speichern', 'Fehler', { duration: 3000 });
      }
    },
    () => {
      this.snackBar.open('Konnte Konfigurationsdaten der Anwendung nicht speichern', 'Fehler', { duration: 3000 });
    });
  }

  ngOnDestroy(): void {
    if (this.configDataChangedSubscription !== null) this.configDataChangedSubscription.unsubscribe();
  }
}
