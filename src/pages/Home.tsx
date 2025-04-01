
import { useState } from 'react';
import Header from '@/components/Header';
import BranchSelector, { Branch, Year } from '@/components/BranchSelector';
import SubjectList, { Subject } from '@/components/SubjectList';
import SearchAndFilter from '@/components/SearchAndFilter';
import NoteCard, { Note } from '@/components/NoteCard';

// Sample notes data
const sampleNotes: Note[] = [
  {
    id: '1',
    title: 'Data Structures Complete Notes',
    description: 'Comprehensive notes covering all topics from arrays to advanced trees and graphs. Includes examples and practice problems.',
    uploadDate: '2023-05-15',
    uploaderName: 'Dr. Sharma',
    rating: 4.8,
    downloads: 1250,
    likes: 342,
    comments: 48,
    fileType: 'PDF',
    fileSize: '4.2 MB',
    subject: {
      id: 'cs201',
      name: 'Data Structures',
      code: 'CS201',
      notesCount: 15,
      branch: 'cse'
    },
    branch: 'cse'
  },
  {
    id: '2',
    title: 'Thermodynamics: Laws and Applications',
    description: 'Detailed notes on thermodynamic laws, cycles, and their engineering applications with solved examples.',
    uploadDate: '2023-06-22',
    uploaderName: 'Prof. Patel',
    rating: 4.5,
    downloads: 980,
    likes: 215,
    comments: 32,
    fileType: 'PDF',
    fileSize: '3.8 MB',
    subject: {
      id: 'me201',
      name: 'Thermodynamics',
      code: 'ME201',
      notesCount: 12,
      branch: 'mechanical'
    },
    branch: 'mechanical'
  },
  {
    id: '3',
    title: 'Circuit Theory Fundamentals',
    description: 'Covers basic to advanced circuit analysis techniques, network theorems, and transient analysis.',
    uploadDate: '2023-04-10',
    uploaderName: 'Dr. Gupta',
    rating: 4.7,
    downloads: 1050,
    likes: 287,
    comments: 38,
    fileType: 'PDF',
    fileSize: '5.1 MB',
    subject: {
      id: 'ee201',
      name: 'Circuit Theory',
      code: 'EE201',
      notesCount: 12,
      branch: 'electrical'
    },
    branch: 'electrical'
  },
  {
    id: '4',
    title: 'Database Systems Concepts and Design',
    description: 'Complete notes on database design, normalization, SQL, and transaction management with practical examples.',
    uploadDate: '2023-07-05',
    uploaderName: 'Prof. Khan',
    rating: 4.6,
    downloads: 1120,
    likes: 298,
    comments: 42,
    fileType: 'PPT',
    fileSize: '6.3 MB',
    subject: {
      id: 'it301',
      name: 'Database Systems',
      code: 'IT301',
      notesCount: 12,
      branch: 'it'
    },
    branch: 'it'
  },
  {
    id: '5',
    title: 'Structural Analysis Techniques',
    description: 'Comprehensive notes on various structural analysis methods including force method, displacement method, and matrix methods.',
    uploadDate: '2023-03-18',
    uploaderName: 'Dr. Verma',
    rating: 4.4,
    downloads: 890,
    likes: 186,
    comments: 29,
    fileType: 'PDF',
    fileSize: '4.5 MB',
    subject: {
      id: 'ce301',
      name: 'Structural Analysis',
      code: 'CE301',
      notesCount: 10,
      branch: 'civil'
    },
    branch: 'civil'
  },
  {
    id: '6',
    title: 'Operating Systems Architecture',
    description: 'Detailed notes on OS concepts, process management, memory management, file systems, and security.',
    uploadDate: '2023-08-12',
    uploaderName: 'Prof. Reddy',
    rating: 4.9,
    downloads: 1450,
    likes: 378,
    comments: 52,
    fileType: 'DOC',
    fileSize: '3.2 MB',
    subject: {
      id: 'cs301',
      name: 'Operating Systems',
      code: 'CS301',
      notesCount: 14,
      branch: 'cse'
    },
    branch: 'cse'
  }
];

const Home = () => {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(null);
  const [selectedYear, setSelectedYear] = useState<Year>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setSelectedSubject(null);
    setFilteredNotes([]);
  };
  
  const handleSelectYear = (year: Year) => {
    setSelectedYear(year);
    setSelectedSubject(null);
    setFilteredNotes([]);
  };
  
  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    // Filter notes for the selected subject
    const notes = sampleNotes.filter(
      note => note.subject.id === subject.id
    );
    setFilteredNotes(notes);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!selectedSubject) return;
    
    if (!query.trim()) {
      // If search is cleared, show all notes for the selected subject
      const notes = sampleNotes.filter(
        note => note.subject.id === selectedSubject.id
      );
      setFilteredNotes(notes);
      return;
    }
    
    // Filter notes based on search query
    const notes = sampleNotes.filter(
      note => 
        note.subject.id === selectedSubject.id &&
        (note.title.toLowerCase().includes(query.toLowerCase()) ||
         note.description.toLowerCase().includes(query.toLowerCase()) ||
         note.uploaderName.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredNotes(notes);
  };
  
  const handleFilter = (criteria: string, value: string) => {
    if (!selectedSubject) return;
    
    // Get the base notes for the selected subject
    let notes = sampleNotes.filter(
      note => note.subject.id === selectedSubject.id
    );
    
    // Apply search query if it exists
    if (searchQuery.trim()) {
      notes = notes.filter(
        note => 
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.uploaderName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply additional filtering based on criteria
    if (criteria === 'sort') {
      if (value === 'recent') {
        notes.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      } else if (value === 'rating') {
        notes.sort((a, b) => b.rating - a.rating);
      } else if (value === 'downloads') {
        notes.sort((a, b) => b.downloads - a.downloads);
      }
    } else if (criteria === 'fileType') {
      if (value !== 'all') {
        notes = notes.filter(note => 
          note.fileType.toLowerCase() === value.toLowerCase() ||
          (value === 'doc' && (note.fileType.toLowerCase() === 'doc' || note.fileType.toLowerCase() === 'docx')) ||
          (value === 'ppt' && (note.fileType.toLowerCase() === 'ppt' || note.fileType.toLowerCase() === 'pptx'))
        );
      }
    } else if (criteria === 'rating') {
      if (value === '4+') {
        notes = notes.filter(note => note.rating >= 4);
      } else if (value === '3+') {
        notes = notes.filter(note => note.rating >= 3);
      } else if (value === '2+') {
        notes = notes.filter(note => note.rating >= 2);
      }
    }
    
    setFilteredNotes(notes);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!selectedSubject ? (
          <>
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Engineering Study Hub</h1>
              <p className="text-gray-600 mb-6">
                Access quality study resources and share your notes with fellow engineering students
              </p>
            </div>
            
            <BranchSelector 
              onSelectBranch={handleSelectBranch} 
              onSelectYear={handleSelectYear}
              selectedBranch={selectedBranch}
              selectedYear={selectedYear}
            />
            
            {selectedBranch && selectedYear && (
              <SubjectList 
                branch={selectedBranch} 
                year={selectedYear}
                onSelectSubject={handleSelectSubject}
              />
            )}
          </>
        ) : (
          <>
            <div className="mb-6">
              <button 
                onClick={() => setSelectedSubject(null)}
                className="text-primary hover:underline inline-flex items-center"
              >
                ← Back to subjects
              </button>
              <h1 className="text-2xl font-bold mt-4">
                {selectedSubject.name}
                <span className="text-sm font-medium text-gray-500 ml-2">
                  ({selectedSubject.code})
                </span>
              </h1>
              <p className="text-gray-600">
                {selectedSubject.notesCount} notes available
              </p>
            </div>
            
            <SearchAndFilter 
              subject={selectedSubject}
              onSearch={handleSearch}
              onFilter={handleFilter}
            />
            
            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No notes found for this subject.</p>
                <p className="text-gray-500 mt-2">Be the first to upload study materials!</p>
              </div>
            )}
          </>
        )}
      </main>
      
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2023 Engineering Study Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
