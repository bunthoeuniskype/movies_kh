/* eslint-disable new-cap */
import React, { PropTypes, Component } from 'react';
import {
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { TMDB_IMG_URL } from '../../../constants/api';
import styles from './styles/CardThree';

const iconStar = <Icon name="md-star" size={16} color="#F5B642" />;

class CardThree extends Component {

	constructor(props) {
		super(props);
		// this.state = {
		// 	viewHide: true
		// }
	}

	_renderListView() {	
		const { info, viewMovie } = this.props;
		let listView;
		if (info.snippet.title !== 'Deleted video') {
			if(info.snippet.thumbnails.medium){
				images = info.snippet.thumbnails.medium.url;
			}else{
			   images = info.snippet.thumbnails.default.url;
			}

			listView = (
				<View style={styles.cardContainer}>
					<TouchableOpacity activeOpacity={0.9} onPress={viewMovie.bind(this, info.id.videoId)}>
					<View style={styles.card}>
						<Image source={{ uri: `${images}` }} style={styles.cardImage} />
						<View style={styles.cardDetails}>
							<Text
								style={styles.cardTitle}
								numberOfLines={3}>
								{info.snippet.title}
							</Text>
							<View style={styles.cardGenre}>
								<Text style={styles.cardGenreItem}>{info.snippet.publishedAt.substring(0, 4)}</Text>
							</View>
							<View style={styles.cardNumbers}>
								<View style={styles.cardStar}>
									{iconStar}
									<Text style={styles.cardStarRatings}>5.0</Text>
								</View>
								<Text style={styles.cardRunningHours} />
							</View>
							<Text style={styles.cardDescription} numberOfLines={3}>
								{info.snippet.description}
							</Text>
						</View>
					</View>
					</TouchableOpacity>
				</View>		
			);
		} else {
			listView = <View />;
		}

		return listView;
	}

	render() {		
		return (	
		   <View>	
		    {this._renderListView()}
		  </View>
		);
	}
}

CardThree.propTypes = {
	info: PropTypes.object.isRequired,
	viewMovie: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
	return {
		moviesGenres: state.movies.genres
	};
}

export default connect(mapStateToProps, null)(CardThree);
