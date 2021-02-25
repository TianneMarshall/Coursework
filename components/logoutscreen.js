import { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import Toast from 'react-native-simple-toast';

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
        Toast.show("Successfully Signed out")
        this.props.navigation.navigate('Sign In')
      }
      else if(response.status === 401) {
        console.error("Error - Not signed in")
      }
      else if(response.status === 500){
        console.error("Error - Please try again later")
      }
      else{
        console.error("Error - Failed to sign out")
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    this.signout()
    return(
      null
    );
  }
}

LogoutScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
}

export default LogoutScreen;
