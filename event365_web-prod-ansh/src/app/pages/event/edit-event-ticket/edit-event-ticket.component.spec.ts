import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventTicketComponent } from './edit-event-ticket.component';

describe('EditEventTicketComponent', () => {
  let component: EditEventTicketComponent;
  let fixture: ComponentFixture<EditEventTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
