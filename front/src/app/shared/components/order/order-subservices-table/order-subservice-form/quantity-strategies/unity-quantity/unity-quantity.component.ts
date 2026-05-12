import { Component, input, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig, CurrencyMaskModule } from 'ng2-currency-mask';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  decimal: ",",
  precision: 0,
  prefix: "",
  suffix: "",
  thousands: "."
};

@Component({
    selector: 'app-unity-quantity',
    imports: [MatInputModule, ReactiveFormsModule, CurrencyMaskModule, MatIconModule, MatButtonModule],
    templateUrl: './unity-quantity.component.html',
    styleUrl: './unity-quantity.component.scss',
    providers: [
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    ]
})
export class UnityQuantityComponent {

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
