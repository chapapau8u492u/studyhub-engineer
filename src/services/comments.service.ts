
import { supabase, Tables } from "@/integrations/supabase/client";
import { Comment } from "@/types/supabase";

export const commentsService = {
  async getCommentsByNote(noteId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(*)')
        .eq('note_id', noteId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to include user email
      const commentsWithEmail = data.map((comment: any) => ({
        ...comment,
        user_email: comment.profiles?.email
      }));
      
      return commentsWithEmail || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },
  
  async addComment(comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment | null> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([comment])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },
  
  async deleteComment(commentId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};
