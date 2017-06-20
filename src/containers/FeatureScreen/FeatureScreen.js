import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView, Image, Text, Platform, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer';
import Pie from 'react-native-pie';
import Dimensions from 'Dimensions';
import find from 'lodash/find';
import join from 'lodash/join';
import moment from 'moment';

import { LOCAL_STORAGE_TOKEN_KEY, Fonts, iOSStatusBarHeight } from '../../constants';
import { Header } from '../../components/Header';
import { ControlPanel } from '../../components/ControlPanel';


export class CardBoxItem extends PureComponent {
  render() {
    const { children, caption } = this.props;
    return (
      <View style={styles.cardBoxItemWrapper}>
        <View style={styles.cardBoxInner}>
          <View style={styles.cardBoxItemCaption}>
            <Text style={styles.cardBoxCaptionTxt}>{ caption }</Text>
          </View>
          <View>
            { children }
          </View>
        </View>
      </View>
    );
  }
}

export class FeatureScreen extends Component {
  constructor (props) {
    super(props);
    
    const sessionId = props.navigation.state.params.id;
    const session = find(props.sessions, { 'ID': sessionId });
    const rawdata = JSON.parse(session.Data);    
    
    this.state = {
      isKeywordsVisible: false,
      results: rawdata.BaseResults,
      moduleName: rawdata.ModuleName,
      keywords: rawdata.Keywords ? rawdata.Keywords : [],
      speaker: rawdata.SpeakerLabels ? rawdata.SpeakerLabels: null,
      scores: rawdata.Scores,
    };
  }

  static navigationOptions = (navigation, screenProps) => {
    const { state, setParams } = navigation.navigation; 
    const stateParams = state.params || {}   
    return {
      header: (
        <Header toggleControlPanel={stateParams.toggleControlPanel} /> 
      )
    }
  };

  _closeControlPanel = () => {
    this._drawer.close()
  };

  _openControlPanel = () => {
    this._drawer.open()
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      toggleControlPanel: this._openControlPanel
    });
  }

  _renderKeywords = () => {
    const { isKeywordsVisible, keywords } = this.state;
    if (isKeywordsVisible) {
      return (
        <View style={styles.keywordsContent}>
          {
            keywords.map((keyword, index) => {
              if (!keyword.Exists)
              return (
                <Text style={styles.singleKeyword1} key={`keyword${index}`}>{ keyword.Word }</Text>
              )
              else
                return (
                <Text style={styles.singleKeyword2} key={`keyword${index}`}>{ keyword.Word  }</Text>
                )
            })
          }
        </View>
      )
    } else return null;
  }
  
  toggleKeywordsView = () => {
    this.setState({ isKeywordsVisible: !this.state.isKeywordsVisible})
  }
  
  getKeyWordScore = (keywords) => {
      let count = 0;
      if (keywords !== null) {
          keywords.forEach(function (obj, index) {
              if (obj.Exists) {
                  count += 1
              }
          });
      }

      return count
  };
  
  renderScoreBox() {
    const score = Math.round(this.state.scores.Final.Score);
    return (
      <CardBoxItem caption="SCORE">
        {/* <Pie
        radius={55}
        innerRadius={0}
        series={[60]}
        colors={['#f00']}
        backgroundColor='#ddd' />
        <View style={styles.gauge}> */}
          <Text style={styles.boxLabel}><Text style={styles.colorBlue}>{score}%</Text></Text>
        {/* </View> */}
      </CardBoxItem>
    )
  };
  
  renderContentBox(data) {
    const keywordscore = this.getKeyWordScore(this.state.keywords) + "/" + this.state.keywords.length;
    return (
      <CardBoxItem caption="CONTENT">
        <Text style={styles.boxLabel}><Text style={styles.colorGreen}>{keywordscore}</Text></Text>
      </CardBoxItem>
    )
  };
  
  renderClarityBox() {
    const clarity = this.state.results.TranscriptClarity;
    return (
      <CardBoxItem caption="CLARITY">
        <Text style={styles.boxLabel}><Text style={clarity > 70 ? styles.colorGreen : styles.colorRed}>{clarity}%</Text></Text>
      </CardBoxItem>
    )
  };
  
  renderFiltersBox() {
    const filter = this.state.results.Fillers.Locations;
    if (filter && filter.length > 0) {
      return (
        <CardBoxItem caption="FILTERES">
          <Text style={styles.boxLabel}><Text style={styles.colorRed}>{filter.length}</Text></Text>
        </CardBoxItem>
      )
    } else {
      return (
        <CardBoxItem caption="FILTERES">
          <Text style={styles.boxLabel}><Text style={styles.colorGreen}>0</Text></Text>
        </CardBoxItem>
      )
    }
  };
  
  renderPaceBox(data) {
    const recommendation = this.state.scores.Pace.Recommendation;
    const score = this.state.results.WPM.Average;
    const wpmRange = this.state.results.WPM.WPMRange;
    let style;
    if (score <= wpmRange.Blue[1]) {
      style = styles.colorRed;
    } else if (score <= wpmRange.Green[1]) {
      style = styles.colorGreen;
    } else {
      style = styles.colorRed;
    }
    return (
      <CardBoxItem caption="PACE">
        <Text style={styles.boxLabel2}><Text style={style}>{recommendation}</Text></Text>
        <Text style={styles.boxLabel3}><Text style={style}>{Math.round(score)} wpm</Text></Text>
      </CardBoxItem>
    )
  };
  
  renderEnergyBox(data) {
    const score = this.state.scores.Energy.Score;
    let style;
    let text;
    if (score > 0.8) {
      text = 'Too much';
      style = {color: 'red', fontSize: 18};
    } else if (score >= 0.35) {
      text = 'Great';
      style = styles.colorGreen;
    } else {
      text = 'Low';
      style = styles.colorRed;
    }
    return (
      <CardBoxItem caption="ENERGY">
        <Text style={styles.boxLabel}><Text style={style}>{text}</Text></Text>
      </CardBoxItem>
    )
  };
  
  render() {
    const { navigation } = this.props;
    const { results } = this.state;
    return (
      //Material Design Style Drawer
      <Drawer 
      ref={(ref) => this._drawer = ref}
      type="displace"
      content={<ControlPanel navigation={navigation} />}
      tapToClose={true}
      openDrawerOffset={0.1} // 10% gap on the right side of drawer
      panCloseMask={0.1}
      closedDrawerOffset={-3}
      styles={drawerStyles}
      tweenHandler={(ratio) => ({
        main: { opacity:(2-ratio)/2 }
      })}
      onOpen={()=>{
        navigation.setParams({toggleControlPanel: this._closeControlPanel})
        }}
      onClose={()=>{
        navigation.setParams({toggleControlPanel: this._openControlPanel})
        }}
      >
        <ScrollView style={styles.container}>
          <View style={styles.labelWrapper}>
            <Text style={styles.headerLabel}>Apoquel - Features</Text>
          </View>
          <Text>Metrics</Text>
          <View style={[styles.itemWrapper, styles.itemShadow, styles.flexContainer]}>
            {this.renderScoreBox()}
            {this.renderContentBox()}
            {this.renderClarityBox()}
            {this.renderFiltersBox()}
            {this.renderPaceBox()}
            {this.renderEnergyBox()}
          </View>
          <View style={[styles.itemWrapper, styles.itemShadow]}>
            <View style={[styles.keywordContainer, styles.flexContainer]}>
              <Text  style={styles.keywordLabel}>Keywords</Text>
              <Text style={styles.keywordLabel} onPress={this.toggleKeywordsView }>1</Text>
            </View>
            { this._renderKeywords() }
          </View>
          <View style={[styles.itemWrapper, styles.itemShadow, styles.transcriptContainer]}>
            <View style={styles.flexContainer}>
              <Text style={styles.transcriptLabel}>Transcript</Text>
              <Text style={styles.keywordLabel}>2</Text>
            </View>
            <Text style={styles.transcriptTxt}>
              { join(results.Words, ' ') }
            </Text>
          </View>
        </ScrollView>
      </Drawer>
    );
  }
}

FeatureScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connect(
  state => ({auth: state.auth, account: state.account, sessions: state.sessions.sessions})
)(FeatureScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 17,
    paddingHorizontal: 25,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  labelWrapper: {
    paddingBottom: 36
  },
  headerLabel: {
    alignSelf: 'flex-start',
    fontSize: 18,
    lineHeight: 29,
    color: '#595960',
  },
  headerSubtitle: {
    alignSelf: 'flex-start',
    fontSize: 18,
    lineHeight: 20,
    color: '#595960',
  },
  itemWrapper: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d8d8d8',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 10,
  },
  itemShadow: {
    shadowOffset:{
      width: 0,
      height: 1
    },
    shadowRadius: 2,
    shadowColor: 'black',
		shadowOpacity: 0.5,
  },
  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardBoxItemWrapper: {
    width: '33%',
    flexGrow: 1,
  },
  cardBoxInner: {
    borderRadius: 8,
    borderWidth: 1,
    margin: 3,
    borderColor: '#d8d8d8',
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardBoxItemCaption: {
    borderBottomWidth: 1,
    borderColor: '#E1E1E1',
    padding: 5,
    marginBottom: 10,
  },
  cardBoxCaptionTxt: {
    color: '#777',
    fontSize: 12,
  },
  boxLabel: {
    fontSize: 26,
    height: 38
  },
  boxLabel2: {
    textAlign: 'center',
    fontSize: 18,
  },
  boxLabel3: {
    textAlign: 'center',
    fontSize: 14,
  },
  colorBlue: {
    color: 'blue'
  },
  colorGreen: {
    color: 'green'
  },
  colorRed: {
    color: 'red'
  },
  keywordContainer: {
    paddingLeft: 20,
    paddingRight: 50,
  },
  keywordsContent: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#E1E1E1',
    paddingLeft: 20,
  },
  keywordLabel: {
    fontSize: 20,
    color: '#777'
  },
  singleKeyword1: {
    fontSize: 20,
    color: 'red',
    paddingBottom: 10,
  },
  singleKeyword2: {
    fontSize: 20,
    color: 'blue',
    paddingBottom: 10,
  },
  transcriptContainer: {
    paddingHorizontal: 16,
  },
  transcriptLabel: {
    fontSize: 22,
    color: '#777',
    marginBottom: 10,
  },
  transcriptTxt: {
    fontSize: 20,
    color: '#777',
    lineHeight: 30,
  },
  gauge: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: 'rgba(74,143,224,1)',
    fontSize: 24,
  },
});

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
}