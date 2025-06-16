import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  firstname = '';
  lastname = '';
  email = '';
  password = '';
  role = 'USER'; // default
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.firstname || !this.lastname || !this.email || !this.password) {
      this.errorMessage = 'Toate câmpurile sunt obligatorii.';
      return;
    }

    const request = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/']); // Redirecționare după înregistrare
      },
      error: () => {
        this.errorMessage = 'Înregistrarea a eșuat. Încearcă din nou.';
      }
    });
  }
}
