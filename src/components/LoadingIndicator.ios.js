import React, { Component } from 'react';
import { ActivityIndicatorIOS } from 'react-native';

export class LoadingIndicator extends Component {

  constructor(props){
    super(props);
  }

  render() {
  	return <ActivityIndicatorIOS animating={true} isSmall={true} color={'gray'} />;
  }
}

export default LoadingIndicator;