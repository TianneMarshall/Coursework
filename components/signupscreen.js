import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, FlatList,  Alert } from 'react-native';

class SignUpScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: ''
    }
  }

  registerUser(){
    if (this.state.password != this.state.confirmPassword) {
      Alert.alert("Password does not match")
    }
    else{

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
      .then((response) => {
        Alert.alert("Registered");
        this.props.navigation.navigate('Sign In');
      })
      .catch((error) => {
        Alert.alert("Could not sign up")
        console.error(error);
      });
    }
  }

  render() {

    return(
      <View style={styles.form}>

        <View style={styles.titles}>
          <Text> Sign up </Text>
        </View>

        <View style={styles.element}>
          <Text style={styles.label}> First Name: </Text>
          <TextInput style={styles.field}
            placeholder="Enter your first name"
            onChangeText={(first_name) => {this.setState({first_name})}}
            value={this.state.first_name}
          />
        </View>

        <View style={styles.element}>
          <Text style={styles.label}> Last Name: </Text>
          <TextInput style={styles.field}
            placeholder="Enter your last name"
            onChangeText={(last_name) => {this.setState({last_name})}}
            value={this.state.last_name}
          />
        </View>

        <View style={styles.element}>
          <Text style={styles.label}> Email: </Text>
          <TextInput style={styles.field}
            placeholder="Enter your email address"
            onChangeText={(email) => {this.setState({email})}}
            value={this.state.email}
          />
        </View>

        <View style={styles.element}>
          <Text style={styles.label}> Password: </Text>
          <TextInput style={styles.field}
            placeholder="Enter your password"
            secureTextEntry={true}
            onChangeText={(password) => {this.setState({password})}}
            value={this.state.password}
          />
        </View>

        <View style={styles.element}>
          <Text style={styles.label}> Confirm Password: </Text>
          <TextInput style={styles.field}
            placeholder="Enter your password"
            secureTextEntry={true}
            onChangeText={(confirmPassword) => {this.setState({confirmPassword})}}
            value={this.state.confirmPassword}
          />
        </View>

        <Button
          title="Register"
          onPress={() => this.registerUser()}
        />
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
    borderColor: 'blue'
  },

  label:{
    alignItems: 'center'
  }

})
export default SignUpScreen;
