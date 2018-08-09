import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemauthoringComponent } from './itemauthoring.component';

describe('ItemauthoringComponent', () => {
  let component: ItemauthoringComponent;
  let fixture: ComponentFixture<ItemauthoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemauthoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemauthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
