import { firstValueFrom, map, take } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, input, inject, computed, Optional, signal, WritableSignal, effect } from '@angular/core';

import { IUser, UserRole } from '../../models/User';
import { OrdersService } from '../../services/orders.service';
import { Order, PaymentStatus } from '../../models/Order';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { UsersService } from '../../services/users.service';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { MatSnackBar } from '@angular/material/snack-bar';

const ANGULAR_MATERIAL_MODULES = [
  MatInputModule, MatSelectModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule
]


@Component({
  selector: 'app-order',
  standalone: true,
  imports: [NgClass, AsyncPipe, ...ANGULAR_MATERIAL_MODULES],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {

  private id = input<string>();

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
    description: new FormControl(null, [Validators.required, Validators.maxLength(8000)]),
    datetimeIn: new FormControl(null, [Validators.required]),
    datetimeOut: new FormControl(null, [Validators.required]),
    open: new FormControl(true, [Validators.required]),
    paymentStatus: new FormControl(null, [Validators.required]),
    client: new FormControl(null, [Validators.required]),
  });

  constructor() {
    effect(async () => {
      if (!this.isNew$()) {
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
    })
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
    this.matSnackBar.open('Order de serviço editada com sucesso', 'X');
  }

  async deleteOrder() {
    this.matDialog.open(ConfirmationComponent, { data: 'Tem certeza que deseja excluir esta order de serviço?\nEssa operação é irreversível!' })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.ordersService.deleteOrder(this.id())
            .pipe(take(1))
            .subscribe({
              next: () => {
                this.returnOrCloseDialog();
                this.matSnackBar.open('Order de serviço excluída com sucesso');
              },
            })
        }
      })
  }

}

interface IFormOrder {
  title: FormControl<string>;
  description: FormControl<string>;
  datetimeIn: FormControl<Date>;
  datetimeOut: FormControl<Date>;
  open: FormControl<boolean>;
  paymentStatus: FormControl<PaymentStatus>;
  client: FormControl<IUser>;
}