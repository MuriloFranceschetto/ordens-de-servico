import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourQuantityComponent } from './hour-quantity.component';

describe('HourQuantityComponent', () => {
  let component: HourQuantityComponent;
  let fixture: ComponentFixture<HourQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HourQuantityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HourQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
