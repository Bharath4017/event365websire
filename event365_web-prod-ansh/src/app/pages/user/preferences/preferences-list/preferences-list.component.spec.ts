import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesListComponent } from './preferences-list.component';

describe('PreferencesListComponent', () => {
  let component: PreferencesListComponent;
  let fixture: ComponentFixture<PreferencesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferencesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
