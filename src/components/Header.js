import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Text, Platform } from 'react-native';
import Button from 'react-native-button';
import HamburgerMenuButton from '../../assets/images/Menu.png';

const isIOS = Platform.OS == 'ios';

export class Header extends Component {
  constructor(props) {
    super(props);
  }
  _getHeader = () => {
    const { toggleControlPanel } = this.props;    
      return (<View style={styles.headerStyle}>        
        <Button containerStyle={styles.hamburgerButtonContainer} onPress={toggleControlPanel}>
          <Image source={HamburgerMenuButton} style={styles.hamburgerButton} />
        </Button>
        <Text style={styles.headerTitle}>Acme Inc.</Text>
      </View>);
  }

  render() {
    return (
      this._getHeader()
    );
  }
}

Header.propTypes = {
  
};

export default Header;

const styles = StyleSheet.create({
  headerStyle: {
    height: 50,
    marginTop: isIOS? 20 : 0,
    backgroundColor: '#072b4f',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerButtonContainer: {
    paddingHorizontal: 13,
    paddingVertical: 11,
    overflow: 'hidden',
    display: 'flex',
    alignContent: 'center',
    marginLeft: 9
  },
  hamburgerButton: {
    resizeMode: 'contain'
  },
  headerTitle: {
    marginLeft: 20,
    fontSize: 20,
    lineHeight: 24,
    color: '#fff'
  }
});