/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Alert, FlatList, PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import PropTypes from 'prop-types';
import {getDistance} from 'geolib';

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
      console.log("You can access location");
      return true;
    }
    else {
      console.log("Location permission denied");
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

  calculateDistances = () => {
    const {locations} = this.props.route.params;
    return(
      <View>
          <Text> Longitude: {this.state.location.longitude} </Text>
          <Text> Latitude: {this.state.location.latitude} </Text>
          <FlatList
            data={locations}
            renderItem={({item}) =>
                  <View style={styles.location}>
                    <Text> Distance: {this.calc(item.latitude, item.longitude)} </Text>
                    <Text style={{fontSize: 20}}>{item.location_name}</Text>
                  </View>
            }
            keyExtractor={({location_id}) => location_id.toString()}
          />
      </View>
    );
  }

  calculateDistance = () => {
      const {locations} = this.props.route.params;
      const myLocation = this.state.location;

      locations.map((location) => this.calc(location.latitude, location.longitude))
      return(
        <Text>
          {locations.map((location) => getDistance(
          {latitude: myLocation.latitude, longitude: myLocation.longitude},
          {latitude: location.latitude, longitude:location.longitude}
        ))}
        </Text>
      );
      
      
  }

  calc(latitude, longitude) {
    const myLocation = this.state.location;
    console.log("Latitude: ", latitude)
    console.log("Longitude: ", longitude)
    const distance = getDistance(
        {latitude: myLocation.latitude, longitude: myLocation.longitude},
        {latitude, longitude}
      )
      console.log(distance.toString());
    return <Text> {distance}</Text>
  }

  findCoordinates() {
    if(!this.state.locationPermission){
      this.state.locationPermission = requestLocationPermission();
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const location = position;
        console.log("LOCATION 1: ", location.coords)

        this.setState({ 
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
          },
          isLoading: false
        });
      },
      (error) => {
        Alert.alert(error.message)
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

  location: {
    flex: 1,
    borderColor: 'blue',
    borderWidth: 4,
    margin: 8,
    padding: 7
  },
});

MyLocation.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired
    }).isRequired,
    route: PropTypes.instanceOf(Object).isRequired
}

export default MyLocation;