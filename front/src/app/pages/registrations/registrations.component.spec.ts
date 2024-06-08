import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationsComponent } from './registrations.component';
import { RouterModule, provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from '../../app.routes';

describe('RegistrationsComponent', () => {
  let component: RegistrationsComponent;
  let fixture: ComponentFixture<RegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationsComponent, RouterModule],
      providers: [
        provideRouter(routes, withComponentInputBinding()),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
