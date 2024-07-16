import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnityQuantityComponent } from './unity-quantity.component';

describe('UnityQuantityComponent', () => {
  let component: UnityQuantityComponent;
  let fixture: ComponentFixture<UnityQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnityQuantityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnityQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
