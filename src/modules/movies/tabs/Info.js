import React, { PropTypes } from 'react';
import {
	Text,
	View
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';

import styles from './styles/Info';

const Info = ({ info }) => {	
	const releaseDate = moment(info.publishedAt).format('LL');
	return (
		<View style={styles.container}>
			<View style={styles.labelRow}>
				<Text style={styles.label}>Title : </Text>
				<Text style={styles.value}>{info.snippet.title}</Text>
			</View>	
			<View style={styles.labelRow}>
				<Text style={styles.label}>Release Date : </Text>
				<Text style={styles.value}>{releaseDate}</Text>
			</View>			
			<View style={styles.overview}>				
				<Text style={styles.overviewText}>
					{info.snippet.description}
				</Text>
			</View>					
		</View>
	);
};

Info.propTypes = {
	info: PropTypes.object.isRequired
};

export default Info;
