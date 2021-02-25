import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import { Button, Text, Input, Form, Item} from 'native-base'
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

      updatedFirstName: '',
      updatedLastName: '',
      updatedEmail: '',
      updatedPassword: '',
      confirmPassword: ''
    };
  }

  componentDidMount() {
    this.getOriginalData();
  }

  // load user's original data into the state
  getOriginalData() {
    const user = this.props.route.params.userData;

    this.setState({
      originalFirstName: user.first_name,
      originalLastName: user.last_name,
      originalEmail: user.email,
      originalPassword: user.password,
      updatedFirstName: user.first_name,
      updatedLastName: user.last_name,
      updatedEmail: user.email,
      updatedPassword: user.password,
      confirmPassword: user.password
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
        throw Error('Error invalid details');
      } 
      else if (response.status === 401) {
        throw Error('Could not update details - Please log in');
      } 
      else if (response.status === 404) {
        throw Error('Error can not find user');
      } 
      else {
        throw Error('Error - Please try again later');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };

  checkChanges() {
    
    const newInfo = {};
  
    // if the user's information has changed then add the new information into a list for patch request
    if (this.state.updatedFirstName !== this.state.originalFirstName){
      newInfo.first_name = this.state.updatedFirstName;
    }

    if (this.state.updatedLastName !== this.state.originalLastName){
      newInfo.last_name = this.state.updatedLastName;
    }

    if (this.state.updatedEmail !== this.state.originalEmail){
      newInfo.email = this.state.updatedEmail;
    }

    // if the user's password has been updated then check if the re-entered password matches the new one for validation
    if (this.state.updatedPassword !== this.state.originalPassword){
      if(this.state.confirmPassword !== this.state.updatedPassword){
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
      <View style={styles.form}>
        <Form>
          <Icon style={styles.image} name="user-circle" size={60} />
          <Item>
            <Input
              regular
              style={styles.field}
              placeholder={this.state.originalFirstName}
              onChangeText={(updatedFirstName) => this.setState({updatedFirstName})}
              value={this.state.updatedFirstName}
            />
          </Item>
          <Item>
            <Input
              regular
              style={styles.field}
              placeholder={this.state.originalLastName}
              onChangeText={(updatedLastName) => this.setState({updatedLastName})}
              value={this.state.updatedLastName}
            />
          </Item>
          <Item>
            <Input
              regular
              style={styles.field}
              placeholder={this.state.originalEmail}
              onChangeText={(updatedEmail) => this.setState({updatedEmail})}
              value={this.state.updatedEmail}
            />
          </Item>
          <Item>
            <Input
              regular
              style={styles.field}
              secureTextEntry
              placeholder="Enter new password.."
              onChangeText={(updatedPassword) => this.setState({updatedPassword})}
              value={this.state.updatedPassword}
            />
          </Item>
          <Item>
            <Input
              regular
              style={styles.field}
              secureTextEntry
              placeholder="Confirm new password.."
              onChangeText={(confirmPassword) => this.setState({confirmPassword})}
            />
          </Item>
        </Form>
        {/* review the updated information when button is pressed */}
        <Button rounded onPress={() => this.checkChanges()} style={styles.button}>
          <Text> Save Changes </Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    margin: 10
  },
  field: {
    borderWidth: 2,
    borderColor: 'blue',
    textAlign: 'center',
    margin: 15
  },
  image: {
    alignSelf: 'center',
    margin: 5,
    color: 'blue',
  },
  button: {
    alignSelf: 'center',
    margin: 10
  }
});

EditProfileScreen.propTypes = {
  route: PropTypes.instanceOf(Object).isRequired
}
export default EditProfileScreen;
