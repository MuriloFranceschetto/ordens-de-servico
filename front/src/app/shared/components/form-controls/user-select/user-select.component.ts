import { Subject, debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, Signal, computed, inject, input, } from '@angular/core';

import { IUser } from '../../../models/User';
import { UserComponent } from '../../user/user.component';
import { UsersService } from '../../../services/users.service';
import { UtilsService } from '../../../services/utils.service';
import { SearchSelectOptionComponent } from '../search-select-option/search-select-option.component';

@Component({
  selector: 'app-user-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule, SearchSelectOptionComponent],
  templateUrl: './user-select.component.html',
  styleUrl: './user-select.component.scss',
})
export class UserSelectComponent implements OnInit {

  // ----- INPUTS ----------
  public readonly formGroup = input.required<FormGroup<any>>();
  public readonly formControlName = input.required<string>();
  public readonly filterFn = input<(user: IUser) => boolean>();
  public readonly subscriptSizing = input<'dynamic' | 'fixed'>();

  // ----- INJECTIONS ------
  private readonly usersService = inject(UsersService);
  private readonly utilsService = inject(UtilsService);
  private readonly dialog = inject(MatDialog);

  // -----------------------
  public readonly FN_COMPARE_WITH_USERS = this.usersService.FN_COMPARE_WITH_USERS;

  public searchControl = new FormControl(null);
  private searchFormValue = toSignal(this.searchControl.valueChanges.pipe(takeUntilDestroyed(), distinctUntilChanged(), debounceTime(500)));

  // Para buscar os usuários novamente emitir este evento
  private readonly triggerUsersRequest$ = new Subject<void>();

  private readonly usersFullList = toSignal(this.triggerUsersRequest$.pipe(takeUntilDestroyed(), switchMap(() => this.usersService.users$)));

  private readonly users: Signal<IUser[]> = computed(() => {
    if (!this.usersFullList())
      return [];

    if (!this.filterFn)
      return this.usersFullList();

    return this.usersFullList().filter(this.filterFn());
  });

  public filteredUsers = computed(() => {
    let users = this.users();
    if (!users) return [];

    if (!this.searchFormValue()) {
      return users.slice(0, 30);
    } else {
      return this.users().filter(user => {
        return this.utilsService.normalize(user.name)
          .includes(this.utilsService.normalize(this.searchFormValue()))
      })
    }
  });

  ngOnInit(): void {
    this.triggerUsersRequest$.next();
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

}
