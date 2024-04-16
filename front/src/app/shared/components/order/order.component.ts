import { Component, input, inject, OnChanges, computed, Optional } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnChanges {

  private _id = input();
  private ordersService = inject(OrdersService);
  @Optional() private dialogRef = inject(MatDialogRef<OrderComponent>);

  public isNew = computed(() => this._id() === 'new');

  public formOrder: FormGroup<IFormOrder> = new FormGroup({
    title: new FormControl(null, [Validators.required]),
  });

  ngOnChanges(): void {
  }

  returnOrCloseDialog() {
    this.dialogRef ? this.dialogRef.close() : window.history.back();
  }

  deleteOrder() {

  }

  registerOrder() {

  }

}

interface IFormOrder {
  title: FormControl<string>;
}