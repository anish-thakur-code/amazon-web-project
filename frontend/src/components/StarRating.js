import React from 'react';

const StarRating = ({ rating, numReviews }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="product-rating">
      {stars.map((star) => (
        <i
          key={star}
          className={`fas fa-star ${star <= Math.round(rating) ? 'stars-filled' : 'stars-empty'}`}
        ></i>
      ))}
      {numReviews !== undefined && (
        <span>({numReviews})</span>
      )}
    </div>
  );
};

export default StarRating;
