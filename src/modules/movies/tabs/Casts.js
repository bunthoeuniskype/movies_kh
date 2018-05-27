import React, { PropTypes } from 'react';
import {
	Text,
	View,
	Image
} from 'react-native';

import styles from './styles/Casts';

const Casts = ({ info, getTabHeight }) => {
	let computedHeight = (80 + 15) * 1; // (castImage.height + castContainer.marginBottom)
	computedHeight += 447 + 40; // Header height + container ((20 paddingVertical) = 40)

	return (
		<View style={styles.container} onLayout={getTabHeight.bind(this, 'casts', computedHeight)}>
			{
				<View key={info.id} style={styles.castContainer}>
						<Image source={{ uri: `${info.snippet.thumbnails.medium.url}` }} style={styles.castImage} />
						<View style={styles.characterContainer}>
							<Text style={styles.characterName}>
								{info.snippet.title}
							</Text>
							<Text style={styles.asCharacter}>
								{info.snippet.description}
							</Text>
						</View>
				</View>
			}
		</View>
	);
};

Casts.propTypes = {
	info: PropTypes.object.isRequired,
	getTabHeight: PropTypes.func.isRequired
};

export default Casts;
