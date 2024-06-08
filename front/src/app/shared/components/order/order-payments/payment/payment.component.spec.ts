import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PaymentComponent } from './payment.component';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { PaymentMethodLabelPipe } from '../../../../pipes/payment-method-label.pipe';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const MATERIAL_MODULES = [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatMenuModule, MatIconModule, MatTooltipModule];

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BrowserAnimationsModule,
        PaymentComponent,
        AsyncPipe,
        CurrencyMaskModule,
        ConfirmationComponent,
        ...MATERIAL_MODULES],
    providers: [
        HttpClient,
        PaymentMethodLabelPipe,
        CurrencyPipe,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
