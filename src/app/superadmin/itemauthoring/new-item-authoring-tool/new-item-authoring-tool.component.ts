import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './new-item-authoring-tool.component.html',
  styleUrls: ['./new-item-authoring-tool.component.css']
})
export class NewItemAuthoringToolComponent implements OnInit {
  newform: FormGroup;

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.newform = this.fb.group({
      id: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.pattern(/^\w+$/)]),
      name: this.fb.control('', [Validators.required, Validators.minLength(3)])
    });
  }
}
