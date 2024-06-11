import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSubserviceFormComponent } from './order-subservice-form.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('OrderSubserviceFormComponent', () => {
  let component: OrderSubserviceFormComponent;
  let fixture: ComponentFixture<OrderSubserviceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSubserviceFormComponent, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrderSubserviceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
