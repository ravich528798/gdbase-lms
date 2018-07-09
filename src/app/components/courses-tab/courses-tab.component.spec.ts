import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesTabComponent } from './courses-tab.component';

describe('CoursesTabComponent', () => {
  let component: CoursesTabComponent;
  let fixture: ComponentFixture<CoursesTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
