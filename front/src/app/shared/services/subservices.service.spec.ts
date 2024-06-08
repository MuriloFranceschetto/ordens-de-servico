import { TestBed } from '@angular/core/testing';

import { SubservicesService } from './subservices.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SubservicesService', () => {
  let service: SubservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(SubservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
