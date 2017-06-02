import {MediaStreamTrack, getUserMedia} from 'react-native-webrtc';

function getLocalStream(isFront, callback) {
  MediaStreamTrack.getSources(sourceInfos => {
    let videoSourceId;
    sourceInfos.forEach((sourceInfo) => {
      if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
        videoSourceId = sourceInfo.id;
      }
    });
    getUserMedia({
      audio: true,
      video: false
    }, function (stream) {
      console.log('Got Stream: ', stream);
      callback(stream);
    }, (error) => {
      console.log("Error: ", error);
    });
  });
}


export default {
  getLocalStream
}