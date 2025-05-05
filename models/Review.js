import { Schema, model } from 'mongoose';

// Create the Review Schema
const reviewSchema = new Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: Date, default: Date.now }, // Timestamp when the review was submitted
});

// Create the Review model based on the schema
const Review = model('Review', reviewSchema);

export default Review;
