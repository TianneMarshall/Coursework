import React, { Component } from 'react';
import { Alert, AsyncStorage, Button, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Location from './location';

class Homescreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      locations: []
    }
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
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          locations: responseJson
        });
      })
      .catch((error) => {
        Alert.alert("Could not load locations")
        console.error(error);
      });
  }

  componentDidMount(){
    this.getLocations();
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.state.locations}
          renderItem={({item}) =>
              <TouchableOpacity>
                <View style={styles.location}>
                  <Text style={{fontSize: 20}}>{item.location_name}</Text>
                  <Text>{item.location_town}</Text>
                  <Text> {item.avg_overall_rating} </Text>
                </View>
              </TouchableOpacity>
          }
          keyExtractor={({location_id}, index) => location_id.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

  location: {
    flex: 1,
    borderColor: 'blue',
    borderWidth: 4,
    margin: 8,
    padding: 7
  },

  name: {
    fontSize: 15,
    color: 'red'
  },

  element: {
    flex: 2
  },

  field: {
    borderWidth: 2,
    borderColor: 'blue'
  },

  label:{
    alignItems: 'center'
  }

})

export default Homescreen;
