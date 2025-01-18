import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    EMPTY,
    merge,
    of,
    shareReplay,
    Subject,
    switchMap,
    take,
    tap,
    throwError
} from 'rxjs';

import {RouterLink} from '@angular/router';
import {AsyncPipe, NgClass} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {Component, inject, signal, viewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

import {IUser, USER_ROLES_OPTIONS, UserRole} from '../../../shared/models/User';
import {UsersService} from '../../../shared/services/users.service';
import {UserComponent} from '../../../shared/components/user/user.component';
import {UserRoleLabelPipe} from '../../../shared/pipes/user-role-label.pipe';
import {MatCheckboxModule} from '@angular/material/checkbox';

const MATERIAL_MODULES = [
    MatTableModule, MatButtonModule, MatDialogModule, MatIconModule,
    MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatInputModule,
    MatCheckboxModule,
]

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [AsyncPipe, UserRoleLabelPipe, NgClass, ReactiveFormsModule, ...MATERIAL_MODULES],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss'
})
export class UsersComponent {

    private readonly usersService = inject(UsersService);
    private readonly dialog = inject(MatDialog);
    public readonly columns: Array<keyof IUser | 'actions'> = ['name', 'roles', 'active', 'actions'];
    public readonly userRolesOptions = USER_ROLES_OPTIONS;

    public readonly loading = signal<boolean>(true);
    public readonly paginator = viewChild.required(MatPaginator);

    public readonly formFilters = new FormGroup({
        name: new FormControl<string>(null),
        roles: new FormControl<UserRole[]>(null),
        show_inactives: new FormControl<boolean>(null),
    })

    private readonly firstSearch$ = this.usersService.getUsers().pipe(take(1));

    public readonly searchUsersTrigger$ = new Subject<void>();
    private searchUsersAgain$ = merge(this.formFilters.valueChanges.pipe(debounceTime(300), distinctUntilChanged()), this.searchUsersTrigger$)
        .pipe(
            tap(() => this.loading.set(true)),
            switchMap(() => {
                const {pageIndex, pageSize} = this.paginator();
                let {name, roles, show_inactives} = this.formFilters.getRawValue();
                return this.usersService.getUsers({name, roles, show_inactives, page: pageIndex, limit: pageSize})
                    .pipe(
                        take(1),
                        catchError(() => {
                            this.loading.set(false);
                            return of({users: [], total: 0});
                        })
                    );
            }),
        );

    public readonly users$ = merge(this.firstSearch$, this.searchUsersAgain$)
        .pipe(
            shareReplay(),
            tap(() => this.loading.set(false)),
            takeUntilDestroyed(),
        );

    async openUserForm(user?: IUser) {
        this.dialog.open(UserComponent, {data: user})
            .afterClosed()
            .subscribe((response) => {
                if (!response) return;
                this.searchUsersTrigger$.next();
            });
    }

    clear(formControl: string) {
        this.formFilters.get(formControl).reset();
    }

}
