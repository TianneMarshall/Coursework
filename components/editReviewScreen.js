/* eslint-disable camelcase */
import React, { Component } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { Button, Text, View } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import Stars from 'react-native-stars';

class editReviewScreen extends Component {
  constructor(props){
    super(props)

    this.state={
      rev_id: '',
      loc_id: '',
      originalOverall: '',
      originalQuality: '',
      originalPrice: '',
      originalCleanliness:'',
      originalBody: '',

      updatedOverall: '',
      updatedQuality: '',
      updatedPrice: '',
      updatedCleanliness: '',
      updatedBody: ''
    }
  }

  componentDidMount() {
    this.getOriginalData()
  }

  getOriginalData() {
    const review = this.props.route.params.reviewData;
    const locationId = this.props.route.params.reviewLocId;
    console.log(locationId)
    this.setState({
      rev_id: review.review_id.toString(),
      loc_id: locationId,
      originalOverall: review.overall_rating,
      originalQuality: review.quality_rating,
      originalPrice: review.price_rating,
      originalCleanliness: review.clenliness_rating,
      originalBody: review.review_body,

      updatedOverall: review.overall_rating,
      updatedQuality: review.quality_rating,
      updatedPrice: review.price_rating,
      updatedCleanliness: review.clenliness_rating,
      updatedBody: review.review_body
    })
  }

  editReview = async (newInfo) => {
    const location_id = this.state.loc_id;
    const token = await AsyncStorage.getItem('@session_token');
    const review_id = this.state.rev_id;

    console.log(review_id, location_id)
    
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+ location_id + "/review/" + review_id,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(newInfo),
    })
    .then((response) => {
      if(response.status === 200) {
        Toast.show("Updated review!");
      }
      else if(response.status === 400) {
        throw Error("Error invalid review");
      }
      else if(response.status === 401) {
        throw Error("Cannot update review - please sign in");
      }
      else if(response.status === 403){
        throw Error("Error - user did not post this review")
      }
      else if(response.status === 404) {
        throw Error("Error cannot find review - try another");
      }
      else if(response.status === 500){
        throw Error("Error - please try again later")
      }
      else {
        console.error("Error - Failed");
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }

  checkChanges() {
    const newInfo = {};
  
    if (this.state.updatedOverall !== this.state.originalOverall){
      newInfo.overall_rating = parseInt(this.state.updatedOverall);
    }

    if (this.state.updatedQuality !== this.state.originalQuality){
      newInfo.quality_rating = parseInt(this.state.updatedQuality);
    }

    if (this.state.updatedPrice !== this.state.originalPrice){
      newInfo.price_rating = parseInt(this.state.updatedPrice);
    }

    if (this.state.updatedCleanliness !== this.state.originalCleanliness){
      newInfo.clenliness_rating = parseInt(this.state.updatedCleanliness);
    }
    if(this.state.updatedBody !== this.state.originalBody){
      newInfo.review_body = this.state.updatedBody;
    }
    console.log(newInfo)
    this.editReview(newInfo)
  }

  profanityCheck() {
    const body = this.state.updatedBody.toLowerCase();
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
        this.checkChanges();
      }
  }

  render() {

    return(
      <View style={styles.review}>

        <View style={styles.rating}>
            <TextInput
                defaultValue="Overall"
                editable={false}
            />
             <Stars
              rating={this.state.originalOverall}
              count={5}
              half
              update={(updatedOverall) => this.setState({updatedOverall})}
              spacing={8}
              fullStar={<Icon name="star" size={40} color='gold'/>}
              emptyStar={<Icon name="star-o" size={40} color='gold'/>}
              halfStar={<Icon name="star-half" size={40} color='gold'/>}
            />
          </View>

          <View style={styles.rating}>
            
            <TextInput
              defaultValue="Quality"
              editable={false}
            />
             <Stars
              rating={this.state.originalQuality}
              count={5}
              half
              update={(updatedQuality) => this.setState({updatedQuality})}
              spacing={8}
              fullStar={<Icon name="star" size={40} color='gold'/>}
              emptyStar={<Icon name="star-o" size={40} color='gold'/>}
              halfStar={<Icon name="star-half" size={40} color='gold'/>}
            />
          </View>

          <View style={styles.rating}>
            <TextInput
              defaultValue="Price"
              editable={false}
            />
             <Stars
              rating={this.state.originalPrice}
              count={5}
              half
              update={(updatedPrice) => this.setState({updatedPrice})}
              spacing={8}
              fullStar={<Icon name="star" size={40} color='gold'/>}
              emptyStar={<Icon name="star-o" size={40} color='gold'/>}
              halfStar={<Icon name="star-half" size={40} color='gold'/>}
            />
          </View>

          <View style={styles.rating}>
            <TextInput
              defaultValue="Cleanliness"
              editable={false}
            />
             <Stars
              rating={this.state.originalCleanliness}
              count={5}
              half
              update={(updatedCleanliness) => this.setState({updatedCleanliness})}
              spacing={8}
              fullStar={<Icon name="star" size={40} color='gold'/>}
              emptyStar={<Icon name="star-o" size={40} color='gold'/>}
              halfStar={<Icon name="star-half" size={40} color='gold'/>}
            />
          </View>
          <ScrollView>
            <TextInput
              style={styles.revBody}
              placeholder={this.state.originalBody}
              onChangeText={(updatedBody) => this.setState({updatedBody})}
              value={this.state.updatedBody}
            />
          </ScrollView>
          
          <Button primary rounded style={styles.button} onPress={() => this.profanityCheck()}>
            <Text>Update Review</Text>
          </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  review: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  revBody: {
    flexDirection: 'column',
    alignItems: 'stretch',
    alignSelf: 'center',
    height: 100,
    width: 200,
    borderColor: 'blue',
    borderWidth: 3

  },
  button: {
    alignSelf: 'center',
    margin: 10
  }
})

editReviewScreen.propTypes = {
  route: PropTypes.instanceOf(Object).isRequired,
  reviewData: PropTypes.instanceOf(Object).isRequired,
  reviewLocId: PropTypes.number.isRequired
}

export default editReviewScreen;
