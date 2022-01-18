import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoureventComponent } from './yourevent.component';

describe('YoureventComponent', () => {
  let component: YoureventComponent;
  let fixture: ComponentFixture<YoureventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YoureventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YoureventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
