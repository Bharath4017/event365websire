import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitPreferenceComponent } from './submit-preference.component';

describe('SubmitPreferenceComponent', () => {
  let component: SubmitPreferenceComponent;
  let fixture: ComponentFixture<SubmitPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitPreferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
