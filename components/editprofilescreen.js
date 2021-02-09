import React, { Component } from 'react';
import { Alert, AsyncStorage, Text, TextInput, View, Button, FlatList, ScrollView } from 'react-native';

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

  componentDidMount() {
    this.getOriginalData();
  }

  render() {
    return(
      <View>
        <Text> Edit Profile </Text>
        <TextInput
          defaultValue={this.state.original_first_name}
        />
        <TextInput
          defaultValue={this.state.original_last_name}
        />
        <TextInput
          defaultValue={this.state.original_email}
        />
      </View>
    );
  }
}

export default EditProfileScreen;
