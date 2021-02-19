/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Button, FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      favourited: false
    }
  }

  componentDidMount() {
    this.getLocation();
  }

  getLocation = async () => {

    const {locId} = this.props.route.params;

    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${  locId}`)
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
          this.setState({
            favourited: true
          });
          Toast.show('Favourited!', Toast.LONG);
        }
        else if(response.status === 401) {
          console.error("Could not favourite");
        }
        else if(response.status === 404) {
          console.error("Could not get location");
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
          this.setState({
            favourited: false
          });
          Toast.show("Unfavourited!", Toast.LONG);
        }
        else if(response.status === 401) {
          console.error("Could not favourite");
        }
        else if(response.status === 404) {
          console.error("Could not get location");
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
      if(this.state.favourited === false) {
        this.favourite();
  
      }
      else if(this.state.favourited === true){
        this.unfavourite();
      }
    }

  render() {
    const navigation = this.props.navigation;
    const icon = this.state.favourited ? 'heart' : 'heart-o';

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
    fontSize: 20
  },

  image: {
    alignItems: 'flex-end',
    margin: 10
  }
})

LocationScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired,
  route: PropTypes.instanceOf(Object).isRequired
}
export default LocationScreen;
