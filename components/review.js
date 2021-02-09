import React, { Component } from 'react';
import { Text, TextInput, View, Button, FlatList, TouchableOpacity } from 'react-native';

class Review extends Component{

  constructor(props){
    super(props);
  }

  render(){

    const review = this.props.data;

    return(
      <View>
        <Text> overall-rating: {review.overall_rating} </Text>
        <Text> {review.review_body} </Text>
        <Text> quality: {review.quality_rating} </Text>
        <Text> price: {review.price_rating} </Text>
        <Text> cleanliness: {review.clenliness_rating} </Text>
        <Text> likes: {review.likes} </Text>
      </View>
    );
  }
}
export default Review;
