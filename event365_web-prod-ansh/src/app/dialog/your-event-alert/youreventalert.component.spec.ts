import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoureventalertComponent } from './youreventalert.component';

describe('YoureventalertComponent', () => {
  let component: YoureventalertComponent;
  let fixture: ComponentFixture<YoureventalertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YoureventalertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YoureventalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
