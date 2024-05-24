import { take } from 'rxjs';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { SubservicesService } from '../../services/subservices.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { CHARGE_TYPES_OPTIONS, ChargeTypes, ISubservice } from '../../models/subservice/ISubservice';

@Component({
  selector: 'app-subservice',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatFormFieldModule,
    MatSelectModule, MatCheckboxModule, MatButtonModule, CurrencyMaskModule],
  templateUrl: './subservice.component.html',
  styleUrl: './subservice.component.scss'
})
export class SubserviceComponent {

  public readonly chargeTypesOptions = CHARGE_TYPES_OPTIONS;

  private readonly dialogRef = inject(MatDialogRef<SubserviceComponent>);
  public readonly dialogData: ISubservice = inject(MAT_DIALOG_DATA);

  private readonly subservicesService = inject(SubservicesService);
  private readonly matDialog = inject(MatDialog);

  public formSubservice = new FormGroup({
    active: new FormControl<boolean>(true),
    name: new FormControl<string>(null, Validators.required),
    charged_per: new FormControl<ChargeTypes>(null, Validators.required),
    price: new FormControl<number>(null, [Validators.required, Validators.min(0)])
  });

  ngOnInit(): void {
    if (!this.dialogData?.id) return;

    this.subservicesService.getSubservice(this.dialogData.id)
      .subscribe({
        next: (subservices) => {
          this.formSubservice.setValue({
            active: subservices.active,
            name: subservices.name,
            charged_per: subservices.charged_per,
            price: subservices.price,
          });
        },
      })
  }

  deleteSubservice() {
    this.matDialog.open(ConfirmationComponent, { data: 'Tem certeza que deseja excluir esse sub-serviço?' })
      .afterClosed()
      .subscribe((response: any) => {
        if (response) {
          this.subservicesService.deleteSubservice(this.dialogData.id)
            .pipe(take(1))
            .subscribe({
              next: () => this.dialogRef.close(),
            })
        }
      })
  }

  registerSubservice() {
    if (this.formSubservice.invalid) {
      this.formSubservice.markAllAsTouched();
      return;
    }
    this.saveMethod
      .pipe(take(1))
      .subscribe({
        next: () => this.dialogRef.close(),
      })
  }

  private get saveMethod() {
    const formData = this.formSubservice.getRawValue();
    return this.dialogData?.id
      ? this.subservicesService.updateSubservice(this.dialogData.id, formData)
      : this.subservicesService.newSubservice(formData);
  }

}
