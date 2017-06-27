import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView, Image, Text, Platform, FlatList, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Drawer from 'react-native-drawer';
import PopupDialog from 'react-native-popup-dialog';

import {each, join, get, map} from 'lodash';
import Dimensions from 'Dimensions';
import {RTCView} from 'react-native-webrtc';

import { LOCAL_STORAGE_TOKEN_KEY, Fonts, iOSStatusBarHeight } from '../../constants';
import * as ProductActionCreators from '../../redux/actions/productsActions';
import { Header } from '../../components/Header';
import { ControlPanel } from '../../components/ControlPanel';
import Commons from "../../lib/commons.js";

const startRecord = require('../../../assets/images/start.png')
const stopRecord = require('../../../assets/images/stop.png')

const webRTCServices = require('../../lib/services.js');
const AUDIO_CONFERENCE_ROOM = "video_conference";
const SELF_STREAM_ID = "self_stream_id";


export class Product extends PureComponent {

  getItemDetails = (details) => {
    let htmlContent = [];
    each(details, (detail, index)=> {
      console.log('detail', detail)
      htmlContent.push(
        <View key={`InnerProduct_${index}`}>
          <TouchableWithoutFeedback style={styles.innerItem} onPress={(e)=> this.props.onPressItem(detail, this.props.productLabel, this.props.productId)} activeOpacity={1}>
            <View style={styles.productItem}>              
              <Text style={styles.itemVal}>{detail.Name}</Text>
              <Text style={styles.itemLinkImage}>=</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.innerItemSeparator} />
        </View>
      );
    });
    return htmlContent;
  }

  componentDidMount() {

  }

  render() {
    const {productLabel, productId, details} = this.props;    
    return (
        <View style={[styles.itemWrapper, styles.itemShadow]}>
          <Text style={styles.productLabel}>{productLabel}</Text>
          <View style={styles.titleSeparator} />
          <View style={styles.innerItemGroup}>
            {this.getItemDetails(details)}
          </View>
        </View>      
    );
  }
}

export class ProductScreen extends Component {

  static navigationOptions = (navigation, screenProps) => {
    const { state, setParams } = navigation.navigation; 
    const stateParams = state.params || {}   
    return {
      header: (
        <Header toggleControlPanel={stateParams.toggleControlPanel}/> 
      ),
    }
  };

  constructor (props) {
    super(props);

    this.state = {
      isRecording: true,
      intervalId: null,
      minute: null,
      second: null,
      totalSecond: null,
      productId: null,      
      productLabel: null,
      moduleDetail: null,
      selfViewSrc: null,
      activeStreamId: null,
      //streamURLs: sampleStreamURLs,
      streams: [], //list of (id, url: friend Stream URL). Id = socketId
      joinState: "ready", //joining, joined
      name: "Tho Q Luong"
    }
  }

  _keyExtractor = (item, index) => index;

  _onPressItem = (moduleDetail, productLabel, productId) => {
    // updater functions are preferred for transactional updates
    this.setState(
      {
        moduleDetail: moduleDetail,
        productLabel: productLabel,
        productId: productId,
        minute: null,
        second: null,
        totalSecond: null
      }
    );
    this.popupDialog.show();
    const { navigation } = this.props;
    //navigation.navigate('FeatureScreen');
  };

  _renderItem = ({item}) => (
    <Product productLabel={item.Name} productId={item.ID} details={item.Modules} onPressItem={this._onPressItem} />
  );

  _closeControlPanel = () => {
    this._drawer.close()
  };

  _openControlPanel = () => {
    this._drawer.open()
  };

  _onPressRecord = () => {
    this.setState(prevState => ({isRecording: !prevState.isRecording}));
    if(this.state.isRecording) {    
      const intervalId = setInterval(()=>{        
        this.setState(prevState => ({
          minute: Math.floor(prevState.totalSecond / 60),
          second: prevState.totalSecond % 60,
          totalSecond: prevState.totalSecond + 1,
        }))
      }, 1000);
      this.setState({intervalId: intervalId});
    }
    else
      clearInterval(this.state.intervalId)
    this.handleJoinClick();
  }

  handleJoinClick = () => {
    //ELSE:
    this.setState({
      joinState: "joining"
    });
    let callbacks = {
      joined: this.handleJoined,
      friendConnected: this.handleFriendConnected,
      friendLeft: this.handleFriendLeft,
    }
    webRTCServices.getLocalStream(true, (stream) => {
      this.setState({
        streams: [{
          id: this.state.moduleDetail.id,
          url: stream.toURL()
        }]
      })
    });
    webRTCServices.join(AUDIO_CONFERENCE_ROOM, 'ssa', callbacks);
  }

  //----------------------------------------------------------------------------
  //  WebRTC service callbacks
  handleJoined = () => {
    this.setState({
      joinState: "joined"
    });
  }

  handleFriendLeft = (socketId) => {
    let newState = {
      streams: this.state.streams.filter(stream => stream.id != socketId)
    }
    this.setState(newState);
  }

  handleFriendConnected = (socketId, stream) => {
    this.setState({
      streams: [
        ...this.state.streams,
        {
          id: socketId,
          url: stream.toURL()
        }
      ]
    })
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.auth.user && newProps.auth.user) {
      // login success action
      this.props.loadProducts.loadProducts();
    }
  }

  componentDidMount() {
    const { navigation, auth } = this.props;
    navigation.setParams({
      toggleControlPanel: this._openControlPanel,
    });

    // If user is authenticated
    if (auth.user) {
      // Load sessions      
      this.props.loadProducts.loadProducts();
    }    
  }

  render() {
    const { navigation, products } = this.props;    
    console.log(products)
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
        <View style={styles.container}>
          <PopupDialog
            ref={(popupDialog) => this.popupDialog=popupDialog }            
            width={Dimensions.get('window').width-50}
            height={Dimensions.get('window').height-200}           
          >
            <View style={styles.modalWrap}>
              <View style={styles.modalTitle}>
                <Text style={styles.moduleName}>{get(this.state, 'moduleDetail.Name')}</Text>
                <Text style={styles.productName}>{this.state.productLabel}</Text>
              </View>
              <View style={styles.modalContent}>
                <Text style={styles.instruction}>{join(get(this.state.moduleDetail, 'Instructions'), ' ')}</Text>                
                <View style={styles.separator}></View>              
                <View style={styles.keywordsWrapper}>
                  <Text style={styles.label}>Keywords</Text>
                </View>
                <View style={styles.keywordContainer}>                  
                  {                    
                    map(get(this.state.moduleDetail, 'Keywords'), (item, index) => {
                      return(<Text key={index} style={styles.keyword}>{item}</Text>)
                    })
                  }
                </View>                
                <View style={styles.recordWrap}>
                  <TouchableWithoutFeedback onPress={this._onPressRecord} activeOpacity={1}>
                    <View style={styles.record}>
                      <Image source={startRecord} style={styles.logoImage} />
                    </View>
                  </TouchableWithoutFeedback>
                  <Text style={styles.time}>{this.state.minute}:{this.state.second}</Text>
                </View>
              </View>
            </View>
          </PopupDialog>
          <View style={styles.labelWrapper}>
            <Text style={styles.headerLabel}>Products</Text>            
          </View>
          <FlatList
            data={products.products.Products}            
            style={styles.itemGroup}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
          />
        </View>
      </Drawer>
    );
  }
}

ProductScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

Product.propTypes = {
  productLabel: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  details: PropTypes.array,
  onPressItem: PropTypes.func.isRequired
}

export default connect(
  state => ({auth: state.auth, products: state.products }),
  dispatch => ({
    loadProducts: bindActionCreators(ProductActionCreators, dispatch),
  })
)(ProductScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 17,
    paddingHorizontal: 25,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  labelWrapper: {
    paddingBottom: 9,
    marginLeft: 5
  },
  headerLabel: {
    alignSelf: 'flex-start',
    fontSize: 24,
    lineHeight: 29,
    color: '#898989',
  },
  titleSeparator: {
    height: 1,
    flex: 1,
    backgroundColor: 'rgb(237,237,237)',
    marginTop: 10
  },
  itemWrapper: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d8d8d8',
    paddingHorizontal: 10,
    paddingBottom: 17,
    marginTop: 24,
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
  productLabel: {
    fontSize: 20,
    color: '#898989',
    lineHeight: 24,
    alignSelf: 'flex-start',
    fontWeight: '600',
    marginTop: 19
  },
  innerItemGroup: {
    paddingHorizontal: 13,
  },
  innerItem: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginTop: 8,
  },
  innerItemSeparator: {
    height: 1,
    flex: 1,
    backgroundColor: 'rgb(237,237,237)',
    marginTop: 11
  },
  itemVal: {
    fontSize: 16,
    color: 'rgba(74, 142, 224, 1)'
  },
  itemLinkImage: {
    color: 'rgba(74, 142, 224, 1)'
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    marginTop: 8,
    flex: 1
  },
  modalWrap: {
    borderRadius: 20,    
    padding: 14
  },
  modalTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',    
  },
  moduleName: {
    fontSize: 30,
    lineHeight: 36,
    color: 'rgba(8, 43, 79, 1)'
  },
  productName: {
    fontSize: 20,
    lineHeight: 36,
    color: 'rgba(89, 89, 91, 1)'
  },
  modalContent: {
    padding: 15
  },
  instruction: {
    fontSize: 16,
    color: 'rgba(8, 43, 79, 1)',
    lineHeight: 19
  },
  separator: {
    height: 2,
    width: 145,
    backgroundColor: 'rgba(8, 43, 79, 1)',
    alignSelf: 'center',
    marginTop: 25
  },
  keywordsWrapper: {
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    lineHeight: 21,
    color: 'rgba(8, 43, 79, 1)',
  },
  keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12    
  },
  keyword: {
    width: '50%',
    color: 'rgba(8, 43, 79, 1)',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center'
  },
  recordWrap: {
    marginTop: 36,
  },
  record: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'red',
    alignSelf: 'center'
  },
  time: {
    fontSize: 30,
    lineHeight: 36,
    color: 'black',
    marginTop: 8,
    alignSelf: 'center'
  },
  selfView: {
    flex: 1,
    backgroundColor: '#ccc',
    borderWidth: 1,
    borderColor: '#000',
    height:200
  }
});

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 3},
}