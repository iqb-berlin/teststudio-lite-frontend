import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemplayerComponent } from './itemplayer.component';

describe('ItemplayerComponent', () => {
  let component: ItemplayerComponent;
  let fixture: ComponentFixture<ItemplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemplayerComponent ]
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
