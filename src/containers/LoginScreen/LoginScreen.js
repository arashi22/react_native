import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Text, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AsyncStorage } from 'react-native';
import { RkTextInput, RkTheme, RkButton } from 'react-native-ui-kitten';
import * as firebase from 'firebase';
import Dimensions from 'Dimensions';

import { LOCAL_STORAGE_USER, Fonts, iOSStatusBarHeight } from '../../constants';
import * as AuthActionCreators from '../../redux/actions/authActions';
import * as AccountActionCreators from '../../redux/actions/accountActions';

const screen_width = Dimensions.get('window').width;
const screen_height = Dimensions.get('window').height;
const isIOS = Platform.OS == 'ios';

class LoginScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      loadingText: 'Logging in...',
      error: '',
      isLoading: false
    };
  }
  
  componentDidMount() {
    // Fetch token key from localStorage
    AsyncStorage.getItem(LOCAL_STORAGE_USER).then((value) => {
      if(value){
        const user = JSON.parse(value);
        this.props.authActions.loginWithUserCache(user);
      }
    }).done();
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.auth.user && newProps.auth.user) {
      // login success action
      this.props.accountActions.loadAccountInfo();
    }
    if (!this.props.auth.error && newProps.auth.error) {
      // login fail action
      Alert.alert('Error', newProps.auth.error.message);
    }
    if (!this.props.account.account && newProps.account.account) {
      this.props.navigation.navigate('Main');
      this.setState({username: '', password: '', isLoading: false});
    }
    if (!this.props.account.error && newProps.account.error) {
      if (this.props.auth.user && this.props.auth.user.token) {
        this.props.authActions.logout();
      }
    }
  }

  async firebaseLogin(email, pass) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, pass);
      firebase.auth().currentUser.getIdToken(true)
        .then((token) => {
          // Dispatch login with firebase token action
          this.props.authActions.login(token, firebase.auth().currentUser.uid);
          this.setState({isLoading: false });
        })
        .catch((error) => this.setState({loadingText: '', error: error.toString(), isLoading: false }));
    } catch (error) {
      this.setState({loadingText: '', error: error.toString(), isLoading: false });
    }
  }

  _onSubmit = () => {
    const {email, password} = this.state;
    if(email == '' || password == '') {
      this.setState(Object.assign({}, email == '' ? {emailError: '*Username is required.'} : {}, password == '' ? {passwordError: '*Password is required.'}: {} ));
      return;
    }
    this.setState({loadingText: 'Logging in...', error: '', isLoading: true});
    this.firebaseLogin(email, password);
  }

  render() {
    const { auth, account } = this.props;
    const { email, emailError, password, passwordError, loadingText, error } = this.state;
    const isLoading = this.state.isLoading || auth.loading || account.loading;
    return (
      <View style={styles.container}>
        <Image source={require('../../../assets/images/login_bg.png')} style={styles.backgroundImage} />        
        <Image source={require('../../../assets/images/logo.png')} style={styles.logoImage} />
        <View style={[styles.loginForm, styles.shadow]}>
          <Text style={styles.headerLabel}>Login</Text>
          <View style={styles.formItem}>
            <Text style={styles.inputLabel}>Email</Text>
            <RkTextInput
              rkType='loginInput'
              inputStyle={styles.inputBox}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={false}
              returnKeyType="next"
              onChangeText={(email) => this.setState({email, emailError: ''})}
              value={email}
              editable={!isLoading} />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.inputLabel}>Password</Text>
            <RkTextInput
              rkType='loginInput'
              inputStyle={styles.inputBox}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={false}
              secureTextEntry={true}
              returnKeyType="go"
              onChangeText={(password) => this.setState({password, passwordError: ''})}
              value={password}
              editable={!isLoading} />
          </View>
          <View style={styles.formItem}>
        		<Text style={styles.forgotPasswordButton}>Forgot Password?</Text>
        	</View>
          <RkButton rkType='loginButton' style={styles.loginButton} onPress={this._onSubmit}>Login</RkButton>
        	<Text style={styles.createAccountButton}>Create account?</Text>
          {!!error && (
            <Text style={styles.errorLabel}>{error}</Text>
          )}
          {!!emailError && (
            <Text style={styles.errorLabel}>{emailError}</Text>
          )}
          {!!passwordError && (
            <Text style={styles.errorLabel}>{passwordError}</Text>
          )}
          {isLoading &&
            <View style={styles.loadingContainer}>              
              <Text style={styles.loadingLabel}>{loadingText}</Text>              
            </View>
          }
        </View>
      </View>
    );
  }
}

LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object,
  error: PropTypes.object,
  loading: PropTypes.bool,
  login: PropTypes.func,
  loginWithCacheToken: PropTypes.func,
  logout: PropTypes.func,
  loadAccountInfo: PropTypes.func
};

LoginScreen.navigationOptions = {
  title: 'Log In',
  header: null
};

export default connect(
  state => ({auth: state.auth, account: state.account}),
  dispatch => ({
    authActions: bindActionCreators(AuthActionCreators, dispatch),
    accountActions: bindActionCreators(AccountActionCreators, dispatch)
  })
)(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: iOSStatusBarHeight,
    paddingHorizontal: 25,
    backgroundColor: '#f6f9fa',
    position: 'relative',
    justifyContent: 'center'
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: screen_width * 0.8,
    height: screen_width * 0.8 * 0.7,
    resizeMode: 'contain', // or 'stretch'
  },
  logoImage: {
    position: 'absolute',
    left: 26,
    top: 27,
    width: screen_width * 0.4,
    height: screen_width * 0.4 * 0.41,
    resizeMode: 'contain', // or 'stretch'
  },
  loginForm: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#d8d8d8',
    borderRadius: 4,
    paddingTop: 29,
    paddingBottom: 39,
    paddingHorizontal: 31,
    backgroundColor: '#ffffff',
  },
  formItem: {
  	flexDirection: 'column',
  	alignItems: 'flex-start',
  },
  shadow: {
    shadowOffset:{
      width: 0,
      height: 1
    },
    shadowRadius: 2,
    shadowColor: 'black',
		shadowOpacity: 0.5,
  },
  headerLabel: {
    fontWeight: '300',
    color: '#595960',
    fontSize: 24,
    alignSelf: 'center',
    lineHeight: 29,
    marginBottom: 11,
  },
  inputLabel: {
    fontWeight: '300',
    color: '#939393',
    fontSize: 14,
    alignSelf: 'flex-start',
    lineHeight: 16,
    marginTop: 0,
    marginBottom: 0
  },
  inputBox: {
    color: '#595959',
    fontSize: 14,
    marginHorizontal: 0,
    marginVertical: 0,
    marginLeft: 0
  },
  forgotPasswordButton: {
    fontSize: 12,
    lineHeight: 14,
    alignSelf: 'flex-start',
    color: '#4a8ee2',
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },
  loginButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 24
  },
  createAccountButton: {
    fontSize: 12,
    lineHeight: 14,
    alignSelf: 'flex-start',
    color: '#4a8ee2',
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    marginTop: 24,
  },
  loadingContainer: {
  	flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	loadingLabel: {
    // backgroundColor: 'transparent',
		color: 'black',
		marginLeft: 5
	},
  errorLabel: {
    color: 'red',
    fontSize: 14
  }
});

RkTheme.setType('RkTextInput', 'loginInput', {
  input: {
    marginLeft: 0,
    marginVertical: 0,
    fontSize: 12,
  }
});

RkTheme.setType('RkButton', 'loginButton', {
  backgroundColor: '#498ee2',
  borderRadius: 8,
  fontSize: 14,
  width: 144,
  height: 37,
});