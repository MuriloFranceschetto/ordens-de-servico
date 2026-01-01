import {filter, switchMap, take, tap} from 'rxjs';
import {CurrencyMaskModule} from 'ng2-currency-mask';

import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {Component, OnInit, inject, signal} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

import {UsersService} from '../../services/users.service';
import {IUser, UserRole, USER_ROLES_OPTIONS} from '../../models/User';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";

@Component({
    selector: 'app-user',
    imports: [ReactiveFormsModule, MatInputModule, MatSelectModule, MatCheckboxModule, CurrencyMaskModule, MatButtonModule, MatIconModule, MatDialogModule, LoadingSpinnerComponent],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {

    private matDialog = inject(MatDialog);
    private userService = inject(UsersService);

    private dialogRef = inject(MatDialogRef<UserComponent, boolean>);
    public dialogData: IUser = inject(MAT_DIALOG_DATA);

    public readonly rolesOptions = USER_ROLES_OPTIONS;

    public formUser = new FormGroup({
        name: new FormControl<string>(null, Validators.required),
        password: new FormControl<string>(null),
        email: new FormControl<string>(null, [Validators.email]),
        phone: new FormControl<string>(null),
        address: new FormControl<string>(null),
        roles: new FormControl<UserRole[]>(null, [Validators.required]),
        pricePerHour: new FormControl<number>(null),
        active: new FormControl<boolean>(true),
    });

    public loadingSave = signal<boolean>(false);
    public loadingDelete = signal<boolean>(false);

    constructor() {
        this.formUser.controls.roles.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe((roles) => {
                let {email, pricePerHour} = this.formUser.controls;

                if (roles.includes(UserRole.Admin)) {
                    email.setValidators(Validators.required);
                } else {
                    email.removeValidators(Validators.required);
                }

                if (roles.includes(UserRole.Worker)) {
                    pricePerHour.setValidators(Validators.required);
                    pricePerHour.enable();
                } else {
                    pricePerHour.removeValidators(Validators.required);
                    pricePerHour.disable();
                }

                this.checkPasswordRequirement(roles);

                email.updateValueAndValidity();
                pricePerHour.updateValueAndValidity();
            })
    }

    private checkPasswordRequirement(roles?: UserRole[]) {
        let passwordCtrl = this.formUser.controls.password;

        if (roles?.includes(UserRole.Admin)) {
            passwordCtrl.enable();
            if (!this.dialogData?.id) {
                passwordCtrl.setValidators(Validators.required);
            } else {
                passwordCtrl.removeValidators(Validators.required);
            }
        } else {
            passwordCtrl.disable();
        }
        passwordCtrl.updateValueAndValidity();
    }

    ngOnInit(): void {
        this.checkPasswordRequirement();
        if (!this.dialogData?.id) return;

        this.userService.getUser(this.dialogData.id)
            .subscribe({
                next: (user) => {
                    this.formUser.setValue({
                        name: user.name,
                        roles: user.roles,
                        email: user.email,
                        phone: user.phone,
                        address: user.address,
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
        this.loadingSave.set(true);
        this.saveMethod
            .pipe(take(1))
            .subscribe({
                next: () => this.dialogRef.close(true),
                error: (e) => {
                    this.loadingSave.set(false);
                    throw e;
                }
            })
    }

    private get saveMethod() {
        const formData = this.formUser.getRawValue();
        return this.dialogData?.id
            ? this.userService.updateUser(this.dialogData.id, formData)
            : this.userService.newUser(formData);
    }

    public deleteUser() {
        this.matDialog.open(ConfirmationComponent, {data: 'Tem certeza que deseja excluir esse usuário?'})
            .afterClosed()
            .pipe(
                filter((response) => !!response),
                tap(() => this.loadingDelete.set(true)),
                switchMap(() => this.userService.deleteUser(this.dialogData.id)),
            )
            .subscribe({
                next: () => this.dialogRef.close(true),
                error: (err) => {
                    this.loadingDelete.set(false);
                    throw err
                },
            });
    }

}
