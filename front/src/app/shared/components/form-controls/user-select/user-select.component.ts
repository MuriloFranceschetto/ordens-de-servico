import { Subject, debounceTime, distinctUntilChanged, filter, map, shareReplay, switchMap, take, takeUntil } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, OnDestroy, OnInit, inject, input, signal, } from '@angular/core';

import { IUser, UserRole } from '../../../models/User';
import { UserComponent } from '../../user/user.component';
import { UsersService } from '../../../services/users.service';
import { SearchSelectOptionComponent } from '../search-select-option/search-select-option.component';


@Component({
  selector: 'app-user-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatIconModule, ReactiveFormsModule, SearchSelectOptionComponent, AsyncPipe],
  templateUrl: './user-select.component.html',
  styleUrl: './user-select.component.scss',
})
export class UserSelectComponent implements OnInit, OnDestroy {

  // ----- INPUTS ----------
  public readonly formGroup = input.required<FormGroup<any>>();
  public readonly formControlName = input.required<string>();
  public readonly optinal = input<boolean>();
  public readonly roles = input<UserRole[]>();
  public readonly subscriptSizing = input<'dynamic' | 'fixed'>();

  // ----- INJECTIONS ------
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);

  // -----------------------
  public readonly FN_COMPARE_WITH_USERS = this.usersService.FN_COMPARE_WITH_USERS;
  public get selectControl(): AbstractControl {
    return this.formGroup().get(this.formControlName());
  }

  // Para buscar os usuários novamente emitir este evento
  private readonly triggerUsersRequest$ = new Subject<void>();
  private readonly destroyed$ = new Subject<void>();


  public searchControl = new FormControl(null);
  public users$ = this.searchControl.valueChanges
    .pipe(
      takeUntilDestroyed(),
      distinctUntilChanged(),
      debounceTime(500),
      filter((value) => !!value),
      switchMap((searchValue) => {
        return this.usersService.getUsers({ name: searchValue, roles: this.roles() }).pipe(take(1))
      }),
      map((response) => response.users),
      shareReplay(),
    );
  public currentValueForm = signal<IUser>(null);
  public showNoResults$ = this.users$.pipe(map(users => users.length === 0))

  ngOnInit(): void {
    this.triggerUsersRequest$.next();

    this.currentValueForm.set(this.selectControl.getRawValue())

    this.selectControl
      .valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => this.currentValueForm.set(value))
  }

  public newUser() {
    let dialogRef = this.dialog.open(UserComponent, {
      autoFocus: false,
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        this.triggerUsersRequest$.next();
      });
  }

  clear() {
    this.selectControl.reset();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
