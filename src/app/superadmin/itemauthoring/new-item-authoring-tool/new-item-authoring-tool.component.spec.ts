import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItemAuthoringToolComponent } from './new-item-authoring-tool.component';

describe('NewItemAuthoringToolComponent', () => {
  let component: NewItemAuthoringToolComponent;
  let fixture: ComponentFixture<NewItemAuthoringToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewItemAuthoringToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewItemAuthoringToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
