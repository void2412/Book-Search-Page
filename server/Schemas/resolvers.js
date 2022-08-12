const {User} = require('../models')

const {signToken} = require('../utils/auth')

const resolver = {
	Query: {
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
			const user = await User.findOne({email:email})

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

		saveBook: async (parent, book, context) => {
			if(context.user){
				const updatedUser = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $addToSet: { savedBooks: book } },
					{ new: true, runValidators: true }
				  );

				return updatedUser
			}

			throw new AuthenticationError("You must be logged in")
		},

		removeBook: async (parent, bookId, context) => {
			if(context.user){
				const updatedUser = await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { savedBooks: { bookId: bookId } } },
					{ new: true }
				  )
				return updatedUser
			}

			throw new AuthenticationError("You must be logged in")
		}
	}
}