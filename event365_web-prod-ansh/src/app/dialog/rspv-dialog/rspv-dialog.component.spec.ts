import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RspvDialogComponent } from './rspv-dialog.component';

describe('RspvDialogComponent', () => {
  let component: RspvDialogComponent;
  let fixture: ComponentFixture<RspvDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RspvDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RspvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
