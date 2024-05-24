import { Pipe, PipeTransform } from '@angular/core';
import { PAYMENT_METHOD_OPTIONS, PaymentType } from '../models/order/PaymentOrder';

@Pipe({
  name: 'paymentMethodLabel',
  standalone: true
})
export class PaymentMethodLabelPipe implements PipeTransform {

  transform(paymentType: PaymentType): string {
    return PAYMENT_METHOD_OPTIONS.find(({ value }) => value === paymentType)?.label || 'Não informado';
  }

}
