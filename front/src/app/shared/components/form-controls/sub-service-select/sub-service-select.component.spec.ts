import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubServiceSelectComponent } from './sub-service-select.component';

describe('SubServiceSelectComponent', () => {
  let component: SubServiceSelectComponent;
  let fixture: ComponentFixture<SubServiceSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubServiceSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubServiceSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
