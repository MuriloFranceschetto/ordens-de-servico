import {debounceTime, merge, shareReplay, Subject, switchMap, take, tap} from 'rxjs';
import colors from 'tailwindcss/colors';
import {Router} from '@angular/router';
import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common';
import {Component, inject, signal, viewChild} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';

import {IOrder, OrderStatus, PaymentStatus} from '../../shared/models/order/Order';
import {OrdersService, QueryParamsOrder} from '../../shared/services/orders.service';
import {MyChipComponent} from '../../shared/components/my-chip/my-chip.component';
import {PaymentStatusPipe} from '../../shared/pipes/payment-status.pipe';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {IUser, UserRole} from '../../shared/models/User';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {UserSelectComponent} from '../../shared/components/form-controls/user-select/user-select.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

const MATERIAL_MODULES = [
    MatTableModule, MatIconModule, MatButtonModule, MatChipsModule,
    MatSelectModule, MatInputModule, MatFormFieldModule, MatProgressBarModule,
    MatDatepickerModule, MatPaginatorModule,
]

@Component({
    selector: 'app-orders',
    standalone: true,
    providers: [provideNativeDateAdapter()],
    imports: [AsyncPipe, DatePipe, PaymentStatusPipe, ReactiveFormsModule, MyChipComponent, UserSelectComponent, ...MATERIAL_MODULES, CurrencyPipe],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss'
})
export class OrdersComponent {

    public readonly colors = colors;
    public readonly OrderStatus = OrderStatus;
    public readonly onlyClients = [UserRole.Client];
    public readonly columns: Array<keyof IOrder | 'actions'> = ['datetimeIn', 'client', 'title', 'orderStatus', 'paymentStatus', 'totalAmountSubservices', 'actions'];

    private readonly ordersService = inject(OrdersService);
    private readonly router = inject(Router);

    public readonly paginator = viewChild.required(MatPaginator);

    public readonly formFilters = new FormGroup<IFilters>({
        order_status: new FormControl<OrderStatus>(null),
        payment_status: new FormControl<PaymentStatus>(null),
        client: new FormControl<IUser>(null),
        title: new FormControl<string>(null),
        checkout_date_init: new FormControl(null),
        checkout_date_end: new FormControl(null),
    });

    public readonly loading = signal<boolean>(true);

    public readonly paginatorChanges$ = new Subject<void>();
    private readonly searchOrdersOnInit$ = this.ordersService.getOrders().pipe(take(1));

    private searchOrdersOnFormChange$ = merge(
        this.paginatorChanges$,
        this.formFilters.valueChanges
    ).pipe(
        takeUntilDestroyed(),
        debounceTime(300),
        tap(() => this.loading.set(true)),
        switchMap(() => {
            let formValue = this.formFilters.getRawValue();
            let queryParams: QueryParamsOrder = {
                title: formValue.title,
                order_status: formValue.order_status,
                payment_status: formValue.payment_status,
                client_id: formValue.client?.id,
                checkout_date_init: formValue.checkout_date_init,
                checkout_date_end: formValue.checkout_date_end,
                page: this.paginator().pageIndex,
                limit: this.paginator().pageSize,
            }
            return this.ordersService.getOrders(queryParams).pipe(take(1))
        }),
    );

    public orders$ = merge(this.searchOrdersOnInit$, this.searchOrdersOnFormChange$).pipe(tap(() => this.loading.set(false)), shareReplay());

    openOrderForm(order?: IOrder) {
        this.router.navigate(['order', order?.id ?? 'new']).then();
    }

    clear(formControl: keyof IFilters) {
        this.formFilters.get(formControl).reset();
    }

}

interface IFilters {
    order_status: FormControl<OrderStatus>,
    payment_status: FormControl<PaymentStatus>,
    client: FormControl<IUser>,
    title: FormControl<string>,
    checkout_date_init: FormControl,
    checkout_date_end: FormControl,
}
