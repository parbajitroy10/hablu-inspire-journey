
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onSave: (updatedUser: User) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  open, 
  onOpenChange, 
  user, 
  onSave 
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [university, setUniversity] = useState(user.university || '');
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || '');
  
  useEffect(() => {
    // Update state when user prop changes
    setName(user.name);
    setEmail(user.email);
    setUniversity(user.university || '');
    setPhotoUrl(user.photoUrl || '');
  }, [user]);
  
  const handleSubmit = () => {
    if (!name || !email) return;
    
    const updatedUser: User = {
      ...user,
      name,
      email,
      university: university || undefined,
      photoUrl: photoUrl || undefined
    };
    
    onSave(updatedUser);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your personal information.</DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center my-4">
          <Avatar className="w-20 h-20 border-2 border-primary">
            {photoUrl ? (
              <AvatarImage src={photoUrl} alt={name} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-2xl font-bold">
                {name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="photoUrl">Profile Picture URL (Optional)</Label>
            <Input
              id="photoUrl"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://example.com/your-photo.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="university">University (Optional)</Label>
            <Input
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="Your university"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="transition-all duration-200 hover:shadow-lg"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
