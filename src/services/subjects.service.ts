
import { mongodb } from "@/integrations/mongodb/client";
import { Subject } from "@/types/mongodb";

export const subjectsService = {
  async getSubjectsByBranchAndYear(branch: string, year: string): Promise<Subject[]> {
    try {
      const subjects = await mongodb.find("subjects", { branch, year });
      return subjects as Subject[];
    } catch (error) {
      console.error("Error getting subjects:", error);
      return [];
    }
  },
  
  async getSubjectById(id: string): Promise<Subject | null> {
    try {
      const subject = await mongodb.findOne("subjects", { _id: id });
      return subject as Subject | null;
    } catch (error) {
      console.error("Error getting subject by id:", error);
      return null;
    }
  }
};
