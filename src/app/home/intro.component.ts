import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-intro',
  template: `
    <p>Diese Web-Anwendung dient der Aufgabenentwicklung zum Einsatz in computerbasierten
      Leistungstests oder Befragungen. Der Zugang ist nur möglich, wenn Sie Zugangsdaten erhalten haben. Es sind
      keine weiteren Seiten öffentlich zugänglich.</p>
    <p>Die Programmierungen erfolgten durch das <a href="https://www.iqb.hu-berlin.de" target="_blank">Institut
      zur Qualitätsentwicklung im Bildungswesen</a>.</p>
    <ul>
      <li>Kennung der Anwendung: {{appName}}</li>
      <li>Version: {{appVersion}}</li>
    </ul>
  `
})
export class IntroComponent {
  constructor(
    @Inject('APP_VERSION') readonly appVersion: string,
    @Inject('APP_NAME') readonly appName: string
  ) { }
}
