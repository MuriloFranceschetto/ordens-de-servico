import { Component, OnInit, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { take } from 'rxjs';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { UsersService } from '../../services/users.service';
import { IUser, UserRole, USER_ROLES_OPTIONS } from '../../models/User';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatSelectModule, MatCheckboxModule, CurrencyMaskModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {

  private matDialog = inject(MatDialog);
  private userService = inject(UsersService);

  private dialogRef = inject(MatDialogRef<UserComponent>);
  public dialogData: IUser = inject(MAT_DIALOG_DATA);

  public readonly rolesOptions = USER_ROLES_OPTIONS;

  public formUser = new FormGroup({
    name: new FormControl<string>(null, Validators.required),
    password: new FormControl<string>(null),
    email: new FormControl<string>(null, [Validators.email]),
    roles: new FormControl<UserRole[]>(null, [Validators.required]),
    pricePerHour: new FormControl<number>(null),
    active: new FormControl<boolean>(true),
  });

  constructor() {
    this.formUser.controls.roles.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((roles) => {
        const ctrlEmail = this.formUser.controls.email;
        const ctrlPrice = this.formUser.controls.pricePerHour;

        if (roles.includes(UserRole.Admin)) {
          ctrlEmail.setValidators(Validators.required);
        } else {
          ctrlEmail.removeValidators(Validators.required);
        }

        if (roles.includes(UserRole.Worker)) {
          ctrlPrice.setValidators(Validators.required);
          ctrlPrice.enable();
        } else {
          ctrlPrice.removeValidators(Validators.required);
          ctrlPrice.disable();
        }

        ctrlEmail.updateValueAndValidity();
        ctrlPrice.updateValueAndValidity();
      })
  }

  ngOnInit(): void {
    if (!this.dialogData?.id) {
      this.formUser.controls.password.setValidators(Validators.required);
      this.formUser.updateValueAndValidity();
      return;
    }

    this.userService.getUser(this.dialogData.id)
      .subscribe({
        next: (user) => {
          this.formUser.setValue({
            name: user.name,
            email: user.email,
            roles: user.roles,
            password: null,
            pricePerHour: user.pricePerHour,
            active: user.active,
          });
        },
      })
  }

  public registerUser() {
    if (this.formUser.invalid) {
      this.formUser.markAllAsTouched();
      return;
    }

    this.saveMethod
      .pipe(take(1))
      .subscribe({
        next: () => this.dialogRef.close(),
      })
  }

  private get saveMethod() {
    const formData = this.formUser.getRawValue();
    return this.dialogData?.id
      ? this.userService.updateUser(this.dialogData.id, formData)
      : this.userService.newUser(formData);
  }

  public deleteUser() {
    this.matDialog.open(ConfirmationComponent, { data: 'Tem certeza que deseja excluir esse usuário?' })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.userService.deleteUser(this.dialogData.id)
            .pipe(take(1))
            .subscribe({
              next: () => this.dialogRef.close(),
            })
        }
      })
  }

}