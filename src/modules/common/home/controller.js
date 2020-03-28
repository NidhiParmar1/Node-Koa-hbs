/* eslint-disable no-unused-expressions */
import constants from './../../../utils/constants'
import Place from '../../../models/places'
import Deal from '../../../models/deals'
import User from '../../../models/users'

// **************Owner Module***************//
// Owner Signup //
// Owner renders to the Signup page by hitting http://127.0.0.1:8000/ownersign //
export async function getOwnerSignup (ctx) {
	try {
		// console.log('Hello')
		await ctx.render('OwnerSignup', {
			msg: null,
			user: null,
			type: null
		});
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}
// Save Owner Details as username, userid, type and password in Database after successful signup Owner will render to the Add new Place Page//
export async function saveOwnerSign(ctx) {
	const user= new User({ type: 'Owner', username: ctx.request.body.oname, userid: ctx.request.body.oemailid, password: ctx.request.body.opassword });
	console.log(user)
	try {
		let userData = await User.findOne({
			userid: ctx.request.body.oemailid
		});
		// console.log(userData.type.indexOf('Owner'))
		if(!userData) {
			await user.save()
			ctx.status = constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS;
			console.log('You are successfully Registered')
			await ctx.redirect('addnewplace?oid='+ctx.request.body.oemailid, {
				msg: 'You are successfully Registered'
			})
		} else if(userData.type.indexOf('Owner')=== -1) {
			await User.update({
				userid: ctx.request.body.oemailid
			}, {
				$push: {
					type: 'Owner'
				}
			})
			await ctx.redirect('addnewplace?oid='+ctx.request.body.oemailid, {
				msg: 'You are successfully Registered'
			})
		} else {
			ctx.body = constants.MESSAGES.USER_ALREADY_EXIST;
			ctx.status = constants.STATUS_CODE.CONFLICT_ERROR_STATUS
			await ctx.render('OwnerSignup', {
				msg: 'User Already Exists',
				user: null,
				type: null
			})
		}
	} catch (error) {
		console.log('Error while creating user', error);
		await ctx.render('OwnerSignup', {
			msg: 'Something went Wrong',
			user: null,
			type: null
		})
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// User Rendered to the Login Page by hitting http://127.0.0.1:8000/ or through a link given on the signup page //
export async function getUserLogin (ctx) {
	try {
		await ctx.render('UserLogin', {
			msg: null,
			user: null,
			type: null
		});
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// Verify User with userid and password from database according to the  type of user
// he will be rendered to the dashboard if type=Owner/User it will be rendered to Owner or User Dashboard/ Home respectively //

export async function checkUserLogin(ctx) {
	try {
		const user = await User.findOne({ userid: ctx.request.body.userid })
		console.log(user)
		console.log(user.type.length)
		let isMatch = await user.validatePassword(ctx.request.body.password)
		if(isMatch) {
			ctx.session.type= user.type[0];
			// console.log(user.length)
			if (user.type[0] === 'User') {
				console.log('login Success')
				ctx.session.user= user.userid
				let places=await Place.find({placestatus: 'Approved'})
				console.log(places)
				await ctx.render('Home', {
					udata: places,
					msg: 'Login Success',
					user: ctx.session.user,
					type: ctx.session.type,
					entry: user.type.length
				})
			} else {
				let dealcount=await Deal.find({ownerid: ctx.request.body.userid}).count()
				// console.log(dealcount)
				let placecount=await Place.find({ownerid: ctx.request.body.userid}).count()
				// console.log(placecount)
				ctx.session.owner= user.userid
				await ctx.render('Dashboard', {
					msg: 'Login Success',
					user: ctx.session.owner,
					odata: null,
					placecount: placecount,
					dealcount: dealcount,
					dealdata: null,
					type: ctx.session.type,
					entry: user.type.length
				})
			}
		}
	} catch (error) {
		console.log('login Fail')
		await ctx.render('UserLogin', {
			msg: 'Login Fail',
			user: ctx.session.user,
			type: ctx.session.type
		})
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// export async function getOwnerLogin (ctx) {
// 	try {
// 		await ctx.render('OwnerLogin', {
// 			msg: null,
// 			user: null,
// 			type: null
// 		});
// 	} catch (error) {
// 		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
// 	}
// }

// export async function checkOwnerLogin(ctx) {
// 	try {
// 		const user = await User.findOne({ userid: ctx.request.body.oemailid, type: 'Owner' })
// 		console.log(user)
// 		let isMatch =await user.validatePassword(ctx.request.body.opassword)
// 		if(isMatch) {
// 			ctx.session.owner= user.userid;
// 			ctx.session.type= user.type;
// 			console.log(ctx.session.type)
// 			console.log('login Success')
// 			// console.log(dealdata)
// 			let dealcount=await Deal.find({ownerid: ctx.request.body.oemailid}).count()
// 			// console.log(dealcount)
// 			let placecount=await Place.find({ownerid: ctx.request.body.oemailid}).count()
// 			// console.log(placecount)
// 			await ctx.render('Dashboard', {
// 				msg: 'Login Success',
// 				user: ctx.session.owner,
// 				placecount: placecount,
// 				dealcount: dealcount,
// 				type: ctx.session.type,
// 				entry: null
// 			})
// 		}
// 	} catch (error) {
// 		console.log('login Fail')
// 		await ctx.render('UserLogin', {
// 			msg: 'Login Fail',
// 			user: null
// 		})
// 		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
// 	}
// }

// After clicking the dashboard butten Owner will render to the Dashboard only when the owner have signed in
// otherwise he will be rendered to the login page //
export async function goDashboard (ctx) {
	try {
		if(!ctx.session.owner) {
			await ctx.render('UserLogin', {
				user: ctx.session.owner,
				type: ctx.session.type,
				msg: null
			});
		} else {
			let dealcount=await Deal.find({ownerid: ctx.session.owner}).count()
			let placecount=await Place.find({ownerid: ctx.session.owner}).count()
			await ctx.render('Dashboard', {
				msg: '',
				user: ctx.session.owner,
				placecount: placecount,
				dealcount: dealcount,
				type: ctx.session.type,
				entry: null
			})
		}
	} catch(error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}
// Add New Place Page Rendering //
export async function addNewPlace (ctx) {
	try {
		await ctx.render('AddPlace', {
			user: ctx.request.query.oid,
			type: ctx.session.type
		});
	} catch(error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// Save Place details to database and render User to Dashhboard //
export async function saveNewPlace (ctx) {
	try {
		const placedata= new Place({ place: ctx.request.body.pname, ownerid: ctx.request.body.oid, 'placeaddress.address': ctx.request.body.address, 'placeaddress.lat': ctx.request.body.lat, 'placeaddress.lng': ctx.request.body.lng, placestatus: 'Pending' });
		await placedata.save()
		console.log('Place Added')
		ctx.status = constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS;
		if (ctx.session.owner) {
			let placecount=await Place.find({ownerid: ctx.session.owner}).count()
			let dealcount=await Deal.find({ownerid: ctx.session.owner}).count()
			await ctx.render('Dashboard', {
				msg: 'Place Added',
				user: ctx.session.owner,
				type: ctx.session.type,
				placecount: placecount,
				dealcount: dealcount,
				entry: null
			})
		} else {
			await ctx.render('UserLogin', {
				msg: 'Place Added Successfully...Login First, to add more details',
				user: ctx.session.owner,
				type: ctx.session.type
			});
		}
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// Check if the place is already added by the Owner or not
export async function checkPlaceName (ctx) {
	try {
		if(!ctx.session.owner) {
			await ctx.render('UserLogin', {
				user: null
			});
		}
		console.log(ctx.query.pname)
		let result=await Place.findOne({ ownerid: ctx.session.owner, place: ctx.query.pname })
		if(result) {
			ctx.response.body='Already Exist'
		} else {
			ctx.response.body='Available'
		}
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// Delete the place details//

export async function deletePlace(ctx) {
	try {
		if(!ctx.session.owner) {
			await ctx.render('UserLogin', {
				user: null,
				type: ctx.session.type,
				msg: null
			});
		} else {
			await Place.findByIdAndRemove({_id: ctx.query.id});
			ctx.status = constants.STATUS_CODE.SUCCESS_STATUS;
			let placecount=await Place.find({ownerid: ctx.session.owner}).count()
			let dealcount=await Deal.find({ownerid: ctx.session.owner}).count()
			await ctx.render('Dashboard', {
				msg: 'Place deleted',
				user: ctx.session.owner,
				placecount: placecount,
				dealcount: dealcount,
				type: ctx.session.type,
				entry: null
			})
		}
	} catch (error) {
		ctx.body = error;
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}
// Render to the View place details Page//
export async function viewPlace (ctx) {
	try {
		if(!ctx.session.owner) {
			await ctx.render('UserLogin', {
				user: ctx.session.owner,
				type: ctx.session.type,
				msg: null
			})
		} else {
			console.log(ctx.query.id)
			let placedata=await Place.find({_id: ctx.query.id})
			await ctx.render('ViewPlace', {
				placedata: placedata,
				user: ctx.session.owner,
				type: ctx.session.type
			});
		}
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// Render the place details to the html page for editing //
export async function editPlace (ctx) {
	try {
		if(!ctx.session.owner) {
			await ctx.render('UserLogin');
		}
		// console.log(ctx.query.id)
		let placedata=await Place.findOne({_id: ctx.query.id})
		await ctx.render('EditPlace', {
			data: placedata,
			user: ctx.session.owner,
			type: ctx.session.type
		});
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// Update the place detailes already saved in database //
export async function updatePlace (ctx) {
	try {
		if(!ctx.session.owner) {
			await ctx.render('UserLogin', {
				msg: null,
				user: ctx.session.owner,
				type: ctx.session.type
			});
		}
		await Place.update({ _id: ctx.request.body.id },
			{ place: ctx.request.body.pname,
				'placeaddress.address': ctx.request.body.address,
				'placeaddress.lat': ctx.request.body.lat,
				'placeaddress.lng': ctx.request.body.lng,
				placestatus: 'Pending' });
		let placecount=await Place.find({ownerid: ctx.session.owner}).count()
		let dealcount=await Deal.find({ownerid: ctx.session.owner}).count()
		await ctx.render('Dashboard', {
			msg: 'Place Updated',
			user: ctx.session.owner,
			placecount: placecount,
			dealcount: dealcount,
			type: ctx.session.type,
			entry: null
		})
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// Render to Add deal Page for a perticular place having approved status  //
export async function addDeal (ctx) {
	try{
		if(!ctx.session.owner) {
			await ctx.render('UserLogin', {
				msg: null,
				user: ctx.session.owner,
				type: ctx.session.type
			});
		} else {
			let result =await Place.findById({ _id: ctx.query.id });
			console.log(result)
			if(result.placestatus === 'Approved') {
				await ctx.render('AddDeal', {
					dealdata: result,
					user: ctx.session.owner,
					type: ctx.session.type
				})
			} else{
				let placecount=await Place.find({ownerid: ctx.session.owner}).count()
				let dealcount=await Deal.find({ownerid: ctx.session.owner}).count()
				await ctx.render('Dashboard', {
					msg: 'Place is not approved',
					user: ctx.session.owner,
					placecount: placecount,
					dealcount: dealcount,
					entry: null,
					type: ctx.session.type
				})
			}
		}
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}
// Save deal to the database with perticular placeid and Ownerid//
export async function saveDeal (ctx) {
	try {
		console.log(ctx.request.body.fromtime)
		const fromtime= new Date(`January 1, 2020 ${ctx.request.body.fromtime}`)
		const totime= new Date(`January 1, 2020 ${ctx.request.body.totime}`)
		let dealdata= new Deal({ placeid: ctx.request.body.id, ownerid: ctx.request.body.ownerid, dealname: ctx.request.body.deal, dealdescription: ctx.request.body.dealdesc, 'dealvalidity.fromdate': ctx.request.body.fromdate, 'dealvalidity.todate': ctx.request.body.todate, 'dealvalidity.fromtime': fromtime, 'dealvalidity.totime': totime });
		console.log(dealdata)
		await dealdata.save()
		console.log('Deal Saved')
		let placecount=await Place.find({ownerid: ctx.session.owner}).count()
		let dealcount=await Deal.find({ownerid: ctx.session.owner}).count()
		await ctx.render('Dashboard', {
			msg: 'Deal Saved',
			user: ctx.session.owner,
			type: ctx.session.type,
			placecount: placecount,
			dealcount: dealcount,
			entry: null
		})
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}
// Render to the View Deal Page where all added deals will be viewd in paginated format//
export async function viewDeal (ctx) {
	try {
		if(!ctx.session.owner) {
			await ctx.render('UserLogin', {
				msg: null,
				user: ctx.session.owner,
				type: ctx.session.type
			});
		} else{
			let dealdata=await Deal.find({_id: ctx.query.id})
			await ctx.render('ViewDeal', {
				dealdata: dealdata,
				user: ctx.session.owner,
				type: ctx.session.type
			});
		}
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// Owner can view deals added to particular place //

export async function viewOwnerDeal (ctx) {
	try {
		if(!ctx.session.owner) {
			await ctx.render('UserLogin', {
				msg: null,
				user: ctx.session.user,
				type: ctx.session.type
			});
		} else{
			let dealdata=await Deal.find({ placeid: ctx.query.id, ownerid: ctx.session.owner })
			await ctx.render('ViewDeal', {
				dealdata: dealdata,
				user: ctx.session.owner,
				type: ctx.session.type
			});
		}
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}
// Edit already added deal //
export async function editDeal (ctx) {
	try {
		if(!ctx.session.owner) {
			await ctx.render('UserLogin', {
				msg: null,
				user: null,
				type: ctx.session.type
			});
		} else{
			let dealdata=await Deal.findOne({_id: ctx.query.id})
			console.log(dealdata)
			await ctx.render('EditDeal', {
				data: dealdata,
				user: ctx.session.owner,
				type: ctx.session.type
			});
		}
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// Save the updated/ edited deal to database//
export async function updateDeal (ctx) {
	try {
		if(!ctx.session.owner) {
			await ctx.render('UserLogin', {
				user: null,
				type: ctx.session.type
			});
		} else {
			console.log(ctx.request.body.id)
			const fromtime = new Date(`January 1, 2020 ${ctx.request.body.fromtime}`)
			const totime = new Date(`January 1, 2020 ${ctx.request.body.totime}`)
			await Deal.findByIdAndUpdate({ _id: ctx.request.body.id }, { dealname: ctx.request.body.deal, dealdescription: ctx.request.body.dealdesc, 'dealvalidity.fromdate': ctx.request.body.fromdate, 'dealvalidity.todate': ctx.request.body.todate, 'dealvalidity.fromtime': fromtime, 'dealvalidity.totime': totime })
			let dealcount=await Deal.find({ownerid: ctx.session.owner}).count()
			let placecount=await Place.find({ownerid: ctx.session.owner}).count()
			await ctx.render('Dashboard', {
				msg: 'Deal Updated',
				user: ctx.session.owner,
				type: ctx.session.type,
				placecount: placecount,
				dealcount: dealcount,
				entry: null
			})
		}
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}
// Delete particular deal from database
export async function deleteDeal (ctx) {
	try {
		if(!ctx.session.owner) {
			ctx.render('UserLogin', {
				user: null,
				type: ctx.session.type
			});
		} else {
			await Deal.findByIdAndRemove({_id: ctx.query.id});
			let dealcount=await Deal.find({ownerid: ctx.session.owner}).count()
			let placecount=await Place.find({ownerid: ctx.session.owner}).count()
			await ctx.render('Dashboard', {
				msg: 'Deal Deleted',
				user: ctx.session.owner,
				type: ctx.session.type,
				placecount: placecount,
				dealcount: dealcount,
				entry: null
			})
		}
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// User Module//
// Render to the  User Signup Page//
export async function getUserSignup (ctx) {
	try {
		await ctx.render('UserSignup', {
			msg: null,
			user: null,
			type: null
		});
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// Save User Signup Details like username, userid, password and type to the database //
export async function saveUserSign(ctx) {
	const user= new User({ type: 'User',
		username: ctx.request.body.uname,
		userid: ctx.request.body.uemailid,
		password: ctx.request.body.upassword });
	console.log(user)
	try {
		let userData = await User.findOne({
			userid: ctx.request.body.uemailid
		});
		if (!userData) {
			await user.save()
			console.log('You are successfully Registered')
			await ctx.render('UserLogin', {
				msg: 'You are successfully Registered',
				user: null,
				type: null
			})
			ctx.status = constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS;
		} else if(userData.type.indexOf('User') === -1) {
			await User.update({
				userid: ctx.request.body.oemailid
			}, {
				$push: {
					type: 'User'
				}
			})
			await ctx.render('UserLogin', {
				msg: 'You are successfully Registered',
				user: null,
				type: null
			})
		} else {
			ctx.body = constants.MESSAGES.USER_ALREADY_EXIST;
			ctx.status = constants.STATUS_CODE.CONFLICT_ERROR_STATUS
			await ctx.render('UserSignup', {
				msg: 'User already exists',
				user: ctx.session.user,
				type: ctx.session.type
			})
		}
	} catch (error) {
		console.log('Error while creating user', error);
		await ctx.render('UserSignup', {
			msg: 'Something went wrong',
			user: ctx.session.user,
			type: ctx.session.type
		})
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// On clicking the Home button user will render to User's Home Page if he is login otherwise it will render to
// the User login page //

export async function goHome (ctx) {
	try{
		if(!ctx.session.user) {
			await ctx.render('UserLogin', {
				user: ctx.session.user,
				type: ctx.session.type,
				msg: null
			})
		} else {
			if(ctx.session.user && ctx.session.type ==='User') {
				let places=await Place.find({placestatus: 'Approved'})
				// console.log(places)
				const entrydata= ctx.query.entry||null
				console.log('EntryData', entrydata)
				await ctx.render('Home', {
					udata: places,
					msg: null,
					user: ctx.session.user,
					type: ctx.session.type,
					entry: entrydata
				})
				// console.log(result.data)
			}
		}
	} catch (error) {
		await ctx.render('UserLogin', {
			msg: null,
			user: ctx.session.user,
			type: ctx.session.type
		})
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// User can view  Active deals at particular place //

export async function viewUserDeal (ctx) {
	const date = new Date()
	const hour= date.getHours()
	console.log(hour)
	const time= new Date(`January 1, 2020 ${hour}:00`)
	console.log(time)
	try {
		if(!ctx.session.user) {
			await ctx.render('UserLogin', {
				msg: null,
				user: ctx.session.user,
				type: ctx.session.type
			});
		} else{
			let dealdata=await Deal.find({placeid: ctx.query.id,
				'dealvalidity.fromdate': { $lte: date },
				'dealvalidity.todate': { $gte: date },
				'dealvalidity.totime': { $gte: time }})
			console.log(dealdata)
			await ctx.render('DealsUser', {
				dealdata: dealdata,
				user: ctx.session.user,
				type: ctx.session.type
			});
		}
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// Code to View Places in Paginated format //
export async function viewPaginatedPlace (ctx) {
	if(!ctx.session.owner) {
		ctx.render('UserLogin', {
			user: null,
			msg: null,
			type: ctx.session.type
		})
	} else {
		let ownerid= ctx.session.owner
		let page =parseInt(ctx.query.page || 1)
		console.log('page:'+page)
		let limit=parseInt(ctx.query.limit || 4)
		let offset= (page-1)*limit;
		console.log(offset)
		try {
			const result= await Place.find({ ownerid: ownerid }).limit(limit).skip(offset)
			let placecount=await Place.find({ownerid: ctx.session.owner}).count()
			console.log(placecount)
			console.log(result)
			await ctx.render('PlaceList', {
				msg: null,
				placedata: result,
				user: ctx.session.owner,
				type: ctx.session.type,
				currentpage: page,
				pages: Math.ceil(placecount / limit)
			})
		} catch (error) {
			ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
		}
	}
}

// Code to View Deals in Paginated format //

export async function viewPaginatedDeal (ctx) {
	if(!ctx.session.owner) {
		ctx.render('UserLogin', {
			user: null,
			msg: null,
			type: ctx.session.type
		});
	} else {
		let ownerid= ctx.session.owner
		let page=parseInt(ctx.query.page || 1)
		console.log('page:'+page)
		let limit =parseInt(ctx.query.limit || 4)
		let offset= (page-1)*limit
		try {
			const dealdata= await Deal.find({ ownerid: ownerid }).limit(limit).skip(offset)
			let dealcount=await Deal.find({ownerid: ctx.session.owner}).count()
			await ctx.render('DealList', {
				msg: '',
				user: ctx.session.owner,
				dealdata: dealdata,
				type: ctx.session.type,
				currentpage: page,
				pages: Math.ceil(dealcount / limit)
			})
		} catch (error) {
			ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
		}
	}
}

// If the user have both types (User/Owner),Switch the User type to Owner type or vice versa //

export async function switchUser(ctx) {
	if(!ctx.session.user && !ctx.session.owner) {
		await ctx.render('UserLogin', {
			user: null,
			msg: null,
			type: ctx.session.type
		});
	} else {
		if(ctx.session.type === 'User') {
			ctx.session.type = 'Owner'
			ctx.session.owner = ctx.session.user
			ctx.session.user= null
			ctx.redirect('dashboard')
		} else {
			ctx.session.type = 'User'
			ctx.session.user = ctx.session.owner
			ctx.session.owner= null
			ctx.redirect('home')
		}
	}
}

// On clicking the Logout Link Destroy Session //
export async function logOut (ctx) {
	ctx.session.admin = null
	ctx.session.owner = null
	ctx.session.user = null
	ctx.session.type = null
	await ctx.render('UserLogin', {
		msg: 'You are successfully logged Out',
		user: null,
		type: ctx.session.type
	});
}
