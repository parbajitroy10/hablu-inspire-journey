
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategories } from '@/utils/data';
import { ImprovementCategory, Goal } from '@/types';

interface AddGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGoal: (goal: Goal) => void;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ open, onOpenChange, onAddGoal }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const categories = getCategories();
  
  const handleSubmit = () => {
    if (!title || !categoryId) return;
    
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      categoryId,
      title,
      description,
      completed: false,
      dueDate: date ? format(date, 'yyyy-MM-dd') : undefined,
    };
    
    onAddGoal(newGoal);
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategoryId('');
    setDate(undefined);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
          <DialogDescription>Create a new goal for your self-improvement journey.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              placeholder="Enter goal title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category: ImprovementCategory) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your goal in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            resetForm();
            onOpenChange(false);
          }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Goal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalModal;
