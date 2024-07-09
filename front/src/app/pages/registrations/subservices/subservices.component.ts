import { BehaviorSubject, shareReplay, switchMap, take, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Component, inject, signal, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ISubservice } from '../../../shared/models/subservice/ISubservice';
import { SubservicesService } from '../../../shared/services/subservices.service';
import { SubserviceComponent } from '../../../shared/components/subservice/subservice.component';
import { SubserviceChargeTypeLabelPipe } from '../../../shared/pipes/subservice-charge-type-label.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const MATERIAL_MODULES = [MatTableModule, MatButtonModule, MatDialogModule, MatIconModule, MatPaginatorModule, MatProgressBarModule]

@Component({
  selector: 'app-subservices',
  standalone: true,
  imports: [...MATERIAL_MODULES, AsyncPipe, RouterLink, SubserviceChargeTypeLabelPipe, NgClass, CurrencyPipe],
  templateUrl: './subservices.component.html',
  styleUrl: './subservices.component.scss'
})
export class SubservicesComponent {

  private readonly subservicesService = inject(SubservicesService);
  private readonly dialog = inject(MatDialog);
  public readonly columns = ['name', 'charged_per', 'price', 'actions'];

  public readonly loading = signal<boolean>(true);
  public readonly paginator = viewChild.required(MatPaginator);

  public readonly searchUsersTrigger$ = new BehaviorSubject<void>(null);

  public readonly subservices$ = this.searchUsersTrigger$
    .pipe(
      takeUntilDestroyed(),
      tap(() => this.loading.set(true)),
      switchMap(() => {
        const { pageIndex, pageSize } = this.paginator();
        return this.subservicesService.getAllSubservices(pageIndex, pageSize).pipe(take(1));
      }),
      tap(() => this.loading.set(false)),
      shareReplay(),
    );

  async openSubserviceForm(subservice?: ISubservice) {
    this.dialog.open<SubserviceComponent, ISubservice, boolean>(SubserviceComponent, { data: subservice })
      .afterClosed().subscribe((updateList) => {
        if (!updateList) return;
        this.searchUsersTrigger$.next();
      });
  }

}
