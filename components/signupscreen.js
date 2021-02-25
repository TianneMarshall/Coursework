/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import {Button, Text, Form, Item, Input, View} from 'native-base';
import Toast from 'react-native-simple-toast';
import PropTypes from 'prop-types';

class SignUpScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  }

  registerUser(){

    return fetch("http://10.0.2.2:3333/api/1.0.0/user",
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password
      })
    })
    .then(() => {
      Toast.show("Successfully registered!");
      this.props.navigation.navigate('Sign In');
    })
    .catch((error) => {
      Alert.alert("Could not sign up")
      console.error(error);
    });
  }

  checkValidInput() {

    // data validation to ensure all form boxes have been filled out
    if(this.state.first_name === ''){
      console.error('please enter first name');
    }
    else if(this.state.last_name === ''){
      console.error('please enter last name');
    }
    else if(this.state.email === ''){
      console.error('please enter email');
    }
    else if(this.state.password === ''){
      console.error('please enter password');
    }
    else if(!this.state.email.match('@')){
      console.error('must enter a valid email using @')
    }
    // throw error if first name or last name contains a digit
    else if(this.state.first_name.match(/\d/) || this.state.last_name.match(/\d/)){
      console.error('Name must only contain letters')
    }
    // throw error is password does not contain a number
    else if(!this.state.password.match(/\d/)) {
      console.error('Password must contain at least one number')
    }
    else if (this.state.password !== this.state.confirmPassword) {
      console.error('Password does not match, please re-enter password')
    }
    // if all data is valid then execute add user post request
    else{
      this.registerUser();
    }
  }

  render() {

    return(
      <View style={styles.form}>
      <ScrollView>
        <Form>
          <Item>
            <Input
              style={styles.field}
              placeholder="Enter your first name.."
              onChangeText={(first_name) => {this.setState({first_name})}}
              value={this.state.first_name}
            />
          </Item>

          <Item>
            <Input 
              style={styles.field}
              placeholder="Enter your last name.."
              onChangeText={(last_name) => {this.setState({last_name})}}
              value={this.state.last_name}
            />
          </Item>

          <Item>
            <Input
              style={styles.field}
              placeholder="Enter your email address.."
              onChangeText={(email) => {this.setState({email})}}
              value={this.state.email}
            />
          </Item>

          <Item inlineLabel>
            <Input 
              style={styles.field}
              placeholder="Enter your password.."
              secureTextEntry
              onChangeText={(password) => {this.setState({password})}}
              value={this.state.password}
            />
          </Item>

          <Item>
            <Input
              style={styles.field}
              placeholder="Re-enter your password.."
              secureTextEntry
              onChangeText={(confirmPassword) => {this.setState({confirmPassword})}}
              value={this.state.confirmPassword}
            />
          </Item>
        </Form>
        
        <Button primary block rounded onPress={() => this.checkValidInput()}>
          <Text> Register </Text>
        </Button>
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    margin: 10
  },
  field: {
    borderWidth: 2,
    borderColor: 'blue',
    textAlign: 'center',
    margin: 15
  },
  image: {
    alignSelf: 'center',
    margin: 5,
    color: 'blue',
  },
  button: {
    alignSelf: 'center',
    margin: 10
  }
});

SignUpScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
}
export default SignUpScreen;
