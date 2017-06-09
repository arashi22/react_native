import {ActionTypes} from '../../constants';

export function loadAccountInfo() {
  const {LOAD_ACCOUNT_INFO} = ActionTypes;
  return {
    type: LOAD_ACCOUNT_INFO
  }
}