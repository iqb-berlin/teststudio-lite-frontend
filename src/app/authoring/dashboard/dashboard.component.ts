import { MainDatastoreService } from './../../maindatastore.service';
import { WorkspaceData, BackendService } from './../backend.service';
import { DatastoreService } from './../datastore.service';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'authoring-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AuthoringDashboardComponent {
  private workspaceList: WorkspaceData[] = [];

  constructor(
    private mds: MainDatastoreService,
    private ds: DatastoreService,
    private bs: BackendService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ds.workspaceList$.subscribe(wsList => this.workspaceList = wsList);
  }

  navigateToAuthoring(selectedWorkspace: number) {
    if (this.router.navigate(['/a'])) {
      this.ds.workspaceId$.next(selectedWorkspace);
    }
  }
}
