import mongoose from 'mongoose'
// import config from '../../config'

const Deal = new mongoose.Schema({
	placeid: {
		type: mongoose.Schema.ObjectId,
		ref: 'Place'
	},
	ownerid: {
		type: String
	},
	dealname: {
		type: String
	},
	dealdescription: {
		type: String
	},
	dealvalidity: {
		fromdate: Date,
		todate: Date,
		fromtime: Date,
		totime: Date
	}
})
export default mongoose.model('deal', Deal);
