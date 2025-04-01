
import { supabase, Tables } from "@/integrations/supabase/client";
import { Subject } from "@/types/supabase";

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
