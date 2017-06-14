import React, { Component } from 'react';
import ProgressBar from 'ProgressBarAndroid';

export class LoadingIndicator extends Component {

  constructor(props){
    super(props);
  }

  render() {
  	return <ProgressBar styleAttr={'Small'} color={'white'} />;
  }
}

export default LoadingIndicator;
