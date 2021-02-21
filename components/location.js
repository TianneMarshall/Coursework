import React from 'react';
import { Image, Text, TextInput, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

function Location (props) {

  const location = props.locationData;

  return(
    <View style={styles.location}>

      <View style={styles.title}>
        <TextInput style={styles.titles} editable={false}> {location.location_name} </TextInput>
      </View>

      <Image
        source={{uri: location.photo_path}}
        style={{width: 200, height: 200}}
      />

      <Text> {location.location_town} </Text>
      <Text> longitude: {location.longitude} </Text>
      <Text> latitude: {location.latitude} </Text>

      <Text> overall rating: {location.avg_overall_rating} </Text>
      <Text> price: {location.avg_price_rating} </Text>
      <Text> quality: {location.avg_quality_rating} </Text>
      <Text> cleanliness: {location.avg_clenliness_rating} </Text>
    </View>
  );
}

const styles=StyleSheet.create({
  location: {
    flex: 1,
    margin: 6
  },
  inputBox: {
    borderColor: 'blue',
    borderWidth: 4,
  },
  title: {
    alignItems: 'center'
  },
  titles: {
    color: 'black',
    fontSize: 30,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center'
  },
});

Location.propTypes = {
  locationData: PropTypes.instanceOf(Object).isRequired
}
export default Location;
