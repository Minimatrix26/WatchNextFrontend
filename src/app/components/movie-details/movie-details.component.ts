import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie: any = null;
  errorMessage: string | null = null;

  reviews: any[] = [];
  newReviewContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const token = this.authService.getToken();

    if (!token || !id) {
      this.errorMessage = 'Acces neautorizat sau id invalid.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Obține detalii film
    this.http.get<any>(`http://localhost:8080/api/v1/movies/${id}`, { headers }).subscribe({
      next: (data) => {
        this.movie = data;

        this.http.get<{ posterPath: string }>(
          'http://localhost:8080/api/v1/movies/poster',
          { params: { title: this.movie.title }, headers }
        ).subscribe({
          next: (posterData) => this.movie.posterPath = posterData.posterPath,
          error: () => this.movie.posterPath = null
        });

        // Încarcă recenzii
        this.loadReviews(id, headers);
      },
      error: () => this.errorMessage = 'Eroare la încărcarea detaliilor filmului.'
    });
  }

  addToWishlist(): void {
    const token = this.authService.getToken();
    if (!token || !this.movie?.id) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post('http://localhost:8080/api/v1/wishlist', { movieId: this.movie.id }, { headers })
      .subscribe({
        next: () => alert('Adăugat la favorite!'),
        error: () => alert('Eroare la adăugare în wishlist.')
      });
  }

  loadReviews(movieId: string, headers: HttpHeaders): void {
    this.http.get<any[]>(`http://localhost:8080/api/v1/reviews/${movieId}`, { headers }).subscribe({
      next: (data) => this.reviews = data,
      error: () => this.reviews = []
    });
  }

  submitReview(): void {
    const token = this.authService.getToken();
    if (!token || !this.newReviewContent.trim() || !this.movie?.id) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('http://localhost:8080/api/v1/reviews', {
      movieId: this.movie.id,
      text: this.newReviewContent
    }, { headers }).subscribe({
      next: () => {
        this.newReviewContent = '';
        this.loadReviews(this.movie.id.toString(), headers);
      },
      error: () => alert('Eroare la adăugarea recenziei.')
    });
  }
}
