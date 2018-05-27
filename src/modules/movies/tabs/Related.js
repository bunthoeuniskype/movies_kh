import React, { PropTypes } from 'react';
import {
	Text,
	View,
	Image,
	TouchableOpacity
} from 'react-native';
import _ from 'lodash';

import styles from './styles/Trailers';

const Related = ({ getTabHeight, youtubeVideos, openYoutube }) => {
	const trailers = _.take(youtubeVideos, 10);
	let computedHeight = (90 + 10) * youtubeVideos.length; // (thumbnail.height + thumbnailContainer.marginBottom)
	computedHeight += 447 + 40; // Header height + container ((20 paddingVertical) = 40)

	return (
		<View style={styles.container}>
			{
				trailers.map((item, index) => (
					<TouchableOpacity key={index} onPress={openYoutube.bind(this, `http://youtube.com/watch?v=${item.id}`)}>
						<View style={styles.thumbnailContainer}>
							<Image source={{ uri: `${item.snippet.thumbnails.medium.url}` }} style={styles.thumbnail} />
							<Text style={styles.title}>{item.snippet.title}</Text>
							<Text style={styles.cardDescription} numberOfLines={1}>
								{item.snippet.description}
							</Text>
						</View>
					</TouchableOpacity>
				))
			}
		</View>
	);
};

Related.propTypes = {
	getTabHeight: PropTypes.func.isRequired,
	openYoutube: PropTypes.func,
	youtubeVideos: PropTypes.array
};

export default Related;
