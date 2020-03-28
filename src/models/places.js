import mongoose from 'mongoose'
// import config from '../../config'

const Place = new mongoose.Schema({
	ownerid: {
		type: String
	},
	place: {
		type: String,
		required: true
	},
	placeaddress: {
		address: String,
		lat: Number,
		lng: Number
	},
	placestatus: {
		type: String
	}
})
export default mongoose.model('place', Place);
