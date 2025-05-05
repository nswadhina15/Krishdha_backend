import express, { json } from 'express';
import { connect, Schema, model } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Handle ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create express app
const app = express();

// Middleware
app.use(json()); // For JSON parsing
app.use(cors()); // Enable CORS

// MongoDB connection
connect(
  process.env.MONGODB_URI ||
    'mongodb+srv://krishdhainfo:vqdNHaH0leXADudL@krishdha.50ju2qs.mongodb.net/Review?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Mongoose schema and model
const reviewSchema = new Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true },
  date: { type: String, required: true },
});

const Review = model('Review', reviewSchema, 'Review');

// Routes
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/reviews', async (req, res) => {
  try {
    const { name, text, rating, date } = req.body;
    const newReview = new Review({ name, text, rating, date });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Serve static frontend (React built files)
const frontendPath = path.join(__dirname, 'public');
// Serve static frontend
app.use(express.static(frontendPath));

// React Router fallback for any route under "/"
app.all('/*splat', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
