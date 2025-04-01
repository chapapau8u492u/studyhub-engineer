
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Subject, Note, Branch, Year } from '@/types/supabase';
import { subjectsService, notesService } from '@/services/supabase';
import Header from '@/components/Header';
import BranchSelector from '@/components/BranchSelector';
import SubjectList from '@/components/SubjectList';
import SearchAndFilter from '@/components/SearchAndFilter';
import NoteCard from '@/components/NoteCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, LogIn } from 'lucide-react';

const Home = () => {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(null);
  const [selectedYear, setSelectedYear] = useState<Year>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
  
  const handleSelectSubject = async (subject: Subject) => {
    setIsLoading(true);
    setSelectedSubject(subject);
    
    try {
      // Fetch notes for the selected subject from the database
      const notes = await notesService.getNotesBySubject(subject.id);
      setFilteredNotes(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notes for this subject',
        variant: 'destructive',
      });
      setFilteredNotes([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!selectedSubject) return;
    
    if (!query.trim()) {
      // If search is cleared, show all notes for the selected subject
      notesService.getNotesBySubject(selectedSubject.id)
        .then(notes => setFilteredNotes(notes))
        .catch(error => {
          console.error('Error fetching notes:', error);
          setFilteredNotes([]);
        });
      return;
    }
    
    // Filter notes based on search query (client-side filtering)
    notesService.getNotesBySubject(selectedSubject.id)
      .then(notes => {
        const filtered = notes.filter(
          note => 
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.description.toLowerCase().includes(query.toLowerCase()) ||
            note.uploader_email?.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredNotes(filtered);
      })
      .catch(error => {
        console.error('Error filtering notes:', error);
        setFilteredNotes([]);
      });
  };
  
  const handleFilter = (criteria: string, value: string) => {
    if (!selectedSubject) return;
    
    // Get all notes for the selected subject 
    notesService.getNotesBySubject(selectedSubject.id)
      .then(notes => {
        // Apply search query if it exists
        let filtered = notes;
        if (searchQuery.trim()) {
          filtered = notes.filter(
            note => 
              note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              note.uploader_email?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        // Apply additional filtering based on criteria
        if (criteria === 'sort') {
          if (value === 'recent') {
            filtered.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
          } else if (value === 'rating') {
            filtered.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
          } else if (value === 'downloads') {
            filtered.sort((a, b) => b.downloads - a.downloads);
          }
        } else if (criteria === 'fileType') {
          if (value !== 'all') {
            filtered = filtered.filter(note => 
              note.file_type.toLowerCase() === value.toLowerCase() ||
              (value === 'doc' && (note.file_type.toLowerCase() === 'doc' || note.file_type.toLowerCase() === 'docx')) ||
              (value === 'ppt' && (note.file_type.toLowerCase() === 'ppt' || note.file_type.toLowerCase() === 'pptx'))
            );
          }
        } else if (criteria === 'rating') {
          if (value === '4+') {
            filtered = filtered.filter(note => (note.avg_rating || 0) >= 4);
          } else if (value === '3+') {
            filtered = filtered.filter(note => (note.avg_rating || 0) >= 3);
          } else if (value === '2+') {
            filtered = filtered.filter(note => (note.avg_rating || 0) >= 2);
          }
        }
        
        setFilteredNotes(filtered);
      })
      .catch(error => {
        console.error('Error filtering notes:', error);
        setFilteredNotes([]);
      });
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
              
              {!user && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                  <Button onClick={() => navigate('/auth')} className="flex items-center gap-2 w-full sm:w-auto">
                    <UserPlus size={16} />
                    <span>Sign Up</span>
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/auth?tab=login')} className="flex items-center gap-2 w-full sm:w-auto">
                    <LogIn size={16} />
                    <span>Log In</span>
                  </Button>
                </div>
              )}
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
                Browse available notes for this subject
              </p>
            </div>
            
            <SearchAndFilter 
              subject={selectedSubject}
              onSearch={handleSearch}
              onFilter={handleFilter}
            />
            
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Loading notes...</p>
              </div>
            ) : filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No notes found for this subject.</p>
                <p className="text-gray-500 mt-2">Be the first to upload study materials!</p>
                {user ? (
                  <UploadNote subject={selectedSubject} />
                ) : (
                  <Button onClick={() => navigate('/auth')} className="mt-4">
                    Sign in to Upload Notes
                  </Button>
                )}
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
