import * as auth from './controller'
import passport from 'koa-passport'
export const baseUrl = '/auth'

export default [
	{
		method: 'GET',
		route: '/google',
		handlers: [passport.authenticate('google', {
			scope: ['https://www.googleapis.com/auth/plus.login',
				'https://www.googleapis.com/auth/userinfo.email']
		})]
	},
	{
		method: 'GET',
		route: '/google/callback',
		handlers: [passport.authenticate('google', {
			failureRedirect: '/'}),
		auth.authUserValid
		]
	}
]
