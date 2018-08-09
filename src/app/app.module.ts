import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatTooltipModule,
  MatToolbarModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatTabsModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BackendService } from './backend.service';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';
import { IqbCommonModule } from './iqb-common';
import { HomeComponent } from './home/home.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SuperadminModule } from './superadmin/superadmin.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutDialogComponent,
    LoginDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    MatTabsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SuperadminModule,
    AppRoutingModule,
    FlexLayoutModule,
    IqbCommonModule
  ],
  entryComponents: [
    AboutDialogComponent,
    LoginDialogComponent
  ],
  providers: [
    BackendService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
