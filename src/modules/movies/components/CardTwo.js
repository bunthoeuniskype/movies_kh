import React, { PropTypes } from 'react';
import {
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';

import styles from './styles/CardTwo';
import { TMDB_IMG_URL } from '../../../constants/api';

const CardTwo = ({ info, viewMovie,type }) => {
	 //console.warn(JSON.stringify(info));
	if(type=="playlistItems"){
		videoId = info.snippet.resourceId.videoId;
	}else{
		videoId = info.id.videoId;
	}


	return (
			<TouchableOpacity activeOpacity={0.8} onPress={viewMovie.bind(this, videoId)}>
				<View style={styles.cardContainer}>
					<Image source={{ uri: `${(info.snippet.thumbnails.medium.url || info.snippet.thumbnails.default.url)}` }} style={styles.cardImage} />
					<View style={styles.cardTitleContainer}>
						<Text style={styles.cardTitle} numberOfLines={2}>
							{info.snippet.title}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

CardTwo.propTypes = {
	info: PropTypes.object.isRequired,
	viewMovie: PropTypes.func.isRequired,
	type:PropTypes.string.isRequired
};

export default CardTwo;
