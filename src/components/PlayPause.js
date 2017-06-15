import React, { Component, PropTypes } from 'react'
import { withMediaProps } from 'react-media-player'
import Transition from 'react-motion-ui-pack'

class ScaleX extends Component {
  render() {
    return (
      <Transition
        component="g"
        enter={{ scaleX: 1 }}
        leave={{ scaleX: 0 }}
      >
        {this.props.children}
      </Transition>
    )
  }
}

class PlayPause extends Component {
  _handlePlayPause = () => {
    this.props.media.playPause()
  }

  render() {
    const { media: { isPlaying }, className } = this.props
    return (
      <svg
        role="button"
        width="36px"
        height="36px"
        viewBox="0 0 36 36"
        className={className}
        onClick={this._handlePlayPause}
      >
        <circle stroke="#C0BFBF" cx="18" cy="18" r="18" strokeWidth="4" fill="none" />
          <ScaleX>
            { isPlaying &&
              <g key="pause" style={{ transformOrigin: '0% 50%' }}>
                <rect x="12" y="11" fill="#C0BFBF" width="4" height="14"/>
                <rect x="20" y="11" fill="#C0BFBF" width="4" height="14"/>
              </g>
            }
          </ScaleX>
          <ScaleX>
            { !isPlaying &&
              <polygon
                key="play"
                fill="#C0BFBF"
                points="14,11 26,18 14,25"
                style={{ transformOrigin: '100% 50%' }}
              />
            }
          </ScaleX>
      </svg>
    )
  }
}

export default withMediaProps(PlayPause)