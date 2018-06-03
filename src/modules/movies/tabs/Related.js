import React, { PropTypes } from 'react';
import {
	Platform,
	Text,
	View,
	Image,
	ListView,
	TouchableOpacity,
	RefreshControl,
} from 'react-native';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CardThree from '../components/CardThree';
import ProgressBar from '../../_global/ProgressBar';
import styles from '../styles/MoviesList';
import * as moviesActions from '../movies.actions';
import { iconsMap } from '../../../utils/AppIcons';

class Related extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			isRefreshing: false,
			currentPage: 1,
			list: []
		};

		this._viewMovie = this._viewMovie.bind(this);
		this._onRefresh = this._onRefresh.bind(this);
		this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
	}

	componentWillMount() {
		this._getVideoRelated();
	}

	_getVideoRelated(){
		this.props.actions.retrieveVideoRelated('video', this.state.currentPage,this.props.movieId)
			.then(() => {
				const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });				
				const dataSource = ds.cloneWithRows(this.props.list.items);
				const totalResults = this.props.list.pageInfo.totalResults;
  				const resultsPerPage = this.props.list.pageInfo.resultsPerPage;
  				const nextPage = this.props.list.nextPageToken;  			
  				// console.warn(JSON.stringify(this.props.list.items));
				this.setState({
					nextPage,
					totalResults,
					resultsPerPage,
					list: this.props.list.items,
					dataSource,
					isLoading: false
				});
			});
		}

	_getRelatedNextPage(type) {
		
		totalItem = this.state.currentPage*this.state.resultsPerPage;				
		if (totalItem < this.state.totalResults) {
			this.setState({
				currentPage: this.state.currentPage + 1
			});

			nextPage = '&pageToken='+this.state.nextPage;
			this.props.actions.retrieveVideoRelated(type, 1,this.props.movieId,nextPage)
				.then(() => {
					const data = this.state.list;
					const newData = this.props.list.items;
					// console.warn(JSON.stringify(newData));
					const nextPage = this.props.list.nextPageToken;
					newData.map((item, index) => data.push(item));
					this.setState({
						nextPage,
						dataSource: this.state.dataSource.cloneWithRows(this.state.list)
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
						icon: iconsMap['ios-remove-circle-outline']
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

	_viewRender(){
		let listview;
		listview = (
			this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
			<ListView
				style={styles.container}
				enableEmptySections			
				onEndReached={ () => this._getRelatedNextPage('video')}	
				onEndReachedThreshold={1200}
				dataSource={this.state.dataSource}
				renderRow={rowData => <CardThree info={rowData} type="search" viewMovie={this._viewMovie} />}
				renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}				
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
		return listview;	
	}

	render(){		
		return (
			<View>
				{this._viewRender()}				
			</View>
		);
	}	
};

Related.navigatorStyle = {
	navBarTransparent: true,
	drawUnderNavBar: true,
	navBarTranslucent: true,
	statusBarHidden: true,
	navBarTextColor: 'white',
	navBarButtonColor: 'white'
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

Related.propTypes = {
	navigator: PropTypes.object,
	movieId: PropTypes.string.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(Related);