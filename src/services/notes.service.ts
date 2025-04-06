
import { mongodb } from "@/integrations/mongodb/client";
import { Note } from "@/types/mongodb";

export const notesService = {
  async getNotesBySubject(subjectId: string): Promise<Note[]> {
    try {
      const notes = await mongodb.find("notes", { subject_id: subjectId });
      return notes as Note[];
    } catch (error) {
      console.error("Error getting notes by subject:", error);
      return [];
    }
  },
  
  async getNoteById(id: string): Promise<Note | null> {
    try {
      const note = await mongodb.findOne("notes", { _id: id });
      return note as Note | null;
    } catch (error) {
      console.error("Error getting note by id:", error);
      return null;
    }
  },
  
  async uploadNote(note: Omit<Note, '_id' | 'upload_date' | 'downloads'>): Promise<Note | null> {
    try {
      const newNote = {
        ...note,
        upload_date: new Date().toISOString(),
        downloads: 0
      };
      
      const result = await mongodb.insertOne("notes", newNote);
      return result as Note;
    } catch (error) {
      console.error("Error uploading note:", error);
      throw new Error("Failed to upload note. Please try again.");
    }
  },
  
  async incrementDownloads(noteId: string): Promise<void> {
    try {
      await mongodb.updateOne(
        "notes",
        { _id: noteId },
        { $inc: { downloads: 1 } }
      );
    } catch (error) {
      console.error("Error incrementing downloads:", error);
    }
  }
};
