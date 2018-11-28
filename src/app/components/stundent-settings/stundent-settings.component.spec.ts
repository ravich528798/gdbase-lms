import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StundentSettingsComponent } from './stundent-settings.component';

describe('StundentSettingsComponent', () => {
  let component: StundentSettingsComponent;
  let fixture: ComponentFixture<StundentSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StundentSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StundentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
