/* eslint-disable camelcase */
import React, { Component } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, Text, Card, CardItem } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import PropTypes from 'prop-types';

import Review from './review';

class MyReviews extends Component {
  constructor(props){
    super(props)

    this.state={
      location_id: '',
      review_id: ''
    }
  }

  deleteReview = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const location_id = this.state.location_id.toString();
    const review_id = this.state.review_id.toString();

    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${  location_id  }/review/${  review_id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      }
    })
    .then((response) => {
      if(response.status === 200) {
        Toast.show('Review Deleted!');
      }
      else if(response.status === 400) {
        throw Error("Bad Request - Invalid delete request");
      }
      else if(response.status === 401) {
        throw Error("Unauthorised - Can not delete review");
      }
      else if(response.status === 403) {
        throw Error("Forbidden - Not your review");
      }
      else if(response.status === 404){
        throw Error("Can not find review");
      }
      else {
        throw Error("Failed");
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }

  delete(item) {
    this.setState({
      review_id: item.review.review_id,
      location_id: item.location.location_id
    })
    this.deleteReview()
  }

  render() {

    const review = this.props.reviewData;
    
    return(
      <View style={styles.reviews}>
        <FlatList
          data={review}
          renderItem={({item}) =>
            <View>
              <Card>
                <Review reviewData={item.review} reviewLocId={item.location.location_id}/>
                <CardItem style={styles.buttons}>
                  <View style={styles.photoButton}>
                    {/* Open the camera to take photo for review when button is pressed */}
                    <Button
                      style={{backgroundColor: '#cc99ff'}}
                      onPress={() => this.props.navigation.navigate('Camera', {reviewData: item})}>
                      <Text>Add Photo</Text>
                    </Button>
                  </View>
                  <View style={styles.editButton}>
                    <Button info onPress={() => this.props.navigation.navigate('Edit Review', {reviewLocId: item.location.location_id, reviewData: item.review})}>
                      <Text>Edit Review</Text>
                    </Button>
                  </View>
                </CardItem>
              </Card>

              {/* Delete review when button is pressed */}
              <TouchableOpacity
                style={styles.delete}
                onPress={() => this.delete(item)}>
                <Icon
                  name="trash-o"
                  size={30}
                />
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  reviews: {
    flex: 1
  },
  delete: {
    alignItems: 'center'
  },
  buttons: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  photoButton: {
    margin: 7
  },
  editButton: {
    margin: 7
  }
})

MyReviews.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired,
  reviewData: PropTypes.instanceOf(Object).isRequired
}

export default MyReviews;
