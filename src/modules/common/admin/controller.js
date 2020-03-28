import constants from '../../../utils/constants'
import Place from '../../../models/places'
import User from '../../../models/users'

// *****Admin Module***//
// Admin Login and hardcode Signup login with url http://127.0.0.1:8000/admin/login//
export async function getLogin (ctx) {
	try {
		// console.log('Hello')
		// const user= new User({ type: 'Admin', username: 'Admin', userid: 'Admin@123.com' , password: 'admin123' })
		// await user.save()
		await ctx.render('AdminLogin', {
			user: null,
			type: null,
			msg: null
		});
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// Code to verify Admin login  details username and password from database after successful
// login admin will be rendered to its Home Page  //

export async function checkAdminLogin(ctx) {
	try {
		const user = await User.findOne({ username: ctx.request.body.aname })
		let isMatch =await user.validatePassword(ctx.request.body.apassword)
		if(isMatch) {
			ctx.session.admin= ctx.request.body.aname;
			ctx.session.type= user.type[0]
			console.log('login Success')
			const result=await Place.find({})
			console.log(result)
			await ctx.render('AdminHome', {
				msg: 'Login Success',
				adata: result,
				user: ctx.session.admin,
				type: ctx.session.type
			})
		}
	} catch (error) {
		console.log('login Fail')
		await ctx.render('AdminLogin', {
			msg: 'Login Fail',
			user: null,
			type: ctx.session.type
		})
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// Admin Approves Place and place status updated to approved //
export async function reviewPlace (ctx) {
	try {
		if(!ctx.session.admin) {
			ctx.render('AdminLogin', {
				msg: null,
				user: ctx.session.admin,
				type: ctx.session.type
			});
		}
		console.log(ctx.query.id)
		console.log('Status' +ctx.params.status)
		await Place.findByIdAndUpdate({ _id: ctx.query.id },
			{ placestatus: 'Approved' });
		const result=await Place.find({})
		console.log(result)
		await ctx.render('AdminHome', {
			msg: 'Place Approved',
			adata: result,
			user: ctx.session.admin,
			type: ctx.session.type
		})
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}

// Admin Rejects Place and placestatus updated to rejected
export async function rejectPlace (ctx) {
	try {
		if(!ctx.session.owner) {
			await ctx.render('AdminLogin', {
				msg: null,
				user: ctx.session.admin,
				type: ctx.session.type
			});
		}
		console.log(ctx.query.id)
		await Place.findByIdAndUpdate({ _id: ctx.query.id }, { placestatus: 'Rejected' });
		const result=await Place.find({})
		console.log(result)
		await ctx.render('AdminHome', {
			msg: 'Place Rejected',
			adata: result,
			user: ctx.session.admin,
			type: ctx.session.type
		})
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}
