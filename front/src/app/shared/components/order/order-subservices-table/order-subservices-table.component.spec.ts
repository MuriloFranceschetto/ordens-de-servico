import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSubservicesComponent } from './order-subservices-table.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Order } from '../../../models/order/Order';

describe('OrderSubservicesComponent', () => {

  let component: OrderSubservicesComponent;
  let fixture: ComponentFixture<OrderSubservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSubservicesComponent],
      providers: [provideHttpClient(withInterceptorsFromDi())]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrderSubservicesComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('order', new Order());
    fixture.componentRef.setInput('subservices$', []);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
