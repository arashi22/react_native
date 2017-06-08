import { AsyncStorage } from 'react-native';
import { fork, put, take, call, takeLatest } from 'redux-saga/effects';
import { ActionTypes, LOCAL_STORAGE_USER } from '../constants';
import api from '../util/api';


const loginHandle = function* loginHandle(action) {
  try {
    const token = yield call(api.getToken, action.firebaseToken);
    const result = { token, uid: action.uid }    
    yield put({type: ActionTypes.LOGIN_SUCCESS, result});
  } catch(error) {
    yield put({type: ActionTypes.LOGIN_FAILED, error});
  }
}

const login = function* login() {  
  const watcher = yield takeLatest(ActionTypes.LOGIN, loginHandle);
}

const logout = function* logout() {
  const { LOGOUT, CLEAR_ACCOUNT_INFO } = ActionTypes;
  const action = yield take(LOGOUT);
  yield put({type: CLEAR_ACCOUNT_INFO});
}

const loadAccountInformations = function* loadAccountInformations() {
  try {
    const data = yield call(AsyncStorage.getItem, LOCAL_STORAGE_USER);    
    const user = JSON.parse(data);
    const result = yield call(api.getAccountInfo, user.uid, user.token);
    yield put({type: ActionTypes.LOAD_ACCOUNT_INFO_SUCCESS, result});
  } catch(error) {    
    yield put({type: ActionTypes.LOAD_ACCOUNT_INFO_FAILED, error});
  }
}

const loadAccountInfo = function* loadAccountInfo() {
  const action = yield takeLatest(ActionTypes.LOAD_ACCOUNT_INFO, loadAccountInformations);    
}

const loadSessions = function* loadSessions() {
  const { LOAD_SESSIONS, LOAD_SESSIONS_SUCCESS, LOAD_SESSIONS_FAILED } = ActionTypes;
  try {
    const action = yield take(LOAD_SESSIONS);
    const data = yield call(AsyncStorage.getItem, LOCAL_STORAGE_USER);
    const user = JSON.parse(data);
    const result = yield call(api.getSessions, user.uid, user.token);    
    yield put({type: LOAD_SESSIONS_SUCCESS, result});    
  } catch(error) {    
    yield put({type: LOAD_SESSIONS_FAILED, error});
  }
}

const loadProducts = function* loadProducts() {
  const { LOAD_PRODUCTS, LOAD_PRODUCTS_SUCCESS, LOAD_PRODUCTS_FAILED } = ActionTypes;
  try {
    const action = yield take(LOAD_PRODUCTS);
    const data = yield call(AsyncStorage.getItem, LOCAL_STORAGE_USER);
    const user = JSON.parse(data);
    const result = yield call(api.getProducts, user.tid, user.token);
    yield put({type: LOAD_PRODUCTS_SUCCESS, result});
  } catch(error) {
    yield put({type: LOAD_PRODUCTS_FAILED, error});
  }
}



//// rootSaga

const rootSaga = function* rootSaga() {
  yield [
    fork(login),
    fork(logout),
    fork(loadAccountInfo),
    fork(loadSessions),
    fork(loadProducts),
  ];
}

export default rootSaga;
