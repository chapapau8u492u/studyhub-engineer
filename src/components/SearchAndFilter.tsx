
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Subject } from '@/types/supabase';
import UploadNote from './UploadNote';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from 'lucide-react';

interface SearchAndFilterProps {
  subject: Subject;
  onSearch: (query: string) => void;
  onFilter: (criteria: string, value: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  subject,
  onSearch,
  onFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };
  
  const handleFilterChange = (criteria: string, value: string) => {
    onFilter(criteria, value);
  };
  
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder={`Search in ${subject.name}...`}
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex items-center gap-2">
          {isMobile ? (
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
          ) : null}
          
          {user && <UploadNote subject={subject} />}
        </div>
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isMobile && !showFilters ? 'hidden' : ''}`}>
        <div>
          <label className="text-sm font-medium">Sort by</label>
          <Select onValueChange={(value) => handleFilterChange('sort', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Most recent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most recent</SelectItem>
              <SelectItem value="rating">Highest rated</SelectItem>
              <SelectItem value="downloads">Most downloaded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium">File type</label>
          <Select onValueChange={(value) => handleFilterChange('fileType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="doc">Word (DOC/DOCX)</SelectItem>
              <SelectItem value="ppt">PowerPoint (PPT/PPTX)</SelectItem>
              <SelectItem value="txt">Text (TXT)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium">Rating</label>
          <Select onValueChange={(value) => handleFilterChange('rating', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any rating</SelectItem>
              <SelectItem value="4+">4+ stars</SelectItem>
              <SelectItem value="3+">3+ stars</SelectItem>
              <SelectItem value="2+">2+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
