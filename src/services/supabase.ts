
import { supabase } from "@/integrations/supabase/client";
import { Note, Subject, Rating, Comment, Like } from "@/types/supabase";

// Subjects service
export const subjectsService = {
  async getSubjectsByBranchAndYear(branch: string, year: string): Promise<Subject[]> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('branch', branch)
        .eq('year', year);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
  },
  
  async getSubjectById(id: string): Promise<Subject | null> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subject:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching subject:', error);
      return null;
    }
  }
};

// Notes service
export const notesService = {
  async getNotesBySubject(subjectId: string): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from('note_stats')
        .select('*')
        .eq('subject_id', subjectId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  },
  
  async getNoteById(id: string): Promise<Note | null> {
    try {
      const { data, error } = await supabase
        .from('note_stats')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching note:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching note:', error);
      return null;
    }
  },
  
  async uploadNote(note: Omit<Note, 'id' | 'upload_date' | 'downloads'>): Promise<Note | null> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([note])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading note:', error);
      throw error;
    }
  },
  
  async incrementDownloads(noteId: string): Promise<void> {
    try {
      const { error } = await supabase
        .rpc('increment_note_downloads', { note_id: noteId });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing downloads:', error);
      throw error;
    }
  }
};

// Ratings service
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

// Comments service
export const commentsService = {
  async getCommentsByNote(noteId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, auth.users(email)')
        .eq('note_id', noteId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to include user email
      return data.map((comment: any) => ({
        ...comment,
        user_email: comment.users?.email
      })) || [];
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

// Likes service
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

// File storage service
export const storageService = {
  async uploadFile(file: File, userId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('notes')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('notes')
        .getPublicUrl(fileName);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },
  
  getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('notes')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }
};
