import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/app-shell/app-shell.component').then(m => m.AppShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/movie-list/movie-list.component').then(m => m.MovieListComponent)
      },
      {
        path: 'recommendations',
        loadComponent: () => import('./components/recommendations/recommendations.component').then(m => m.RecommendationsComponent)
      },
      {
        path: 'movies/:id',
        loadComponent: () => import('./components/movie-details/movie-details.component').then(m => m.MovieDetailsComponent)
      },
      {
        path: 'search',
        loadComponent: () => import('./components/movie-search/movie-search.component').then(m => m.MovieSearchComponent)
      },
      {
        path: 'filter',
        loadComponent: () => import('./components/movie-filter-by-date/movie-filter-by-date.component').then(m => m.MovieFilterByDateComponent)
      },
      {
        path: 'account',
        loadComponent: () => import('./components/account-details/account-details.component').then(m => m.AccountDetailsComponent)
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent)
      }

    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent)
  },

  {
    path: '**',
    redirectTo: ''
  }
];
