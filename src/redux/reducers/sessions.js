import {ActionTypes} from '../../constants';
const {LOAD_SESSIONS, LOAD_SESSIONS_SUCCESS, LOAD_SESSIONS_FAILED, CLEAR_SESSIONS} = ActionTypes;
var initialState = {sessions: null, loading: false, error: null};

export default function sessions(state = initialState, action) {
	switch(action.type) {
		case LOAD_SESSIONS:
			return {
				...state,
				loading: true,
				// sessions: null,
				error: null
			};
		case LOAD_SESSIONS_SUCCESS:		
			return {
				...state,
				loading: false,
				sessions: action.result
			};
		case LOAD_SESSIONS_FAILED:
			return {
				...state,
				loading: false,
				error: action.error
			};
		case CLEAR_SESSIONS:
			return {
				...state,
				sessions: null
			};
		default: 
			return state;
	}
	return state;
}