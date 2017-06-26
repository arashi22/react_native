import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView, Image, Text, Platform, FlatList, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Drawer from 'react-native-drawer';
import moment from 'moment';
import Dimensions from 'Dimensions';

import { LOCAL_STORAGE_TOKEN_KEY, Fonts, iOSStatusBarHeight, DashboardInfo } from '../../constants';
import { Header } from '../../components/Header';
import { ControlPanel } from '../../components/ControlPanel';
import { loadSessions } from '../../redux/actions/sessionsActions';

import calendarIcon from '../../../assets/images/dashboard/calendar.png';
import clockIcon from '../../../assets/images/dashboard/clock.png';
import percentIcon from '../../../assets/images/dashboard/percent.png';


export class ItemGroup extends PureComponent {
  secondsTohhmmss = (totalSeconds) => {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds - (minutes * 60));

    // round seconds
    seconds = Math.round(seconds * 100) / 100;

    let result = (minutes < 10 ? "0" + minutes : minutes);
        result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
    return result;
  };
    
  render() {
    const { data: session, onPressItem } = this.props;    
    let rawdata = {};
    if (session.Data!=='asd') {
      rawdata = JSON.parse(session.Data);
    }

    const date = moment(new Date(session.Date)).format('M/D/YY');
    const duration = this.secondsTohhmmss(session.Duration);
    const score = 5;
    return (
      <TouchableWithoutFeedback activeOpacity={1} onPress={onPressItem}>
        <View style={[styles.itemWrapper, styles.itemShadow]}>
          <Text style={styles.itemLabel}>ABC Inc. - 15 seats ASAP</Text>
          <View style={styles.innerItemGroup}>
            <View style={styles.innerItem}>
              <Image source={calendarIcon} style={styles.thumbIcon} />
              <Text style={styles.itemVal}>{date}</Text>
            </View>
            <View style={styles.innerItem}>
              <Image source={clockIcon} style={styles.thumbIcon} />
              <Text style={styles.itemVal}>{duration}</Text>
            </View>
            <View style={styles.innerItem}>
              <Image source={percentIcon} style={styles.thumbIcon} />
              <Text style={styles.itemVal}>{score}%</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export class MainScreen extends Component {

  static navigationOptions = (navigation, screenProps) => {
    const { state, setParams } = navigation.navigation; 
    const stateParams = state.params || {}   
    return {
      header: (
        <Header toggleControlPanel={stateParams.toggleControlPanel}/> 
      ),
    }
  };

  _keyExtractor = (item, index) => index;

  _onPressItem = (item) => {
    const { navigation } = this.props;
    navigation.navigate('Feature', {id: item.ID});
  };

  _renderItem = ({item}) => (
    <ItemGroup data={item} onPressItem={(e) => this._onPressItem(item)} />
  );

  _closeControlPanel = () => {
    this._drawer.close()
  };

  _openControlPanel = () => {
    this._drawer.open()
  };

  componentDidMount() {    
    const { navigation, auth } = this.props;
    navigation.setParams({
      toggleControlPanel: this._openControlPanel,
    });    
    // If user is authenticated
    if (auth.user) {
      // Load sessions      
      this.props.loadSessions();
    }
  }

  componentWillReceiveProps(props) {
    if(props !== this.props) {}
  }

  render() {
    const { navigation, sessions } = this.props;
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
        {sessions ?
          <View style={styles.container}>
            <View style={styles.labelWrapper}>
              <Text style={styles.headerLabel}>Call Recordings</Text>
              <Text style={styles.headerSubtitle}>Daborah Watson</Text>
            </View>
            <FlatList
              data={sessions}
              style={styles.itemGroup}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
            />
          </View>
        :
          <ActivityIndicator
            animating={true}
            style={[styles.centering, {height: 80}]}
            size="large"
          />
        }
      </Drawer>
    );
  }
}

MainScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

ItemGroup.propTypes = {
  data: PropTypes.object.isRequired,
  onPressItem: PropTypes.func.isRequired
}

export default connect(
  state => ({auth: state.auth, account: state.account.account, sessions: state.sessions.sessions}),
  dispatch => ({    
    loadSessions: bindActionCreators(loadSessions, dispatch),
  })
)(MainScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 17,
    paddingHorizontal: 25,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  labelWrapper: {
    paddingBottom: 12
  },
  headerLabel: {
    alignSelf: 'flex-start',
    fontSize: 24,
    lineHeight: 29,
    color: '#595960',
  },
  headerSubtitle: {
    alignSelf: 'flex-start',
    fontSize: 18,
    lineHeight: 20,
    color: '#595960',
  },
  itemGroup: {
   paddingBottom: 25, 
  },
  itemWrapper: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d8d8d8',
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 5,
    marginBottom: 15,
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
  itemLabel: {
    fontSize: 20,
    color: '#595959',
    lineHeight: 24,
    alignSelf: 'flex-start',
    fontWeight: '600',
    paddingLeft: 5,
  },
  innerItemGroup: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  innerItem: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 20,
  },
  thumbIcon: {
    width: 20,
    height: 20,
  },
  itemVal: {
    marginLeft: 25,
    fontSize: 20,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  }
});

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
}