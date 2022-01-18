import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertNoSubVenueComponent } from './alert-no-sub-venue.component';

describe('AlertNoSubVenueComponent', () => {
  let component: AlertNoSubVenueComponent;
  let fixture: ComponentFixture<AlertNoSubVenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertNoSubVenueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertNoSubVenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
