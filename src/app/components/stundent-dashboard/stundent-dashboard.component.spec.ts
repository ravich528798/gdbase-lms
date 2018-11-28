import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StundentDashboardComponent } from './stundent-dashboard.component';

describe('StundentDashboardComponent', () => {
  let component: StundentDashboardComponent;
  let fixture: ComponentFixture<StundentDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StundentDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StundentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
