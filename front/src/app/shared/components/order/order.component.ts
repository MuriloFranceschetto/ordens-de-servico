import dayjs from 'dayjs';
import { firstValueFrom, map, take } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { plainToClassFromExist } from 'class-transformer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, input, inject, computed, Optional, signal, WritableSignal, effect } from '@angular/core';

import { IUser, UserRole } from '../../models/User';
import { UsersService } from '../../services/users.service';
import { OrdersService } from '../../services/orders.service';
import { Order, PaymentStatus } from '../../models/order/Order';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { OrderPaymentsComponent } from './order-payments/order-payments.component';
import { OrderSubservicesComponent } from './order-subservices/order-subservices.component';

const ANGULAR_MATERIAL_MODULES = [
  MatInputModule, MatSelectModule, MatFormFieldModule, MatIconModule,
  ReactiveFormsModule, MatButtonModule, MatDialogModule,
  MatDatepickerModule, MatNativeDateModule,
];

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [NgClass, AsyncPipe, OrderSubservicesComponent, OrderPaymentsComponent, ...ANGULAR_MATERIAL_MODULES],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {

  public id = input<string>();

  private ordersService = inject(OrdersService);
  private usersService = inject(UsersService);
  private matDialog = inject(MatDialog);
  private matSnackBar = inject(MatSnackBar);
  @Optional() public dialogRef = inject(MatDialogRef<OrderComponent>);

  public FN_COMPARE_WITH_USERS = this.usersService.FN_COMPARE_WITH_USERS;

  public isNew$ = computed(() => this.id() === 'new');

  public clients$ = this.usersService.users$
    .pipe(
      take(1),
      map(users => users.filter(user => user.roles.includes(UserRole.Client)))
    );
  public order$: WritableSignal<Order> = signal(new Order());

  public formOrder: FormGroup<IFormOrder> = new FormGroup({
    title: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    client: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required, Validators.maxLength(8000)]),
    datetimeIn: new FormControl(null, [Validators.required]),
    datetimeOut: new FormControl(null, [Validators.required]),
    open: new FormControl(true, [Validators.required]),
    paymentStatus: new FormControl(PaymentStatus.NOT_PAID, [Validators.required]),
  });

  constructor() {
    effect(async () => {
      if (!this.isNew$()) {
        this.getOrder();
      }
    })
  }

  async getOrder() {

    this.order$.set(
      await firstValueFrom(this.ordersService.getOrderById(this.id()))
    );

    this.formOrder.setValue({
      title: this.order$().title,
      description: this.order$().description,
      datetimeIn: this.order$().datetimeIn,
      datetimeOut: this.order$().datetimeOut,
      open: this.order$().open,
      paymentStatus: this.order$().paymentStatus,
      client: this.order$().client,
    });
  }

  returnOrCloseDialog() {
    this.dialogRef ? this.dialogRef.close() : window.history.back();
  }

  async registerOrder() {
    this.order$.update(order => plainToClassFromExist(order, this.formOrder.getRawValue()));
    if (this.id()) {
      await this.ordersService.updateOrder(this.order$());
    } else {
      await this.ordersService.newOrder(this.order$());
    }
    this.matSnackBar.open(`Order de serviço ${this.id() ? 'editada' : 'registrada'} com sucesso`, 'X', { duration: 3000 });
  }

  setTodayToFormField(formControlName: 'datetimeIn' | 'datetimeOut') {
    this.formOrder.get(formControlName).setValue(dayjs().format('YYYY-MM-DDTHH:mm'));
  }

  async deleteOrder() {
    this.matDialog.open(ConfirmationComponent, { data: 'Tem certeza que deseja excluir esta order de serviço? Essa operação é irreversível!' })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.ordersService.deleteOrder(this.id())
            .pipe(take(1))
            .subscribe({
              next: () => {
                this.returnOrCloseDialog();
                this.matSnackBar.open('Order de serviço excluída com sucesso', 'X', { duration: 3000 });
              },
            })
        }
      })
  }

}

interface IFormOrder {
  title: FormControl<string>;
  description: FormControl<string>;
  datetimeIn: FormControl<string>;
  datetimeOut: FormControl<string>;
  open: FormControl<boolean>;
  paymentStatus: FormControl<number>;
  client: FormControl<IUser>;
}