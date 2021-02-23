import React, {Component} from 'react';
import {TextInput, View, Button, StyleSheet} from 'react-native';
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
      originalPassword:'',
      originalConPassword: '',

      updatedFirstName: '',
      updatedLastName: '',
      updatedEmail: '',
      updatedPassword: '',
      updatedConPassword: ''
    };
  }

  componentDidMount() {
    this.getOriginalData();
  }

  getOriginalData() {
    const user = this.props.route.params.userData;

    this.setState({
      originalFirstName: user.first_name,
      originalLastName: user.last_name,
      originalEmail: user.email,
      originalPassword: user.password,
      originalConPassword: user.password,
      updatedFirstName: user.first_name,
      updatedLastName: user.last_name,
      updatedEmail: user.email,
      updatedPassword: user.password,
      updatedConPassword: user.password
    });
  }

  editUser = async (newInfo) => {

    const userid = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');

    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(newInfo),
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

  checkChanges() {
    
    const newInfo = {};
  
    if (this.state.updatedFirstName !== this.state.originalFirstName){
      newInfo.first_name = this.state.updatedFirstName;
    }

    if (this.state.updatedLastName !== this.state.originalLastName){
      newInfo.last_name = this.state.updatedLastName;
    }

    if (this.state.updatedEmail !== this.state.originalEmail){
      newInfo.email = this.state.updatedEmail;
    }

    if (this.state.updatedPassword !== this.state.originalPassword){
      if(this.state.updatedConPassword !== this.state.updatedPassword){
        throw Error("Passwords do not match, re-type password")
      }
      else{
        newInfo.password = this.state.updatedPassword;
      }
      
    }
      
    this.editUser(newInfo)
  }

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
        <TextInput
          style={styles.textBox}
          secureTextEntry
          placeholder="Enter new password.."
          onChangeText={(updatedPassword) => this.setState({updatedPassword})}
          value={this.state.updatedPassword}
        />
        <TextInput
          style={styles.textBox}
          secureTextEntry
          placeholder="Confirm new password.."
          onChangeText={(updatedConPassword) => this.setState({updatedConPassword})}
        />
        <Button title="Save Changes" onPress={() => this.checkChanges()} />
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
