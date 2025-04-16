
import { ObjectId } from "mongodb";

// Create a browser-friendly MongoDB client that doesn't rely on Node.js modules
// This is a simple implementation that doesn't use the MongoDB driver directly

// Mock ObjectId for browser compatibility
export { ObjectId };

export const mongodb = {
  async find(collection: string, filter = {}, options = {}) {
    try {
      console.log(`Finding documents in ${collection} with filter:`, filter);
      
      // For browser-compatibility, we'll use a mock implementation that returns sample data
      // In a real app, this would be replaced with fetch calls to a backend API
      
      if (collection === "subjects") {
        return mockSubjects.filter(subject => {
          for (const [key, value] of Object.entries(filter)) {
            if (subject[key] !== value) return false;
          }
          return true;
        });
      }
      
      if (collection === "notes") {
        if ((filter as any).subject_id) {
          return mockNotes.filter(note => note.subject_id === (filter as any).subject_id);
        } else if ((filter as any).uploader_id) {
          return mockNotes.filter(note => note.uploader_id === (filter as any).uploader_id);
        }
        return mockNotes;
      }
      
      if (collection === "comments") {
        if ((filter as any).note_id) {
          return mockComments.filter(comment => comment.note_id === (filter as any).note_id);
        }
        return mockComments;
      }
      
      if (collection === "ratings") {
        if ((filter as any).note_id) {
          return mockRatings.filter(rating => rating.note_id === (filter as any).note_id);
        }
        return mockRatings;
      }
      
      if (collection === "likes") {
        if ((filter as any).note_id && (filter as any).user_id) {
          return mockLikes.filter(
            like => like.note_id === (filter as any).note_id && like.user_id === (filter as any).user_id
          );
        }
        return mockLikes;
      }
      
      return [];
    } catch (error) {
      console.error(`MongoDB find error in ${collection}:`, error);
      return [];
    }
  },

  async findOne(collection: string, filter = {}) {
    try {
      console.log(`Finding one document in ${collection} with filter:`, filter);
      
      const results = await this.find(collection, filter);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error(`MongoDB findOne error in ${collection}:`, error);
      return null;
    }
  },

  async insertOne(collection: string, document: any) {
    try {
      console.log(`Inserting document into ${collection}:`, document);
      
      // Generate a mock ObjectId
      const _id = Math.random().toString(36).substring(2, 15);
      
      // Add the new document to our mock data
      if (collection === "notes") {
        mockNotes.push({ ...document, _id });
      } else if (collection === "comments") {
        mockComments.push({ ...document, _id });
      } else if (collection === "ratings") {
        mockRatings.push({ ...document, _id });
      } else if (collection === "likes") {
        mockLikes.push({ ...document, _id });
      } else if (collection === "subjects") {
        mockSubjects.push({ ...document, _id });
      }
      
      return { ...document, _id };
    } catch (error) {
      console.error(`MongoDB insertOne error in ${collection}:`, error);
      throw error;
    }
  },

  async updateOne(collection: string, filter = {}, update = {}) {
    try {
      console.log(`Updating document in ${collection} with filter:`, filter);
      
      // Find the document to update
      const item = await this.findOne(collection, filter);
      if (!item) return { acknowledged: false, modifiedCount: 0 };
      
      // Apply the update
      const updateData = update.hasOwnProperty('$set') ? (update as any).$set : update;
      let mockArray: any[] = [];
      
      if (collection === "notes") mockArray = mockNotes;
      else if (collection === "comments") mockArray = mockComments;
      else if (collection === "ratings") mockArray = mockRatings;
      else if (collection === "likes") mockArray = mockLikes;
      else if (collection === "subjects") mockArray = mockSubjects;
      
      const index = mockArray.findIndex(doc => doc._id === item._id);
      if (index !== -1) {
        mockArray[index] = { ...mockArray[index], ...updateData };
      }
      
      return { acknowledged: true, modifiedCount: 1 };
    } catch (error) {
      console.error(`MongoDB updateOne error in ${collection}:`, error);
      throw error;
    }
  },

  async deleteOne(collection: string, filter = {}) {
    try {
      console.log(`Deleting document from ${collection} with filter:`, filter);
      
      // Find the document to delete
      const item = await this.findOne(collection, filter);
      if (!item) return { acknowledged: false, deletedCount: 0 };
      
      // Delete the document
      let mockArray: any[] = [];
      
      if (collection === "notes") mockArray = mockNotes;
      else if (collection === "comments") mockArray = mockComments;
      else if (collection === "ratings") mockArray = mockRatings;
      else if (collection === "likes") mockArray = mockLikes;
      else if (collection === "subjects") mockArray = mockSubjects;
      
      const index = mockArray.findIndex(doc => doc._id === item._id);
      if (index !== -1) {
        mockArray.splice(index, 1);
      }
      
      return { acknowledged: true, deletedCount: 1 };
    } catch (error) {
      console.error(`MongoDB deleteOne error in ${collection}:`, error);
      throw error;
    }
  }
};

// Mock data for browser development
const mockSubjects = [
  {
    _id: "657e12a8b11e8f75c1234501",
    name: "Data Structures",
    code: "CS201",
    branch: "cse",
    year: "2",
    notesCount: 5
  },
  {
    _id: "657e12a8b11e8f75c1234502",
    name: "Machine Design",
    code: "ME301",
    branch: "mechanical",
    year: "3",
    notesCount: 3
  },
  {
    _id: "657e12a8b11e8f75c1234503",
    name: "Circuit Theory",
    code: "EE201",
    branch: "electrical",
    year: "2",
    notesCount: 4
  },
  {
    _id: "657e12a8b11e8f75c1234504",
    name: "Web Development",
    code: "IT302",
    branch: "it",
    year: "3",
    notesCount: 6
  },
  {
    _id: "657e12a8b11e8f75c1234505",
    name: "Structural Analysis",
    code: "CE301",
    branch: "civil",
    year: "3",
    notesCount: 2
  }
];

const mockNotes = [
  {
    _id: "657e12c0b11e8f75c1234601",
    title: "Linked Lists and Trees",
    description: "Comprehensive notes on linked lists, trees, and their implementations",
    file_url: "https://example.com/files/linked_lists.pdf",
    file_type: "pdf",
    file_size: "2.5 MB",
    upload_date: "2023-12-10T08:30:00Z",
    uploader_id: "user123",
    subject_id: "657e12a8b11e8f75c1234501",
    downloads: 45,
    uploader_email: "john.doe@example.com",
    likes_count: 12,
    comments_count: 5,
    avg_rating: 4.5,
    subject_name: "Data Structures",
    subject_code: "CS201",
    branch: "cse",
    year: "2"
  },
  {
    _id: "657e12c0b11e8f75c1234602",
    title: "Gears and Mechanisms",
    description: "Detailed notes on different types of gears and mechanical mechanisms",
    file_url: "https://example.com/files/gears.pdf",
    file_type: "pdf",
    file_size: "3.2 MB",
    upload_date: "2023-11-15T10:45:00Z",
    uploader_id: "user456",
    subject_id: "657e12a8b11e8f75c1234502",
    downloads: 30,
    uploader_email: "jane.smith@example.com",
    likes_count: 8,
    comments_count: 3,
    avg_rating: 4.2,
    subject_name: "Machine Design",
    subject_code: "ME301",
    branch: "mechanical",
    year: "3"
  },
  {
    _id: "657e12c0b11e8f75c1234603",
    title: "Sorting Algorithms",
    description: "Notes on various sorting algorithms and their time complexities",
    file_url: "https://example.com/files/sorting.pptx",
    file_type: "pptx",
    file_size: "1.8 MB",
    upload_date: "2023-12-05T14:20:00Z",
    uploader_id: "user123",
    subject_id: "657e12a8b11e8f75c1234501",
    downloads: 60,
    uploader_email: "john.doe@example.com",
    likes_count: 15,
    comments_count: 7,
    avg_rating: 4.8,
    subject_name: "Data Structures",
    subject_code: "CS201",
    branch: "cse",
    year: "2"
  }
];

const mockComments = [
  {
    _id: "657e12d8b11e8f75c1234701",
    note_id: "657e12c0b11e8f75c1234601",
    user_id: "user456",
    content: "Great notes! Very helpful for my exam preparation.",
    created_at: "2023-12-12T09:15:00Z",
    user_email: "jane.smith@example.com"
  },
  {
    _id: "657e12d8b11e8f75c1234702",
    note_id: "657e12c0b11e8f75c1234601",
    user_id: "user789",
    content: "Could you add more examples for red-black trees?",
    created_at: "2023-12-13T11:20:00Z",
    user_email: "sam.johnson@example.com"
  }
];

const mockRatings = [
  {
    _id: "657e12e8b11e8f75c1234801",
    note_id: "657e12c0b11e8f75c1234601",
    user_id: "user456",
    rating: 5,
    created_at: "2023-12-11T10:30:00Z"
  },
  {
    _id: "657e12e8b11e8f75c1234802",
    note_id: "657e12c0b11e8f75c1234601",
    user_id: "user789",
    rating: 4,
    created_at: "2023-12-13T12:45:00Z"
  }
];

const mockLikes = [
  {
    _id: "657e12f8b11e8f75c1234901",
    note_id: "657e12c0b11e8f75c1234601",
    user_id: "user456",
    created_at: "2023-12-11T10:35:00Z"
  },
  {
    _id: "657e12f8b11e8f75c1234902",
    note_id: "657e12c0b11e8f75c1234602",
    user_id: "user123",
    created_at: "2023-11-16T08:20:00Z"
  }
];
