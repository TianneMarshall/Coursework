import React, { Component } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';

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

    return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/review/" + review_id,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      }
    })
    .then((response) => {
      if(response.status == 200) {
        Toast.show('Review Deleted!');
      }
      else if(response.status == 400) {
        throw 'Bad Request - Invalid delete request';
      }
      else if(response.status == 401) {
        throw 'Unauthorised - Can not delete review';
      }
      else if(response.status == 403) {
        throw 'Forbidden - Not your review';
      }
      else if(response.status == 404){
        throw 'Can not find review';
      }
      else {
        throw "Failed";
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }

  addPhoto = async () => {
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/review/" + review_id + "/photo",
    {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': token
      }
      .then
    })
  }

  render() {

    const review = this.props.reviewData;

    return(
      <View>

        <FlatList
          data={review}
          renderItem={({item}) =>
            <View>
              <Review reviewData={item.review} reviewLocId={item.location.location_id}/>

              <Button
                title="Add Photo"
                onPress={() => this.addPhoto()}
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
  delete: {
    alignItems: 'center'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})

export default MyReviews;
