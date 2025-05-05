
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from '@/types';

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
  
  const handleSubmit = () => {
    if (!name || !email) return;
    
    const updatedUser: User = {
      ...user,
      name,
      email,
      university: university || undefined,
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
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
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
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="university">University (Optional)</Label>
            <Input
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="Your university"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
