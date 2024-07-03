import { firstValueFrom, take } from 'rxjs';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { AsyncPipe, CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { Component, Signal, TemplateRef, WritableSignal, computed, effect, inject, signal, viewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { IOrder } from '../../../../models/order/Order';
import { IUser, UserRole } from '../../../../models/User';
import { OrdersService } from '../../../../services/orders.service';
import { SubservicesService } from '../../../../services/subservices.service';
import { ConfirmationComponent } from '../../../confirmation/confirmation.component';
import { ChargeTypes, ISubservice } from '../../../../models/subservice/ISubservice';
import { UserSelectComponent } from '../../../form-controls/user-select/user-select.component';
import { SubserviceChargeTypeLabelPipe } from '../../../../pipes/subservice-charge-type-label.pipe';
import { HourQuantityComponent } from './quantity-strategies/hour-quantity/hour-quantity.component';
import { KilometerQuantityComponent } from './quantity-strategies/kilometer-quantity/kilometer-quantity.component';
import { ENVIRONMENT_OPTIONS, EnvironmentType, ISubserviceOrder, SubserviceOrder } from '../../../../models/order/SubserviceOrder';
import { SubServiceSelectComponent } from '../../../form-controls/sub-service-select/sub-service-select.component';

const MATERIAL_MODULES = [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatMenuModule, MatIconModule, MatTooltipModule];
const ANGULAR_MODULES = [AsyncPipe, CurrencyPipe, NgTemplateOutlet];
const PROJECT_COMPONENTS = [ConfirmationComponent, HourQuantityComponent, KilometerQuantityComponent, UserSelectComponent, SubServiceSelectComponent];

@Component({
  selector: 'order-subservices-form',
  standalone: true,
  imports: [
    CurrencyMaskModule,
    SubserviceChargeTypeLabelPipe,
    ...PROJECT_COMPONENTS,
    ...ANGULAR_MODULES,
    ...MATERIAL_MODULES
  ],
  providers: [
    CurrencyPipe,
  ],
  templateUrl: './order-subservice-form.component.html',
  styleUrl: './order-subservice-form.component.scss'
})
export class OrderSubserviceFormComponent {

  private readonly matDialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly currencyPipe = inject(CurrencyPipe);
  private readonly ordersService = inject(OrdersService);
  private readonly subservicesService = inject(SubservicesService);

  public readonly dialogRef = inject(MatDialogRef<OrderSubserviceFormComponent>);
  public readonly data: { order: IOrder, subservice?: SubserviceOrder } = inject(MAT_DIALOG_DATA);

  public readonly ENVIRONMENT_OPTIONS = ENVIRONMENT_OPTIONS;

  public readonly onlyWorkersFn = (user: IUser) => user.roles.includes(UserRole.Worker);

  public readonly subservices$ = this.subservicesService.subservices$;
  public readonly FN_COMPARE_WITH_SUBSERVICES = this.subservicesService.FN_COMPARE_WITH_SUBSERVICES;

  public form = new FormGroup<FormGroupSubservice>({
    subservice: new FormControl(null, Validators.required),
    worker: new FormControl(null, Validators.required),
    amount: new FormControl(null, [Validators.required, Validators.min(0)]),
    environment: new FormControl(EnvironmentType.INTERNAL, Validators.required),
    hours: new FormControl(null),
  });
  private formValueChanges$ = toSignal(this.form.valueChanges);
  public quantity: WritableSignal<number> = signal(0);

  public priceSugestion$: Signal<number> = computed(() => {
    return this.formValueChanges$()?.subservice?.price * this.quantity();
  });

  public hoursField = viewChild<TemplateRef<any>>('hoursField');
  public unityField = viewChild<TemplateRef<any>>('unityField');
  public kilometerField = viewChild<TemplateRef<any>>('kilometerField');
  public kilogramField = viewChild<TemplateRef<any>>('kilogramField');
  public noQuantityField = viewChild<TemplateRef<any>>('noQuantityField');

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

      this.quantity.set(0);

      if (subserviceType === ChargeTypes.REFER) {
        this.quantity.set(1);
        this.form.controls.environment.disable();
        this.form.controls.environment.removeValidators(Validators.required);
      } else {
        this.form.controls.environment.enable();
        this.form.controls.environment.setValidators(Validators.required);
      }
    }, {
      allowSignalWrites: true,
    });
  }

  ngOnInit(): void {
    if (this.data.subservice) {
      this.form.setValue({
        amount: this.data.subservice.amount,
        environment: this.data.subservice.environment,
        subservice: this.data.subservice.subservice,
        worker: this.data.subservice.worker,
        hours: null, // TODO - Converter quantidade de horas e vice-versa
      });
      this.quantity.set(this.data.subservice.quantity);
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
      quantity: this.quantity(),
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

}

interface FormGroupSubservice {
  amount: FormControl<number>;
  environment: FormControl<EnvironmentType>;
  subservice: FormControl<ISubservice>;
  worker: FormControl<IUser>;
  hours: FormControl<string>;
}