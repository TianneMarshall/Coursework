import React, { Component } from 'react';
import { Text, TextInput, View, Button, FlatList, TouchableOpacity } from 'react-native';

class Location extends Component{

  constructor(props){
    super(props);
  }

  render(){

    const location = this.props.data;

    return(
      <View>
        <Text> {location.location_name} </Text>
        <Text> {location.location_town} </Text>
        <Text> Overall Rating: {location.avg_overall_rating} </Text>
        <Text> Price: {location.avg_price_rating} </Text>
        <Text> Cleanliness: {location.avg_clenliness_rating} </Text>
        <Text> Quality: {location.avg_quality_rating} </Text>
      </View>
    );
  }
}
export default Location;
