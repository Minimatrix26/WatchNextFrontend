import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Trebuie să fii autentificat pentru a vedea filmele.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // 1. Obținem filmele din backend
    this.http.get<any[]>('http://localhost:8080/api/v1/movies', { headers }).subscribe({
      next: (data) => {
        this.movies = data;

        // 2. Pentru fiecare film, cerem posterul TMDB
        this.movies.forEach((movie) => {
          this.http.get<{ posterPath: string }>(
            'http://localhost:8080/api/v1/movies/poster',
            {
    params: { title: movie.title },
    headers: headers  // Include JWT
  }
          ).subscribe({
            next: (posterData) => {
              movie.posterPath = posterData.posterPath;
            },
            error: () => {
              movie.posterPath = null; // fallback
            }
          });
        });
      },
      error: () => {
        this.errorMessage = 'Eroare la preluarea filmelor. Verifică autentificarea.';
      }
    });
  }
}
