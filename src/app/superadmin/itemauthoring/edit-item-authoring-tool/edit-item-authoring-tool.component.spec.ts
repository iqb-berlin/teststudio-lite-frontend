import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemAuthoringToolComponent } from './edit-item-authoring-tool.component';

describe('EditItemAuthoringToolComponent', () => {
  let component: EditItemAuthoringToolComponent;
  let fixture: ComponentFixture<EditItemAuthoringToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditItemAuthoringToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemAuthoringToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
