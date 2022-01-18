import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerReviewComponent } from './add-customer-review.component';

describe('AddCustomerReviewComponent', () => {
  let component: AddCustomerReviewComponent;
  let fixture: ComponentFixture<AddCustomerReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomerReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
