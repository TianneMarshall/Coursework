import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import PropTypes from 'prop-types';

class LoginScreen extends Component{

  constructor(props){
    super(props)

    this.state={
      email: '',
      password: ''
    }
  }

  signin = async () => {
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/login",
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
    .then((response) => {
      if(response.status === 200) {
        Toast.show("Successfully signed in!", Toast.LONG);
        return response.json()
      }
      if(response.status === 400){
        console.error("Error - incorrect email/password");
      }
      else if(response.status === 500) {
        console.error("Error - please try again later");
      }
      else{
        console.error("Failed")
      }
    })
    .then(async(responseJson) => {
      await AsyncStorage.setItem('@session_token', responseJson.token);
      await AsyncStorage.setItem('@user_id', responseJson.id.toString());
      this.props.navigation.navigate("Home");
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {

    const navigation = this.props.navigation;

    return(
      <View style={styles.form}>
          <TextInput style={styles.field}
            placeholder="enter email.."
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
          />
          <TextInput style={styles.field}
            placeholder="enter password.."
            secureTextEntry
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
          />

          <View style={styles.signInButton}>
          <Button
            title="Sign in"
            onPress={() => this.signin()}
          />
          </View>

          <View style={styles.signUpButton} >
            <Button
              title="Sign Up"
              onPress={() => navigation.navigate('Register')}
            />
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  form: {
    flex: 1,
    justifyContent: 'center'
  },

  titles: {
    flex: 1,
    alignItems: 'center',
  },

  element: {
    flex: 2
  },

  field: {
    borderWidth: 2,
    borderColor: 'blue',
    margin: 20
  },

  signInButton:{
    padding: 30
  },

  signUpButton:{
    padding: 30
  }

})

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
}

export default LoginScreen;
