import React from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import Review from './review';

function Reviews (props) {

  const review = props.reviewData;

  return(
    <View>
      <FlatList
        data={review}
        renderItem={({item}) =>

          <Review reviewData={item.review} reviewLocId={item.location.location_id}/>
        }
      />
    </View>
  );
}

Reviews.propTypes = {
  reviewData: PropTypes.instanceOf(Object).isRequired
}

export default Reviews;
