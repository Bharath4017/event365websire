import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMessageAlertComponent } from './send-message-alert.component';

describe('SendMessageAlertComponent', () => {
  let component: SendMessageAlertComponent;
  let fixture: ComponentFixture<SendMessageAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendMessageAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMessageAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
