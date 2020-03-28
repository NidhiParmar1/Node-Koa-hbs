import * as home from './controller'

export const baseUrl = '/'

export default [
	{
		method: 'GET',
		route: '/',
		handlers: [
			home.getUserLogin
		]
	},
	{
		method: 'GET',
		route: 'ownersign',
		handlers: [
			home.getOwnerSignup
		]
	},
	{
		method: 'GET',
		route: 'usersign',
		handlers: [
			home.getUserSignup
		]
	},
	{
		method: 'GET',
		route: 'userlogin',
		handlers: [
			home.getUserLogin
		]
	},
	{
		method: 'POST',
		route: 'saveusersign',
		handlers: [
			home.saveUserSign
		]
	},
	{
		method: 'POST',
		route: 'checkuserlogin',
		handlers: [
			home.checkUserLogin
		]
	},
	{
		method: 'GET',
		route: 'ownerlogin',
		handlers: [
			home.getOwnerLogin
		]
	},
	{
		method: 'POST',
		route: 'saveownersign',
		handlers: [
			home.saveOwnerSign
		]
	},
	{
		method: 'POST',
		route: 'checkOwnerLogin',
		handlers: [
			home.checkOwnerLogin
		]
	},
	{
		method: 'GET',
		route: 'dashboard',
		handlers: [
			home.goDashboard
		]
	},
	{
		method: 'GET',
		route: 'addnewplace',
		handlers: [
			home.addNewPlace
		]
	},
	{
		method: 'POST',
		route: 'saveplace',
		handlers: [
			home.saveNewPlace
		]
	},
	{
		method: 'GET',
		route: 'deleteplace',
		handlers: [
			home.deletePlace
		]
	},
	{
		method: 'GET',
		route: 'editplace',
		handlers: [
			home.editPlace
		]
	},
	{
		method: 'GET',
		route: 'viewplace',
		handlers: [
			home.viewPlace
		]
	},
	{
		method: 'POST',
		route: 'updateplace',
		handlers: [
			home.updatePlace
		]
	},
	{
		method: 'GET',
		route: 'adddeal',
		handlers: [
			home.addDeal
		]
	},
	{
		method: 'POST',
		route: 'savedeal',
		handlers: [
			home.saveDeal
		]
	},
	{
		method: 'GET',
		route: 'viewdeal',
		handlers: [
			home.viewDeal
		]
	},
	{
		method: 'GET',
		route: 'editdeal',
		handlers: [
			home.editDeal
		]
	},
	{
		method: 'POST',
		route: 'updatedeal',
		handlers: [
			home.updateDeal
		]
	},
	{
		method: 'GET',
		route: 'deletedeal',
		handlers: [
			home.deleteDeal
		]
	},
	{
		method: 'GET',
		route: 'logout',
		handlers: [
			home.logOut
		]
	},
	{
		method: 'GET',
		route: 'viewpaginatedplace',
		handlers: [
			home.viewPaginatedPlace
		]
	},
	{
		method: 'GET',
		route: 'viewpaginateddeal',
		handlers: [
			home.viewPaginatedDeal
		]
	},
	{
		method: 'GET',
		route: 'checkplacename',
		handlers: [
			home.checkPlaceName
		]
	},
	{
		method: 'GET',
		route: 'home',
		handlers: [
			home.goHome
		]
	},
	{
		method: 'GET',
		route: 'viewuserdeal',
		handlers: [
			home.viewUserDeal
		]
	},
	{
		method: 'GET',
		route: 'viewownerdeal',
		handlers: [
			home.viewOwnerDeal
		]
	},
	{
		method: 'GET',
		route: 'switchuser',
		handlers: [
			home.switchUser
		]
	}
]
