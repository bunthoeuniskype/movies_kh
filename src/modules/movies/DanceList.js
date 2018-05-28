import React, { PropTypes, Component } from 'react';
import {
	Platform,
	View,
	ListView,
	RefreshControl
} from 'react-native';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { DANCE_PLAY_LIST_ITEM_U2 } from '../../constants/api';
import * as moviesActions from './movies.actions';
import CardThree from './components/CardThree';
import ProgressBar from '../_global/ProgressBar';
import styles from './styles/MoviesList';
import { iconsMap } from '../../utils/AppIcons';

class DanceList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			isRefreshing: false,
			currentPage: 1,
			list: {
				results: []
			}
		};

		this._viewMovie = this._viewMovie.bind(this);
		this._onRefresh = this._onRefresh.bind(this);
		this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
	}

	componentWillMount() {
		this._retrieveMoviesList();
	}

	_retrieveMoviesList(isRefreshed) {
		this.props.actions.retrieveMoviesList(this.props.type, this.state.currentPage,DANCE_PLAY_LIST_ITEM_U2)
			.then(() => {
				const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });				
				const dataSource = ds.cloneWithRows(this.props.list.items);
				const totalResults = this.props.list.pageInfo.totalResults;
  				const resultsPerPage = this.props.list.pageInfo.resultsPerPage;
  				const nextPageToken = this.props.list.nextPage;
  				// console.warn(JSON.stringify(this.props.list.items));
				this.setState({
					nextPageToken,
					totalResults,
					resultsPerPage,
					list: this.props.list.items,
					dataSource,
					isLoading: false
				});
			});
		if (isRefreshed && this.setState({ isRefreshing: false }));
	}

	_retrieveNextPage(type) {
		totalItem = this.state.currentPage*this.state.resultsPerPage;				
		if (totalItem < this.state.totalResults) {
			this.setState({
				currentPage: this.state.currentPage + 1
			});
		
			nextPage = '&pageToken='+this.state.nextPage;
			this.props.actions.retrieveMoviesList(this.props.type, 1,DANCE_PLAY_LIST_ITEM_U2,nextPage)
				.then(() => {
					const data = this.state.list.results;
					const newData = this.props.list.items;
					//console.warn(JSON.stringify(newData));
					const nextPage = this.props.list.nextPageToken;
					newData.map((item, index) => data.push(item));
					this.setState({
						nextPage,
						dataSource: this.state.dataSource.cloneWithRows(this.state.list.results)
					});
				});
			}
		}
	
	_viewMovie(movieId) {	
		this.props.navigator.showModal({
			screen: 'vdokh.Movie',
			passProps: {
				movieId
			},
			backButtonHidden: true,
			navigatorButtons: {
				rightButtons: [
					{
						id: 'close',
						icon: iconsMap['ios-arrow-round-down']
					}
				]
			}
		});
	}

	_onRefresh() {
		this.setState({ isRefreshing: true });
		this._retrieveMoviesList('isRefreshed');
	}

	_onNavigatorEvent(event) {
		if (event.type === 'NavBarButtonPress') {
			if (event.id === 'close') {
				this.props.navigator.dismissModal();
			}
		}
	}

	render() {
	
		return (
			this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
			<ListView
				style={styles.container}
				enableEmptySections			
				onEndReached={type => this._retrieveNextPage(this.props.type)}	
				onEndReachedThreshold={1200}
				dataSource={this.state.dataSource}
				renderRow={rowData => <CardThree info={rowData} type="playlistItems" viewMovie={this._viewMovie} />}
				renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
				renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
				refreshControl={
					<RefreshControl
						refreshing={this.state.isRefreshing}
						onRefresh={this._onRefresh}
						colors={['#EA0000']}
						tintColor="white"
						title="loading..."
						titleColor="white"
						progressBackgroundColor="white"
					/>
				}
			/>
		);
	}
}

DanceList.propTypes = {
	actions: PropTypes.object.isRequired,
	list: PropTypes.object.isRequired,
	//type: PropTypes.string.isRequired,
	navigator: PropTypes.object
};

let navigatorStyle = {};

if (Platform.OS === 'ios') {
	navigatorStyle = {
		navBarTranslucent: true,
		drawUnderNavBar: true
	};
} else {
	navigatorStyle = {
		navBarBackgroundColor: '#0a0a0a'
	};
}

DanceList.navigatorStyle = {
	...navigatorStyle,
	statusBarColor: 'black',
	statusBarTextColorScheme: 'light',
	navBarTextColor: 'white',
	navBarButtonColor: 'white'
};

function mapStateToProps(state, ownProps) {
	return {
		list: state.movies.list
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(moviesActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(DanceList);
