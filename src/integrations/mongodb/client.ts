
import { MongoClient, ObjectId } from "mongodb";

// MongoDB connection string
const MONGODB_URI = "mongodb+srv://trylaptop2024:<db_password>@notes-app.cmibw.mongodb.net/?retryWrites=true&w=majority&appName=Notes-App";
// Replace <db_password> with your actual password in the code
const DATABASE = "notes_app"; // Your database name

// Create MongoDB client
const client = new MongoClient(MONGODB_URI.replace("<db_password>", "your_actual_password_here"));

// Connect to MongoDB
let clientPromise: Promise<MongoClient>;
try {
  clientPromise = client.connect();
  console.log("MongoDB connection initialized");
} catch (error) {
  console.error("Failed to connect to MongoDB", error);
  throw error;
}

export const mongodb = {
  async find(collection: string, filter = {}, options = {}) {
    try {
      const database = (await clientPromise).db(DATABASE);
      const result = await database.collection(collection).find(filter, options).toArray();
      return result;
    } catch (error) {
      console.error(`MongoDB find error in ${collection}:`, error);
      return [];
    }
  },

  async findOne(collection: string, filter = {}) {
    try {
      // Convert string _id to ObjectId if present
      if (filter && (filter as any)._id && typeof (filter as any)._id === 'string') {
        (filter as any)._id = new ObjectId((filter as any)._id);
      }
      
      const database = (await clientPromise).db(DATABASE);
      const result = await database.collection(collection).findOne(filter);
      return result;
    } catch (error) {
      console.error(`MongoDB findOne error in ${collection}:`, error);
      return null;
    }
  },

  async insertOne(collection: string, document: any) {
    try {
      const database = (await clientPromise).db(DATABASE);
      const result = await database.collection(collection).insertOne(document);
      return { ...document, _id: result.insertedId.toString() };
    } catch (error) {
      console.error(`MongoDB insertOne error in ${collection}:`, error);
      throw error;
    }
  },

  async updateOne(collection: string, filter = {}, update = {}) {
    try {
      // Convert string _id to ObjectId if present
      if (filter && (filter as any)._id && typeof (filter as any)._id === 'string') {
        (filter as any)._id = new ObjectId((filter as any)._id);
      }
      
      const database = (await clientPromise).db(DATABASE);
      const result = await database.collection(collection).updateOne(
        filter, 
        update.hasOwnProperty('$set') ? update : { $set: update }
      );
      return result;
    } catch (error) {
      console.error(`MongoDB updateOne error in ${collection}:`, error);
      throw error;
    }
  },

  async deleteOne(collection: string, filter = {}) {
    try {
      // Convert string _id to ObjectId if present
      if (filter && (filter as any)._id && typeof (filter as any)._id === 'string') {
        (filter as any)._id = new ObjectId((filter as any)._id);
      }
      
      const database = (await clientPromise).db(DATABASE);
      const result = await database.collection(collection).deleteOne(filter);
      return result;
    } catch (error) {
      console.error(`MongoDB deleteOne error in ${collection}:`, error);
      throw error;
    }
  }
};
