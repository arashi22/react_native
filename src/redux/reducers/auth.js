import { AsyncStorage } from 'react-native';

import { LOCAL_STORAGE_USER, ActionTypes } from '../../constants';
const { LOGIN, LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT } = ActionTypes;
const initialAuthState = { user: null, loading: false, error: null };

export default function auth(state = initialAuthState, action) {  
  switch(action.type) {
		case LOGIN:
			return {
				...state,
				loading: true,
				user: null,
				error: null
			};
		case LOGIN_SUCCESS:
			AsyncStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(action.result)).done();
			return {
				...state,
				loading: false,
				user: action.result
			};
		case LOGIN_FAILED:
			return {
				...state,
				loading: false,
				error: action.error
			};
		case LOGOUT:
			AsyncStorage.removeItem(LOCAL_STORAGE_USER).done();
			return {
				...state,
				user: null
			};
		default: 
			return state;
	}
	return state;
}