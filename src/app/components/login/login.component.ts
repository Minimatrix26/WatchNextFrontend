import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthenticationRequest } from '../../models/authentication-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: AuthenticationRequest = {
    email: '',
    password: ''
  };

  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.form).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage = 'Email sau parolă incorecte!';
      }
    });
  }
}
