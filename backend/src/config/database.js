import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async () => {
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI is not configured');
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });
  console.log('MongoDB connected');
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};

export const databaseState = () => ({
  readyState: mongoose.connection.readyState,
  connected: mongoose.connection.readyState === 1
});
