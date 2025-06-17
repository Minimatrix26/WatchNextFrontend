import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent {
  title: string = '';
  count: number = 5;
  recommendations: any[] = [];
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  fetchRecommendations(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Trebuie să fii autentificat.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(
      `http://localhost:8080/api/v1/recommendations/by-title?title=${this.title}&count=${this.count}`,
      { headers }
    ).subscribe({
      next: (data) => {
        this.recommendations = data;
        this.errorMessage = null;

        // Afișăm posterele
        this.recommendations.forEach(movie => {
          const params = new HttpParams().set('title', movie.title);
          this.http.get<{ posterPath: string }>('http://localhost:8080/api/v1/movies/poster', {
            headers,
            params
          }).subscribe({
            next: res => movie.posterPath = res.posterPath,
            error: () => movie.posterPath = null
          });
        });
      },
      error: () => {
        this.errorMessage = 'Eroare la generarea recomandărilor.';
        this.recommendations = [];
      }
    });
  }
}
