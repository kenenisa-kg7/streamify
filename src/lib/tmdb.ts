import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
export const IMAGE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL;

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

// Movies
export const getTrendingMovies = () => tmdb.get("/trending/movie/week");
export const getPopularMovies = () => tmdb.get("/movie/popular");
export const getTopRatedMovies = () => tmdb.get("/movie/top_rated");
export const getUpcomingMovies = () => tmdb.get("/movie/upcoming");
export const getMovieDetails = (id: number) => tmdb.get(`/movie/${id}`);
export const getMovieVideos = (id: number) => tmdb.get(`/movie/${id}/videos`);
export const getMovieCredits = (id: number) => tmdb.get(`/movie/${id}/credits`);
export const getSimilarMovies = (id: number) => tmdb.get(`/movie/${id}/similar`);
export const searchMovies = (query: string) => tmdb.get("/search/movie", { params: { query } });

// TV Shows
export const getTrendingTV = () => tmdb.get("/trending/tv/week");
export const getPopularTV = () => tmdb.get("/tv/popular");
export const getTopRatedTV = () => tmdb.get("/tv/top_rated");
export const getTVDetails = (id: number) => tmdb.get(`/tv/${id}`);

// Genres
export const getMovieGenres = () => tmdb.get("/genre/movie/list");
export const getMoviesByGenre = (genreId: number) =>
  tmdb.get("/discover/movie", { params: { with_genres: genreId } });

export default tmdb;