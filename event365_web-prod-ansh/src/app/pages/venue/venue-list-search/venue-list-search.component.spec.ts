import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueListSearchComponent } from './venue-list-search.component';

describe('VenueListSearchComponent', () => {
  let component: VenueListSearchComponent;
  let fixture: ComponentFixture<VenueListSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenueListSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueListSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
