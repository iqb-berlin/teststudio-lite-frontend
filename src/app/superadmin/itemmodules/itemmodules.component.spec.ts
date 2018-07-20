import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemmodulesComponent } from './itemmodules.component';

describe('ItemmodulesComponent', () => {
  let component: ItemmodulesComponent;
  let fixture: ComponentFixture<ItemmodulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemmodulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemmodulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
