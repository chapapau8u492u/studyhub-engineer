
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Star, ThumbsUp, MessageSquare, FileText } from "lucide-react";
import { Branch } from './BranchSelector';
import { Subject } from './SubjectList';

export interface Note {
  id: string;
  title: string;
  description: string;
  uploadDate: string;
  uploaderName: string;
  rating: number;
  downloads: number;
  likes: number;
  comments: number;
  fileType: string;
  fileSize: string;
  subject: Subject;
  branch: Branch;
}

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{note.title}</h3>
            <p className="text-sm text-gray-500">
              {note.subject.name} • {note.uploadDate}
            </p>
          </div>
          <Badge variant="outline" className={`branch-pill branch-pill-${note.branch}`}>
            {note.branch === 'cse' ? 'CSE' : 
             note.branch === 'it' ? 'IT' : 
             note.branch.charAt(0).toUpperCase() + note.branch.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 mb-4">{note.description}</p>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            <span>{note.fileType}</span>
          </div>
          <div>
            <span>{note.fileSize}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500" />
            <span>{note.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="mt-4 text-sm">
          <span className="text-gray-500">Uploaded by: </span>
          <span className="font-medium">{note.uploaderName}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center ${isLiked ? 'text-blue-600' : ''}`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{isLiked ? note.likes + 1 : note.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{note.comments}</span>
          </Button>
        </div>
        <Button variant="outline" size="sm" className="flex items-center">
          <Download className="h-4 w-4 mr-1" />
          <span>Download</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
