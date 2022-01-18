import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwentyMinPopUpComponent } from './twenty-min-pop-up.component';

describe('TwentyMinPopUpComponent', () => {
  let component: TwentyMinPopUpComponent;
  let fixture: ComponentFixture<TwentyMinPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwentyMinPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwentyMinPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
