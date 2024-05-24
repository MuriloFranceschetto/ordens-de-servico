import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSubserviceFieldsComponent } from './order-subservice-fields.component';

describe('OrderSubserviceFieldsComponent', () => {
  let component: OrderSubserviceFieldsComponent;
  let fixture: ComponentFixture<OrderSubserviceFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSubserviceFieldsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderSubserviceFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
