import  React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Card, CardItem, Button, Header, Item } from 'native-base'
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

  reset = async() => {

    return fetch("http://10.0.2.2:3333/api/1.0.0/reset",
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if(response.status === 200){
        Toast.show("Successfully reset database", Toast.LONG)
      }
      else if(response.status === 500){
        console.error("Error - try again later")
      }
      else{
        console.error("Failed")
      }
    })
    .catch((error) => {
      console.error(error)
    });
  }

  resample = async() => {

    return fetch("http://10.0.2.2:3333/api/1.0.0/resample",
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if(response.status === 201){
        Toast.show("Successfully reloaded sample set", Toast.LONG)
      }
      else if(response.status === 500){
        console.error("Error - try again later")
      }
    })
    .catch((error) => {
      console.error(error)
    });
  }

  render() {
    
    return(
      <View style={{flex: 1}}>
        <Header transparent style={styles.title}>
          <Item transparent>
            <Text style={styles.title}> Settings </Text>
          </Item>
        </Header>
      <Card style={styles.screen}>
        <CardItem>
          <Button rounded info onPress={() => this.signout()}>
            <Text> Log out</Text>
          </Button>
        </CardItem>
        <CardItem>
          <Button rounded danger onPress={() => this.reset()}>
            <Text> Reset Database </Text>
          </Button>
        </CardItem>
        <CardItem>
          <Button rounded danger onPress={() => this.resample()}>
            <Text> Resample Database </Text>
          </Button>
        </CardItem>
      </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    alignSelf: 'center',
    margin: 10
  },
  card: {
    borderBottomWidth: 2,
    borderColor: '#bf80ff',
  },
  title: {
    fontSize: 25,
    alignSelf: 'center'
  }
})

LogoutScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
}

export default LogoutScreen;
