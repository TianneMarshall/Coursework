/* eslint-disable camelcase */
import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, CardItem, Thumbnail, Header, Item, Input } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

class Homescreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      locations: [],
      searchInput: ''
    }
  }

  componentDidMount(){
    // re-load the locations when the home screen comes into focus
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getLocations();
    })
  }

  componentWillUnmount(){
    this.unsubscribe()
  }

  getLocations = async () => {

    const token = await AsyncStorage.getItem('@session_token');
    const searchValue = this.state.searchInput;

    return fetch(`http://10.0.2.2:3333/api/1.0.0/find?q=${  searchValue}`,
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
      // return the locations if the request did not fail
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
        <Header searchBar transparent>
          <Item>
            <Input placeholder="Search" onChangeText={(searchInput) => this.setState({searchInput})}/>
            {/* Button to search for particular venues */}
            <Icon style={styles.button}
              name="search" color='#0033cc'size={30} 
              onPress={() => this.getLocations()}
            />
            {/* Button to search for venues by the user's device location */}
            <Icon style={styles.button}
              name='map-pin' color='#cc99ff' size={28}
              onPress={() => navigator.navigate('MyLocation', {locations: this.state.locations})}
            />
          </Item>
        </Header>
        <FlatList
          data={this.state.locations}
          renderItem={({item}) =>
            <Card bordered>
              {/* Load individual location info for the location that is pressed */}
              <CardItem button style={styles.card} onPress={() => navigator.navigate('Location Info', {locId: item.location_id})}>
                <Thumbnail source={{uri: item.photo_path}} />
                <Text style={{fontSize: 20}}>{item.location_name}</Text>
              </CardItem>
              <CardItem >
                <Text>{item.location_town}</Text>
              </CardItem>
              <CardItem >
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
    alignSelf: 'center',
    margin: 10
  },
  card: {
    borderBottomWidth: 2,
    borderColor: '#bf80ff',
  }
})

Homescreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired
  }).isRequired
}

export default Homescreen;
