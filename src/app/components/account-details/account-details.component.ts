import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  user: any = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Trebuie să fii autentificat.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('http://localhost:8080/api/v1/demo-controller/users/single', { headers })
      .subscribe({
        next: (data) => {
          this.user = data;
        },
        error: () => {
          this.errorMessage = 'Eroare la preluarea datelor utilizatorului.';
        }
      });
  }
}
