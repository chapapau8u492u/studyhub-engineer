
import { supabase, Tables } from "@/integrations/supabase/client";

export const likesService = {
  async toggleLike(noteId: string, userId: string): Promise<boolean> {
    console.log('Database tables have been reset - toggleLike');
    console.log('Cannot toggle like as database tables do not exist yet');
    throw new Error('Database tables have been reset. Please set up the database schema first.');
  },
  
  async checkIfLiked(noteId: string, userId: string): Promise<boolean> {
    console.log('Database tables have been reset - checkIfLiked');
    return false;
  }
};
