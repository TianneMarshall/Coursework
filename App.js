import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Homescreen from './components/homescreen';
import ProfileScreen from './components/profilescreen';
import SignUpScreen from './components/signupscreen';
import LoginScreen from './components/loginscreen';

const Tab = createBottomTabNavigator();

class App extends Component {
  constructor(props){
    super(props);

  }

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Register" component={SignUpScreen} />
          <Tab.Screen name="Home" component={Homescreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Sign In" component={LoginScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
export default App;
