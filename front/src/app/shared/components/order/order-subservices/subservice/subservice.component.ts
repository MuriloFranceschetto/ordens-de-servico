import { Observable, firstValueFrom, map, share, shareReplay, take, tap } from 'rxjs';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { Component, ElementRef, Signal, TemplateRef, ViewContainerRef, computed, effect, inject, viewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, CommonModule, CurrencyPipe, NgTemplateOutlet } from '@angular/common';
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
import { ENVIRONMENT_OPTIONS, EnvironmentType, ISubserviceOrder, SubserviceOrder } from '../../../../models/order/SubserviceOrder';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';
import { ChargeTypes, ISubservice } from '../../../../models/subservice/ISubservice';
import { IUser, UserRole } from '../../../../models/User';
import { SubservicesService } from '../../../../services/subservices.service';
import { SubserviceChargeTypeLabelPipe } from '../../../../pipes/subservice-charge-type-label.pipe';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { HourQuantityComponent } from './quantity-strategies/hour-quantity/hour-quantity.component';

const MATERIAL_MODULES = [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatMenuModule, MatIconModule, MatTooltipModule];
const ANGULAR_MODULES = [AsyncPipe, CurrencyPipe, NgTemplateOutlet];

@Component({
  selector: 'app-subservice',
  standalone: true,
  imports: [CurrencyMaskModule, SubserviceChargeTypeLabelPipe, ConfirmationComponent, HourQuantityComponent, ...ANGULAR_MODULES, ...MATERIAL_MODULES],
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

  public readonly workers$ = this.usersService.users$
    .pipe(
      take(1),
      map((users) => {
        return users.filter(user => user.roles.find(role => [UserRole.Worker].includes(role)))
      })
    );
  public readonly FN_COMPARE_WITH_USERS = this.usersService.FN_COMPARE_WITH_USERS;

  public readonly subservices$ = this.subservicesService.subservices$;
  public readonly FN_COMPARE_WITH_SUBSERVICES = this.subservicesService.FN_COMPARE_WITH_SUBSERVICES;

  public form = new FormGroup<FormGroupSubservice>({
    subservice: new FormControl(null, Validators.required),
    worker: new FormControl(null, Validators.required),
    amount: new FormControl(null, [Validators.required, Validators.min(0)]),
    environment: new FormControl(EnvironmentType.INTERNAL, Validators.required),
    quantity: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.min(0)]),
    hours: new FormControl(null),
  });
  public quantity: number = 6.33;

  public hoursField = viewChild<TemplateRef<any>>('hoursField');
  public unityField = viewChild<TemplateRef<any>>('unityField');
  public kilometerField = viewChild<TemplateRef<any>>('kilometerField');
  public kilogramField = viewChild<TemplateRef<any>>('kilogramField');
  public noQuantityField = viewChild<TemplateRef<any>>('noQuantityField');

  public initialMileage = new FormControl<number>(null, Validators.min(0));
  public finalMileage = new FormControl<number>(null, Validators.min(0));

  private subserviceChanges: Signal<ISubservice> = toSignal(this.form.controls.subservice.valueChanges);

  public fieldTemplateToRender$ = computed(() => {
    const subserviceType: ChargeTypes = this.subserviceChanges()?.charged_per;
    let fieldTemplatesBySubserviceType: { [key: string]: Signal<TemplateRef<any>> } = {
      'HR': this.hoursField,
      'KM': this.kilometerField,
      'KG': this.kilogramField,
      'UN': this.unityField,
    }
    let template = fieldTemplatesBySubserviceType[subserviceType];
    return template ? template() : this.noQuantityField();
  });

  constructor() {
    // OPERAÇÕES QUANDO MUDA O TIPO DO SUBSERVIÇO
    effect(() => {
      const subserviceType: ChargeTypes = this.subserviceChanges()?.charged_per;
      if (!subserviceType) return;

      const quantityField = this.form.controls.quantity;

      quantityField.enable();
      quantityField.reset();

      if (subserviceType === ChargeTypes.REFER) {
        quantityField.setValue(1);
        this.form.controls.environment.disable();
        this.form.controls.environment.removeValidators(Validators.required);
      } else {
        this.form.controls.environment.enable();
        this.form.controls.environment.setValidators(Validators.required);
      }
    });
  }

  public priceSugestion$: Observable<number> = this.form.valueChanges
    .pipe(
      takeUntilDestroyed(),
      map((formValue) => {
        return (formValue.subservice?.price * formValue?.quantity) || null;
      }),
      share(),
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

  async saveSubservice() {
    const formValue = this.form.getRawValue();
    let subservice: ISubserviceOrder = {
      id: (this.data.subservice?.id || null),
      order: this.data.order,
      amount: formValue.amount,
      environment: formValue.environment,
      subservice: formValue.subservice,
      worker: formValue.worker,
      quantity: formValue.quantity,
    }
    try {
      let response = await firstValueFrom(this.ordersService.saveSubservice(subservice));
      this.dialogRef.close(response);
    } catch (err) {
      throw err;
    }
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

  public calculateKilometers() {
    this.form.controls.quantity.setValue(this.finalMileage.getRawValue() - this.initialMileage.getRawValue());
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