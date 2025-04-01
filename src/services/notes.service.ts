
import { supabase, Tables } from "@/integrations/supabase/client";
import { Note } from "@/types/supabase";

export const notesService = {
  async getNotesBySubject(subjectId: string): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from('note_stats')
        .select('*')
        .eq('subject_id', subjectId);
      
      if (error) throw error;
      return data as Note[] || [];
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
      
      return data as Note;
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
      return data as Note;
    } catch (error) {
      console.error('Error uploading note:', error);
      throw error;
    }
  },
  
  async incrementDownloads(noteId: string): Promise<void> {
    try {
      // Use a type casting to tell TypeScript this is the correct structure
      const { error } = await supabase.rpc(
        'increment_note_downloads', 
        { note_id: noteId } as unknown as Record<string, unknown>
      );
      
      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing downloads:', error);
      throw error;
    }
  }
};
