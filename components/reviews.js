import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert } from 'react-native';

class Reviews extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    }
  }

  getEmail = (email) => {
    this.setState({email: email})
  }

  getPassword = (password) => {
    this.setState({password: password})
  }

  login = () => {
    Alert.alert(
      this.state.email,
      this.state.password
    );
  }

  render() {
    return(
      <View>
        <View style={styles.inputBoxes}>
          <TextInput placeholder="email" onChangeText={this.getEmail} value={this.state.email}/>
        </View>
        <View style={styles.inputBoxes}>
          <TextInput placeholder="password" onChangeText={this.getPassword} value={this.state.password} secureTextEntry={true}/>
        </View>
        <Button
          title="Log in"
          onPress={this.login}
        />
      </View>
    );
  }
}

  const styles=StyleSheet.create({
    inputBox: {
      borderColor: 'blue',
      borderWidth: 4,
    }
  });

export default Reviews;
