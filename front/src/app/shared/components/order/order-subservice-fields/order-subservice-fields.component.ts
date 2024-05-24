import { Observable, map } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, OnChanges, inject, input, model, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { SubserviceOrder } from '../../../models/order/SubserviceOrder';
import { SubservicesService } from '../../../services/subservices.service';
import { ChargeTypes, ISubservice } from '../../../models/subservice/ISubservice';
import { SubserviceChargeTypeLabelPipe } from '../../../pipes/subservice-charge-type-label.pipe';
import { CurrencyMaskModule } from 'ng2-currency-mask';

const MATERIAL_MODULES = [MatIconModule, MatButtonModule, MatInputModule, MatSelectModule];

@Component({
  selector: 'app-order-subservice-fields',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, FormsModule, CurrencyPipe, SubserviceChargeTypeLabelPipe, CurrencyMaskModule, ...MATERIAL_MODULES],
  providers: [
    CurrencyPipe,
  ],
  templateUrl: './order-subservice-fields.component.html',
  styleUrl: './order-subservice-fields.component.scss'
})
export class OrderSubserviceFieldsComponent implements OnChanges {

  private readonly subservicesService: SubservicesService = inject(SubservicesService);
  private readonly currencyPipe = inject(CurrencyPipe);

  public readonly FN_COMPARE_WITH_SUBSERVICES = this.subservicesService.FN_COMPARE_WITH_SUBSERVICES;

  // --------------------------------------------------------

  public subserviceOrder = model.required<SubserviceOrder>();
  public onSubserviceOrderChange(newSubservice: SubserviceOrder) {
    this.subserviceOrder.set(newSubservice);
  }

  public index = input.required<number>();
  public onClickRemove = output<void>();

  public form: FormGroup<FormSubserviceOrder> = new FormGroup({
    subservice: new FormControl<ISubservice>(null, [Validators.required]),
    quantity: new FormControl<number>(null, [Validators.required, Validators.min(0)]),
    price: new FormControl<number>(null, [Validators.required, Validators.min(0)]),
  });
  public subservices$ = this.subservicesService.subservices$;

  public sugestedPrice$: Observable<string> = this.form.valueChanges.pipe(
    map((value) => this.currencyPipe.transform(this.getSugestedPrice(value?.subservice, value?.quantity), 'R$')),
  );
  public showsQuantityInput$: Observable<boolean> = this.form.valueChanges.pipe(
    map((value) => [ChargeTypes.KG, ChargeTypes.KM, ChargeTypes.UNITY].includes(value?.subservice?.charged_per))
  );

  ngOnChanges(): void {
    this.form.controls.subservice.setValue(this.subserviceOrder()?.subservice);
    this.form.controls.quantity.setValue(this.subserviceOrder()?.quantity);
    this.form.controls.price.setValue(this.subserviceOrder()?.price);
  }

  // TODO - Multiplicação por horas e minutos
  public getSugestedPrice(subservice: ISubservice, quantity: number): number | null {
    if (!subservice?.price || !subservice?.charged_per || !quantity) {
      return null;
    }
    if (subservice.charged_per === ChargeTypes.REFER) {
      return subservice.price;
    }
    if ([ChargeTypes.KM, ChargeTypes.UNITY, ChargeTypes.KG].includes(subservice.charged_per)) {
      return subservice.price * quantity;
    }
    return 0;
  }

}

interface FormSubserviceOrder {
  subservice: FormControl<ISubservice>,
  quantity: FormControl<number>,
  price: FormControl<number>,
}