import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourQuantityComponent } from './hour-quantity.component';
import { signal } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HourQuantityComponent', () => {
  let component: HourQuantityComponent;
  let fixture: ComponentFixture<HourQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HourQuantityComponent, BrowserAnimationsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HourQuantityComponent);

    fixture.componentRef.setInput('quantity', signal<number>(10))

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
