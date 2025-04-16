
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { notesService, ratingsService, commentsService, likesService } from "@/services/supabase";
import { Note, Comment } from "@/types/supabase";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Download, Heart, Calendar, User, MessageSquare, Star, ArrowLeft, Send } from "lucide-react";

const NoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchNoteDetails = async () => {
      try {
        const noteData = await notesService.getNoteById(id);
        if (noteData) {
          setNote(noteData);
        
          const commentsData = await commentsService.getCommentsByNote(id);
          setComments(commentsData);
        
          if (user) {
            const ratingData = await ratingsService.getUserRating(id, user.id);
            if (ratingData) {
              setUserRating(ratingData.rating);
            }
          
            const likeStatus = await likesService.checkIfLiked(id, user.id);
            setIsLiked(likeStatus);
          }
        }
      } catch (error) {
        console.error("Error fetching note details:", error);
        toast({
          title: "Error",
          description: "Failed to load note details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNoteDetails();
  }, [id, user, toast]);

  const handleDownload = async () => {
    if (!note) return;
    
    try {
      await notesService.incrementDownloads(note.id);
      window.open(note.file_url, '_blank');
      setNote({
        ...note,
        downloads: note.downloads + 1,
      });
    } catch (error) {
      console.error("Error downloading note:", error);
      toast({
        title: "Download failed",
        description: "Failed to download the note",
        variant: "destructive",
      });
    }
  };

  const handleRating = async (rating: number) => {
    if (!user || !note) {
      toast({
        title: "Authentication required",
        description: "Please log in to rate notes",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    try {
      await ratingsService.addOrUpdateRating({
        note_id: note.id,
        user_id: user.id,
        rating,
      });
      
      setUserRating(rating);
      
      const updatedNote = await notesService.getNoteById(note.id);
      if (updatedNote) {
        setNote(updatedNote);
      }
      
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });
      
    } catch (error) {
      console.error("Error rating note:", error);
      toast({
        title: "Rating failed",
        description: "Failed to submit your rating",
        variant: "destructive",
      });
    }
  };

  const handleLike = async () => {
    if (!user || !note) {
      toast({
        title: "Authentication required",
        description: "Please log in to like notes",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    try {
      const newLikeStatus = await likesService.toggleLike(note.id, user.id);
      setIsLiked(newLikeStatus);
      
      setNote({
        ...note,
        likes_count: (note.likes_count || 0) + (newLikeStatus ? 1 : -1),
      });
      
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Action failed",
        description: "Failed to process your action",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async () => {
    if (!user || !note) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setCommentLoading(true);
      
      const comment = await commentsService.addComment({
        note_id: note.id,
        user_id: user.id,
        content: newComment.trim(),
      });
      
      if (comment) {
        const commentWithEmail = {
          ...comment,
          user_email: user.email,
        };
        
        setComments([commentWithEmail, ...comments]);
        setNewComment("");
        
        setNote({
          ...note,
          comments_count: (note.comments_count || 0) + 1,
        });
      }
      
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Comment failed",
        description: "Failed to add your comment",
        variant: "destructive",
      });
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading note details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64 flex-col gap-4">
            <p className="text-gray-500">Note not found</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Button>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading note details...</p>
          </div>
        ) : !note ? (
          <div className="flex justify-center items-center h-64 flex-col gap-4">
            <p className="text-gray-500">Note not found</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{note.title}</CardTitle>
                      <CardDescription className="text-sm mt-2">
                        {note.subject_name || note.subject?.name} ({note.subject_code || note.subject?.code})
                      </CardDescription>
                    </div>
                    
                    <Button
                      onClick={handleLike}
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Heart size={16} className={isLiked ? "fill-white" : ""} />
                      <span>{note.likes_count || 0}</span>
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1">{note.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">File Information</h3>
                        <div className="mt-1 space-y-1">
                          <p className="text-sm">Type: {note.file_type}</p>
                          <p className="text-sm">Size: {note.file_size}</p>
                          <p className="text-sm">Downloads: {note.downloads}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Additional Information</h3>
                        <div className="mt-1 space-y-1 flex flex-col">
                          <div className="flex items-center gap-1 text-sm">
                            <User size={14} />
                            <span>Uploaded by: {note.uploader_email?.split('@')[0]}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar size={14} />
                            <span>Upload date: {new Date(note.upload_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <MessageSquare size={14} />
                            <span>Comments: {note.comments_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Rate this note:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRating(rating)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={20}
                            className={`${
                              rating <= userRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="ml-2 text-sm">
                      ({note.avg_rating ? note.avg_rating.toFixed(1) : '0'}/5)
                    </span>
                  </div>
                  
                  <Button onClick={handleDownload} className="flex items-center gap-2">
                    <Download size={16} />
                    <span>Download</span>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Comments ({comments.length})</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={commentLoading}
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || commentLoading}
                      size="sm"
                      className="mt-1"
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                  
                  {comments.length > 0 ? (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="p-3 border rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>
                                {comment.user_email?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {comment.user_email?.split('@')[0]}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Notes</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-center text-gray-500 py-4">
                    Related notes feature coming soon.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NoteDetail;
