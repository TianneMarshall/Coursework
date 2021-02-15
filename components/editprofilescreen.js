import React, { Component } from 'react';
import { Alert, Text, TextInput, View, Button, FlatList, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';


class EditProfileScreen extends Component{
  constructor(props){
    super(props)

    this.state={
      original_first_name: '',
      original_last_name: '',
      original_email: '',
      updated_first_name: '',
      updated_last_name: '',
      updated_email: ''
    }
  }

  getOriginalData() {
    const user = this.props.route.params.userData;

    this.setState({original_first_name: user.first_name});
    this.setState({original_last_name: user.last_name});
    this.setState({original_email: user.email});
  }

  editUser = async (to_send) => {

    const userid = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');

    Alert.alert(JSON.stringify(to_send));

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+userid,
    {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        },
        body: JSON.stringify(to_send)
    })
    .then((response) => {
      if(response.status == 200) {
        Toast.show("Saved Changes!");
      }
      else if(response.status == 400) {
        throw 'Error invalid details';
      }
      else if(response.status == 401) {
        throw 'Error unauthorised';
      }
      else if(response.status == 404) {
        throw 'Error Can not find user';
      }
      else{
        throw 'Failed'
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }

  checkChanges(){

    var to_send = {};

    if(this.state.original_first_name != this.state.updated_first_name){
      to_send['first_name'] = this.state.updated_first_name;
    }
    if(this.state.original_first_name != this.state.updated_first_name){
      to_send['last_name'] = this.state.updated_last_name;
    }
    if(this.state.original_first_name != this.state.updated_first_name){
      to_send['email'] = this.state.updated_email;
    }
    this.editUser(to_send);
  }

  componentDidMount() {
    this.getOriginalData();
  }

  render() {
    return(
      <View style={styles.screen}>

          <Icon
            style={styles.image}
            name='user-circle'
            size={60}
          />

          <TextInput style={styles.textBox}
            defaultValue={this.state.original_first_name}
            onChangeText={(updated_first_name) => this.setState({updated_first_name})}
          />
          <TextInput style={styles.textBox}
            defaultValue={this.state.original_last_name}
            onChangeText={(updated_last_name) => this.setState({updated_last_name})}
          />
          <TextInput style={styles.textBox}
            defaultValue={this.state.original_email}
            onChangeText={(updated_email) => this.setState({updated_email})}
          />

          <Button
            title="Save Changes"
            onPress={() => this.checkChanges()}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    alignItems: 'center',
  },

  titles: {
    fontSize: 20,
    color: 'black'
  },

  textBox: {
    width: 300,
    borderColor: 'blue',
    borderWidth: 2,
    margin: 4,
    textAlign: 'center'
  },

  image: {
    alignItems: 'center',
    margin: 3,
    color: 'blue'
  }

})

export default EditProfileScreen;
