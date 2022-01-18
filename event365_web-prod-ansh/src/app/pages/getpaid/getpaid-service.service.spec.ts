import { TestBed } from '@angular/core/testing';

import { GetpaidServiceService } from './getpaid-service.service';

describe('GetpaidServiceService', () => {
  let service: GetpaidServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetpaidServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
