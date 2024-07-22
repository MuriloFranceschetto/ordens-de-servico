import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  host: {
    'class': 'w-full h-svh flex justify-center items-center'
  }
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  public loading = signal<boolean>(false);

  public form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required),
  });

  login() {
    let { email, password } = this.form.getRawValue();
    this.authService.login(email, password)
      .pipe(
        tap(() => this.loading.set(true))
      )
      .subscribe({
        next: ({ access_token }) => {
          this.authService.setTokenToLocalStorage(access_token);
          this.router.navigate(['']);
        },
        error: (e) => {
          this.snackBar.open(`Login não é válido: ${e?.error?.message || ''}`, 'X');
          this.loading.set(false)
        }
      })
  }

}
