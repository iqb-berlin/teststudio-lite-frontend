import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemauthoringComponent } from './itemauthoring.component';
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('ItemauthoringComponent', () => {
  let component: ItemauthoringComponent;
  let fixture: ComponentFixture<ItemauthoringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemauthoringComponent ],
      imports: [HttpClientModule, MatDialogModule, MatSnackBarModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemauthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
