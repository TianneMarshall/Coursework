import React, { Component} from 'react';
import { Text, View, Button, FlatList } from 'react-native';

class User extends Component{

  constructor(props){
    super(props);
  }

  render(){

    const user = this.props.data;

    return(
      <View>
        <Text> fname </Text>
        <Text> lname </Text>
        <Text> picture </Text>
        <Text> email </Text>
      <View>
    );
  }
}
export default User;
