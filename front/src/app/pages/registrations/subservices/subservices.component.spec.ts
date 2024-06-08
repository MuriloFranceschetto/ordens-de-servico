import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubservicesComponent } from './subservices.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SubservicesComponent', () => {
  let component: SubservicesComponent;
  let fixture: ComponentFixture<SubservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SubservicesComponent],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
      .compileComponents();

    fixture = TestBed.createComponent(SubservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
