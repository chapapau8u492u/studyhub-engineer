
import { mongodb } from "@/integrations/mongodb/client";
import { Comment } from "@/types/mongodb";
import { adaptMongoCommentToSupaComment } from "@/utils/type-adapters";

export const commentsService = {
  async getCommentsByNote(noteId: string) {
    try {
      const comments = await mongodb.find(
        "comments", 
        { note_id: noteId },
        { sort: { created_at: -1 } }
      );
      return (comments as Comment[]).map(adaptMongoCommentToSupaComment);
    } catch (error) {
      console.error("Error getting comments:", error);
      return [];
    }
  },
  
  async addComment(comment: Omit<Comment, '_id' | 'created_at'>) {
    try {
      const newComment = {
        ...comment,
        created_at: new Date().toISOString()
      };
      
      const result = await mongodb.insertOne("comments", newComment);
      return adaptMongoCommentToSupaComment(result as Comment);
    } catch (error) {
      console.error("Error adding comment:", error);
      throw new Error("Failed to add comment. Please try again.");
    }
  },
  
  async deleteComment(commentId: string, userId: string) {
    try {
      await mongodb.deleteOne("comments", { _id: commentId, user_id: userId });
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw new Error("Failed to delete comment");
    }
  }
};
