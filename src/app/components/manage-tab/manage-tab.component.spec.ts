import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTabComponent } from './manage-tab.component';

describe('ManageTabComponent', () => {
  let component: ManageTabComponent;
  let fixture: ComponentFixture<ManageTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
