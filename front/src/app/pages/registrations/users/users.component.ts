import { Component, inject } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { take } from 'rxjs';

import { UsersService } from '../../../shared/services/users.service';
import { UserComponent } from '../../../shared/components/user/user.component';
import { IUser } from '../../../shared/models/User';
import { UserRoleLabelPipe } from '../../../shared/pipes/user-role-label.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe, MatTableModule, RouterLink, MatButtonModule, MatDialogModule, UserRoleLabelPipe, MatIconModule, NgClass],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  private usersService = inject(UsersService);
  private dialog = inject(MatDialog);

  public users$ = this.usersService.users$.pipe(take(1));

  public readonly columns = ['name', 'roles', 'actions'];

  async openUserForm(user?: IUser) {
    let dialogRef = this.dialog.open(UserComponent, {
      data: user,
    });
    dialogRef.afterClosed().subscribe((response) => {
      this.users$ = this.usersService.users$.pipe(take(1));
    });
  }

}
