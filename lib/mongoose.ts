import mongoose from "mongoose";

// let isConnected = false; // Variable to track the connection status
const PATH = process.env.MONGODB_URL

if (!PATH) {
  throw new Error(
    'Please define the MONGODB_URL environment variable inside .env.local'
  )
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}


export const connectToDB = async () => {
  if (cached.conn) {
    console.log("MongoDB connection already established");
    return cached.conn
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(PATH).then((mongoose) => {
      return mongoose
    })
  }
  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
};