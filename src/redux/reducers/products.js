import {ActionTypes} from '../../constants';
const {LOAD_PRODUCTS, LOAD_PRODUCTS_SUCCESS, LOAD_PRODUCTS_FAILED} = ActionTypes;

var initialState = {
	products: { Products: [] },
	loading: false,
	error: null
};

export default function products(state = initialState, action) {
	switch(action.type) {
		case LOAD_PRODUCTS:
			return {
				...state,
				loading: true,
				// products: null,
				error: null
			};
		case LOAD_PRODUCTS_SUCCESS:
			return {
				...state,
				loading: false,
				products: action.result
			};
		case LOAD_PRODUCTS_FAILED:
			return {
				...state,
				loading: false,
				error: action.error
			};		
		default: 
			return state;
	}
	return state;
}