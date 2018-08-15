import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './newunit.component.html',
  styleUrls: ['./newunit.component.css']
})
export class NewunitComponent implements OnInit {
  newunitform: FormGroup;

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.newunitform = this.fb.group({
      key: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      label: this.fb.control('')
    });
  }
}
