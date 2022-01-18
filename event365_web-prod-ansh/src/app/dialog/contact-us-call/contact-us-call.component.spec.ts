import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsCallComponent } from './contact-us-call.component';

describe('ContactUsCallComponent', () => {
  let component: ContactUsCallComponent;
  let fixture: ComponentFixture<ContactUsCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUsCallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUsCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
