import React, { Component, PropTypes } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import styles from './styles/Drawer';

class Drawer extends Component {
	constructor(props) {
		super(props);

		this._goToMovies = this._goToMovies.bind(this);
		this._goToMusic = this._goToMusic.bind(this);
		this._goToDance = this._goToDance.bind(this);
		this._openSearch = this._openSearch.bind(this);
	}

	_openSearch() {
		this._toggleDrawer();
		this.props.navigator.showModal({
			screen: 'vdokh.Search',
			title: 'Search'
		});
	}

	_goToMovies() {	
		this._toggleDrawer();
		this.props.navigator.push({
			screen: 'vdokh.MoviesList',
			title: 'Movies'
		});
	}
	_goToMusic() {	
		this._toggleDrawer();
		this.props.navigator.push({
			screen: 'vdokh.MoviesList',
			title: 'Music'
		});
	}
	_goToDance() {	
		this._toggleDrawer();
		this.props.navigator.push({
			screen: 'vdokh.MoviesList',
			title: 'Dance'
		});
	}

	_toggleDrawer() {
		this.props.navigator.toggleDrawer({
			to: 'closed',
			side: 'left',
			animated: true
		});
	}

	render() {
		const iconSearch = (<Icon name="md-search" size={26} color="#9F9F9F" style={[styles.drawerListIcon, { paddingLeft: 2 }]} />);
		const iconMovies = (<Icon name="md-film" size={26} color="#9F9F9F" style={[styles.drawerListIcon, { paddingLeft: 3 }]} />);
		const iconMusic = (<Icon name="md-headset" size={26} color="#9F9F9F" style={styles.drawerListIcon} />);
		const iconDance = (<Icon name="md-disc" size={26} color="#9F9F9F" style={styles.drawerListIcon} />);
		const iconTV = (<Icon name="ios-desktop" size={26} color="#9F9F9F" style={styles.drawerListIcon} />);
		return (
			<LinearGradient colors={['rgba(0, 0, 0, 0.7)', 'rgba(0,0,0, 0.9)', 'rgba(0,0,0, 1)']} style={styles.linearGradient}>
				<View style={styles.container}>
					<View style={styles.drawerList}>
						<TouchableOpacity onPress={this._openSearch}>
							<View style={styles.drawerListItem}>
								{iconSearch}
								<Text style={styles.drawerListItemText}>
									Search
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={this._goToMovies}>
							<View style={styles.drawerListItem}>
								{iconMovies}
								<Text style={styles.drawerListItemText}>
									Movies
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={this._goToMovies}>
							<View style={styles.drawerListItem}>
								{iconMusic}
								<Text style={styles.drawerListItemText}>
									Music
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={this._goToMovies}>
							<View style={styles.drawerListItem}>
								{iconDance}
								<Text style={styles.drawerListItemText}>
									Dance
								</Text>
							</View>
						</TouchableOpacity>						
					</View>
					<Text style={styles._version}>
						{/* 'v1.0.0' */}
					</Text>
				</View>
			</LinearGradient>
		);
	}
}

Drawer.propTypes = {
	navigator: PropTypes.object
};

export default Drawer;
