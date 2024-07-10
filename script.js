const API_KEY = '6d178e926c57ab78bbb1c09c6e4471ea';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let genres = [];

async function fetchGenres() {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    genres = data.genres;
}

async function fetchMovies(endpoint) {
    const response = await fetch(`${BASE_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    return data.results;
}

function getGenreNames(genreIds) {
    return genreIds
        .map(id => genres.find(genre => genre.id === id)?.name)
        .filter(name => name)
        .join(', ');
}

function createMovieTile(movie) {
    const tile = document.createElement('div');
    tile.className = 'movie-tile';

    const img = document.createElement('img');
    img.src = IMAGE_BASE_URL + movie.poster_path;
    img.alt = movie.title;

    const info = document.createElement('div');
    info.className = 'movie-info';
    
    const title = document.createElement('h3');
    title.textContent = movie.title;

    const year = document.createElement('p');
    year.textContent = `Released: ${movie.release_date.split('-')[0]}`;

    const description = document.createElement('p');
    description.textContent = movie.overview;

    const genre = document.createElement('p');
    genre.textContent = `Genres: ${getGenreNames(movie.genre_ids)}`;

    info.appendChild(title);
    info.appendChild(year);
    info.appendChild(description);
    info.appendChild(genre);

    tile.appendChild(img);
    tile.appendChild(info);

    return tile;
}

async function loadMovies() {
    await fetchGenres(); // Fetch genres before loading movies

    const popularMovies = await fetchMovies('movie/popular');
    const topRatedMovies = await fetchMovies('movie/top_rated');
    const upcomingMovies = await fetchMovies('movie/upcoming');

    const popularContainer = document.getElementById('popular-movies');
    const topRatedContainer = document.getElementById('top-rated-movies');
    const upcomingContainer = document.getElementById('upcoming-movies');

    popularMovies.forEach(movie => popularContainer.appendChild(createMovieTile(movie)));
    topRatedMovies.forEach(movie => topRatedContainer.appendChild(createMovieTile(movie)));
    upcomingMovies.forEach(movie => upcomingContainer.appendChild(createMovieTile(movie)));
}

loadMovies();
