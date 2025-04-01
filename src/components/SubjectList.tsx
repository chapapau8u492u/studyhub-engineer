
import { Branch, Year } from './BranchSelector';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubjectListProps {
  branch: Branch;
  year: Year;
  onSelectSubject: (subject: Subject) => void;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  notesCount: number;
  branch: Branch;
}

// Subject data organized by branch and year
const subjectsByBranchAndYear: Record<string, Record<string, Subject[]>> = {
  'mechanical': {
    '1': [
      { id: 'me101', name: 'Engineering Mechanics', code: 'ME101', notesCount: 15, branch: 'mechanical' },
      { id: 'me102', name: 'Engineering Graphics', code: 'ME102', notesCount: 8, branch: 'mechanical' },
      { id: 'me103', name: 'Workshop Practice', code: 'ME103', notesCount: 5, branch: 'mechanical' },
    ],
    '2': [
      { id: 'me201', name: 'Thermodynamics', code: 'ME201', notesCount: 12, branch: 'mechanical' },
      { id: 'me202', name: 'Strength of Materials', code: 'ME202', notesCount: 9, branch: 'mechanical' },
      { id: 'me203', name: 'Fluid Mechanics', code: 'ME203', notesCount: 7, branch: 'mechanical' },
    ],
    '3': [
      { id: 'me301', name: 'Heat Transfer', code: 'ME301', notesCount: 10, branch: 'mechanical' },
      { id: 'me302', name: 'Machine Design', code: 'ME302', notesCount: 6, branch: 'mechanical' },
      { id: 'me303', name: 'Manufacturing Processes', code: 'ME303', notesCount: 11, branch: 'mechanical' },
    ],
    '4': [
      { id: 'me401', name: 'Automobile Engineering', code: 'ME401', notesCount: 4, branch: 'mechanical' },
      { id: 'me402', name: 'Refrigeration & Air Conditioning', code: 'ME402', notesCount: 8, branch: 'mechanical' },
      { id: 'me403', name: 'Industrial Engineering', code: 'ME403', notesCount: 6, branch: 'mechanical' },
    ],
  },
  'cse': {
    '1': [
      { id: 'cs101', name: 'Introduction to Programming', code: 'CS101', notesCount: 18, branch: 'cse' },
      { id: 'cs102', name: 'Digital Logic', code: 'CS102', notesCount: 10, branch: 'cse' },
      { id: 'cs103', name: 'Discrete Mathematics', code: 'CS103', notesCount: 7, branch: 'cse' },
    ],
    '2': [
      { id: 'cs201', name: 'Data Structures', code: 'CS201', notesCount: 15, branch: 'cse' },
      { id: 'cs202', name: 'Computer Organization', code: 'CS202', notesCount: 9, branch: 'cse' },
      { id: 'cs203', name: 'Object-Oriented Programming', code: 'CS203', notesCount: 12, branch: 'cse' },
    ],
    '3': [
      { id: 'cs301', name: 'Operating Systems', code: 'CS301', notesCount: 14, branch: 'cse' },
      { id: 'cs302', name: 'Database Management Systems', code: 'CS302', notesCount: 11, branch: 'cse' },
      { id: 'cs303', name: 'Computer Networks', code: 'CS303', notesCount: 8, branch: 'cse' },
    ],
    '4': [
      { id: 'cs401', name: 'Artificial Intelligence', code: 'CS401', notesCount: 9, branch: 'cse' },
      { id: 'cs402', name: 'Machine Learning', code: 'CS402', notesCount: 7, branch: 'cse' },
      { id: 'cs403', name: 'Cloud Computing', code: 'CS403', notesCount: 5, branch: 'cse' },
    ],
  },
  'it': {
    '1': [
      { id: 'it101', name: 'Introduction to IT', code: 'IT101', notesCount: 16, branch: 'it' },
      { id: 'it102', name: 'Digital Systems', code: 'IT102', notesCount: 9, branch: 'it' },
      { id: 'it103', name: 'Programming Fundamentals', code: 'IT103', notesCount: 11, branch: 'it' },
    ],
    '2': [
      { id: 'it201', name: 'Data Structures & Algorithms', code: 'IT201', notesCount: 13, branch: 'it' },
      { id: 'it202', name: 'Software Engineering', code: 'IT202', notesCount: 8, branch: 'it' },
      { id: 'it203', name: 'Web Technologies', code: 'IT203', notesCount: 10, branch: 'it' },
    ],
    '3': [
      { id: 'it301', name: 'Database Systems', code: 'IT301', notesCount: 12, branch: 'it' },
      { id: 'it302', name: 'Computer Networks', code: 'IT302', notesCount: 7, branch: 'it' },
      { id: 'it303', name: 'Information Security', code: 'IT303', notesCount: 6, branch: 'it' },
    ],
    '4': [
      { id: 'it401', name: 'Big Data Analytics', code: 'IT401', notesCount: 8, branch: 'it' },
      { id: 'it402', name: 'Mobile Application Development', code: 'IT402', notesCount: 9, branch: 'it' },
      { id: 'it403', name: 'Internet of Things', code: 'IT403', notesCount: 5, branch: 'it' },
    ],
  },
  'civil': {
    '1': [
      { id: 'ce101', name: 'Engineering Drawing', code: 'CE101', notesCount: 14, branch: 'civil' },
      { id: 'ce102', name: 'Building Materials', code: 'CE102', notesCount: 7, branch: 'civil' },
      { id: 'ce103', name: 'Surveying I', code: 'CE103', notesCount: 9, branch: 'civil' },
    ],
    '2': [
      { id: 'ce201', name: 'Strength of Materials', code: 'CE201', notesCount: 11, branch: 'civil' },
      { id: 'ce202', name: 'Fluid Mechanics', code: 'CE202', notesCount: 8, branch: 'civil' },
      { id: 'ce203', name: 'Surveying II', code: 'CE203', notesCount: 6, branch: 'civil' },
    ],
    '3': [
      { id: 'ce301', name: 'Structural Analysis', code: 'CE301', notesCount: 10, branch: 'civil' },
      { id: 'ce302', name: 'Geotechnical Engineering', code: 'CE302', notesCount: 7, branch: 'civil' },
      { id: 'ce303', name: 'Transportation Engineering', code: 'CE303', notesCount: 5, branch: 'civil' },
    ],
    '4': [
      { id: 'ce401', name: 'Environmental Engineering', code: 'CE401', notesCount: 8, branch: 'civil' },
      { id: 'ce402', name: 'Construction Management', code: 'CE402', notesCount: 6, branch: 'civil' },
      { id: 'ce403', name: 'Advanced Structural Design', code: 'CE403', notesCount: 4, branch: 'civil' },
    ],
  },
  'electrical': {
    '1': [
      { id: 'ee101', name: 'Basic Electrical Engineering', code: 'EE101', notesCount: 15, branch: 'electrical' },
      { id: 'ee102', name: 'Electrical Measurements', code: 'EE102', notesCount: 8, branch: 'electrical' },
      { id: 'ee103', name: 'Electronic Devices', code: 'EE103', notesCount: 10, branch: 'electrical' },
    ],
    '2': [
      { id: 'ee201', name: 'Circuit Theory', code: 'EE201', notesCount: 12, branch: 'electrical' },
      { id: 'ee202', name: 'Electromagnetic Fields', code: 'EE202', notesCount: 7, branch: 'electrical' },
      { id: 'ee203', name: 'Analog Electronics', code: 'EE203', notesCount: 9, branch: 'electrical' },
    ],
    '3': [
      { id: 'ee301', name: 'Power Systems', code: 'EE301', notesCount: 11, branch: 'electrical' },
      { id: 'ee302', name: 'Control Systems', code: 'EE302', notesCount: 8, branch: 'electrical' },
      { id: 'ee303', name: 'Electrical Machines', code: 'EE303', notesCount: 10, branch: 'electrical' },
    ],
    '4': [
      { id: 'ee401', name: 'Power Electronics', code: 'EE401', notesCount: 9, branch: 'electrical' },
      { id: 'ee402', name: 'Digital Signal Processing', code: 'EE402', notesCount: 6, branch: 'electrical' },
      { id: 'ee403', name: 'Renewable Energy Systems', code: 'EE403', notesCount: 5, branch: 'electrical' },
    ],
  },
};

const SubjectList = ({ branch, year, onSelectSubject }: SubjectListProps) => {
  if (!branch || !year) return null;
  
  const subjects = subjectsByBranchAndYear[branch]?.[year] || [];
  
  if (subjects.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-600">No subjects available for this selection</h3>
      </div>
    );
  }
  
  return (
    <div className="py-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Available Subjects
        <div className="mt-2">
          <Badge variant="outline" className={`branch-pill branch-pill-${branch}`}>
            {branch === 'cse' 
              ? 'Computer Science and Engineering' 
              : branch === 'it' 
                ? 'Information Technology' 
                : `${branch.charAt(0).toUpperCase() + branch.slice(1)} Engineering`}
          </Badge>
          <Badge variant="outline" className="ml-2">
            {year}<sup>{getSuffix(year)}</sup> Year
          </Badge>
        </div>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <Card 
            key={subject.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectSubject(subject)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>{subject.name}</span>
                <Badge variant="outline">{subject.code}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{subject.notesCount} notes available</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper function to get the correct suffix for the year
function getSuffix(year: string | null): string {
  if (year === '1') return 'st';
  if (year === '2') return 'nd';
  if (year === '3') return 'rd';
  return 'th';
}

export default SubjectList;
