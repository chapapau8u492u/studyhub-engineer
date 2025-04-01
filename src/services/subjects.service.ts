
import { supabase, Tables } from "@/integrations/supabase/client";
import { Subject } from "@/types/supabase";

export const subjectsService = {
  async getSubjectsByBranchAndYear(branch: string, year: string): Promise<Subject[]> {
    console.log('Database tables have been reset - getSubjectsByBranchAndYear');
    return [];
  },
  
  async getSubjectById(id: string): Promise<Subject | null> {
    console.log('Database tables have been reset - getSubjectById');
    return null;
  }
};
