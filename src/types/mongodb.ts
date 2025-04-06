
export type Branch = 'mechanical' | 'cse' | 'it' | 'civil' | 'electrical' | null;
export type Year = '1' | '2' | '3' | '4' | null;

export interface Note {
  _id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  file_size: string;
  upload_date: string;
  uploader_id: string;
  subject_id: string;
  downloads: number;
  subject?: Subject;
  uploader_email?: string;
  likes_count?: number;
  comments_count?: number;
  avg_rating?: number;
  subject_name?: string;
  subject_code?: string;
  branch?: Branch | string; 
  year?: Year | string;    
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  branch: Branch | string; 
  year: Year | string;    
  notesCount?: number;
}

export interface Rating {
  _id: string;
  note_id: string;
  user_id: string;
  rating: number;
  created_at: string;
}

export interface Comment {
  _id: string;
  note_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_email?: string;
}

export interface Like {
  _id: string;
  note_id: string;
  user_id: string;
  created_at: string;
}
