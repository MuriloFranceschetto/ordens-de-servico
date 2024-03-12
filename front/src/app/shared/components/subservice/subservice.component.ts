import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CHARGE_TYPES_OPTIONS, ChargeTypes, ISubservice } from '../../models/Subservice';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SubservicesService } from '../../services/subservices.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-subservice',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule],
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
        next: (user) => {
          this.formSubservice.setValue({
            active: user.active,
            name: user.name,
            charged_per: user.charged_per,
            price: user.price,
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
