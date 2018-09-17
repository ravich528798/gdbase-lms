import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordBottomsheetComponent } from './reset-password-bottomsheet.component';

describe('ResetPasswordBottomsheetComponent', () => {
  let component: ResetPasswordBottomsheetComponent;
  let fixture: ComponentFixture<ResetPasswordBottomsheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordBottomsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordBottomsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
