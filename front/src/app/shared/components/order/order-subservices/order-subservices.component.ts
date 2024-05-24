import { AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, WritableSignal, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { SubserviceOrder } from '../../../models/order/SubserviceOrder';
import { SubservicesService } from '../../../services/subservices.service';
import { OrderSubserviceFieldsComponent } from '../order-subservice-fields/order-subservice-fields.component';
import { MatTooltipModule } from '@angular/material/tooltip';

const MATERIAL_MODULES = [
  MatIconModule, MatButtonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatTooltipModule
];

@Component({
  selector: 'app-order-subservices',
  standalone: true,
  imports: [AsyncPipe, FormsModule, OrderSubserviceFieldsComponent, ...MATERIAL_MODULES],
  templateUrl: './order-subservices.component.html',
  styleUrl: './order-subservices.component.scss'
})
export class OrderSubservicesComponent {

  private readonly subservicesService: SubservicesService = inject(SubservicesService);
  public readonly FN_COMPARE_WITH_SUBSERVICES = this.subservicesService.FN_COMPARE_WITH_SUBSERVICES;

  public subservices$ = this.subservicesService.subservices$;
  public orderSubservices$: WritableSignal<SubserviceOrder[]> = signal([]);

  addNewSubservice() {
    this.orderSubservices$().push(new SubserviceOrder());
  }

  removeSubservice(i: number) {
    this.orderSubservices$().splice(i, 1);
  }

}
