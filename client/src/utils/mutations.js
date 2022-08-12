import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
	mutation loginUser($email: String!, $password: String!){
		login(email: $email, password: $password){
			token,
			user{
				_id
				username
			}
		}
	}
`

export const ADD_USER = gql`
	mutation addUser($username: String!, $email: String!, $password: String!){
		addUser(username: $username, email: $email, password: $password) {
			token
			user {
				_id
				username
			}
		}
	}
`

export const SAVE_BOOK = gql`
	mutation saveBook($authors: Array, $description: String!, $title: String!, $bookId: String!, $image: String, $link: String){
		saveBook(authors: $authors, description: $description, title: $title, bookId: $bookId, image: $image, link: $link){
			user{
			_id
			username
			email
			savedBooks{
				bookId
				title
				description
				authors
				image
				link
				}
			bookCount
			}
		}
	}
`

export const REMOVE_BOOK = gql`
	mutation removeBook($bookId: String!){
		removeBook(bookId: $bookId){
			user{
			_id
			username
			email
			savedBooks{
				bookId
				title
				description
				authors
				image
				link
				}
			bookCount
			}
		}
	}
`