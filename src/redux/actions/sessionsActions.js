import {ActionTypes} from '../../constants';

export function loadSessions() {
  const {LOAD_SESSIONS} = ActionTypes;
  return {
    type: LOAD_SESSIONS
  }
}