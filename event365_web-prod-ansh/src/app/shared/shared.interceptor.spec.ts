import { TestBed } from '@angular/core/testing';

import { SharedInterceptor } from './shared.interceptor';

describe('SharedInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SharedInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: SharedInterceptor = TestBed.inject(SharedInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
