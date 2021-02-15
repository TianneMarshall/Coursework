import React, { Component } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import Stars from 'react-native-stars';

class Ratings extends Component {
  constructor(props){
    super(props)
  }

  render() {
    const reviewRating = this.props.reviewData;

    return(
      <Stars
        rating={reviewRating}
        count={5}
        half={true}
        spacing={8}
        fullStar={<Icon name={'star'} size={25} color='gold'/>}
        emptyStar={<Icon name={'star-o'} size={25} color='gold'/>}
        halfStar={<Icon name={'star-half'} size={25} color='gold'/>}
      />
    );
  }
}

export default Ratings;
