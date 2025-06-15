import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent implements OnInit, OnDestroy {
  query: string = '';
  movies: any[] = [];
  errorMessage: string | null = null;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Acces neautorizat.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query.trim()) {
          this.movies = [];
          return [];
        }
        const searchUrl = 'http://localhost:8080/api/v1/movies/search-by-title?title=' + encodeURIComponent(query);
        return this.http.get<any[]>(searchUrl, { headers });
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.movies = data;
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
        this.movies = [];
        this.errorMessage = 'Eroare la căutare.';
      }
    });
  }

  onQueryChange(): void {
    this.searchSubject.next(this.query);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
