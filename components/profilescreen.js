/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Text, View, Button, FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import User from './user';
import Reviews from './reviews';
import MyReviews from './myReviews';

class ProfileScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      user: [],
      favourite_locations: [],
      reviews: [],
      liked_reviews: []
    }
  }

  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {

    const userid = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');

    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userid}`,
    {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        user: responseJson,
        reviews: responseJson.reviews,
        favourite_locations: responseJson.favourite_locations,
        liked_reviews: responseJson.liked_reviews
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {

    const navigator = this.props.navigation;

    return (
      <View>
        <ScrollView>
          <User userData={this.state.user} />

          <Button
            title="Edit Profile"
            onPress={() => navigator.navigate('EditUser', {userData: this.state.user})}
          />

          <TextInput
            style={styles.title}
            defaultValue="Reviews"
            editable={false}
          />
          <MyReviews reviewData={this.state.reviews} />

          <TextInput
            style={styles.title}
            defaultValue="Liked Reviews"
            editable={false}
          />
          <Reviews reviewData={this.state.liked_reviews}/>

          <TextInput
            style={styles.title}
            defaultValue="Favourite Locations"
            editable={false}
          />

            <FlatList
              data={this.state.favourite_locations}
              renderItem={({item}) =>
              <View>
                <TouchableOpacity onPress={() => navigator.navigate('LocationScreen', {locId: item.location_id})}>
                  <Icon
                    name='heart'
                    color= 'red'
                    size={60}
                  />
                  <Text style={{fontSize: 20}}> {item.location_name}</Text>
                  <Text> {item.location_town}</Text>
                  <Text> average rating: {item.avg_overall_rating} </Text>
                </TouchableOpacity>
              </View>
              }
              keyExtractor={({location_id}) => location_id.toString()}
            />

        </ScrollView>
      </View>

    );
  }
}

const styles=StyleSheet.create({
  title: {
    color: 'black',
    fontSize: 20
  },

  item: {
    borderColor: 'blue',
    borderWidth: 3
  },

  button: {
    marginTop: 6
  }
})


ProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
}

export default ProfileScreen;
