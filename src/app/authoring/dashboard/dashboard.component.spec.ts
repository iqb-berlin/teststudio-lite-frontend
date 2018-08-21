import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthoringDashboardComponent } from './dashboard.component';

describe('AuthoringDashboardComponent', () => {
  let component: AuthoringDashboardComponent;
  let fixture: ComponentFixture<AuthoringDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthoringDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthoringDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
