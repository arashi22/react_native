import LoginScreen from '../containers/LoginScreen/LoginScreen';
import MainScreen from '../containers/MainScreen/MainScreen';
import FeatureScreen from '../containers/FeatureScreen/FeatureScreen';
import ProductScreen from '../containers/ProductScreen/ProductScreen';

export const NavRoutesConfiguration = {
  Login: { screen: LoginScreen },
  Main: { screen: MainScreen },
  Feature: { screen: FeatureScreen },
  Product: { screen: ProductScreen },
};

export const StackNavigatorConfiguration = {
  initialRouteName: 'Login',
  headerMode: 'screen'
}