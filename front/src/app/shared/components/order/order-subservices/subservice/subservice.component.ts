import { Observable, map, take } from 'rxjs';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { IOrder } from '../../../../models/order/Order';
import { UsersService } from '../../../../services/users.service';
import { OrdersService } from '../../../../services/orders.service';
import { ENVIRONMENT_OPTIONS, EnvironmentType, SubserviceOrder } from '../../../../models/order/SubserviceOrder';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';
import { ChargeTypes, ISubservice } from '../../../../models/subservice/ISubservice';
import { IUser, UserRole } from '../../../../models/User';
import { SubservicesService } from '../../../../services/subservices.service';
import { SubserviceChargeTypeLabelPipe } from '../../../../pipes/subservice-charge-type-label.pipe';

const MATERIAL_MODULES = [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatMenuModule, MatIconModule, MatTooltipModule];

@Component({
  selector: 'app-subservice',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, CurrencyMaskModule, SubserviceChargeTypeLabelPipe, ConfirmationComponent, ...MATERIAL_MODULES],
  providers: [
    CurrencyPipe,
  ],
  templateUrl: './subservice.component.html',
  styleUrl: './subservice.component.scss'
})
export class SubserviceComponent {

  private readonly matDialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly currencyPipe = inject(CurrencyPipe);
  private readonly usersService = inject(UsersService);
  private readonly ordersService = inject(OrdersService);
  private readonly subservicesService = inject(SubservicesService);

  public readonly dialogRef = inject(MatDialogRef<SubserviceComponent>);
  public readonly data: { order: IOrder, subservice?: SubserviceOrder } = inject(MAT_DIALOG_DATA);

  public readonly ENVIRONMENT_OPTIONS = ENVIRONMENT_OPTIONS;

  public readonly workers$ = this.usersService.users$.pipe(map(users => users.filter(user => user.roles.includes(UserRole.Worker))));
  public readonly FN_COMPARE_WITH_USERS = this.usersService.FN_COMPARE_WITH_USERS;

  public readonly subservices$ = this.subservicesService.subservices$;
  public readonly FN_COMPARE_WITH_SUBSERVICES = this.subservicesService.FN_COMPARE_WITH_SUBSERVICES;

  public form = new FormGroup<FormGroupSubservice>({
    subservice: new FormControl(null, Validators.required),
    worker: new FormControl(null, Validators.required),
    amount: new FormControl(0, [Validators.required, Validators.min(0)]),
    environment: new FormControl(null, Validators.required),
    quantity: new FormControl(null, [Validators.required, Validators.min(0)]),
    hours: new FormControl(null, [Validators.required]),
  });

  public showsHoursInput$: Observable<boolean> = this.form.valueChanges
    .pipe(
      map((formValue) => formValue?.subservice?.charged_per === ChargeTypes.HOUR)
    );

  ngOnInit(): void {
    if (this.data.subservice) {
      this.form.setValue({
        amount: this.data.subservice.amount,
        environment: this.data.subservice.environment,
        subservice: this.data.subservice.subservice,
        worker: this.data.subservice.worker,
        quantity: this.data.subservice.quantity,
        hours: null, // TODO - Converter quantidade de horas e vice-versa
      });
    }
  }

  saveSubservice() {
    const formValue = this.form.getRawValue();
    this.ordersService.saveSubservice({
      id: (this.data.subservice?.id || null),
      order: this.data.order,
      amount: formValue.amount,
      environment: formValue.environment,
      subservice: formValue.subservice,
      worker: formValue.worker,
      quantity: formValue.quantity,
    }).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error(err);
      }
    });
  }

  deleteSubservice() {
    let msg = `
    Você está prestes a remover o sub-serviço com as seguintes definições:
    
      - Valor: <b>${this.currencyPipe.transform(this.form.value?.amount || this.data?.subservice?.amount)}</b>
        
    <b>Tem certeza que deseja excluir esse pagamento?</b>
    `;

    this.matDialog.open(ConfirmationComponent, { data: msg })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.ordersService.deletePayment(this.data.order.id, this.data.subservice.id)
            .pipe(take(1))
            .subscribe({
              next: () => {
                this.matSnackBar.open('Pagamento excluído com sucesso', 'X', { duration: 3000 });
                this.dialogRef.close();
              },
            })
        }
      });
  }

}

interface FormGroupSubservice {
  amount: FormControl<number>;
  environment: FormControl<EnvironmentType>;
  subservice: FormControl<ISubservice>;
  worker: FormControl<IUser>;
  quantity: FormControl<number>;
  hours: FormControl<string>;
}