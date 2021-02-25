import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Text } from 'native-base';
import PropTypes from 'prop-types';

function Location (props) {

  const location = props.locationData;

  return(
    <View style={styles.location}>

      <View style={styles.title}>
        <Text style={styles.titles}>{location.location_name}</Text>  
      </View>

      <Image
        source={{uri: location.photo_path}}
        style={styles.image}
      />

      <Text style={styles.town}> {location.location_town} </Text>
      <Text> Overall Rating: {location.avg_overall_rating} </Text>
      <Text> Price: {location.avg_price_rating} </Text>
      <Text> Quality: {location.avg_quality_rating} </Text>
      <Text> Cleanliness: {location.avg_clenliness_rating} </Text>
    </View>
  );
}

const styles=StyleSheet.create({
  location: {
    flex: 1,
    margin: 6
  },
  title: {
    alignItems: 'center'
  },
  titles: {
    color: 'black',
    fontSize: 30,
  },
  town: {
    fontSize: 20,
    alignSelf: 'center',
    margin: 20
  },
  image: {
    width: 200,
    height: 150,
    margin: 15
  }
});

Location.propTypes = {
  locationData: PropTypes.instanceOf(Object).isRequired
}
export default Location;
