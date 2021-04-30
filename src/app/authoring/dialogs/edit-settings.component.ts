import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatastoreService } from '../datastore.service';

@Component({
  selector: 'app-edit-settings',
  templateUrl: './edit-settings.component.html',
  styleUrls: ['./edit-settings.component.css']
})
export class EditSettingsComponent implements OnInit {
  settingsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public ds: DatastoreService
  ) { }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      editorSelector: this.fb.control(this.ds.defaultEditor),
      playerSelector: this.fb.control(this.ds.defaultPlayer)
    });
  }
}
