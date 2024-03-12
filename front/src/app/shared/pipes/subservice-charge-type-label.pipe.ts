import { Pipe, PipeTransform } from '@angular/core';
import { CHARGE_TYPES_OPTIONS, ChargeTypes } from '../models/Subservice';

@Pipe({
  name: 'subserviceChargeTypeLabel',
  standalone: true
})
export class SubserviceChargeTypeLabelPipe implements PipeTransform {

  transform(chargeType: ChargeTypes): string {
    return CHARGE_TYPES_OPTIONS.find(({ value }) => value === chargeType)?.label || 'Não informado';
  }

}
