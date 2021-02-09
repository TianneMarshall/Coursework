import React, { Component } from 'react';
import { Alert, AsyncStorage, Button, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Review from './review';

class Reviews extends Component {

  constructor(props) {
    super(props);

    this.state = {
      reviews: {
          "review_id": 643,
          "overall_rating": 4,
          "price_rating": 2,
          "quality_rating": 3,
          "clenliness_rating": 5,
          "review_body": "Great coffee but the bathrooms were smelly"
        }
    }
  }

  getReviews() {

  }

  render() {
    return(
      <View>
        <Text> Reviews </Text>
        <Review data={this.state.reviews}/>
      </View>
    );
  }
}

  const styles=StyleSheet.create({
    inputBox: {
      borderColor: 'blue',
      borderWidth: 4,
    }
  });

export default Reviews;
