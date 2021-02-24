/* eslint-disable camelcase */
import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
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

  componentDidMount() {
    this.getPhoto()
  }

  getPhoto = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const loc_id = this.props.reviewLocId.toString();
    const review = this.props.reviewData;
    const rev_id = review.review_id.toString();

    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${  loc_id  }/review/${  rev_id  }/photo`,
    {
      headers: {
        'Content-Type': 'image/jpeg',
        'X-Authorization': token
      }
    })
    .then((response) => {
      if(response.status === 404){
        throw Error('Error could not find photo or image')
      }
      else if(response.status === 500){
        throw Error('Error - please try again later')
      }
      else if(response.status === 200){
        return response
      }
    })
    .then((response) => response.blob())
    .then(async(responseBlob) => {
      console.log(JSON.stringify(responseBlob))
      const imageURL = URL.createObjectURL(responseBlob) 
      console.log("imageURL", imageURL)
      await AsyncStorage.setItem('@image', JSON.stringify(responseBlob));
    })
    .then(async() => {
      const image = await AsyncStorage.getItem('@image')
      return(
        <Image
          source={{uri: JSON.parse(image)}}
          style={{width: 200, height: 150}}
        />
      )
    })

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
          liked: true,
          thumb: 'thumbs-up'
        });
        Toast.show('Liked!');
      }
      else if(response.status === 401) {
        throw Error("Could not like");
      }
      else if(response.status === 404) {
        throw Error("Could not get review");
      }
      else{
        throw Error("Error");
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
          liked: false,
          thumb: "thumbs-o-up"
        });
        Toast.show('Unliked!', Toast.LONG);
      }
      else if(response.status === 401) {
        throw Error("Could not unlike");
      }
      else if(response.status === 404) {
        throw Error("Could not get review");
      }
      else{
        throw Error("Error");
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }

  checkLike(){
    if(this.state.liked === false) {
      this.like();
    }
    else if(this.state.liked === true){
      this.unlike();
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
        <View style={styles.revBody}>
          <Text> {review.review_body} </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  review: {
    flex: 1,
    marginRight: 15,
    marginLeft: 15,
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
  },
  revBody: {
    alignSelf: 'center'
  }
})


Review.propTypes = {
  reviewData: PropTypes.instanceOf(Object).isRequired,
  reviewLocId: PropTypes.number.isRequired
}

export default Review;
