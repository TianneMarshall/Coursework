/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Button, FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import { RNCamera } from 'react-native-camera';
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
        console.error("Bad Request - Invalid delete request");
      }
      else if(response.status === 401) {
        console.error("Unauthorised - Can not delete review");
      }
      else if(response.status === 403) {
        console.error("Forbidden - Not your review");
      }
      else if(response.status === 404){
        console.error("Can not find review");
      }
      else {
        console.error("Failed");
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }

  takePicture = async() => {
    const token = await AsyncStorage.getItem('@session_token');
    const location_id = this.state.location_id.toString();
    const review_id = this.state.review_id.toString();

    if(this.camera){
      const options = {quality:0.5, base64:true}
      const data = await this.camera.takePictureAsync(options);

      console.log(data.uri, token);

      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${  location_id  }/review/${  review_id  }/photo`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'image/jpeg',
          'X-Authorization': token
        },
        body: data
      })
      .then((response) => {
        if(response.status === 200){
          Toast.show("Photo Taken!");
        }
        else if(response.status === 400) {
          console.error("Error bad request");
        }
        else if(response.status === 401) {
          console.error("Error Unauthorised");
        }
        else if(response.status === 404) {
          console.error("Error not found");
        }
        else if(response.status === 500) {
          console.error("Error Failed");
        }
      })
      .catch((error) => {
        console.error(error);
      })
    }
  }

  render() {

    const review = this.props.reviewData;

    return(
      <View style={styles.reviews}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          captureAudio={false}
        />
        <FlatList
          data={review}
          renderItem={({item}) =>
            <View>
              <Review reviewData={item.review} reviewLocId={item.location.location_id}/>

              <Button
                title="Add Photo"
                onPressIn={() => this.setState({review_id: item.review.review_id, location_id: item.location.location_id})}
                onPress={() => this.takePicture()}
              />

              <TouchableOpacity
                style={styles.delete}
                onPressIn={() => this.setState({review_id: item.review.review_id, location_id: item.location.location_id})}
                onPress={() => this.deleteReview()}>
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
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})

MyReviews.propTypes = {
  reviewData: PropTypes.instanceOf(Object).isRequired
}

export default MyReviews;
