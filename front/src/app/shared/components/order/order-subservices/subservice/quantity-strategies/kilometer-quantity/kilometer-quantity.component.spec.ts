import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KilometerQuantityComponent } from './kilometer-quantity.component';

describe('KilometerQuantityComponent', () => {
  let component: KilometerQuantityComponent;
  let fixture: ComponentFixture<KilometerQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KilometerQuantityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KilometerQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
