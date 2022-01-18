import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedInRsvpComponent } from './checked-in-rsvp.component';

describe('CheckedInRsvpComponent', () => {
  let component: CheckedInRsvpComponent;
  let fixture: ComponentFixture<CheckedInRsvpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckedInRsvpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckedInRsvpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
