import { TestBed } from '@angular/core/testing';

import { SubservicesService } from './subservices.service';
import { HttpClientModule } from '@angular/common/http';

describe('SubservicesService', () => {
  let service: SubservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(SubservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
