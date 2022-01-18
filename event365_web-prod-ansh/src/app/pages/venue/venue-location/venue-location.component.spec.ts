import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueLocationComponent } from './venue-location.component';

describe('VenueLocationComponent', () => {
  let component: VenueLocationComponent;
  let fixture: ComponentFixture<VenueLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenueLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
