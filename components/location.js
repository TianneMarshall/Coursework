import React, { Component } from 'react';
import { Alert, AsyncStorage, Image, Text, TextInput, View, Button, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import LocationScreen from './locationscreen';
import Toast from 'react-native-simple-toast';
import  Icon from 'react-native-vector-icons/FontAwesome';

class Location extends Component{

  constructor(props){
    super(props);

    this.state={
      locId: '',
      favourited: false,
      hearted: 'heart-o'
    }
  }

  checkFavourite(){
    if(this.state.favourited == false) {
      this.favourite();
      this.setState({hearted: 'heart'})
    }
    else if(this.state.favourited == true){
      this.unfavourite();
      this.setState({hearted: 'heart-o'})
    }
  }

  favourite = async () => {

    const token = await AsyncStorage.getItem('@session_token');
    const loc_id = this.props.locationData.location_id.toString();

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
            favourited: true
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
      const loc_id = this.props.locationData.location_id.toString();

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

  render(){

    const location = this.props.locationData;

    return(
      <View>
          <TouchableOpacity onPress={() => this.checkFavourite()}>
            <Icon
              name={this.state.hearted}
              color='red'
              size={60}
            />
          </TouchableOpacity>

          <Text> {location.location_name} </Text>
          <Text> {location.location_town} </Text>
          <Text> longitude: {location.longitude} </Text>
          <Text> latitude: {location.latitude} </Text>

          <Image
            source={{uri: location.photo_path}}
            style={{width: 200, height: 200}}
          />

          <Text> overall rating: {location.avg_overall_rating} </Text>
          <Text> price: {location.avg_price_rating} </Text>
          <Text> qaulity: {location.avg_quality_rating} </Text>
          <Text> cleanliness: {location.avg_clenliness_rating} </Text>
      </View>
    );
  }
}

const styles=StyleSheet.create({
  inputBox: {
    borderColor: 'blue',
    borderWidth: 4,
  },
  title: {
    color: 'black',
    fontSize: 20
  },
  location: {
    borderColor: 'blue',
    borderWidth: 2,
    margin: 6
  }
});

export default Location;
