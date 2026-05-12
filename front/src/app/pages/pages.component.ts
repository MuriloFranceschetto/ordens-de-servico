import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'app-pages',
    imports: [RouterModule, MatToolbarModule, MatButtonModule],
    templateUrl: './pages.component.html',
    styleUrl: './pages.component.scss'
})
export class PagesComponent {
  public authService = inject(AuthService)
}
