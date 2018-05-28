/* eslint-disable import/prefer-default-export */
import { Navigation } from 'react-native-navigation';

import Drawer from './modules/_global/Drawer';
import Movies from './modules/movies/Movies';
import MoviesList from './modules/movies/MoviesList';
import MusicList from './modules/movies/MusicList';
import DanceList from './modules/movies/DanceList';
import Movie from './modules/movies/Movie';
import Search from './modules/movies/Search';

export function registerScreens(store, Provider) {
	Navigation.registerComponent('vdokh.Movie', () => Movie, store, Provider);
	Navigation.registerComponent('vdokh.Movies', () => Movies, store, Provider);
	Navigation.registerComponent('vdokh.MoviesList', () => MoviesList, store, Provider);
	Navigation.registerComponent('vdokh.DanceList', () => DanceList, store, Provider);
	Navigation.registerComponent('vdokh.MusicList', () => MusicList, store, Provider);
	Navigation.registerComponent('vdokh.Search', () => Search, store, Provider);
	Navigation.registerComponent('vdokh.Drawer', () => Drawer);
}
