import constants from './../../../utils/constants'

// Create Session and Render Authenticated User to Home Page
export async function authUserValid(ctx) {
	try {
		console.log(ctx.state.user)
		ctx.session.user =ctx.state.user.userid
		ctx.session.type =ctx.state.user.type[0]
		const role =ctx.state.user.type.length
		await ctx.redirect(`/home?entry=${role}`)
	} catch (error) {
		ctx.status = constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS
	}
}
