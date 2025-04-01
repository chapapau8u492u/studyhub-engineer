
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Note } from '@/types/supabase';
import { likesService } from '@/services/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Heart, MessageSquare, Star, Calendar, FileText } from 'lucide-react';

interface NoteCardProps {
  note: Note;
}

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <FileText className="text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileText className="text-blue-500" />;
    case 'ppt':
    case 'pptx':
      return <FileText className="text-orange-500" />;
    default:
      return <FileText />;
  }
};

const getNoteCardBorderColor = (branch: string | undefined) => {
  switch (branch) {
    case 'mechanical':
      return 'border-orange-500';
    case 'cse':
      return 'border-blue-500';
    case 'it':
      return 'border-purple-500';
    case 'civil':
      return 'border-green-500';
    case 'electrical':
      return 'border-red-500';
    default:
      return '';
  }
};

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(note.likes_count || 0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like notes",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    try {
      setIsLoading(true);
      const newLikeStatus = await likesService.toggleLike(note.id, user.id);
      setLiked(newLikeStatus);
      setLikeCount(prev => newLikeStatus ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Action failed",
        description: "Failed to process your action",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Link to={`/notes/${note.id}`}>
      <Card className={`hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col border-l-4 ${getNoteCardBorderColor(note.branch)}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{note.title}</CardTitle>
            <Badge variant="outline">{note.file_type}</Badge>
          </div>
          <CardDescription className="line-clamp-2 min-h-[40px]">
            {note.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Calendar size={14} className="mr-1" />
            <span>{new Date(note.upload_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span>By {note.uploader_email?.split('@')[0]}</span>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" title="Rating">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm">{note.avg_rating ? note.avg_rating.toFixed(1) : '0'}</span>
            </div>
            
            <div className="flex items-center gap-1" title="Downloads">
              <Download size={14} />
              <span className="text-sm">{note.downloads}</span>
            </div>
            
            <div className="flex items-center gap-1" title="Comments">
              <MessageSquare size={14} />
              <span className="text-sm">{note.comments_count || 0}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto"
            onClick={handleLike}
            disabled={isLoading}
          >
            <Heart size={18} className={liked ? "fill-red-500 text-red-500" : ""} />
            <span className="ml-1 text-xs">{likeCount}</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default NoteCard;
