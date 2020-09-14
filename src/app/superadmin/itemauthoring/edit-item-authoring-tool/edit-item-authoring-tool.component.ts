import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-item-authoring-tool',
  templateUrl: './edit-item-authoring-tool.component.html',
  styleUrls: ['./edit-item-authoring-tool.component.css']
})
export class EditItemAuthoringToolComponent implements OnInit {
  editform: FormGroup;

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.editform = this.fb.group({
      id: this.fb.control(this.data.id, [Validators.required, Validators.minLength(3), Validators.pattern(/^\w+$/)]),
      name: this.fb.control(this.data.name, [Validators.required, Validators.minLength(3)])
    });
  }
}
