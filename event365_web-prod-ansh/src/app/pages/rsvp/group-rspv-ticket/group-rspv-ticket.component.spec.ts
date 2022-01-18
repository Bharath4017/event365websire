import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRspvTicketComponent } from './group-rspv-ticket.component';

describe('GroupRspvTicketComponent', () => {
  let component: GroupRspvTicketComponent;
  let fixture: ComponentFixture<GroupRspvTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupRspvTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupRspvTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
