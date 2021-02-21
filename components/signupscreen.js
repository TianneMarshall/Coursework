/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Alert, ScrollView } from 'react-native';
import {Button, Text, View, List, ListItem, Input} from 'native-base';
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
    if(this.state.first_name === ''){
      Alert.alert('please enter first name');
    }
    else if(this.state.last_name === ''){
      Alert.alert('please enter last name');
    }
    else if(this.state.email === ''){
      Alert.alert('please enter email');
    }
    else if(this.state.password === ''){
      Alert.alert('please enter password');
    }
    else if (this.state.password !== this.state.confirmPassword) {
      Alert.alert("Password does not match, please confirm password")
    }
    else{
      this.registerUser();
    }
  }

  render() {

    return(
      <ScrollView>
        <List>
          <ListItem>
            <Input
              placeholder="Enter your first name.."
              onChangeText={(first_name) => {this.setState({first_name})}}
              value={this.state.first_name}
            />
          </ListItem>

          <ListItem>
            <Input 
              placeholder="Enter your last name.."
              onChangeText={(last_name) => {this.setState({last_name})}}
              value={this.state.last_name}
            />
          </ListItem>

          <ListItem>
            <Input
              placeholder="Enter your email address.."
              onChangeText={(email) => {this.setState({email})}}
              value={this.state.email}
            />
          </ListItem>

          <ListItem inlineLabel>
            <Input 
              placeholder="Enter your password.."
              secureTextEntry
              onChangeText={(password) => {this.setState({password})}}
              value={this.state.password}
            />
          </ListItem>

          <ListItem>
            <Input
              placeholder="Re-enter your password.."
              secureTextEntry
              onChangeText={(confirmPassword) => {this.setState({confirmPassword})}}
              value={this.state.confirmPassword}
            />
          </ListItem>
      
        </List>
        
        <Button primary block rounded onPress={() => this.checkValidInput()}>
          <Text> Register </Text>
        </Button>
      </ScrollView>
    );

  }
}

SignUpScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
}
export default SignUpScreen;
