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
  }

  editUser = async (toSend) => {
    const userid = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');

    Alert.alert(JSON.stringify(toSend));

    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 200) {
          Toast.show('Saved Changes!');
        } else if (response.status === 400) {
          console.error('Error invalid details');
        } else if (response.status === 401) {
          console.error('Error unauthorised');
        } else if (response.status === 404) {
          console.error('Error Can not find user');
        } else {
          console.error('Failed');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  checkChanges() {
    const toSend = {};
    if (this.state.originalFirstName !== this.state.updatedFirstName) {
      toSend.first_name = this.state.updatedFirstName;
    }
    if (this.state.originalLastName !== this.state.updatedLastName) {
      toSend.last_name = this.state.updatedLastName;
    }
    if (this.state.originalEmail !== this.state.updatedEmail) {
      toSend.email = this.state.updatedEmail;
    }
    this.editUser(toSend);
  }

  render() {
    return (
      <View style={styles.screen}>
        <Icon style={styles.image} name="user-circle" size={60} />
        <TextInput
          style={styles.textBox}
          defaultValue={this.state.originalFirstName}
          onChangeText={(updatedFirstName) =>
            this.setState({updatedFirstName})
          }
        />
        <TextInput
          style={styles.textBox}
          defaultValue={this.state.originalLastName}
          onChangeText={(updatedLastName) =>
            this.setState({updatedLastName})
          }
        />
        <TextInput
          style={styles.textBox}
          defaultValue={this.state.originalEmail}
          onChangeText={(updatedEmail) => this.setState({updatedEmail})}
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
