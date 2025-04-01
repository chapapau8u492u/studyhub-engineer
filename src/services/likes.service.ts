
import { supabase, Tables } from "@/integrations/supabase/client";

export const likesService = {
  async toggleLike(noteId: string, userId: string): Promise<boolean> {
    try {
      // Check if user already liked this note
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('note_id', noteId)
        .eq('user_id', userId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking like:', checkError);
        throw checkError;
      }
      
      if (existingLike) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);
        
        if (error) throw error;
        return false; // Not liked anymore
      } else {
        // Add like
        const { error } = await supabase
          .from('likes')
          .insert([{ note_id: noteId, user_id: userId }]);
        
        if (error) throw error;
        return true; // Now liked
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },
  
  async checkIfLiked(noteId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('note_id', noteId)
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking like:', error);
        throw error;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking like:', error);
      return false;
    }
  }
};
