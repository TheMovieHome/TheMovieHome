import React, { useState } from 'react';
import './Catalog.css';

const MovieCatalog = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);

  // Dados fictícios de filmes
  const movies = [
    {
      id: 1,
      title: 'Vingadores: Ultimato',
      year: '2019',
      rating: 8.4,
      genre: 'Action',
      poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      description: 'Após os eventos devastadores de Vingadores: Guerra Infinita, o universo está em ruínas.'
    },
    {
      id: 2,
      title: 'Coringa',
      year: '2019',
      rating: 8.5,
      genre: 'Drama',
      poster: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
      description: 'Arthur Fleck é um homem que luta para encontrar seu lugar na sociedade.'
    },
    {
      id: 3,
      title: 'Spider-Man: Através do Aranhaverso',
      year: '2023',
      rating: 8.7,
      genre: 'Animation',
      poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
      description: 'Miles Morales volta a se reunir com Gwen Stacy em uma nova aventura.'
    },
    {
      id: 4,
      title: 'Oppenheimer',
      year: '2023',
      rating: 8.3,
      genre: 'Drama',
      poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      description: 'A história de J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.'
    },
    {
      id: 5,
      title: 'Barbie',
      year: '2023',
      rating: 6.9,
      genre: 'Comedy',
      poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
      description: 'Barbie e Ken vivem no colorido mundo da Barbieland.'
    },
    {
      id: 6,
      title: 'Duna',
      year: '2021',
      rating: 8.0,
      genre: 'Sci-Fi',
      poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
      description: 'Paul Atreides, jovem brilhante e talentoso, nasceu para um destino grandioso.'
    },
    {
      id: 7,
      title: 'Parasita',
      year: '2019',
      rating: 8.6,
      genre: 'Thriller',
      poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
      description: 'Toda a família de Ki-taek está desempregada, vivendo em um porão fedido.'
    },
    {
      id: 8,
      title: 'Interestelar',
      year: '2014',
      rating: 8.6,
      genre: 'Sci-Fi',
      poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      description: 'As reservas naturais da Terra estão chegando ao fim.'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'Action', name: 'Ação' },
    { id: 'Drama', name: 'Drama' },
    { id: 'Comedy', name: 'Comédia' },
    { id: 'Sci-Fi', name: 'Ficção Científica' },
    { id: 'Animation', name: 'Animação' },
    { id: 'Thriller', name: 'Thriller' }
  ];

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || movie.genre === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (movieId) => {
    setFavorites(prev =>
      prev.includes(movieId)
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  return (
    <div className="catalog-container">
      {/* Header */}
      <header className="catalog-header">
        <div className="header-content">
          <div className="logo">
            <h1>
            </h1>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar filmes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="user-menu">
            <span className="user-welcome">Olá, {user.name}!</span>
            <button onClick={onLogout} className="logout-btn">
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="categories-section">
        <div className="categories-container">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <main className="movies-section">
        <div className="movies-grid">
          {filteredMovies.map(movie => (
            <div key={movie.id} className="movie-card">
              <div className="movie-poster">
                <img src={movie.poster} alt={movie.title} />
                <div className="movie-overlay">
                  <button
                    onClick={() => toggleFavorite(movie.id)}
                    className={`favorite-btn ${favorites.includes(movie.id) ? 'active' : ''}`}
                  >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-details">
                  <span className="movie-year">{movie.year}</span>
                  <span className="movie-rating">⭐ {movie.rating}</span>
                </div>
                <p className="movie-description">{movie.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MovieCatalog;