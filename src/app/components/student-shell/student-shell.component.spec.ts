import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentShellComponent } from './student-shell.component';

describe('StudentShellComponent', () => {
  let component: StudentShellComponent;
  let fixture: ComponentFixture<StudentShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
