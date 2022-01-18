import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlerteventComponent } from './alertevent.component';

describe('AlerteventComponent', () => {
  let component: AlerteventComponent;
  let fixture: ComponentFixture<AlerteventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlerteventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlerteventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
