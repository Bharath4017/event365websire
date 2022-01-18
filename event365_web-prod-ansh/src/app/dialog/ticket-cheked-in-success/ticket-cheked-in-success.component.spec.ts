import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketChekedInSuccessComponent } from './ticket-cheked-in-success.component';

describe('TicketChekedInSuccessComponent', () => {
  let component: TicketChekedInSuccessComponent;
  let fixture: ComponentFixture<TicketChekedInSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketChekedInSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketChekedInSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
