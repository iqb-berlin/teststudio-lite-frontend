import { Component } from '@angular/core';

@Component({
  template: `
    <div fxLayout="column" fxLayoutAlign="start stretch" class="admin-tab-content">
      <div fxLayout="row" class="div-row">
        <div fxFlex="48">
          <mat-label>Gruppen der Arbeitsbereiche</mat-label>
        </div>
        <div fxFlex="48">
          <app-workspace-groups></app-workspace-groups>
        </div>
      </div>
      <!--<div class="div-row"><p>asoc aspoc asop</p></div>-->
    </div>
  `,
  styles: ['.div-row {border-color: gray; border-width: 0 0 1px 0; border-style: solid; margin-top: 10px}']
})
export class SettingsComponent {}
