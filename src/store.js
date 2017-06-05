import { createStore, applyMiddleware, compose } from 'redux';
import { NavigationActions } from 'react-navigation';
import createSagaMiddleware from 'redux-saga';
import createReducer from './redux/reducers/';
import rootSaga from './redux/sagas';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(navReducer = {}) {

  //Create the store with two middlewares
  // 1. sagaMiddleware: Makes the redux-sagas work
  // 2. routerMiddleware: Syns the location/U
  const middlewares = [
    sagaMiddleware,
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is install use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = 
    process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Prevents Redux DevTools from re-dispatching all previous actions.
      shouldHotReload: false
  }) : compose;
  /* eslint-enabled */

  const store = createStore(
    createReducer(navReducer),
    undefined,
    composeEnhancers(...enhancers),
  );

  sagaMiddleware.run(rootSaga);

  //Extensions
  store.runSaga = sagaMiddleware.run;
  store.asyncReducers = {}; // Async reducer registry

  return store;
}