import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#0a0a0a',
		...Platform.select({
			ios: {
				paddingTop: 83
			}
		})
	},
	progressBar: {
		backgroundColor: '#0a0a0a',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	seperator: {
		marginTop: 10,
		backgroundColor: '#8E8E8E'
	},
	btn:{
		backgroundColor: '#8E8E8E',
		padding:10,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default styles;
