/* eslint-disable camelcase */
import React, { Component } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Button, Text, View, Form, Textarea } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import Stars from 'react-native-stars';

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

  validityCheck() {
    if(!this.state.overall_rating) {
      this.setState({overall_rating: 0})
    }
    if(!this.state.price_rating) {
      this.setState({price_rating: 0})
    }
    if(!this.state.quality_rating) {
      this.setState({quality_rating: 0})
    }
    if(!this.state.clenliness_rating) {
      this.setState({clenliness_rating: 0})
    }
    this.profanityCheck()
  }

  profanityCheck() {
    const body = this.state.review_body.toLowerCase();
    if(!body) {
      console.error("Must write review body");
    }
    else if(body.includes("cake")){
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
          <View style={styles.rating}>
            <TextInput
              defaultValue="Quality"
              editable={false}
            />
            <Stars
              default={0}
              update={(quality_rating) => {this.setState({quality_rating})}}
              count={5}
              spacing={8}
              fullStar={<Icon name="star" size={40} color='gold'/>}
              emptyStar={<Icon name="star-o" size={40} color='gold'/>}
            />

          </View>

          <View style={styles.rating}>
            <TextInput
              defaultValue="Price   "
              editable={false}
            />
            <Stars
              default={0}
              update={(price_rating) => {this.setState({price_rating})}}
              count={5}
              spacing={8}
              fullStar={<Icon name="star" size={40} color='gold'/>}
              emptyStar={<Icon name="star-o" size={40} color='gold'/>}
            />
          </View>

          <View style={styles.rating}>
            <TextInput
              defaultValue="Cleanliness"
              editable={false}
            />
            <Stars
              default={0}
              update={(clenliness_rating) => {this.setState({clenliness_rating})}}
              count={5}
              spacing={8}
              fullStar={<Icon name="star" size={40} color='gold'/>}
              emptyStar={<Icon name="star-o" size={40} color='gold'/>}
            />
          </View>

          <View style={styles.rating}>
            <TextInput
              defaultValue="Overall"
              editable={false}
            />
            <Stars
              default={0}
              update={(overall_rating) => {this.setState({overall_rating})}}
              count={5}
              spacing={8}
              fullStar={<Icon name="star" size={40} color='gold'/>}
              emptyStar={<Icon name="star-o" size={40} color='gold'/>}
            />
          </View>
          <Form>
            <Textarea
              style={styles.revBody}
              rowSpan={5}
              placeholder="Write review body"
              onChangeText={(review_body) => this.setState({review_body})}
              value={this.state.review_body}
            />
          </Form>
          <Button primary rounded style={styles.button} onPress={() => this.validityCheck()}>
            <Text>Post Review</Text>
          </Button>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  review: {
    flex: 1,
    justifyContent: 'center'
  },

  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  revBody: {
    alignSelf: 'center',
    borderColor: '#bf80ff',
    borderWidth: 2,
    margin: 20, 
    width: 350,
  },
  button: {
    alignSelf: 'center',
    marginTop: 20
  }
})

WriteReviewScreen.propTypes = {
  route: PropTypes.instanceOf(Object).isRequired
}

export default WriteReviewScreen;
