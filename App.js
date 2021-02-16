import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import  Icon from 'react-native-vector-icons/FontAwesome';

import Homescreen from './components/homescreen';
import ProfileScreen from './components/profilescreen';
import SignUpScreen from './components/signupscreen';
import Location from './components/location';
import LoginScreen from './components/loginscreen';
import LogoutScreen from './components/logoutscreen';
import LocationScreen from './components/locationscreen';
import EditProfileScreen from './components/editprofilescreen';
import WriteReviewScreen from './components/writeReviewScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const UserStack = createStackNavigator();
const LoginStack = createStackNavigator();

function UserNav() {
  return(
    <UserStack.Navigator>
      <UserStack.Screen name="Profile" component={ProfileScreen} />
      <UserStack.Screen name="EditUser" component={EditProfileScreen} />
      <UserStack.Screen name="LocationScreen" component={LocationScreen} />
    </UserStack.Navigator>
  );
}

function HomeNav() {
  return(
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Homescreen} />
      <Stack.Screen name="LocationScreen" component={LocationScreen} />
      <Stack.Screen name="Location" component={Location} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="WriteReviewScreen" component={WriteReviewScreen} />
    </Stack.Navigator>
  );
}

function LoginNav() {
  return(
    <Stack.Navigator>
      <Stack.Screen name="Sign In" component={LoginScreen} />
      <Stack.Screen name="Register" component={SignUpScreen} />
    </Stack.Navigator>
  );
}


class App extends Component {
  constructor(props){
    super(props);

  }

  render() {
    return (

      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Sign In" component={LoginNav} />
          <Tab.Screen name="Home" component={HomeNav} />
          <Tab.Screen name="Profile" component={UserNav} />
          <Tab.Screen name="Sign out" component={LogoutScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
export default App;
