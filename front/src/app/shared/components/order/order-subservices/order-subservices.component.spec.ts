import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSubservicesComponent } from './order-subservices.component';

describe('OrderSubservicesComponent', () => {
  let component: OrderSubservicesComponent;
  let fixture: ComponentFixture<OrderSubservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSubservicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderSubservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
