import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { Component, WritableSignal, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-hour-quantity',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule],
  templateUrl: './hour-quantity.component.html',
  styleUrl: './hour-quantity.component.scss'
})
export class HourQuantityComponent {

  public readonly quantity = input<WritableSignal<number>>();
  public readonly hourFormControl = new FormControl<string>(null, Validators.required);

  constructor() {
    this.hourFormControl.valueChanges
      .pipe(
        takeUntilDestroyed(),
        debounceTime(200),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        if (!this.hourFormControl.valid) return;
        this.quantity().set(this.timeToPercentage(value));
      });
  }

  ngOnInit(): void {
    this.hourFormControl.setValue(this.percentageToTime(this.quantity()()));
  }

  private timeToPercentage(time: string): number {
    const [hours, minutes] = time.split(':').map(n => +n);
    const percentageMinutes = +(minutes / 60).toFixed(2);
    return hours + percentageMinutes;
  }

  private percentageToTime(percentage: number): string {
    const hours = Math.floor(percentage);
    let decimals = percentage - hours;
    let minutes = (((decimals / 100) * 60) * 100).toFixed();

    return this.fillWithZero(hours) + ':' + this.fillWithZero(minutes);
  }

  private fillWithZero(num: number | string) {
    return num.toString().padStart(2, '0');
  }

}
