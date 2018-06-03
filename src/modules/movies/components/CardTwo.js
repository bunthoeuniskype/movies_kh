import React, { PropTypes,Component } from 'react';
import {
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';

import styles from './styles/CardTwo';

class CardTwo extends Component {

	constructor(props) {
		super(props);
		// this.state = {
		// 	viewHide: true
		// }
	}

	_renderListView() {	
		const { info, viewMovie,type } = this.props;
		let listView;
		if (info.snippet.title !== 'Deleted video') {
			
			if(type=="playlistItems"){
				videoId = info.snippet.resourceId.videoId;
			}else{
				videoId = info.id.videoId;
			}
			
			listView = (
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

CardTwo.propTypes = {
	info: PropTypes.object.isRequired,
	viewMovie: PropTypes.func.isRequired,
	type:PropTypes.string.isRequired
};

export default CardTwo;
