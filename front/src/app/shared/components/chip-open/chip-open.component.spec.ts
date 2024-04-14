import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipOpenComponent } from './chip-open.component';

describe('ChipOpenComponent', () => {
  let component: ChipOpenComponent;
  let fixture: ComponentFixture<ChipOpenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipOpenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChipOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
