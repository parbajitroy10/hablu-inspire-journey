
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Goal } from '@/types';
import { getCategories } from '@/utils/data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AddGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGoal: (goal: Goal) => void;
  preselectedCategoryId?: string;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ 
  open, 
  onOpenChange, 
  onAddGoal,
  preselectedCategoryId
}) => {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>(preselectedCategoryId || '');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  
  useEffect(() => {
    const loadedCategories = getCategories();
    setCategories(loadedCategories);
    
    // Set preselected category if provided
    if (preselectedCategoryId) {
      setCategoryId(preselectedCategoryId);
    }
  }, [preselectedCategoryId]);
  
  const handleSubmit = () => {
    if (!title.trim() || !categoryId) return;
    
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      categoryId,
      title: title.trim(),
      description: description.trim(),
      completed: false,
      dueDate: date ? format(date, 'yyyy-MM-dd') : undefined,
      priority
    };
    
    onAddGoal(newGoal);
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategoryId(preselectedCategoryId || '');
    setDate(undefined);
    setPriority('medium');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              placeholder="Enter goal title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter a description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Due Date (Optional)</Label>
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
          
          <div className="grid gap-2">
            <Label>Priority</Label>
            <RadioGroup defaultValue="medium" value={priority} onValueChange={(value) => setPriority(value as 'high' | 'medium' | 'low')}>
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="text-destructive font-medium">High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="text-amber-500 font-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="text-green-500 font-medium">Low</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !categoryId}>
            Save Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalModal;
