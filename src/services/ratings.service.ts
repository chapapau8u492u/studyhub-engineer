
import { supabase, Tables } from "@/integrations/supabase/client";
import { Rating } from "@/types/supabase";

export const ratingsService = {
  async getRatingsByNote(noteId: string): Promise<Rating[]> {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('note_id', noteId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching ratings:', error);
      return [];
    }
  },
  
  async getUserRating(noteId: string, userId: string): Promise<Rating | null> {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('note_id', noteId)
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user rating:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user rating:', error);
      return null;
    }
  },
  
  async addOrUpdateRating(rating: Omit<Rating, 'id' | 'created_at'>): Promise<Rating | null> {
    try {
      // Check if user already rated this note
      const existingRating = await this.getUserRating(rating.note_id, rating.user_id);
      
      if (existingRating) {
        // Update existing rating
        const { data, error } = await supabase
          .from('ratings')
          .update({ rating: rating.rating })
          .eq('id', existingRating.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Insert new rating
        const { data, error } = await supabase
          .from('ratings')
          .insert([rating])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error adding/updating rating:', error);
      throw error;
    }
  }
};
