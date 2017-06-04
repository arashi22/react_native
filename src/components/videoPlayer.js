import React, { Component, PropTypes } from 'react'
import { View } from 'react-native'
import { Media, Player, controls } from 'react-media-player'
import Measure from 'react-measure';
import PlayPause from './PlayPause'
import SeekBar from './seekbar'
import Paper from 'material-ui/Paper';
// import ReactHighcharts from 'react-highcharts';

const { CurrentTime, Progress, Duration, Volume } = controls

export default class VideoPlayer extends React.Component {

  constructor (props) {
    super();
    this.state = {
      seekbarWidth: 0,
      videoDuration: 0,
      divClassName: 'media-controls media-player-for-speaker'
     }
  }

  onMeasure = (dimen) => {
    this.setState({
      ...this.state,
      seekbarWidth: dimen.width
    })
  };

  onDuration = (data) => {
    this.setState({
      ...this.state,
      videoDuration: data.duration
    });
  };

  componentWillReceiveProps (nextProps) {
    this.props = nextProps
  }
  
  fixFillerMarkers = () => {
    let fillerMarkers = [];
    let width = this.state.seekbarWidth;
    let duration = this.state.videoDuration;
    let unit = width/duration;
    let results = this.props.results;
    if(results && results.Fillers && results.Fillers.Locations && results.Fillers.Locations.length > 0) {
      let length = this.props.results.Fillers.Locations.length;
      let locations = this.props.results.Fillers.Locations;
      for(let i = 0; i < length; i++){
        let leftValue = results.StartTimes[locations[i]] * unit;
        let marWidth = results.EndTimes[locations[i]] - results.StartTimes[locations[i]];
        const divStyle = {
          left: leftValue,
          width: marWidth * unit
        };
        fillerMarkers.push(<View className="redMark" style={divStyle} key={i}></View>);
      }
    }
    return fillerMarkers;
  }

  fixPauseMarkers = () => {
    let pauseMarkers = [];
    let width = this.state.seekbarWidth;
    let duration = this.state.videoDuration;
    var unit = width/duration;
    if(this.props.results && this.props.results.Pauses && this.props.results.Pauses.Pauses && this.props.results.Pauses.Pauses.length > 0) {
      let results = this.props.results.Pauses.Pauses;
      let length = results.length;
      for(let i = 0; i < length; i++){
        let pauseWidth = results[i][1] * unit;
        let leftValue = results[i][2] * unit;
        const divStyle = {
          left: leftValue,
          width: pauseWidth 
        };
        pauseMarkers.push(<div className="greenMark" style={divStyle} key={i*10}></div>);
      }
    }
    return pauseMarkers;
  }


  render() {
    let fillerMarkers = [];
    let pauseMarkers = [];
    if(Object.keys(this.props.results).length !== 0 && this.state.videoDuration > 0) {
      if(this.props.showFillers)
        fillerMarkers = this.fixFillerMarkers();
      if(this.props.showPauses)
        pauseMarkers = this.fixPauseMarkers();
    }
    return (
      <Media ref="media" >
          <div
            className='media-player'
            tabIndex="0" >
            <Paper className={this.state.divClassName} zDepth={1} rounded={false}>
              <PlayPause className="media-control media-control--play-pause" />
              <CurrentTime className="media-control media-control--current-time" />
              <div className="media-control-group media-control-group--seek">
                <Progress className="media-control media-control--progress" />
                <Measure onMeasure={this.onMeasure} >
                  <SeekBar className="media-control media-control--seekbar"/>
                </Measure>
                {fillerMarkers}
                {pauseMarkers}
              </div>
              <Duration className="media-control media-control--duration" />
              {/*<MuteUnmute className="media-control media-control--mute-unmute" />
              <Volume className="media-control media-control--volume" />*/}
              {/*<ReactHighcharts config={this.state.config} domProps={{id:'chartId'}}></ReactHighcharts>*/}
            </Paper>
            <Player
              className="player"
              src={this.props.src}
              vendor='video'
              onReady={this.onDuration}
              />
          </div>
      </Media>
    )
  }
}

export default VideoPlayer;