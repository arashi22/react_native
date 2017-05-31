

/**
 * Combine all reducers in this file and export the combind reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux';
import auth from './auth';
import account from './account';
import sessions from './sessions';
import products from './products';

/**
 * Create the main reducer with the asynchronosly loaded ones
 */

export default function createReducer(navReducer) {
  return combineReducers({
    nav: navReducer,
    auth,
    account,
    sessions,
    products,
  })
}