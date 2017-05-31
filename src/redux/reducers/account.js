import {AsyncStorage} from 'react-native';

import {ActionTypes} from '../../constants';
const {LOAD_ACCOUNT_INFO, LOAD_ACCOUNT_INFO_SUCCESS, LOAD_ACCOUNT_INFO_FAILED, CLEAR_ACCOUNT_INFO} = ActionTypes;
var initialState = {account: null, loading: false, error: null};

export default function account(state = initialState, action) {
	switch(action.type) {
		case LOAD_ACCOUNT_INFO:
			return {
				...state,
				loading: true,
				account: null,
				error: null
			};
		case LOAD_ACCOUNT_INFO_SUCCESS:
			return {
				...state,
				loading: false,
				account: action.result
			};
		case LOAD_ACCOUNT_INFO_FAILED:
			return {
				...state,
				loading: false,
				error: action.error
			};
		case CLEAR_ACCOUNT_INFO:
			return {
				...state,
				account: null
			};
		default: 
			return state;
	}
	return state;
}