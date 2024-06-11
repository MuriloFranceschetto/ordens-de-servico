import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KilometerQuantityComponent } from './kilometer-quantity.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

describe('KilometerQuantityComponent', () => {
  let component: KilometerQuantityComponent;
  let fixture: ComponentFixture<KilometerQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KilometerQuantityComponent, BrowserAnimationsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(KilometerQuantityComponent);

    fixture.componentRef.setInput('quantity', signal<number>(10))

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
