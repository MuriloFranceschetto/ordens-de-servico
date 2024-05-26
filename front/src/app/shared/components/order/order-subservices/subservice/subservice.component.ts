import { take } from 'rxjs';
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
import { SubserviceOrder } from '../../../../models/order/SubserviceOrder';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';

const MATERIAL_MODULES = [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatMenuModule, MatIconModule, MatTooltipModule];

@Component({
  selector: 'app-subservice',
  standalone: true,
  imports: [AsyncPipe, CurrencyMaskModule, ConfirmationComponent, ...MATERIAL_MODULES],
  providers: [
    CurrencyPipe,
  ],
  templateUrl: './subservice.component.html',
  styleUrl: './subservice.component.scss'
})
export class SubserviceComponent {

  private readonly ordersService = inject(OrdersService);
  private readonly usersService = inject(UsersService);
  private readonly matDialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly currencyPipe = inject(CurrencyPipe);

  public readonly dialogRef = inject(MatDialogRef<SubserviceComponent>);
  public readonly data: { order: IOrder, subservice?: SubserviceOrder } = inject(MAT_DIALOG_DATA);

  public form: FormGroup<FormGroupSubservice> = new FormGroup({
    amount: new FormControl(null, [Validators.required, Validators.min(0)])
  });

  saveSubservice() {

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
      })
  }

}

interface FormGroupSubservice {
  amount: FormControl<number>;
}