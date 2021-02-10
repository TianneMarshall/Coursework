import React, { Component } from 'react';
import { Alert, AsyncStorage, Button, FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';

class Reviews extends Component {

  constructor(props) {
    super(props);

    this.state={
      rev_id: '',
      liked: false
    }

  }


  likeReview = async () => {

      const token = await AsyncStorage.getItem('@session_token');
      const loc_id = this.props.reviewLocId.toString();
      const rev_id = this.state.rev_id.toString();
      Alert.alert(rev_id);

      return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + loc_id + "/review/" + rev_id + "/like",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })
      .then((response) => {
        if(response.status == 200){
          Toast.show('Success!', Toast.LONG);
        }
        else if(response.status == 401) {
          throw "Could not favourite";
        }
        else if(response.status == 404) {
          throw "Could not get review";
        }
        else{
          throw "Error";
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  checkReviewType = (item) =>{
    if(item.location != null) {
      return item = item.review;
    }
    else{
      return item;
    }
  }


  render() {

    const review = this.props.reviewData;
    const location_id = this.props.reviewLocId;

    return(
      <View>
        <FlatList
          data={review}
          renderItem={({item}) =>
            <View style={styles.reviews}>
              <TouchableOpacity
                onPressIn={() => this.setState({rev_id: item.review_id})}
                onPress={() => this.likeReview()}>

              </TouchableOpacity>

              <Text> overall rating: {item.overall_rating} </Text>
              <Text> Liked by {item.likes} </Text>
              <Text> {item.review_body} </Text>
              <Text> quality: {item.quality_rating} </Text>
              <Text> price: {item.price_rating} </Text>
              <Text> cleanliness: {item.clenliness_rating} </Text>
            </View>
          }
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
