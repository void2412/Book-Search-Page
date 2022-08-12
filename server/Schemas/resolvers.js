const {User} = require('../models')

const {signToken} = require('../utils/auth')

const resolver = {
	Query: {
		user: async 
	}
}