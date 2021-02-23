import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {Button, Text, View, Form, Input, Item} from 'native-base';
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
        throw Error("Error - incorrect email/password");
      }
      else if(response.status === 500) {
        throw Error("Error - please try again later");
      }
      else{
        throw Error("Failed")
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

    const navigator = this.props.navigation;

    return(
      <View style={styles.form}>
        <Form>
          <Item>
            <Input regular
              style={styles.field}
              placeholder="enter email.."
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
            />
          </Item>
          <Item>
            <Input regular
              style={styles.field}
              placeholder="enter password.."
              secureTextEntry
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />
          </Item>
        </Form>
        <Button info block rounded onPress={() => this.signin()} style={styles.button}>
          <Text>Sign in</Text>
        </Button>

        <Button primary block rounded onPress={() => navigator.navigate('Register')} style={styles.button}>
          <Text>Register</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  form: {
    flex: 1,
    justifyContent: 'center'
  },

  field: {
    borderWidth: 2,
    borderColor: 'blue',
    margin: 20
  },

  button: {
    margin: 7
  }

})

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
}

export default LoginScreen;
