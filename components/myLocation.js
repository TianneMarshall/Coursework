/* eslint-disable camelcase */
import React, { Component } from 'react';
import { FlatList, PermissionsAndroid, StyleSheet, View } from 'react-native';
import { Text, Card, CardItem, Thumbnail } from 'native-base'
import Geolocation from 'react-native-geolocation-service';
import PropTypes from 'prop-types';
import {getDistance, orderByDistance} from 'geolib';

async function requestLocationPermission() {
  try{
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "This app requires acess to your location",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED){
      return true;
    }
    else {
      return false;
    }
  }
  catch(error) {
    console.warn(error);
  }
}

class MyLocation extends Component {
  constructor(props){
    super(props);

    this.state = {
      location: null,
      locationPermission: false,
      isLoading: true
    }
  }

  componentDidMount(){
    this.findCoordinates();
  }

  calculateDistance = () => {
    const navigator = this.props.navigation
    const {locations} = this.props.route.params;
    const myLocation = this.state.location;

    // Testing dataset of locations with different latitudes and longitudes to test sorting method
    const loc = {}; 
    loc.location_id = 64; loc.location_name = "Costa Coffee"; loc.latitude = 96; loc.longitude = 52; 
    locations.push(loc)

    const loc2 = {}; 
    loc2.location_id = 66; loc2.location_name = "Greggs"; loc2.latitude = 79; loc2.longitude = 0; 
    locations.push(loc2)

    const loc3 = {}; 
    loc3.location_id = 67; loc3.location_name = "Cafe Nero"; loc3.latitude = 74; loc3.longitude = 1; 
    locations.push(loc3)

    // sort the venues in ascending order of their distance from the device's location
    const sortedLocs = orderByDistance({latitude: myLocation.latitude, longitude: myLocation.longitude}, locations)

    return(
      <FlatList
        data={sortedLocs}
        renderItem={({item}) =>
          <Card bordered>
            {/* Load individual location information when the location is pressed */}
            <CardItem button style={styles.card} onPress={() => navigator.navigate('Location Info', {locId: item.location_id})}>
              <Thumbnail source={{uri: item.photo_path}} />
              <Text>{item.location_name}</Text>
            </CardItem>
            <CardItem>
              {/* Calculate the distance between location and the user's current location */}
              <Text>{this.calc(item.latitude, item.longitude)} Miles Away</Text>
            </CardItem>
            <CardItem>
              <Text>{item.location_town}</Text>
            </CardItem>
            <CardItem>
              <Text>Overall Rating: {item.avg_overall_rating}</Text>
            </CardItem>
          </Card>
        }
        keyExtractor={({location_id}) => location_id.toString()}
      />
    )
  }

  calc(latitude, longitude) {
    const myLocation = this.state.location;

    // calculate the distance between the user's current location and the coffee venue
    const distance = getDistance
    (
      {latitude: myLocation.latitude, longitude: myLocation.longitude},
      {latitude, longitude}
    )

    // divide the distance by 1000 to convert from meters to miles  
    return(distance / 1000)
  }

  findCoordinates() {
    // determine whether app has permission to access the user's location
    if(!this.state.locationPermission){
      this.state.locationPermission = requestLocationPermission();
    }

    // get the user's current location (latitude and longitude) and store in the state
    Geolocation.getCurrentPosition(
      (position) => {
        const location = position;

        this.setState({ 
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
          },
          isLoading: false
        });
      },
      (error) => {
        throw Error(error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    ); 
  };

  render() {

    if(this.state.isLoading){
      return(
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
      
    return(
      this.calculateDistance() 
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 2,
    borderColor: '#bf80ff',
  }
})

MyLocation.propTypes = {
  navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired
  }).isRequired,
  route: PropTypes.instanceOf(Object).isRequired
}

export default MyLocation;