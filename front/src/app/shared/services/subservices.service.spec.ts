import { TestBed } from '@angular/core/testing';

import { SubservicesService } from './subservices.service';

describe('SubservicesService', () => {
  let service: SubservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
