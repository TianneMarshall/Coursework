import React, { Component } from 'react';
import { Text, View, Button, FlatList, ScrollView } from 'react-native';
import Location from './components/location';

class Homescreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      location: {
        "location_id": 123,
        "location_name": "Tianne's Coffee",
        "location_town": "Manchester",
        "latitude": 34,
        "longitude": 12,
        "photo_path": "hello",
        "avg_price_rating": 4,
        "avg_clenliness_rating": 5,
        "avg_quality_rating": 5
      }
    }
  }

  render() {
    return (
      <ScrollView>
        <Location data={this.state.location} />
      </ScrollView>
    );
  }
}
export default Homescreen;
