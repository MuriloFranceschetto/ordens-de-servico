import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubserviceComponent } from './subservice.component';

describe('SubserviceComponent', () => {
  let component: SubserviceComponent;
  let fixture: ComponentFixture<SubserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubserviceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
