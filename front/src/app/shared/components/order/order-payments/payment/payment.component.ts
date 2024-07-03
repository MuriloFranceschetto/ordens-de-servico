import dayjs from 'dayjs';
import { map, take } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { Component, OnInit, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { IOrder } from '../../../../models/order/Order';
import { IUser, UserRole } from '../../../../models/User';
import { UsersService } from '../../../../services/users.service';
import { OrdersService } from '../../../../services/orders.service';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';
import { PaymentMethodLabelPipe } from '../../../../pipes/payment-method-label.pipe';
import { UserSelectComponent } from '../../../form-controls/user-select/user-select.component';
import { IPaymentOrder, PAYMENT_METHOD_OPTIONS, PaymentType } from '../../../../models/order/PaymentOrder';

const MATERIAL_MODULES = [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatMenuModule, MatIconModule, MatTooltipModule];

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [AsyncPipe, CurrencyMaskModule, ConfirmationComponent, UserSelectComponent, ...MATERIAL_MODULES],
  providers: [
    PaymentMethodLabelPipe,
    CurrencyPipe,
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {

  private readonly ordersService = inject(OrdersService);
  private readonly usersService = inject(UsersService);
  private readonly matDialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly paymentMethodLabelPipe = inject(PaymentMethodLabelPipe);
  private readonly currencyPipe = inject(CurrencyPipe);

  public readonly PAYMENT_METHOD_OPTIONS = PAYMENT_METHOD_OPTIONS;
  public readonly FN_COMPARE_WITH_USERS = this.usersService.FN_COMPARE_WITH_USERS;

  public readonly onlyPayersFn = (user: IUser) => user.roles.some(role => [UserRole.Client, UserRole.Third].includes(role));

  public dialogRef = inject(MatDialogRef<PaymentComponent>);
  public data: { order: IOrder, payment?: IPaymentOrder } = inject(MAT_DIALOG_DATA);
  public clients$ = this.usersService.users$
    .pipe(
      map(users => users.filter(user => user.roles.includes(UserRole.Client)))
    );

  public form: FormGroup<FormGroupPayment> = new FormGroup<FormGroupPayment>({
    payer: new FormControl(null, [Validators.required]),
    type: new FormControl(null, [Validators.required]),
    amount: new FormControl(null, [Validators.required, Validators.min(0)]),
    date: new FormControl(null, [Validators.required]),
  });

  ngOnInit(): void {
    if (this.data.payment) {
      this.form.setValue({
        amount: this.data.payment.amount,
        payer: this.data.payment.payer,
        type: this.data.payment.type,
        date: dayjs(this.data.payment.date).format('YYYY-MM-DD'),
      });
    }
  }

  setTodayToFormField() {
    this.form.controls.date.setValue(dayjs().format('YYYY-MM-DD'));
  }

  async savePayment() {
    const formValue = this.form.getRawValue();
    this.ordersService.savePayment({
      id: (this.data.payment?.id || null),
      order: this.data.order,
      amount: formValue.amount,
      type: formValue.type,
      payer: formValue.payer,
      date: formValue.date,
    }).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error(err);
      }
    });
  }

  async deletePayment() {

    let msg = `
Você está prestes a remover o pagamento com as seguintes definições:

  - Pagador: <b>${this.form.value?.payer?.name || this.data?.payment?.payer?.name}</b>
  - Método: <b>${this.paymentMethodLabelPipe.transform(this.form.value?.type || this.data?.payment?.type)}</b>
  - Valor: <b>${this.currencyPipe.transform(this.form.value?.amount || this.data?.payment?.amount)}</b>
    
<b>Tem certeza que deseja excluir esse pagamento?</b>
`;

    this.matDialog.open(ConfirmationComponent, { data: msg })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.ordersService.deletePayment(this.data.order.id, this.data.payment.id)
            .pipe(take(1))
            .subscribe({
              next: () => {
                this.matSnackBar.open('Pagamento excluído com sucesso', 'X', { duration: 3000 });
                this.dialogRef.close();
              },
            })
        }
      })
  }

}

interface FormGroupPayment {
  amount: FormControl<number>,
  type: FormControl<PaymentType>,
  payer: FormControl<IUser>,
  date: FormControl<string>,
}
