import React, { Component } from 'react';
import { Text, View, Button, FlatList, ScrollView } from 'react-native';

class ProfileScreen extends Component {
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
        <Text> "Profile" </Text>
      </ScrollView>
    );
  }
}
export default ProfileScreen;
