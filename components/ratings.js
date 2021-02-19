import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Stars from 'react-native-stars';
import PropTypes from 'prop-types';

function Ratings (props) {

  const reviewRating = props.reviewData;

  return(
    <Stars
      rating={reviewRating}
      count={5}
      half
      spacing={8}
      fullStar={<Icon name="star" size={25} color='gold'/>}
      emptyStar={<Icon name="star-o" size={25} color='gold'/>}
      halfStar={<Icon name="star-half" size={25} color='gold'/>}
    />
  );
}

Ratings.propTypes = {
  reviewData: PropTypes.number.isRequired
}

export default Ratings;
