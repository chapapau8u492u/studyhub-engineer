
import * as MongoTypes from '@/types/mongodb';
import * as SupaTypes from '@/types/supabase';

/**
 * Adapters to convert MongoDB data structures to Supabase-compatible formats
 * for use with existing UI components
 */

export function adaptMongoNoteToSupaNote(mongoNote: MongoTypes.Note): SupaTypes.Note {
  return {
    id: mongoNote._id.toString(),
    title: mongoNote.title,
    description: mongoNote.description,
    file_url: mongoNote.file_url,
    file_type: mongoNote.file_type,
    file_size: mongoNote.file_size,
    upload_date: mongoNote.upload_date,
    uploader_id: mongoNote.uploader_id,
    subject_id: mongoNote.subject_id,
    downloads: mongoNote.downloads,
    subject: mongoNote.subject ? adaptMongoSubjectToSupaSubject(mongoNote.subject) : undefined,
    uploader_email: mongoNote.uploader_email,
    likes_count: mongoNote.likes_count,
    comments_count: mongoNote.comments_count,
    avg_rating: mongoNote.avg_rating,
    subject_name: mongoNote.subject_name,
    subject_code: mongoNote.subject_code,
    branch: mongoNote.branch,
    year: mongoNote.year,
  };
}

export function adaptMongoSubjectToSupaSubject(mongoSubject: MongoTypes.Subject): SupaTypes.Subject {
  return {
    id: mongoSubject._id.toString(),
    name: mongoSubject.name,
    code: mongoSubject.code,
    branch: mongoSubject.branch,
    year: mongoSubject.year,
    notesCount: mongoSubject.notesCount,
  };
}

export function adaptMongoCommentToSupaComment(mongoComment: MongoTypes.Comment): SupaTypes.Comment {
  return {
    id: mongoComment._id.toString(),
    note_id: mongoComment.note_id,
    user_id: mongoComment.user_id,
    content: mongoComment.content,
    created_at: mongoComment.created_at,
    user_email: mongoComment.user_email,
  };
}

export function adaptMongoRatingToSupaRating(mongoRating: MongoTypes.Rating): SupaTypes.Rating {
  return {
    id: mongoRating._id.toString(),
    note_id: mongoRating.note_id,
    user_id: mongoRating.user_id,
    rating: mongoRating.rating,
    created_at: mongoRating.created_at,
  };
}

export function adaptMongoLikeToSupaLike(mongoLike: MongoTypes.Like): SupaTypes.Like {
  return {
    id: mongoLike._id.toString(),
    note_id: mongoLike.note_id,
    user_id: mongoLike.user_id,
    created_at: mongoLike.created_at,
  };
}
