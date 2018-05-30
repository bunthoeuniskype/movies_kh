import React, { PropTypes } from 'react';
import {
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import styles from './styles/CardOne';
import { TMDB_IMG_URL } from '../../../constants/api';

const iconStar = (<Icon name="md-star" size={16} color="#F5B642" />);

const CardOne = ({ info, viewMovie }) => {
	//console.warn(JSON.stringify(info));
	return (
	<View>
		<Image source={{ uri: `${(info.snippet.thumbnails.medium.url || info.snippet.thumbnails.default.url)}` }} style={styles.imageBackdrop} />
		<LinearGradient colors={['rgba(0, 0, 0, 0.5)', 'rgba(0,0,0, 0.7)', 'rgba(0,0,0, 0.8)']} style={styles.linearGradient} />
		<View style={styles.cardContainer}>
			<Image source={{ uri: `${(info.snippet.thumbnails.medium.url || info.snippet.thumbnails.default.url)}` }} style={styles.cardImage} />
			<View style={styles.cardDetails}>
				<Text style={styles.cardTitle} numberOfLines={2}>
					{info.snippet.title}
				</Text>				
				<View style={styles.cardNumbers}>
					<View style={styles.cardStar}>
						{iconStar}
						<Text style={styles.cardStarRatings}>8.9</Text>
					</View>
					<Text style={styles.cardRunningHours} />
				</View>
				<Text style={styles.cardDescription} numberOfLines={3}>
					{info.snippet.description}
				</Text>
				<TouchableOpacity activeOpacity={0.9} onPress={viewMovie.bind(this,info.id.videoId)}>
					<View style={styles.viewButton}>
						<Text style={styles.viewButtonText}>Play now</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
		</View>
	);
}

CardOne.propTypes = {
	info: PropTypes.object.isRequired,
	viewMovie: PropTypes.func.isRequired
};

export default CardOne;
