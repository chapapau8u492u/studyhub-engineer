
import { mongodb } from "@/integrations/mongodb/client";
import { Rating } from "@/types/mongodb";

export const ratingsService = {
  async getRatingsByNote(noteId: string): Promise<Rating[]> {
    try {
      const ratings = await mongodb.find("ratings", { note_id: noteId });
      return ratings as Rating[];
    } catch (error) {
      console.error("Error getting ratings:", error);
      return [];
    }
  },
  
  async getUserRating(noteId: string, userId: string): Promise<Rating | null> {
    try {
      const rating = await mongodb.findOne("ratings", { note_id: noteId, user_id: userId });
      return rating as Rating | null;
    } catch (error) {
      console.error("Error getting user rating:", error);
      return null;
    }
  },
  
  async addOrUpdateRating(rating: Omit<Rating, '_id' | 'created_at'>): Promise<Rating | null> {
    try {
      // Check if rating exists
      const existingRating = await this.getUserRating(rating.note_id, rating.user_id);
      
      if (existingRating) {
        // Update existing rating
        await mongodb.updateOne(
          "ratings",
          { _id: existingRating._id },
          { rating: rating.rating }
        );
        return {
          ...existingRating,
          rating: rating.rating
        };
      } else {
        // Create new rating
        const newRating = {
          ...rating,
          created_at: new Date().toISOString()
        };
        
        const result = await mongodb.insertOne("ratings", newRating);
        return result as Rating;
      }
    } catch (error) {
      console.error("Error adding/updating rating:", error);
      throw new Error("Failed to save rating. Please try again.");
    }
  }
};
