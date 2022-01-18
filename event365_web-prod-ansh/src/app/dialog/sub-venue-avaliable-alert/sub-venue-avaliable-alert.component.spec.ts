import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubVenueAvaliableAlertComponent } from './sub-venue-avaliable-alert.component';

describe('SubVenueAvaliableAlertComponent', () => {
  let component: SubVenueAvaliableAlertComponent;
  let fixture: ComponentFixture<SubVenueAvaliableAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubVenueAvaliableAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubVenueAvaliableAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
