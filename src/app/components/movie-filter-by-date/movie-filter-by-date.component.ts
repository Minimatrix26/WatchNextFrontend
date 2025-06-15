import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-filter-by-date',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './movie-filter-by-date.component.html',
  styleUrls: ['./movie-filter-by-date.component.css']
})
export class MovieFilterByDateComponent {
  from: string = '';
  to: string = '';
  limit: number = 10;
  selectedSort: string = 'imdb-desc';
  movies: any[] = [];
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  filter(): void {
    const token = this.authService.getToken();
    if (!token || !this.from || !this.to) {
      this.errorMessage = 'Completează toate câmpurile.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = {
      limit: this.limit,
      from: this.from,
      to: this.to
    };

    this.http.get<any[]>('http://localhost:8080/api/v1/movies/query', { headers, params }).subscribe({
      next: (data) => {
        this.movies = this.applySort(data);
        this.errorMessage = null;

        this.movies.forEach((movie) => {
          this.http.get<{ posterPath: string }>(
            'http://localhost:8080/api/v1/movies/poster',
            {
              params: { title: movie.title },
              headers: headers
            }
          ).subscribe({
            next: (posterData) => movie.posterPath = posterData.posterPath,
            error: () => movie.posterPath = null
          });
        });
      },
      error: () => {
        this.errorMessage = 'Eroare la filtrare.';
        this.movies = [];
      }
    });
  }

  applySort(movies: any[]): any[] {
    switch (this.selectedSort) {
      case 'imdb-desc':
        return movies.sort((a, b) => b.imdbScore - a.imdbScore);
      case 'imdb-asc':
        return movies.sort((a, b) => a.imdbScore - b.imdbScore);
      case 'title-az':
        return movies.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-za':
        return movies.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return movies;
    }
  }
}
