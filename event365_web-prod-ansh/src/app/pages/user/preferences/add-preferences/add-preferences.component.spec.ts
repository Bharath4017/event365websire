import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPreferencesComponent } from './add-preferences.component';

describe('AddPreferencesComponent', () => {
  let component: AddPreferencesComponent;
  let fixture: ComponentFixture<AddPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPreferencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
