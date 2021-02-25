/* eslint-disable camelcase */
import React, { Component } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Text, Card } from 'native-base'
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import Review from './review';
import Location from './location';

class LocationScreen extends Component{

  constructor(props){
    super(props)

    this.state={
      location_id: '',
      location: [],
      reviews: [],
      favourited: false,
      iconName: 'heart-o'
    }
  }

  componentDidMount() {
    this.getLocation();
  }

  getLocation = async () => {

    const {locId} = this.props.route.params;

    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${  locId}`)
    .then((response) => {
      if(response.status === 404){
        throw Error("Could not find venue - please select another")
      }
      else if(response.status === 500){
        throw Error("Error - please try again later")
      }
      else{
        return response;
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        location_id: responseJson.location_id,
        reviews: responseJson.location_reviews,
        location: responseJson
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  favourite = async () => {

    const token = await AsyncStorage.getItem('@session_token');
    const locId = this.state.location_id.toString();

    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${  locId  }/favourite`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      }
    })
    .then((response) => {
      if(response.status === 200) {
        // change the heart icon to show location has been favourited
        this.setState({
          favourited: true,
          iconName: 'heart'
        });
        Toast.show('Favourited!');
      }
      else if(response.status === 400){
        console.error("Error - please try again later")
      }
      else if(response.status === 401) {
        console.error("Could not favourite - Please sign in");
      }
      else if(response.status === 404) {
        console.error("Could not find location - try another");
      }
      else if(response.status === 500){
        console.error("Error please try again later")
      }
      else{
        console.error("Error");
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }

  unfavourite = async () => {

    const token = await AsyncStorage.getItem('@session_token');
    const locId = this.state.location_id.toString();

    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${  locId  }/favourite`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      }
    })
    .then((response) => {
      if(response.status === 200){
        // change the heart icon to show location has been removed from favourites
        this.setState({
          favourited: false,
          iconName: 'heart-o'
        });
        Toast.show("Unfavourited!");
      }
      else if(response.status === 401) {
        console.error("Could not unfavourite - Please sign in");
      }
      else if(response.status === 403){
        console.error("Error - location is not in favourites")
      }
      else if(response.status === 404) {
        console.error("Could not find location - try another");
      }
      else if(response.status === 500){
        console.error("Error - Please try again later")
      }
      else{
        console.error("Error");
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }

  checkFavourite(){
    // determine whether to execute post favourite request or delete favourite request
    if(this.state.favourited === false) {
      this.favourite();
    }
    else if(this.state.favourited === true){
      this.unfavourite();
    }
  }

  render() {
    const navigator = this.props.navigation;

    return(
      <View style={styles.location}>
        <ScrollView>
          {/* check which request to execute when heart button is pressed */}
          <TouchableOpacity style={styles.image} onPress={() => this.checkFavourite()}>
            <Icon
              name={this.state.iconName}
              color='red'
              size={60}
            />
          </TouchableOpacity>

          <Location locationData={this.state.location} />

          {/* Pass location id to write review screen in props */}
          <Button info block rounded onPress={() => navigator.navigate('Write Review', {locId: this.state.location_id})}>
            <Text>Write Review</Text>
          </Button>

          <Text style={styles.title}>
            Reviews
          </Text>
            
          {/* Load location's reviews */}
          <FlatList
            data={this.state.reviews}
            renderItem={({item}) =>
              <Card>
                <Review reviewData={item} reviewLocId={this.state.location_id}/> 
              </Card>
            }
            keyExtractor={({review_id}) => review_id.toString()}
          />
        </ScrollView>
      </View>
    );
  }
}
const styles=StyleSheet.create({
  location: {
    flex: 1
  },

  title: {
    color: 'black',
    fontSize: 20,
    margin: 10
  },

  image: {
    alignItems: 'flex-end',
    margin: 20
  }
})

LocationScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired,
  route: PropTypes.instanceOf(Object).isRequired
}
export default LocationScreen;
