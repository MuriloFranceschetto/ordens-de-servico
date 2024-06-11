import { Component, OnInit, WritableSignal, input, model } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-kilometer-quantity',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './kilometer-quantity.component.html',
  styleUrl: './kilometer-quantity.component.scss'
})
export class KilometerQuantityComponent implements OnInit {

  public initialMileage = new FormControl<number>(null, Validators.min(0));
  public finalMileage = new FormControl<number>(null, Validators.min(0));
  public quantityFormControl = new FormControl<number>(null, Validators.min(0));

  public readonly quantity = input<WritableSignal<number>>();

  constructor() {
    this.quantityFormControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.quantity().set(value);
      });
  }

  ngOnInit(): void {
    this.quantityFormControl.setValue(this.quantity()());
  }

  public calculateKilometers() {
    this.quantityFormControl.setValue(this.finalMileage.getRawValue() - this.initialMileage.getRawValue());
  }

}
