import React, { PropTypes, Component } from 'react';
import {
	View,
	ListView,
	TextInput,
	RefreshControl
} from 'react-native';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { YOUTUBE_API_KEY, YOUTUBE_URL } from '../../constants/api';
import * as moviesActions from './movies.actions';
import CardThree from './components/CardThree';
import styles from './styles/Search';
import { iconsMap } from '../../utils/AppIcons';
import ProgressBar from '../_global/ProgressBar';

class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			currentPage: 1,
			searchResults:[],
			isRefreshing: false,
			query: null
		};

		this._viewMovie = this._viewMovie.bind(this);
		this._handleTextInput = this._handleTextInput.bind(this);
		this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
	}

	_handleTextInput(event) {

		const query = event.nativeEvent.text;
		this.setState({ query });
		if (!query) this.setState({ query: '' });
		
		setTimeout(() => {
			if (query.length) {
				this.props.actions.retrieveMoviesSearchResults(this.state.query, 1)
				.then(() => {
					const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });				
					const dataSource = ds.cloneWithRows(this.props.searchResults.items);
					const totalResults = this.props.searchResults.pageInfo.totalResults;
					const resultsPerPage = this.props.searchResults.pageInfo.resultsPerPage; 	
					const nextPage = this.props.searchResults.nextPageToken;							
					this.setState({
						nextPage,
						dataSource,
						searchResults:this.props.searchResults.items,
						totalResults,
						resultsPerPage,
						isLoading: false,
						isRefreshing: false
					});
				});
			}
		}, 500);
	}

	_retrieveNextPage() {		
		
		totalItem = this.state.currentPage*this.state.resultsPerPage;				
		if (totalItem < this.state.totalResults) {
			this.setState({
				currentPage: this.state.currentPage + 1
			});		
			nextPage = '&pageToken='+this.state.nextPage;
			this.props.actions.retrieveMoviesSearchResults(this.state.query, 1,nextPage)
				.then(() => {
					const data = this.state.searchResults;
					const newData = this.props.searchResults.items;
					const nextPage = this.props.searchResults.nextPageToken;					
					newData.map((item, index) => data.push(item));
					this.setState({
						nextPage,
						dataSource: this.state.dataSource.cloneWithRows(this.state.searchResults),
						isRefreshing: false,
					});
				});
		}
	}

	_viewMovie(movieId) {
		this.props.navigator.push({
			screen: 'vdokh.Movie',
			passProps: {
				movieId
			},
			backButtonHidden: true,
			navigatorButtons: {
				rightButtons: [
					{
						id: 'close',
						icon: iconsMap['ios-remove-circle-outline']
					}
				]
			}
		});
	}

	_onNavigatorEvent(event) {
		if (event.type === 'NavBarButtonPress') {
			if (event.id === 'close') {
				this.props.navigator.dismissModal();
			}
		}
	}

	_renderListView() {	
		let listView;
		if (this.state.query) {
			listView = (
				<ListView
					onEndReached={type => this._retrieveNextPage()}
					enableEmptySections					
					onEndReachedThreshold={1200}
					dataSource={this.state.dataSource}
					renderRow={rowData => <CardThree info={rowData} type="search" viewMovie={this._viewMovie} />}
					renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
					renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
				/>
			);
		} else {
			listView = <View />;
		}

		return listView;
	}

	render() {	
		return (
			<View style={styles.container}>
				<View style={styles.searchbox}>
					<View style={styles.searchboxBorder}>
						<TextInput
							style={styles.textInput}
							autoFocus
							returnKeyType={'search'}
							value={this.state.query}
							onChange={this._handleTextInput}
							underlineColorAndroid="transparent"
						/>
					</View>
				</View>
				{ !this.state.isLoading && this._renderListView() }
			</View>

		);
	}
}

Search.propTypes = {
	actions: PropTypes.object.isRequired,
	searchResults: PropTypes.object.isRequired,
	navigator: PropTypes.object
};

Search.navigatorStyle = {
	statusBarColor: 'black',
	statusBarTextColorScheme: 'light',
	navBarBackgroundColor: '#0a0a0a',
	navBarTextColor: 'white',
	navBarButtonColor: 'white'
};

function mapStateToProps(state, ownProps) {
	return {
		searchResults: state.movies.searchResults
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(moviesActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
