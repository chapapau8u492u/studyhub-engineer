import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Note } from '@/types/supabase';
import Header from '@/components/Header';
import NoteCard from '@/components/NoteCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { User, LogOut } from 'lucide-react';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchUserNotes = async () => {
      try {
        const { data, error } = await supabase
          .from('note_stats')
          .select('*')
          .eq('uploader_id', user.id);

        if (error) throw error;
        
        setUserNotes(data || []);
      } catch (error: any) {
        console.error('Error fetching user notes:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your notes',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserNotes();
  }, [user, navigate, toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return null; // This should not happen due to the redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <CardTitle className="text-2xl">{user.email?.split('@')[0]}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
                
                <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </Button>
              </div>
              
              <Separator className="mt-6" />
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="notes" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="notes">My Notes</TabsTrigger>
                  <TabsTrigger value="account">Account Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="notes" className="py-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <p className="text-gray-500">Loading your notes...</p>
                    </div>
                  ) : userNotes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userNotes.map(note => (
                        <NoteCard key={note.id} note={note} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <p className="text-gray-500 mb-4">You haven't uploaded any notes yet.</p>
                      <Button onClick={() => navigate('/')}>
                        Browse Subjects
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="account" className="py-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Account Information</h3>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Email: {user.email}</p>
                        <p>Account created: {new Date(user.created_at!).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Password</h3>
                      <div className="mt-2">
                        <Button variant="outline">Change Password</Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Account Settings</h3>
                      <div className="mt-2">
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        This will permanently delete your account and all your uploaded notes.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
