const {User} = require('../models')

const {signToken} = require('../utils/auth')

const resolver = {
	Query: {
		user: async (parent, {userId}) =>{
			return User.findOne({_id: userId})
		},

		me: async (parent, args, context) =>{
			if (context.user){
				return User.findOne({_id: context.user._id})
			}
			throw new AuthenticationError("You must be logged in to access this page")
		}
	},

	Mutation: {
		addUser: async (parent, {username, email, password}) =>{
			const user = await User.create({username, email, password})
			const token = signToken(user)

			return {token, user}
		},

		login: async (parent, {email, password}) => {
			const user = await User.findOne({ email })

			if (!user){
				throw new AuthenticationError("No user with this email")
			}

			const checkPw = await User.isCorrectPassword(password)

			if(!checkPw){
				throw new AuthenticationError("Incorrect Password")
			}

			const token = signToken(user)
			return {token, user}
		},

		addBook: async (parent, {user, book}, context) => {
			if(context.user){
				const updatedUser = await User.findOneAndUpdate(
					{ _id: user._id },
					{ $addToSet: { savedBooks: book } },
					{ new: true, runValidators: true }
				  );

				return updatedUser
			}

			throw new AuthenticationError("You must be logged in")
		},

		removeBook: async (parent, {user, params}, context) => {
			if(context.user){
				const updatedUser = await User.findOneAndUpdate(
					{ _id: user._id },
					{ $pull: { savedBooks: { bookId: params.bookId } } },
					{ new: true }
				  )
				return updatedUser
			}

			throw new AuthenticationError("You must be logged in")
		}
	}
}