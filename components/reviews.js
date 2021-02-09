import React, { Component } from 'react';
import { Alert, AsyncStorage, Button, FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';

class Reviews extends Component {

  constructor(props) {
    super(props);

  }

  render() {

    const review = this.props.reviewData;

    return(
      <View>
        <FlatList
          data={review}
          renderItem={({item}) =>
            <TouchableOpacity>
              <View style={styles.reviews}>
                <Text> overall rating: {item.overall_rating} </Text>
                <Text> Liked by {item.likes} </Text>
                <Text> {item.review_body} </Text>
                <Text> quality: {item.quality_rating} </Text>
                <Text> price: {item.price_rating} </Text>
                <Text> cleanliness: {item.clenliness_rating} </Text>
              </View>
            </TouchableOpacity>
          }
          keyExtractor={({review_id}, index) => review_id.toString()}
        />
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
    reviews: {
      borderColor: 'blue',
      borderWidth: 2,
      margin: 6
    }
  });

export default Reviews;
