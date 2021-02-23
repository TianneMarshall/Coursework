/* eslint-disable camelcase */
import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Text, Card, CardItem, Thumbnail } from 'native-base'
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

class Homescreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      locations: [],
    }
  }

  componentDidMount(){
    this.getLocations();
  }

  getLocations = async () => {

    const token = await AsyncStorage.getItem('@session_token');

    return fetch("http://10.0.2.2:3333/api/1.0.0/find",
    {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
    })
      .then((response) => {
        if(response.status === 400){
          throw Error("Could not load locations - Bad Request")
        }
        else if(response.status === 401) {
          throw Error("Could not load locations - Please log in")
        }
        else if(response.status === 500) {
          throw Error("Error - please try again later")
        }
          return response;
      })
      .then((response) => response.json())
      .then((responseJson) => {
       
          this.setState({
            locations: responseJson
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {

    const navigator = this.props.navigation;

    return (
      <View style={styles.screen}>
        <Button 
          info 
          rounded
          style={styles.button}
          onPress={() => navigator.navigate('MyLocation', {locations: this.state.locations})}>
          <Text> Search Nearby </Text>
        </Button>

        <FlatList
          data={this.state.locations}
          renderItem={({item}) =>
                <Card>
                  <CardItem bordered button onPress={() => navigator.navigate('LocationScreen', {locId: item.location_id})}>
                    <Thumbnail source={{uri: item.photo_path}} />
                    <Text style={{fontSize: 20}}>{item.location_name}</Text>
                  </CardItem>

                  <CardItem>
                    <Text>{item.location_town}</Text>
                  </CardItem>
                  <CardItem>
                    <Text>Overall Rating: {item.avg_overall_rating} </Text>
                  </CardItem>
                </Card>
          }
          keyExtractor={({location_id}) => location_id.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    margin: 8
  },
  button: {
    alignSelf: 'center'
  }

})

Homescreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
}

export default Homescreen;
