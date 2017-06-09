import {ActionTypes} from '../../constants';

export function login(firebaseToken, uid) {
  const {LOGIN} = ActionTypes;
  return {
    type: LOGIN,
    firebaseToken: firebaseToken,
    uid: uid
  }
}

export function loginWithUserCache(user) {
  const {LOGIN_SUCCESS} = ActionTypes;
  return {
    type: LOGIN_SUCCESS,
    result: user
  };
}

export function logout() {
  const {LOGOUT} = ActionTypes;
  return {
    type: LOGOUT,
    result: {}
  };
}
