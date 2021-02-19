/* eslint-disable camelcase */
import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import PropTypes from 'prop-types';

import Ratings from './ratings';

class Review extends Component {
  constructor(props){
    super(props)
    this.state={
      liked: false,
      thumb: 'thumbs-o-up'
    }
  }

  like = async () => {

      const token = await AsyncStorage.getItem('@session_token');
      const review = this.props.reviewData;
      const loc_id = this.props.reviewLocId.toString();
      const rev_id = review.review_id.toString();

      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${  loc_id  }/review/${  rev_id  }/like`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })
      .then((response) => {
        if(response.status === 200){
          this.setState({
            liked: true
          });
          Toast.show('Liked!');
        }
        else if(response.status === 401) {
          console.error("Could not like");
        }
        else if(response.status === 404) {
          console.error("Could not get review");
        }
        else{
          console.error("Error");
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  unlike = async () => {

    const token = await AsyncStorage.getItem('@session_token');
    const review = this.props.reviewData;
    const loc_id = this.props.reviewLocId.toString();
    const rev_id = review.review_id.toString();

      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${  loc_id  }/review/${  rev_id  }/like`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })
      .then((response) => {
        if(response.status === 200){
          this.setState({
            liked: false
          });
          Toast.show('Unliked!', Toast.LONG);
        }
        else if(response.status === 401) {
          console.error("Could not unlike");
        }
        else if(response.status === 404) {
          console.error("Could not get review");
        }
        else{
          console.error("Error");
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  checkLike(){
    if(this.state.liked === false) {
      this.like();
      this.setState({thumb: "thumbs-up"});

    }
    else if(this.state.liked === true){
      this.unlike();
      this.setState({thumb: "thumbs-o-up"});
    }
  }

  render() {
    const review = this.props.reviewData;
    return(
      <View style={styles.review}>

        <TouchableOpacity style={styles.likes}>
          <Text> Liked by {review.likes} </Text>
          <Icon
            name={this.state.thumb}
            size={30}
            onPress={() => this.checkLike()}
          />
        </TouchableOpacity>

        <View style={styles.rating}>
          <TextInput
            defaultValue="Overall"
            editable={false}
          />
          <Ratings reviewData={review.overall_rating} />
        </View>

        <View style={styles.rating}>
          <TextInput
            defaultValue="Quality"
            editable={false}
          />
          <Ratings reviewData={review.quality_rating} />
        </View>

        <View style={styles.rating}>
          <TextInput
            defaultValue="Price   "
            editable={false}
          />
          <Ratings reviewData={review.price_rating} />
        </View>

        <View style={styles.rating}>
          <TextInput
            defaultValue="Cleanliness"
            editable={false}
          />
          <Ratings reviewData={review.clenliness_rating} />
        </View>

        <Text> {review.review_body} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  review: {
    flex: 1,
    borderColor: 'blue',
    borderWidth: 3,
    margin: 10,
    padding: 15
  },

  likes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  delete: {
    alignItems: 'center'
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  star: {
    color: 'yellow'
  }
})


Review.propTypes = {
  reviewData: PropTypes.instanceOf(Object).isRequired,
  reviewLocId: PropTypes.number.isRequired
}

export default Review;
