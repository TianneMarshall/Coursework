import React, { Component } from 'react';
import { Alert, AsyncStorage, Text, View, Button, FlatList, ScrollView } from 'react-native';

class ProfileScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      favourite_locations: [],
      reviews: [],
      liked_reviews: []
    }
  }

  getUser = async () => {

    const userid = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+userid,
    {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        first_name: responseJson.first_name,
        last_name: responseJson.last_name,
        email: responseJson.email
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  componentDidMount() {
    this.getUser();
  }

  render() {

    const navigation = this.props.navigation;

    return (
      <View>
        <Text> {this.state.first_name} </Text>
        <Text> {this.state.last_name} </Text>
        <Text> {this.state.email} </Text>
        <Button
          title="Edit Profile"
          onPress={() => navigation.navigate('EditUser', {first_name: this.state.first_name}, {last_name: this.state.last_name}, {email: this.state.email})}
        />
      </View>

    );
  }
}
export default ProfileScreen;
