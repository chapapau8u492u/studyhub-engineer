
import axios from "axios";

// MongoDB Atlas Data API configuration
// This is a public API key that should be configured for your Atlas cluster's Data API
const DATA_API_URL = "https://data.mongodb-api.com/app/data-api/endpoint/data/v1";
const DATA_API_KEY = ""; // You'll need to add your API key here
const DATA_SOURCE = "Cluster0"; // Your Atlas cluster name
const DATABASE = "notes_app"; // Your database name

const client = axios.create({
  baseURL: DATA_API_URL,
  headers: {
    "Content-Type": "application/json",
    "api-key": DATA_API_KEY,
  },
});

export const mongodb = {
  async find(collection: string, filter = {}, options = {}) {
    try {
      const response = await client.post("/action/find", {
        dataSource: DATA_SOURCE,
        database: DATABASE,
        collection,
        filter,
        ...options
      });
      return response.data.documents || [];
    } catch (error) {
      console.error("MongoDB find error:", error);
      return [];
    }
  },

  async findOne(collection: string, filter = {}) {
    try {
      const response = await client.post("/action/findOne", {
        dataSource: DATA_SOURCE,
        database: DATABASE,
        collection,
        filter
      });
      return response.data.document || null;
    } catch (error) {
      console.error("MongoDB findOne error:", error);
      return null;
    }
  },

  async insertOne(collection: string, document: any) {
    try {
      const response = await client.post("/action/insertOne", {
        dataSource: DATA_SOURCE,
        database: DATABASE,
        collection,
        document
      });
      return { ...document, _id: response.data.insertedId };
    } catch (error) {
      console.error("MongoDB insertOne error:", error);
      throw error;
    }
  },

  async updateOne(collection: string, filter = {}, update = {}) {
    try {
      const response = await client.post("/action/updateOne", {
        dataSource: DATA_SOURCE,
        database: DATABASE,
        collection,
        filter,
        update: { $set: update }
      });
      return response.data;
    } catch (error) {
      console.error("MongoDB updateOne error:", error);
      throw error;
    }
  },

  async deleteOne(collection: string, filter = {}) {
    try {
      const response = await client.post("/action/deleteOne", {
        dataSource: DATA_SOURCE,
        database: DATABASE,
        collection,
        filter
      });
      return response.data;
    } catch (error) {
      console.error("MongoDB deleteOne error:", error);
      throw error;
    }
  }
};
