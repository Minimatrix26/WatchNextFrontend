import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-category',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './movie-category.component.html',
  styleUrls: ['./movie-category.component.css']
})
export class MovieCategoryComponent implements OnInit {
  categories: any[] = [];
  selectedCategoryId: number | null = null;
  movies: any[] = [];
  errorMessage: string | null = null;
  page: number = 0;
  size: number = 12;
  totalPages: number = 0;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Autentificare necesară.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:8080/api/v1/categories', { headers }).subscribe({
      next: (data) => this.categories = data,
      error: () => this.errorMessage = 'Nu s-au putut încărca categoriile.'
    });
  }

  fetchMovies(page: number = 0): void {
    if (!this.selectedCategoryId) return;

    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams()
      .set('categoryId', this.selectedCategoryId)
      .set('page', page.toString())
      .set('size', this.size.toString());

    this.http.get<any>('http://localhost:8080/api/v1/movies/by-category', { headers, params }).subscribe({
      next: (response) => {
        this.movies = response.content;
        this.page = response.number;
        this.totalPages = response.totalPages;

        this.movies.forEach(movie => {
          this.http.get<{ posterPath: string }>('http://localhost:8080/api/v1/movies/poster', {
            headers,
            params: new HttpParams().set('title', movie.title)
          }).subscribe({
            next: data => movie.posterPath = data.posterPath,
            error: () => movie.posterPath = null
          });
        });
      },
      error: () => this.errorMessage = 'Eroare la încărcarea filmelor.'
    });
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.fetchMovies(this.page + 1);
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.fetchMovies(this.page - 1);
    }
  }
}