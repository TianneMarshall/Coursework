import React, { Component } from 'react';
import { Alert, Button, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

class LogoutScreen extends Component{

  signout = async () => {

    const token = await AsyncStorage.getItem('@session_token');

      return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })
      .then((response) => {
        if(response.status === 200) {
          Alert.alert("Logged out")
          this.props.navigation.navigate('Sign In')
        }
        else{
          Alert.alert("Failed")
        }
      })
      .catch((error) => {
        Alert.alert("Failed to log out")
        console.error(error);
      });
  }


  render() {
    return(
      <View>
        <Button
          title="logout"
          onPress={() => this.signout()}
        />
      </View>
    );
  }
}

LogoutScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
}

export default LogoutScreen;
