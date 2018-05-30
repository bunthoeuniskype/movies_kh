import axios from 'axios';
import * as types from '../../constants/actionTypes';
import { LATEST_PLAY_LIST_ITEM_U2,POPULAR_PLAY_LIST_ITEM_U2,TMDB_URL, TMDB_API_KEY,VIDEO_LOCATION_U2, YOUTUBE_API_KEY, YOUTUBE_URL  } from '../../constants/api';



// GENRES
export function retrieveMoviesGenresSuccess(res) {
	return {
		type: types.RETRIEVE_MOVIES_GENRES_SUCCESS,
		moviesGenres: res.data
	};
}

export function retrieveMoviesGenres() {
	return function (dispatch) {
		return axios.get(`${TMDB_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`)
		.then(res => {
			dispatch(retrieveMoviesGenresSuccess(res));
		})
		.catch(error => {
			console.log(error); //eslint-disable-line
		});
	};
}

// POPULAR
export function retrievePopularMoviesSuccess(res) {	
	return {
		type: types.RETRIEVE_POPULAR_MOVIES_SUCCESS,
		popularMovies: res.data
	};
}

export function retrievePopularMovies(getResult=10,nextPage='') {
	return function (dispatch) {
		return axios.get(`${YOUTUBE_URL}playlistItems?part=snippet,contentDetails&playlistId=${POPULAR_PLAY_LIST_ITEM_U2}&key=${YOUTUBE_API_KEY}&maxResults=${getResult}${nextPage}`)
		.then(res => {
			dispatch(retrievePopularMoviesSuccess(res));
		})
		.catch(error => {
			console.log('Popular', error); //eslint-disable-line
		});
	};
}

// NOW PLAYING
export function retrieveNowPlayingMoviesSuccess(res) {	
	return {
		type: types.RETRIEVE_NOWPLAYING_MOVIES_SUCCESS,
		nowPlayingMovies: res.data
	};
}

export function retrieveNowPlayingMovies(query='khmer Movies') {
	return function (dispatch) {
		//return axios.get(`${YOUTUBE_URL}search?key=${YOUTUBE_API_KEY}&q=${query}&part=snippet&order=viewCount&maxResults=3&type=video&videoDefinition=high`)
		return axios.get(`${YOUTUBE_URL}playlistItems?part=snippet,contentDetails&playlistId=${LATEST_PLAY_LIST_ITEM_U2}&key=${YOUTUBE_API_KEY}`)
		.then(res => {
			dispatch(retrieveNowPlayingMoviesSuccess(res));
		})
		.catch(error => {
			console.warn('Now Playing', error); //eslint-disable-line
		});
	};
}

// MOVIES LIST
export function retrieveMoviesListSuccess(res) {
	return {
		type: types.RETRIEVE_MOVIES_LIST_SUCCESS,
		list: res.data
	};
}

//VIDEO RELATED
export function retrieveVideoRelated(type='video', page,relatedToVideoId='',nextPage='') {
	//console.warn(nextPage);	
	getResult = page*5;
	return function (dispatch) {
		return axios.get(`${YOUTUBE_URL}search?part=snippet&order=viewCount&type=${type}&relatedToVideoId=${relatedToVideoId}&key=${YOUTUBE_API_KEY}&maxResults=${getResult}${nextPage}`)
		.then(res => {
			dispatch(retrieveMoviesListSuccess(res));			
		})
		.catch(error => {
			console.warn('VIDEO RELATED', error); //eslint-disable-line
		});
	};
}

export function retrieveMoviesList(type, page,playlistId='',nextPage='') {
	getResult = page*5;
	return function (dispatch) {
		return axios.get(`${YOUTUBE_URL}playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}&maxResults=${getResult}${nextPage}`)
		.then(res => {
			dispatch(retrieveMoviesListSuccess(res));
		})
		.catch(error => {
			console.warn('Movies List', error); //eslint-disable-line
		});
	};
}

// SEARCH RESULTS
export function retrieveMoviesSearchResultsSuccess(res) {		
	return {
		type: types.RETRIEVE_MOVIES_SEARCH_RESULT_SUCCESS,
		searchResults: res.data
	};
}

export function retrieveMoviesSearchResults(query, page,nextPage='') {
	let getResult = page * 5;
	return function (dispatch) {
		return axios.get(`${YOUTUBE_URL}search?key=${YOUTUBE_API_KEY}&q=${query}&part=snippet&order=viewCount&maxResults=${getResult}&type=video${nextPage}`)
		.then(res => {			
			dispatch(retrieveMoviesSearchResultsSuccess(res));
		})
		.catch(error => {
			console.log('Movies Search Results', error); //eslint-disable-line
		});
	};
}

// MOVIE DETAILS
export function retrieveMovieDetailsSuccess(res) {
	return {
		type: types.RETRIEVE_MOVIE_DETAILS_SUCCESS,
		details: res.data.items[0]
	};
}

export function retrieveMovieDetails(movieId) {
	return function (dispatch) {
		return axios.get(`${YOUTUBE_URL}videos?id=${movieId}&key=${YOUTUBE_API_KEY}&part=snippet`)
		.then(res => {
			dispatch(retrieveMovieDetailsSuccess(res));
		})
		.catch(error => {
			console.log('Movie Details', error); //eslint-disable-line
		});
	};
}
