import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesComponent } from './pages.component';
import { RouterModule, provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from '../app.routes';

describe('PagesComponent', () => {
  let component: PagesComponent;
  let fixture: ComponentFixture<PagesComponent>;

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        imports: [RouterModule, PagesComponent],
        providers: [
          provideRouter(routes, withComponentInputBinding()),
        ]
      })
      .compileComponents();

    fixture = TestBed.createComponent(PagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
