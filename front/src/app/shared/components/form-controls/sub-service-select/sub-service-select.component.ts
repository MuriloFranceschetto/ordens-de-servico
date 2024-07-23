import { Subject, debounceTime, distinctUntilChanged, switchMap, take, takeUntil } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { UtilsService } from '../../../services/utils.service';
import { SubservicesService } from '../../../services/subservices.service';
import { SubserviceComponent } from '../../subservice/subservice.component';
import { SearchSelectOptionComponent } from '../search-select-option/search-select-option.component';
import { ISubservice } from '../../../models/subservice/ISubservice';

@Component({
  selector: 'app-sub-service-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule, SearchSelectOptionComponent],
  templateUrl: './sub-service-select.component.html',
  styleUrl: './sub-service-select.component.scss'
})
export class SubServiceSelectComponent implements OnInit, OnDestroy {

  // ----- INPUTS ----------
  public readonly formGroup = input.required<FormGroup<any>>();
  public readonly formControlName = input.required<string>();
  public readonly subscriptSizing = input<'dynamic' | 'fixed'>();
  public readonly showCreationBtn = input<boolean>(true);

  // ----- INJECTIONS ------
  private readonly subserviceService = inject(SubservicesService);
  private readonly utilsService = inject(UtilsService);
  private readonly dialog = inject(MatDialog);

  // -----------------------
  public readonly FN_COMPARE_WITH_SUBSERVICES = this.subserviceService.FN_COMPARE_WITH_SUBSERVICES;

  public currentValueForm = signal<ISubservice>(null);

  public searchControl = new FormControl(null);
  private searchFormValue = toSignal(this.searchControl.valueChanges.pipe(takeUntilDestroyed(), distinctUntilChanged(), debounceTime(500)));

  // Para buscar os usuários novamente emitir este evento
  private readonly triggerSubservicesRequest$ = new Subject<void>();

  private readonly subservicesFullList = toSignal(this.triggerSubservicesRequest$.pipe(takeUntilDestroyed(), switchMap(() => this.subserviceService.subservices$)));

  public filteredSubservices = computed(() => {
    let subservices = this.subservicesFullList();
    if (!subservices) return [];

    if (!this.searchFormValue()) {
      return subservices.slice(0, 30);
    } else {
      return subservices.filter(user => {
        return this.utilsService.normalize(user.name)
          .includes(this.utilsService.normalize(this.searchFormValue()))
      })
    }
  });

  ngOnInit(): void {
    this.triggerSubservicesRequest$.next();
    this.formGroup()
      .get(this.formControlName())
      .valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => this.currentValueForm.set(value))
  }

  public newSubservice() {
    let dialogRef = this.dialog.open(SubserviceComponent, {
      autoFocus: false,
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        this.triggerSubservicesRequest$.next();
      });
  }


  private destroyed$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
