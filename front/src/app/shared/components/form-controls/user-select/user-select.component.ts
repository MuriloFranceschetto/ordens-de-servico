import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged, filter, shareReplay, switchMap, take, takeUntil } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, OnDestroy, OnInit, Signal, computed, inject, input, signal, } from '@angular/core';

import { IUser, UserRole } from '../../../models/User';
import { UserComponent } from '../../user/user.component';
import { UsersService } from '../../../services/users.service';
import { UtilsService } from '../../../services/utils.service';
import { SearchSelectOptionComponent } from '../search-select-option/search-select-option.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule, SearchSelectOptionComponent, AsyncPipe],
  templateUrl: './user-select.component.html',
  styleUrl: './user-select.component.scss',
})
export class UserSelectComponent implements OnInit, OnDestroy {

  // ----- INPUTS ----------
  public readonly formGroup = input.required<FormGroup<any>>();
  public readonly formControlName = input.required<string>();
  public readonly roles = input<UserRole[]>();
  public readonly subscriptSizing = input<'dynamic' | 'fixed'>();

  // ----- INJECTIONS ------
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);

  // -----------------------
  public readonly FN_COMPARE_WITH_USERS = this.usersService.FN_COMPARE_WITH_USERS;

  public currentValueForm = signal<IUser>(null);

  public searchControl = new FormControl(null);
  public users$ = this.searchControl.valueChanges
    .pipe(
      takeUntilDestroyed(),
      distinctUntilChanged(),
      filter((value) => !!value),
      debounceTime(500),
      switchMap((searchValue) => {
        return this.usersService.getUsersWithFilter({ name: searchValue }).pipe(take(1))
      }),
      shareReplay(),
    );

  // Para buscar os usuários novamente emitir este evento
  private readonly triggerUsersRequest$ = new Subject<void>();

  ngOnInit(): void {
    this.triggerUsersRequest$.next();
    this.formGroup()
      .get(this.formControlName())
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


  private destroyed$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
