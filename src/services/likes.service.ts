
import { mongodb } from "@/integrations/mongodb/client";
import { Like } from "@/types/mongodb";
import { adaptMongoLikeToSupaLike } from "@/utils/type-adapters";

export const likesService = {
  async toggleLike(noteId: string, userId: string) {
    try {
      // Check if like exists
      const existingLike = await mongodb.findOne("likes", { note_id: noteId, user_id: userId });
      
      if (existingLike) {
        // Remove like
        await mongodb.deleteOne("likes", { _id: existingLike._id });
        return false;
      } else {
        // Add like
        await mongodb.insertOne("likes", {
          note_id: noteId,
          user_id: userId,
          created_at: new Date().toISOString()
        });
        return true;
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      throw new Error("Failed to process like. Please try again.");
    }
  },
  
  async checkIfLiked(noteId: string, userId: string) {
    try {
      const like = await mongodb.findOne("likes", { note_id: noteId, user_id: userId });
      return !!like;
    } catch (error) {
      console.error("Error checking like status:", error);
      return false;
    }
  }
};
