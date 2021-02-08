import React, { Component } from 'react';
import { Alert, AsyncStorage, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

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
      if(response.status == 200) {
        Alert.alert("Signed in");
        return response.json()
      }
      else{
        throw 'Error inccorect email/password';
      }
    })
    .then(async(responseJson) => {
      await AsyncStorage.setItem('@session_token', responseJson.token);
      this.props.navigation.navigate('Home');
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return(
      <View style={styles.form}>
          <TextInput style={styles.field}
            placeholder="enter email.."
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
          />
          <TextInput style={styles.field}
            placeholder="enter password.."
            secureTextEntry={true}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
          />
          <Button style={styles.signButton}
            title="Sign in"
            onPress={() => this.signin()}
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
    borderColor: 'blue',
    margin: 20
  },

  signButton:{
    padding: 20
  }

})

export default LoginScreen;
