import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MainDatastoreService } from './maindatastore.service';
import { BackendService } from './backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(
    public mds: MainDatastoreService,
    private bs: BackendService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.mds.dataLoading = true;
      this.bs.getConfig().subscribe(newConfig => {
        this.mds.appConfig = newConfig;
        this.mds.appConfig.trusted_intro_html = this.sanitizer.bypassSecurityTrustHtml(newConfig.intro_html);
        this.mds.appConfig.trusted_impressum_html = this.sanitizer.bypassSecurityTrustHtml(newConfig.impressum_html);
        this.mds.dataLoading = false;
      });
      this.bs.getStatus().subscribe(newStatus => {
        this.mds.loginStatus = newStatus;
      },
      () => {
        this.mds.loginStatus = null;
      });

      window.addEventListener('message', event => {
        this.mds.processMessagePost(event);
      }, false);
    });
  }
}
