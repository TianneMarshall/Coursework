import React, { Component } from 'react';
import { Alert, Image, Text, TextInput, View, Button, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationScreen from './locationscreen';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ratings from './ratings';

class Location extends Component{

  constructor(props){
    super(props);

  }

  render(){

    const location = this.props.locationData;

    return(
      <View style={styles.location}>

        <View style={styles.title}>
          <TextInput style={styles.titles} editable={false}> {location.location_name} </TextInput>
        </View>

        <Image
          source={{uri: location.photo_path}}
          style={{width: 200, height: 200}}
        />

        <Text> {location.location_town} </Text>
        <Text> longitude: {location.longitude} </Text>
        <Text> latitude: {location.latitude} </Text>

        <Text> overall rating: {location.avg_overall_rating} </Text>
        <Text> price: {location.avg_price_rating} </Text>
        <Text> qaulity: {location.avg_quality_rating} </Text>
        <Text> cleanliness: {location.avg_clenliness_rating} </Text>
      </View>
    );
  }
}

const styles=StyleSheet.create({
  location: {
    flex: 1,
    margin: 6
  },
  inputBox: {
    borderColor: 'blue',
    borderWidth: 4,
  },
  title: {
    alignItems: 'center'
  },
  titles: {
    color: 'black',
    fontSize: 30,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center'
  },
});

export default Location;
