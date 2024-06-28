import { Pipe, PipeTransform } from '@angular/core';
import { PaymentStatus } from '../models/order/Order';
import { DefaultColors } from 'tailwindcss/types/generated/colors';
import colors from 'tailwindcss/colors';

@Pipe({
  name: 'paymentStatus',
  standalone: true
})
export class PaymentStatusPipe implements PipeTransform {

  private readonly paymentStatusConfig = {
    0: { label: 'Não pago', color: colors.red },
    1: { label: 'Parcialmente pago', color: colors.blue },
    2: { label: 'Pago', color: colors.green },
  };

  transform(value: PaymentStatus) {
    return this.paymentStatusConfig[value] || { label: '', color: colors.white };
  }

}
