import React, { Component } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';

import Review from './review';

class Reviews extends Component {

  constructor(props) {
    super(props);

    this.state={
      rev_id: '',
      liked: false,
      thumb: 'thumbs-o-up'
    }

  }

  render() {

    const review = this.props.reviewData;

    return(
      <View>
        <FlatList
          data={review}
          renderItem={({item}) =>

            <Review reviewData={item.review} reviewLocId={item.location.location_id}/>
          }
        />
      </View>
    );
  }
}

export default Reviews;
