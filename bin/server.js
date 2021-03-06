import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import convert from 'koa-convert'
import logger from 'koa-logger'
import mongoose from 'mongoose'
import session from 'koa-generic-session'
import passport from 'koa-passport'
import mount from 'koa-mount'
import serve from 'koa-static'
import helmet from 'koa-helmet'
// import views from 'koa-views'
import path from 'path'
import render from 'koa-ejs'

// import http2 from 'http2'
import User from '../src/models/users'
import config from '../config'
import { errorMiddleware } from '../src/middleware'
import GoogleStrategy from 'passport-google-oauth'

const app = new Koa()
app.keys = [config.session]

// replace these with your certificate information
// const options = {
// 	cert: fs.readFileSync('./cert/localhost.cert'),
// 	key: fs.readFileSync('./cert/localhost.key')
// }

// --------------------- start -------------------------
// Instead of calling convert for all legacy middlewares
// just use the following to convert them all at once

const _use = app.use
app.use = x => _use.call(app, convert(x))

// The code above avoids writting the following
// app.use(convert(logger()))
// Must be used before any router is used
render(app, {
	root: path.join(__dirname, 'views'),
	layout: 'layout',
	viewExt: 'hbs',
	cache: false,
	debug: true
})

// ---------------------- end --------------------------

passport.use(new GoogleStrategy.OAuth2Strategy({
	clientID: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	callbackURL: 'http://localhost:8000/auth/google/callback'
},
async function (accessToken, refreshToken, profile, done) {
	console.log(profile)
	// console.log('Token: '+accessToken)
	// console.log(profile.emails[0].value)
	const user = new User({ username: profile.displayName, userid: profile.emails[0].value, authid: profile.id, type: 'User' })
	const userData =await User.findOne({ authid: profile.id })
	console.log(userData)
	if (!userData) {
		await user.save()
		done(null, user)
	} else if(userData.type.indexOf('Owner')=== -1) {
		await User.update({
			authid: profile.id
		}, {
			$push: {
				type: 'Owner'
			}
		})
		done(null, userData)
	} else {
		done(null, userData)
	}
}))

mongoose.Promise = global.Promise
mongoose.connect(config.database)

app.use(helmet())
app.use(logger())
app.use(bodyParser())
app.use(session())
app.use(errorMiddleware())

app.use(serve('views'))
// Mount static API documents generated by api-generator
app.use(mount('/docs', serve(`${process.cwd()}/docs`)))

// Using Passport for authentication
require('../config/passport')
app.use(passport.initialize())
app.use(passport.session())

// Serialize User
passport.serializeUser((user, done) => {
	done(null, user.authid)
});

// Deserialize User
passport.deserializeUser((authid, done) => {
	User.findById(authid).then((user) => {
		done(null, user)
	})
});

// Using module wise routing
const modules1 = require('../src/modules/v1')
const modules2 = require('../src/modules/v2')
const common = require('../src/modules/common')
modules1(app)
modules2(app)
common(app)

// Show swagger only if the NODE_ENV is development
console.log('env', process.env.NODE_ENV)
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	console.log('env2', process.env.NODE_ENV)
	app.use(mount('/swagger', serve(`${process.cwd()}/swagger`)))
}

// Using http2 to work with http/2 instead of http/1.x
// http2
//   .createSecureServer(options, app.callback())
//   .listen(config.port, () => {
//     console.log(`Server started on ${config.port}`)
//   })

app.listen(config.port, () => {
	console.log(`Server started on ${config.port}`)
})

export default app
