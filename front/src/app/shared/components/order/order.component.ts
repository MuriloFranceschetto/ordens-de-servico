import dayjs from 'dayjs';
import { filter, firstValueFrom, map, switchMap, take } from 'rxjs';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { Router } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, input, inject, computed, Optional, signal, WritableSignal, OnInit } from '@angular/core';

import { IUser, UserRole } from '../../models/User';
import { UsersService } from '../../services/users.service';
import { OrdersService } from '../../services/orders.service';
import { Order, PaymentStatus } from '../../models/order/Order';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { OrderPaymentsComponent } from './order-payments/order-payments.component';
import { OrderSubservicesComponent } from './order-subservices-table/order-subservices-table.component';
import { MyChipComponent } from '../my-chip/my-chip.component';
import { PaymentStatusPipe } from "../../pipes/payment-status.pipe";

const ANGULAR_MATERIAL_MODULES = [
  MatInputModule, MatSelectModule, MatFormFieldModule, MatIconModule,
  ReactiveFormsModule, MatButtonModule, MatDialogModule,
  MatDatepickerModule, MatNativeDateModule, MatMenuModule,
];

@Component({
  selector: 'app-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  imports: [NgClass, AsyncPipe, OrderSubservicesComponent, OrderPaymentsComponent, MyChipComponent, ...ANGULAR_MATERIAL_MODULES, PaymentStatusPipe]
})
export class OrderComponent implements OnInit {

  public id = input<string>();

  private ordersService = inject(OrdersService);
  private usersService = inject(UsersService);
  private matDialog = inject(MatDialog);
  private matSnackBar = inject(MatSnackBar);
  private router = inject(Router);

  @Optional() public dialogRef = inject(MatDialogRef<OrderComponent>, {
    optional: true,
  });

  public FN_COMPARE_WITH_USERS = this.usersService.FN_COMPARE_WITH_USERS;

  public clients$ = this.usersService.users$
    .pipe(
      take(1),
      map(users => users.filter(user => user.roles.includes(UserRole.Client)))
    );
  public order$: WritableSignal<Order> = signal(new Order());

  public isNew$ = computed(() => this.id() === 'new');

  public formOrder: FormGroup<IFormOrder> = new FormGroup({
    title: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    client: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required, Validators.maxLength(8000)]),
    datetimeIn: new FormControl(null, [Validators.required]),
    datetimeOut: new FormControl(null, [Validators.required]),
    open: new FormControl(true, [Validators.required]),
    paymentStatus: new FormControl(PaymentStatus.NOT_PAID, [Validators.required]),
  });

  ngOnInit() {
    if (!this.isNew$()) {
      this.order$.update(order => {
        order.id = this.id();
        return order;
      });
      this.getOrder();
    }
  }

  async getOrder() {
    let order = await firstValueFrom(this.ordersService.getOrderById(this.order$()?.id));

    this.order$.set(plainToClass(Order, order));

    let { title, description, datetimeIn, datetimeOut, open, paymentStatus, client } = this.order$();

    this.formOrder.setValue({
      title, description, datetimeIn, datetimeOut, open, paymentStatus, client
    });
  }

  returnOrCloseDialog() {
    this.dialogRef ? this.dialogRef.close() : window.history.back();
  }

  async registerOrder() {
    this.order$.update(order => plainToClassFromExist(order, this.formOrder.getRawValue()));

    let response;
    if (this.isNew$()) {
      response = await this.ordersService.newOrder(this.order$());
    } else {
      response = await this.ordersService.updateOrder(this.order$());
    }
    this.matSnackBar.open(`Order de serviço ${this.id() ? 'editada' : 'registrada'} com sucesso`, 'X', { duration: 3000 });
    this.order$.set(plainToClass(Order, response.order));

    if (!this.dialogRef) {
      this.router.navigate(['order', this.order$().id]);
    }
    this.getOrder();
  }

  async finishOrder() {
    if (!this.id()) return;
    await this.ordersService.finishOrder(this.order$().id);
    this.matSnackBar.open(`Order de serviço finalizada com sucesso`, 'X', { duration: 3000 });
  }

  setTodayToFormField(formControlName: 'datetimeIn' | 'datetimeOut') {
    this.formOrder.get(formControlName).setValue(dayjs().format('YYYY-MM-DDTHH:mm'));
  }

  async deleteOrder() {
    this.matDialog.open(ConfirmationComponent, { data: 'Tem certeza que deseja excluir esta order de serviço?\n\n<b>Essa operação é irreversível!</b>' })
      .afterClosed()
      .pipe(
        filter((response) => !!response),
        switchMap(() => this.ordersService.deleteOrder(this.id()))
      )
      .subscribe({
        next: () => {
          this.returnOrCloseDialog();
          this.matSnackBar.open('Order de serviço excluída com sucesso', 'X', { duration: 3000 });
        },
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