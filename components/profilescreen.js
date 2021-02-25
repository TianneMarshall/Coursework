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

  // re-load the user information when the profile screen comes into focus
  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getUser();
    })
  }

  componentWillUnmount(){
    this.unsubscribe()
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
      // if the request is successful, return the results
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

          <Button primary block rounded onPress={() => navigator.navigate('Edit User', {userData: this.state.user})}>
            <Text> Edit Profile</Text>
          </Button>

          <Text style={styles.title}>My Reviews</Text>

          {/* Load the reviews that the user has posted */}
          <MyReviews reviewData={this.state.reviews} navigation={this.props.navigation} />

          <Text style={styles.title}>Liked Reviews</Text>

          {/* Load the reviews that the user has liked */}
          <Card>
            <Reviews reviewData={this.state.liked_reviews}/>
          </Card>

          <Text style={styles.title}>Favourite Locations</Text>

          {/* Load the user's favourite locations */}
          <FlatList style={{flex: 1}}
            data={this.state.favourite_locations}
            renderItem={({item}) =>
            <View>
              <TouchableOpacity onPress={() => navigator.navigate('Location Info', {locId: item.location_id})}>
                <Card style={styles.location}>
                  <CardItem style={styles.image}>
                    <Icon
                      name='heart'
                      color= 'red'
                      size={50}
                    />
                  </CardItem>
                  <CardItem style={styles.card}>
                    <Thumbnail source={{uri: item.photo_path}}/>
                    <TextInput 
                      style={styles.locTitle} 
                      editable={false}
                      defaultValue={item.location_name}
                    />
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

  location: {
    paddingBottom: 30
  },

  title: {
    color: 'black',
    fontSize: 20,
    margin: 10
  },

  item: {
    borderColor: 'blue',
    borderWidth: 3
  },

  button: {
    marginTop: 6
  },

  image: {
    alignSelf: 'flex-end'
  },

  locTitle: {
    fontSize: 25,
    color: 'black'
  },
  card: {
    borderBottomWidth: 2,
    borderColor: '#bf80ff',
    marginBottom: 15
  }
})


ProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired
  }).isRequired
}

export default ProfileScreen;
