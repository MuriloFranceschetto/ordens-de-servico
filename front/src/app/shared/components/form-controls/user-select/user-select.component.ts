import { Component, OnDestroy, OnInit, Signal, ViewEncapsulation, computed, inject, input, } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UsersService } from '../../../services/users.service';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { IUser } from '../../../models/User';
import { Subject, debounceTime, delay, distinctUntilChanged, interval, map, switchMap, take, timeInterval } from 'rxjs';
import { UtilsService } from '../../../services/utils.service';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { UserComponent } from '../../user/user.component';

@Component({
  selector: 'app-user-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule, MatTooltipModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './user-select.component.html',
  styleUrl: './user-select.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UserSelectComponent implements OnInit {

  // ----- INPUTS ----------
  public readonly formGroup = input.required<FormGroup<any>>();
  public readonly formControlName = input.required<string>();
  public readonly filterFn = input<(user: IUser) => boolean>();

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
