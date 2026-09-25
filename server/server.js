import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
await connectDB();

app.listen(PORT, () => {
  console.log(`🚀 CodeVision AI server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
