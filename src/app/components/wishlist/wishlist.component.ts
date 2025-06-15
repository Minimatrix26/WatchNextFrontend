import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  movies: any[] = [];
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Trebuie să fii autentificat.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // 1. Obține filmele din wishlist
    this.http.get<any[]>('http://localhost:8080/api/v1/wishlist', { headers }).subscribe({
      next: (data) => {
        this.movies = data;

        // 2. Pentru fiecare film, obține posterPath
        this.movies.forEach((movie) => {
          this.http.get<{ posterPath: string }>(
            'http://localhost:8080/api/v1/movies/poster',
            {
              params: { title: movie.title },
              headers
            }
          ).subscribe({
            next: (posterData) => movie.posterPath = posterData.posterPath,
            error: () => movie.posterPath = null
          });
        });
      },
      error: () => this.errorMessage = 'Eroare la încărcarea wishlist-ului.'
    });
  }

  removeFromWishlist(movieId: number): void {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.delete(`http://localhost:8080/api/v1/wishlist/${movieId}`, {
    headers
  }).subscribe({
    next: () => this.movies = this.movies.filter(m => m.id !== movieId),
    error: () => alert('Nu s-a putut elimina filmul din favorite.')
  });
}

}
