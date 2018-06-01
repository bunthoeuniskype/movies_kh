import React, { Component, PropTypes } from 'react';
import {
	Image,
	Linking,
	RefreshControl,
	ScrollView,
	Text,
	ListView,
	ToastAndroid,
	View, WebView, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as moviesActions from './movies.actions';
import Casts from './tabs/Casts';
import DefaultTabBar from '../_global/scrollableTabView/DefaultTabBar';
import Info from './tabs/Info';
import ProgressBar from '../_global/ProgressBar';
import Related from './tabs/Related';
import styles from './styles/Movie';
import CardOne from './components/CardOne';
import VideoPlayer from 'react-native-video-player';
import { TMDB_IMG_URL, YOUTUBE_API_KEY, YOUTUBE_URL } from '../../constants/api';

class Movie extends Component {
	constructor(props) {
		super(props);

		this.state = {
			castsTabHeight: null,
			heightAnim: null,
			infoTabHeight: null,
			isLoading: true,
			isRefreshing: false,
			showSimilarMovies: true,
			trailersTabHeight: null,
			tab: 0,
			youtubeVideos: [],
			currentPage:1,
			list: {
				results: []
			},
			video: { width: undefined, height: undefined, duration: undefined },
		    thumbnailUrl: undefined,
		    videoUrl: undefined,
		};

		this._getTabHeight = this._getTabHeight.bind(this);
		this._onChangeTab = this._onChangeTab.bind(this);
		this._onContentSizeChange = this._onContentSizeChange.bind(this);
		this._onRefresh = this._onRefresh.bind(this);
		this._onScroll = this._onScroll.bind(this);
		this._viewMovie = this._viewMovie.bind(this);
		this._openYoutube = this._openYoutube.bind(this);
		this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
	}

	componentWillMount() {
		this._retrieveDetails();		
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.details) this.setState({ isLoading: false });
	}

	_retrieveDetails(isRefreshed) {			
		this.props.actions.retrieveMovieDetails(this.props.movieId)
			.then(() => {
				this._retrieveYoutubeDetails();				
			});	
		if (isRefreshed && this.setState({ isRefreshing: false }));
	}

	
	_onRefresh() {
		this.setState({ isRefreshing: true });
		this._retrieveDetails('isRefreshed');
	}

	_onScroll(event) {
		const contentOffsetY = event.nativeEvent.contentOffset.y.toFixed();
		if (contentOffsetY > 150) {
			this._toggleNavbar('hidden');
		} else {
			this._toggleNavbar('shown');
		}
	}

	_toggleNavbar(status) {
		this.props.navigator.toggleNavBar({
			to: status,
			animated: true
		});
	}

	_onChangeTab({ i, ref }) {
		this.setState({ tab: i });
	}

	// ScrollView onContentSizeChange prop
	_onContentSizeChange(width, height) {
		if (this.state.tab === 0 && this.state.infoTabHeight === this.state.castsTabHeight) {
			this.setState({ infoTabHeight: height });
		}
	}

	_getTabHeight(tabName, height) {
		if (tabName === 'casts') this.setState({ castsTabHeight: height });
		if (tabName === 'trailers') this.setState({ trailersTabHeight: height });
	}

	_retrieveYoutubeDetails() {	 
		const data = this.state.youtubeVideos;		
		const request  = data.push(this.props.details);
		// console.warn(JSON.stringify(this.props.details));
		return request;		
	}

	_viewMovie(movieId) {
		this.props.navigator.push({
			screen: 'vdokh.Movie',
			passProps: {
				movieId
			}
		});
	}

	_openYoutube(youtubeUrl) {
		Linking.canOpenURL(youtubeUrl).then(supported => {
			if (supported) {
				Linking.openURL(youtubeUrl);
			} else {
				ToastAndroid.show(`RN Don't know how to handle this url ${youtubeUrl}`, ToastAndroid.SHORT);
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

	render() {
		const iconStar = <Icon name="md-star" size={16} color="#F5B642" />;
		const { details } = this.props;
		const info = details;
		//console.warn(JSON.stringify(this.state.youtubeVideos));
		//const videoUrl = 'https://gcs-vimeo.akamaized.net/exp=1527849554~acl=%2A%2F587282651.mp4%2A~hmac=6d46e0211e9f55781cb02d1ba23e80fafe2c8ce9270664b0f8f353ce202c4c9d/vimeo-prod-skyfire-std-us/01/971/7/179859217/587282651.mp4';
		const videoUrl = 'https://www.youtube.com/embed/'+info.id;
		//console.warn(JSON.stringify(info.contentDetails.duration))
		//console.warn(ytDurationToSeconds('PT4M59S'));

		let height;
		if (this.state.tab === 0) height = this.state.infoTabHeight;
		if (this.state.tab === 1) height = this.state.castsTabHeight;
		if (this.state.tab === 2) height = this.state.trailersTabHeight;

		return (		
			this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> : this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :	
			<ScrollView
					style={styles.container}
					onScroll={this._onScroll.bind(this)}
					scrollEventThrottle={100}
					onContentSizeChange={this._onContentSizeChange}
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
					}>
				<View>		
				  <WebView
                    style={ styles.WebViewContainer }
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                	source={{uri: 'https://www.youtube.com/embed/dFKhWe2bBkM' }}
          			 />
					  <VideoPlayer
				          endWithThumbnail
				          thumbnail={{ uri: `${info.snippet.thumbnails.medium.url}` }}
				          video={{ uri: videoUrl }}		
				          videoWidth={this.state.video.width}
				          videoHeight={this.state.video.height}
				          duration={this.state.video.duration}		        
				          ref={r => this.player = r}
				        />
					<View style={styles.contentContainer}>
						<ScrollableTabView
							onChangeTab={this._onChangeTab}
							renderTabBar={() => (
								<DefaultTabBar
									textStyle={styles.textStyle}
									underlineStyle={styles.underlineStyle}
									style={styles.tabBar}
								/>
							)}>
							<Info tabLabel="INFO" info={info} />							
							<Related tabLabel="Videos Related" movieId={this.props.movieId} navigator={this.props.navigator}/>
						</ScrollableTabView>
					</View>				
				</View>
			</ScrollView>	
		);
	}
}

Movie.navigatorStyle = {
	navBarTransparent: true,
	drawUnderNavBar: true,
	navBarTranslucent: true,
	statusBarHidden: true,
	navBarTextColor: 'white',
	navBarButtonColor: 'white'
};

Movie.propTypes = {
	actions: PropTypes.object.isRequired,
	details: PropTypes.object.isRequired,
	navigator: PropTypes.object,
	movieId: PropTypes.string.isRequired,
	list: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
	return {
		details: state.movies.details,
		list: state.movies.list,
	    //similarMovies: state.movies.similarMovies
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(moviesActions, dispatch)
	};
}



//  function convertYouTubeTimeFormatToSeconds(timeFormat) {

//     if ( timeFormat === null || timeFormat.indexOf("PT") !== 0 ) {
//         return 0;
//     }

//     // match the digits into an array
//     // each set of digits into an item
//     var digitArray      = timeFormat.match(/\d+/g);
//     var totalSeconds    = 0;

//     // only 1 value in array
//     if (timeFormat.indexOf('H') > -1 && timeFormat.indexOf('M') == -1 && timeFormat.indexOf('S') == -1) {
//         totalSeconds    += getIntValue(digitArray[0]) * 60 * 60;
//     }

//     else if (timeFormat.indexOf('H') == -1 && timeFormat.indexOf('M') > -1 && timeFormat.indexOf('S') == -1) {
//         totalSeconds    += getIntValue(digitArray[0]) * 60;
//     }

//     else if (timeFormat.indexOf('H') == -1 && timeFormat.indexOf('M') == -1 && timeFormat.indexOf('S') > -1) {
//         totalSeconds    += getIntValue(digitArray[0]);
//     }


//     // 2 values in array
//     else if (timeFormat.indexOf('H') > -1 && timeFormat.indexOf('M') > -1 && timeFormat.indexOf('S') == -1) {
//         totalSeconds    += getIntValue(digitArray[0]) * 60 * 60;
//         totalSeconds    += getIntValue(digitArray[1]) * 60;
//     }

//     else if (timeFormat.indexOf('H') > -1 && timeFormat.indexOf('M') == -1 && timeFormat.indexOf('S') > -1) {
//         totalSeconds    += getIntValue(digitArray[0]) * 60 * 60;
//         totalSeconds    += getIntValue(digitArray[1]);
//     }

//     else if (timeFormat.indexOf('H') == -1 && timeFormat.indexOf('M') > -1 && timeFormat.indexOf('S') > -1) {
//         totalSeconds    += getIntValue(digitArray[0]) * 60;
//         totalSeconds    += getIntValue(digitArray[1]);
//     }


//     // all 3 values
//     else if (timeFormat.indexOf('H') > -1 && timeFormat.indexOf('M') > -1 && timeFormat.indexOf('S') > -1) {
//         totalSeconds    += getIntValue(digitArray[0]) * 60 * 60;
//         totalSeconds    += getIntValue(digitArray[1]) * 60;
//         totalSeconds    += getIntValue(digitArray[2]);
//     }

// //  console.log(timeFormat, totalSeconds);

//     return totalSeconds;
// }
// function getIntValue(value) {
//     if (value === null) {
//         return 0;
//     }

//     else {

//         var intValue = 0;
//         try {
//             intValue        = parseInt(value);
//             if (isNaN(intValue)) {
//                 intValue    = 0;
//             }
//         } catch (ex) { }

//         return Math.floor(intValue);
//     }
// }

export default connect(mapStateToProps, mapDispatchToProps)(Movie);
