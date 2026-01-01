import { Component, input, OnInit, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig, CurrencyMaskModule } from 'ng2-currency-mask';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  decimal: ",",
  precision: 3,
  prefix: "",
  suffix: " Kg",
  thousands: "."
};

@Component({
    selector: 'app-kilogram-quantity',
    imports: [MatInputModule, ReactiveFormsModule, MatIconModule, CurrencyMaskModule],
    templateUrl: './kilogram-quantity.component.html',
    styleUrl: './kilogram-quantity.component.scss',
    providers: [
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    ]
})
export class KilogramQuantityComponent implements OnInit {
  public readonly quantity = input<WritableSignal<number>>();
  public readonly quantityFormControl = new FormControl(null, Validators.required);

  constructor() {
    this.quantityFormControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => this.quantity().set(value));
  }

  ngOnInit(): void {
    this.quantityFormControl.setValue(this.quantity()());
  }

}
