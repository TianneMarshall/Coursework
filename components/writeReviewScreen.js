/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Button, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { AirbnbRating } from 'react-native-ratings';
import PropTypes from 'prop-types';

class WriteReviewScreen extends Component {
  constructor(props){
    super(props)

    this.state={
      overall_rating: '',
      review_body: '',
      quality_rating: '',
      price_rating: '',
      clenliness_rating: '',
    }

  }

  postReview = async () => {
    const location_id = this.props.route.params.locId;
    const token = await AsyncStorage.getItem('@session_token');

    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${  location_id  }/review`,
    {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        },
        body: JSON.stringify({
          overall_rating:  parseInt(this.state.overall_rating),
          price_rating: parseInt(this.state.price_rating),
          quality_rating: parseInt(this.state.quality_rating),
          clenliness_rating: parseInt(this.state.clenliness_rating),
          review_body:  this.state.review_body
        })
    })
    .then((response) => {
      if(response.status === 201) {
        Toast.show("Posted review!");
      }
      else if(response.status === 400) {
        console.error("Error invalid review");
      }
      else if(response.status === 401) {
        console.error("Error cannot post review");
      }
      else if(response.status === 404) {
        console.error("Error cannot find location");
      }
      else {
        console.error("Error failed");
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }

  profantiyCheck() {
    const body = this.state.review_body.toLowerCase();
    if(body.includes("cake")){
      console.error("Error must not review cakes");
    }
    else if(body.includes("tea")){
      console.error("Error must not review tea");
    }
    else if(body.includes("pastry") || body.includes("pastries")){
      console.error("Error must not review pastries");
    }
    else{
      this.postReview();
    }

  }

  render() {
    return(
      <View style={styles.review}>

      <ScrollView>
          <View style={styles.rating}>
            <TextInput
              defaultValue="Quality"
              editable={false}
            />

            <AirbnbRating
              count={5}
              defaultRating={0}
              reviews=''
              size={30}
              onFinishRating={(quality_rating) => this.setState({quality_rating})} />
          </View>



          <View style={styles.rating}>
            <TextInput
              defaultValue="Price"
              editable={false}
            />

            <AirbnbRating
              count={5}
              defaultRating={0}
              reviews=''
              size={30}
              onFinishRating={(price_rating) => this.setState({price_rating})} />
          </View>



          <View style={styles.rating}>
            <TextInput
              defaultValue="Cleanliness"
              editable={false}
            />

            <AirbnbRating
              count={5}
              defaultRating={0}
              reviews=''
              size={30}
              onFinishRating={(clenliness_rating) => this.setState({clenliness_rating})} />
          </View>


        <View style={styles.rating}>
          <TextInput
            defaultValue="Overall"
            editable={false}
          />

          <AirbnbRating
            count={5}
            defaultRating={0}
            reviews=''
            size={30}
            onFinishRating={(overall_rating) => this.setState({overall_rating})} />
        </View>


        <TextInput
          style={styles.revBody}
          placeholder="write review body"
          onChangeText={(review_body) => this.setState({review_body})}
          value={this.state.review_body}
        />

        <Button
          title="Post Review"
          onPress={() => this.profantiyCheck()}
        />

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  review: {
    flex: 1,
    alignItems: 'center'
  },

  rating: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    textAlign: 'center'
  },

  revBody: {
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 100,
    width: 200,
    borderColor: 'blue',
    borderWidth: 3
  }
})

WriteReviewScreen.propTypes = {
  route: PropTypes.instanceOf(Object).isRequired
}

export default WriteReviewScreen;
