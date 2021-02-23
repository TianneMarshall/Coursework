/* eslint-disable camelcase */
import React, { Component } from 'react';
import { View,  FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Text, Card, CardItem, Thumbnail} from 'native-base';
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
    .then((response) => {
      if(response.status === 401){
        throw Error("Could not get info - please log in")
      }
      else if(response.status === 404){
        throw Error("Could not find user - try another account")
      }
      else if(response.status === 500) {
        throw Error("Error - please try again later")
      }
      else{
        return response;
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
      <View style={styles.screen}>
        <ScrollView>
          <User userData={this.state.user} />

          <Button primary block rounded onPress={() => navigator.navigate('EditUser', {userData: this.state.user})}>
            <Text> Edit Profile</Text>
          </Button>

          <TextInput
            style={styles.title}
            defaultValue="Reviews"
            editable={false}
          />
          <MyReviews reviewData={this.state.reviews} navigation={this.props.navigation} />

          <TextInput
            style={styles.title}
            defaultValue="Liked Reviews"
            editable={false}
          />
          <Card>
            <Reviews reviewData={this.state.liked_reviews}/>
          </Card>

          <TextInput
            style={styles.title}
            defaultValue="Favourite Locations"
            editable={false}
          />

          <FlatList style={{flex: 1}}
            data={this.state.favourite_locations}
            renderItem={({item}) =>
            <View>
              <TouchableOpacity onPress={() => navigator.navigate('LocationScreen', {locId: item.location_id})}>
              <Card>
                <CardItem style={styles.image}>
                  <Icon
                    name='heart'
                    color= 'red'
                    size={50}
                  />
                </CardItem>
                <CardItem>
                  <Thumbnail source={{uri: item.photo_path}}/>
                  <Text style={{fontSize: 20}}> {item.location_name}</Text>
                </CardItem>
                <Text> {item.location_town}</Text>
                <Text> Overall Rating: {item.avg_overall_rating} </Text>
              </Card>
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
  screen: {
    flex: 1
  },
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
  },

  image: {
    alignSelf: 'flex-end',
    margin: 10
  }
})


ProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
}

export default ProfileScreen;
