import { API_Config } from '../constants';
import ApiUtils from './apiUtils'

const utils = {
  getToken: (firebaseToken) => {
    return fetch(API_Config.baseUrl + 'user/login', {
      method: 'GET',
      headers: {
        'Authorization': firebaseToken,
        'Content-Type': 'application/json'
      }
    })
    .then(ApiUtils.checkStatus)
    .then((response) => {
      // Get jwt token
      const token = response.headers.map.authentication[0];
      return token;
    });
  },
  
  getAccountInfo: (uid, token) => {
    return fetch(API_Config.baseUrl + 'user/' + uid, {
      method: 'GET',
      headers: {
        'Authentication': token,
        'Content-Type': 'application/json'
      }
    })
    .then(ApiUtils.checkStatus)
    .then((response) => response.json());
  },
  
  getSessions: (uid, token) => {
    return fetch(API_Config.baseUrl + 'session/user/' + uid, {
      method: 'GET',
      headers: {
        'Authentication': token,
        'Content-Type': 'application/json'
      }
    })
    .then(ApiUtils.checkStatus)
    .then((response) => response.json());
  },

  getProducts: (tid, token) => {
    return fetch(API_Config.baseUrl + 'product/' + tid, {
      method: 'GET',
      headers: {
        'Authentication': token,
        'Content-Type': 'application/json'
      }
    })
    .then(ApiUtils.checkStatus)
    .then((response) => response.json());
  }
};

export default utils;