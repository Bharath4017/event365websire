import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedEventComponent } from './related-event.component';

describe('RelatedEventComponent', () => {
  let component: RelatedEventComponent;
  let fixture: ComponentFixture<RelatedEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
