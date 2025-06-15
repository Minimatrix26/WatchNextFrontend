import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieFilterByDateComponent } from './movie-filter-by-date.component';

describe('MovieFilterByDateComponent', () => {
  let component: MovieFilterByDateComponent;
  let fixture: ComponentFixture<MovieFilterByDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieFilterByDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieFilterByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
