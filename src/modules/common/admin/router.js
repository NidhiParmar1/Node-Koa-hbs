import * as admin from './controller'
export const baseUrl = '/admin/'

export default [
	{
		method: 'GET',
		route: 'login',
		handlers: [
			admin.getLogin
		]
	},
	{
		method: 'POST',
		route: 'checkadminlogin',
		handlers: [
			admin.checkAdminLogin
		]
	},
	{
		method: 'GET',
		route: 'approveplace',
		handlers: [
			admin.reviewPlace
		]
	},
	{
		method: 'GET',
		route: 'rejectplace',
		handlers: [
			admin.rejectPlace
		]
	}
]
