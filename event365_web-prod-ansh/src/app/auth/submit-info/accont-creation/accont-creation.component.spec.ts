import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccontCreationComponent } from './accont-creation.component';

describe('AccontCreationComponent', () => {
  let component: AccontCreationComponent;
  let fixture: ComponentFixture<AccontCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccontCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccontCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
