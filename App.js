
/**
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import configureStore from './src/store';
import AppWithNavigationState from './src/navigators/AppNavigator';
import navReducer from './src/redux/reducers/nav';
import Firebase from "./src/firebase/firebase";

const initialState = configureStore(navReducer);
Firebase.initialise();

export default class App extends Component {

  render() {
    return (
      <Provider store={initialState}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('HobbyProjectApp', () => App);