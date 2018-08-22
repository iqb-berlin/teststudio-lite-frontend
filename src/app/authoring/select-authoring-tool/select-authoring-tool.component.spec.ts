import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAuthoringToolComponent } from './select-authoring-tool.component';

describe('SelectAuthoringToolComponent', () => {
  let component: SelectAuthoringToolComponent;
  let fixture: ComponentFixture<SelectAuthoringToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAuthoringToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAuthoringToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
