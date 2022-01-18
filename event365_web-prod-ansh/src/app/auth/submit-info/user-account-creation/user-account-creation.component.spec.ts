import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountCreationComponent } from './user-account-creation.component';

describe('UserAccountCreationComponent', () => {
  let component: UserAccountCreationComponent;
  let fixture: ComponentFixture<UserAccountCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
