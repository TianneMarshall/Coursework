import React, { Component } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { Button, Text, Card, CardItem } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RNCamera } from 'react-native-camera';
import Toast from 'react-native-simple-toast';
import PropTypes from 'prop-types';

class Camera extends Component{

    constructor(props){
        super(props)
    
        this.state={
          location_id: '',
          review_id: ''
        }
    }

    componentDidMount(){
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.getParam();
      })
    }

  componentWillUnmount(){
    this.unsubscribe()
  }

  getParam(){
    const reviewInfo = this.props.route.params.reviewData;

    this.setState({
        review_id: reviewInfo.review.review_id,
        location_id: reviewInfo.location.location_id
    })
  }

  takePicture = async() => {
      const token = await AsyncStorage.getItem('@session_token');
      const locationId = this.state.location_id.toString();
      const reviewId = this.state.review_id.toString();

      console.log("Location: ", locationId)
      console.log("Review: ", reviewId)
  
      if(this.camera){
        const options = {quality: 0.5, base64: true}
        const data = await this.camera.takePictureAsync(options);
  
        return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${  locationId  }/review/${  reviewId  }/photo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'image/jpeg',
            'X-Authorization': token
          },
          body: data.toString()
        })
        .then((response) => {
          if(response.status === 200){
            Toast.show("Uploaded photo!");
          }
          else if(response.status === 400) {
            throw Error("Invalid photo type - try another photo");
          }
          else if(response.status === 401) {
            throw Error("Error - User did not post this review");
          }
          else if(response.status === 404) {
            throw Error("Cannot find review - try another");
          }
          else if(response.status === 500) {
            throw Error("Error - try again later");
          }
          else{
              throw Error("Error failed")
          }
        })
        .catch((error) => {
          console.error(error);
        })
      }
    }

  render(){
    const navigator = this.props.navigation
    return (
      <View style={{flex:1}}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={{
            flex:1,
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
          captureAudio={false}
        />
        <Card style={styles.buttons}>
            <CardItem style={styles.button}>
                
                <Button info onPress={() => navigator.navigate('Profile')}>
                    <Icon
                        style={styles.backButton}
                        name='chevron-left'
                        color='#0033cc'
                        size={30}
                    />
                    <Text>Back</Text>
                </Button>
            </CardItem>
            <CardItem style={styles.button}>
                <Button primary onPress={() => this.takePicture()}>
                    <Text>Take Photo</Text>
                </Button>
            </CardItem>
        </Card>
      </View>
    );
  }

}

const styles = StyleSheet.create({
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignSelf: 'center'
    },
    
    button: {
        margin: 7,
        backgroundColor: 'transparent'
    },

    backButton: {
        margin: 7
    }
});

Camera.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
        addListener: PropTypes.func.isRequired
    }).isRequired,
    route: PropTypes.instanceOf(Object).isRequired,
    reviewData: PropTypes.instanceOf(Object).isRequired
  }

export default Camera;