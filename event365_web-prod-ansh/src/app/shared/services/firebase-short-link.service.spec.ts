import { TestBed } from '@angular/core/testing';

import { FirebaseShortLinkService } from './firebase-short-link.service';

describe('FirebaseShortLinkService', () => {
  let service: FirebaseShortLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseShortLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
