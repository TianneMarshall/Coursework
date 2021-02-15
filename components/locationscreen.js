import React, { Component } from 'react';
import { Alert, Button, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reviews from './reviews';
import Review from './review';
import Location from './location';
import Toast from 'react-native-simple-toast';
import  Icon from 'react-native-vector-icons/FontAwesome';

class LocationScreen extends Component{

  constructor(props){
    super(props)

    this.state={
      location_id: '',
      location: [],
      reviews: [],
      favourited: false
    }
  }

  getLocation = async () => {

    const loc = this.props.route.params.locId;

    return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + loc)
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

  checkFavourite(){
    if(this.state.favourited == false) {
      this.favourite();
      this.setState({hearted: "heart"});

    }
    else if(this.state.favourited == true){
      this.unfavourite();
      this.setState({hearted: "heart-o"});
    }
  }

  favourite = async () => {

    const token = await AsyncStorage.getItem('@session_token');
    const loc_id = this.state.location_id.toString();

      return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + loc_id + "/favourite",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })
      .then((response) => {
        if(response.status == 200) {
          this.setState({
            favourited: true,
            hearted: 'heart'
          });
          Toast.show('Favourited!', Toast.LONG);
        }
        else if(response.status == 401) {
          throw "Could not favourite";
        }
        else if(response.status == 404) {
          throw "Could not get location";
        }
        else{
          throw "Error";
        }
      })
      .catch((error) => {
        console.error(error);
      })
    }

    unfavourite = async () => {

      const token = await AsyncStorage.getItem('@session_token');
      const loc_id = this.state.location_id.toString();

      return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + loc_id + "/favourite",
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })
      .then((response) => {
        if(response.status == 200){
          this.setState({
            favourited: false
          });
          Toast.show('Unfavourited!', Toast.LONG);
        }
        else if(response.status == 401) {
          throw "Could not favourite";
        }
        else if(response.status == 404) {
          throw "Could not get location";
        }
        else{
          throw "Error";
        }
      })
      .catch((error) => {
        console.error(error);
      })
    }

  componentDidMount() {
    this.getLocation();
  }

  render() {
    const navigation = this.props.navigation;
    let icon = this.state.favourited ? 'heart' : 'heart-o';

    return(
      <View style={styles.location}>

        <ScrollView>

          <TouchableOpacity style={styles.image} onPress={() => this.checkFavourite()}>
            <Icon
              name={icon}
              color='red'
              size={60}
            />
          </TouchableOpacity>

          <Location locationData={this.state.location} />

          <Button
            title="Write Review"
            onPress={() => navigation.navigate('WriteReviewScreen', {locId: this.state.location_id})}
          />

          <TextInput
            style={styles.title}
            defaultValue="Reviews"
            editable={false}
          />

          <FlatList
            data={this.state.reviews}
            renderItem={({item}) =>

            <Review reviewData={item} reviewLocId={this.state.location_id}/>
            }
            keyExtractor={({review_id}, index) => review_id.toString()}
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
    fontSize: 20
  },

  image: {
    alignItems: 'flex-end',
    margin: 10
  }
})
export default LocationScreen;
