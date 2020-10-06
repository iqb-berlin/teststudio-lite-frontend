import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemplayerComponent } from './itemplayer.component';
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('ItemplayerComponent', () => {
  let component: ItemplayerComponent;
  let fixture: ComponentFixture<ItemplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemplayerComponent ],
      imports: [HttpClientModule, MatDialogModule, MatSnackBarModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
