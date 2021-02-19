import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

function User (props) {

    const user = props.userData;

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
            editable={false} />

          <TextInput
            style={styles.name}
            defaultValue={user.last_name}
            editable={false} />
        </View>
        <Text> {user.email} </Text>
      </View>
    );
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

User.propTypes = {
  userData: PropTypes.instanceOf(Object).isRequired
}

export default User;
