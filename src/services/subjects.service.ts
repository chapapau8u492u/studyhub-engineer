
import { mongodb } from "@/integrations/mongodb/client";
import { Subject } from "@/types/mongodb";
import { adaptMongoSubjectToSupaSubject } from "@/utils/type-adapters";

export const subjectsService = {
  async getSubjectsByBranchAndYear(branch: string, year: string) {
    try {
      const subjects = await mongodb.find("subjects", { branch, year });
      return subjects.map(subject => adaptMongoSubjectToSupaSubject(subject as Subject));
    } catch (error) {
      console.error("Error getting subjects:", error);
      return [];
    }
  },
  
  async getSubjectById(id: string) {
    try {
      const subject = await mongodb.findOne("subjects", { _id: id });
      return subject ? adaptMongoSubjectToSupaSubject(subject as Subject) : null;
    } catch (error) {
      console.error("Error getting subject by id:", error);
      return null;
    }
  }
};
