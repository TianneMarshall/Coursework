import React, { Component} from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';


class User extends Component{

  constructor(props){
    super(props);
  }

  render(){

    const user = this.props.userData;

    return(
      <View style={styles.screen}>
        <Icon
          style={styles.image}
          name='user-circle'
          size={60}
        />
        <View style={styles.names}>
          <TextInput
            style={styles.name}
            defaultValue={user.first_name}
            editable={false}>
          </TextInput>

          <TextInput
            style={styles.name}
            defaultValue={user.last_name}
            editable={false}>
          </TextInput>
        </View>
        <Text> {user.email} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20
  },
  image: {
    alignItems: 'center',
    marginTop: 20,
    color: 'blue'
  },
  name: {
    color: 'black',
    fontSize: 30
  },
  names: {
    flexDirection: 'row'
  }

})

export default User;
