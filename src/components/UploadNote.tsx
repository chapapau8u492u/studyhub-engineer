
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Subject } from '@/types/supabase';
import { notesService, storageService } from '@/services/supabase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Upload, File } from 'lucide-react';

interface UploadNoteProps {
  subject: Subject;
}

const UploadNote: React.FC<UploadNoteProps> = ({ subject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const getFileType = (file: File): string => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (['doc', 'docx'].includes(extension)) return 'DOC';
    if (['ppt', 'pptx'].includes(extension)) return 'PPT';
    if (extension === 'pdf') return 'PDF';
    if (extension === 'txt') return 'TXT';
    
    return extension.toUpperCase();
  };

  const getFileSize = (file: File): string => {
    const fileSizeInKB = file.size / 1024;
    
    if (fileSizeInKB < 1024) {
      return `${fileSizeInKB.toFixed(1)} KB`;
    } else {
      const fileSizeInMB = fileSizeInKB / 1024;
      return `${fileSizeInMB.toFixed(1)} MB`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload notes",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    if (!file || !title || !description) {
      toast({
        title: "Missing information",
        description: "Please fill all the fields and select a file",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Simulate progress (real progress would require custom upload solution)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Upload file to storage
      const fileUrl = await storageService.uploadFile(file, user.id);
      
      // Create note entry in database
      await notesService.uploadNote({
        title,
        description,
        file_url: fileUrl,
        file_type: getFileType(file),
        file_size: getFileSize(file),
        uploader_id: user.id,
        subject_id: subject.id,
      });
      
      // Complete progress
      setUploadProgress(100);
      clearInterval(progressInterval);
      
      toast({
        title: "Note uploaded successfully",
        description: "Your note has been uploaded and is now available to others",
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      setIsOpen(false);
      
      // Wait a moment to let the user see 100%
      setTimeout(() => {
        setUploadProgress(0);
        setIsLoading(false);
      }, 500);
      
    } catch (error: any) {
      console.error('Error uploading note:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload note. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Upload size={16} />
          <span>Upload Notes</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload Notes for {subject.name}</DialogTitle>
          <DialogDescription>
            Share your notes with fellow students. Supported formats: PDF, DOCX, PPT, TXT.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Complete notes for Chapter 3"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="These notes cover all topics from chapter 3 including example problems and solutions."
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="file">File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  disabled={isLoading}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
              {file && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <File size={16} />
                  <span>{file.name} ({getFileSize(file)})</span>
                </div>
              )}
            </div>
            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !file || !title || !description}>
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadNote;
