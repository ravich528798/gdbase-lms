import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StundentCoursesComponent } from './stundent-courses.component';

describe('StundentCoursesComponent', () => {
  let component: StundentCoursesComponent;
  let fixture: ComponentFixture<StundentCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StundentCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StundentCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
