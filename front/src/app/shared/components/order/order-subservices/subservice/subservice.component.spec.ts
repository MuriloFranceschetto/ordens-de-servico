import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubserviceComponent } from './subservice.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SubserviceComponent', () => {
  let component: SubserviceComponent;
  let fixture: ComponentFixture<SubserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SubserviceComponent, BrowserAnimationsModule],
    providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
    ]
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
