import { BehaviorSubject, shareReplay, switchMap, take, tap } from 'rxjs';

import { RouterLink } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Component, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { IUser } from '../../../shared/models/User';
import { UsersService } from '../../../shared/services/users.service';
import { UserComponent } from '../../../shared/components/user/user.component';
import { UserRoleLabelPipe } from '../../../shared/pipes/user-role-label.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe, MatTableModule, RouterLink, MatButtonModule, MatDialogModule, UserRoleLabelPipe, MatIconModule, NgClass, MatPaginatorModule, MatProgressBarModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);
  public readonly columns = ['name', 'roles', 'actions'];

  public readonly loading = signal<boolean>(true);
  public readonly paginator = viewChild.required(MatPaginator);

  public readonly searchUsersTrigger$ = new BehaviorSubject<void>(null);

  public readonly users$ = this.searchUsersTrigger$
    .pipe(
      takeUntilDestroyed(),
      tap(() => this.loading.set(true)),
      switchMap(() => {
        const { pageIndex, pageSize } = this.paginator();
        return this.usersService.getAllUsers(pageIndex, pageSize).pipe(take(1));
      }),
      tap(() => this.loading.set(false)),
      shareReplay(),
    );

  async openUserForm(user?: IUser) {
    this.dialog.open(UserComponent, { data: user })
      .afterClosed()
      .subscribe((response) => {
        if (!response) return;
        this.searchUsersTrigger$.next();
      });
  }

}
