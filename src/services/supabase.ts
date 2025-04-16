
// Re-export all MongoDB services with the supabase.ts filename
// This allows existing imports to work without needing to be updated
export { subjectsService } from './subjects.service';
export { notesService } from './notes.service';
export { ratingsService } from './ratings.service';
export { commentsService } from './comments.service';
export { likesService } from './likes.service';
export { storageService } from './storage.service';
