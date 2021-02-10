import React, { Component } from 'react';
import { Alert, AsyncStorage, Text, TextInput, View, Button, FlatList, ScrollView, StyleSheet } from 'react-native';

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
    const fname = this.props.route.params.first_name;
    const lname = this.props.route.params.last_name;
    const email = this.props.route.params.email;

    this.setState({original_first_name: fname});
    this.setState({original_last_name: lname});
    this.setState({original_email: email});
  }

  editUser = async () => {

    const userid = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+userid,
    {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
    })
  }

  checkChanges(){
    if(this.state.original_first_name != this.state.updated_first_name){

    }
    if(this.state.original_first_name != this.state.updated_first_name){

    }
    if(this.state.original_first_name != this.state.updated_first_name){

    }
  }

  componentDidMount() {
    this.getOriginalData();
  }

  render() {
    return(
      <View style={styles.screen}>
        <TextInput style={styles.titles} defaultValue="Edit Profile" editable={false}/>
        <View>
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
        </View>
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
  }

})

export default EditProfileScreen;
