import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVenueAlertComponent } from './delete-venue-alert.component';

describe('DeleteVenueAlertComponent', () => {
  let component: DeleteVenueAlertComponent;
  let fixture: ComponentFixture<DeleteVenueAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteVenueAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteVenueAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
