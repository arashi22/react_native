import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Text, Platform } from 'react-native';
import Button from 'react-native-button';
import Dimensions from 'Dimensions';

const screen_width = Dimensions.get('window').width;
const screen_height = Dimensions.get('window').height;
const isIOS = Platform.OS == 'ios';


export class ControlPanel extends Component {  

  _onPressHome = () => {
    const { navigation } = this.props;
    navigation.navigate('Main');
  }

  _onPressProducts = () => {
    const { navigation } = this.props;
    navigation.navigate('Product');
  }

  _OnPressSettings = () => {
    const { navigation } = this.props;
  }

  render() {
    return (
      <View style={styles.menuStyle}>        
        <Image source={require('../../assets/images/login_bg.png')} style={styles.backgroundImage} />      
        <Button style={styles.menuItem} onPress={this._onPressHome}>Home</Button>
        <View style={styles.separator}/>
        <Button style={styles.menuItem} onPress={this._onPressProducts}>Products</Button>
        <View style={styles.separator} />
        <Button style={styles.menuItem}>Settings</Button>        
      </View>
    );
  }
}

ControlPanel.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default ControlPanel;

const styles = StyleSheet.create({
  menuStyle: {
    flex: 1,
    backgroundColor: '#072b4f',
    paddingHorizontal: 14,
    paddingTop: 50
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    height: screen_width * 0.8 * 0.7,
    resizeMode: 'contain', // or 'stretch'
  },
  menuItem: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    fontSize: 20,
    color: 'white',
    lineHeight: 50,    
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginVertical: 5
  }
});