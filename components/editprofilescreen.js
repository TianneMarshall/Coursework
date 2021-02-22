import React, {Component} from 'react';
import {Alert, TextInput, View, Button, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      originalFirstName: '',
      originalLastName: '',
      originalEmail: '',

      updatedFirstName: '',
      updatedLastName: '',
      updatedEmail: '',
    };
  }

  componentDidMount() {
    this.getOriginalData();
  }

  getOriginalData() {
    const user = this.props.route.params.userData;

    this.setState({originalFirstName: user.first_name});
    this.setState({originalLastName: user.last_name});
    this.setState({originalEmail: user.email});
    this.setState({updatedFirstName: user.first_name});
    this.setState({updatedLastName: user.last_name});
    this.setState({updatedEmail: user.email});
  }

  editUser = async () => {

      let to_send = {};
  
      if (this.state.updatedFirstName != this.state.originalFirstName){
        to_send['first_name'] = this.state.updatedFirstName;
      }
  
      if (this.state.updatedLastName != this.state.originalLastName){
        to_send['last_name'] = this.state.updatedLastName;
      }
  
      if (this.state.updatedEmail != this.state.originalEmail){
        to_send['email'] = this.state.updatedEmail;
      }

    console.log("original array", JSON.stringify(to_send))

    const userid = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');

    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(to_send),
    })
      .then((response) => {
        if (response.status === 200) {
          Toast.show('Saved Changes!');
        } 
        else if (response.status === 400) {
          console.error('Error invalid details');
        } 
        else if (response.status === 401) {
          console.error('Could not update details - Please log in');
        } 
        else if (response.status === 404) {
          console.error('Error can not find user');
        } 
        else {
          console.error('Error - Please try again later');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };


  render() {
    return (
      <View style={styles.screen}>
        <Icon style={styles.image} name="user-circle" size={60} />
        <TextInput
          style={styles.textBox}
          placeholder={this.state.originalFirstName}
          onChangeText={(updatedFirstName) => this.setState({updatedFirstName})}
          value={this.state.updatedFirstName}
        />
        <TextInput
          style={styles.textBox}
          placeholder={this.state.originalLastName}
          onChangeText={(updatedLastName) => this.setState({updatedLastName})}
          value={this.state.updatedLastName}
        />
        <TextInput
          style={styles.textBox}
          placeholder={this.state.originalEmail}
          onChangeText={(updatedEmail) => this.setState({updatedEmail})}
          value={this.state.updatedEmail}
        />
        <Button title="Save Changes" onPress={() => this.editUser()} />
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
    color: 'black',
  },
  textBox: {
    width: 300,
    borderColor: 'blue',
    borderWidth: 2,
    margin: 4,
    textAlign: 'center',
  },
  image: {
    alignItems: 'center',
    margin: 3,
    color: 'blue',
  },
});

EditProfileScreen.propTypes = {
  route: PropTypes.instanceOf(Object).isRequired
}
export default EditProfileScreen;
