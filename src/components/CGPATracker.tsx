
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { BarChart, BookOpen, TrendingUp } from 'lucide-react';
import { getCGPAData, saveCGPAData, generateCourseRecommendations, calculateRequiredGrades } from '@/utils/cgpaUtils';
import BottomNav from './BottomNav';

const formSchema = z.object({
  currentCGPA: z.number().min(0).max(4),
  targetCGPA: z.number().min(0).max(4),
  currentCredits: z.number().min(0),
  plannedCredits: z.number().min(0),
});

const CGPATracker: React.FC = () => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [requiredGrades, setRequiredGrades] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentCGPA: 0,
      targetCGPA: 4.0,
      currentCredits: 0,
      plannedCredits: 15,
    }
  });

  useEffect(() => {
    const savedData = getCGPAData();
    if (savedData) {
      form.setValue('currentCGPA', savedData.currentCGPA);
      form.setValue('targetCGPA', savedData.targetCGPA);
      updateCalculations(savedData.currentCGPA, savedData.targetCGPA);
    }
  }, []);

  const updateCalculations = (currentCGPA: number, targetCGPA: number) => {
    const currentCredits = form.getValues('currentCredits');
    const plannedCredits = form.getValues('plannedCredits');
    
    // Calculate progress percentage towards target CGPA
    const progressPercentage = currentCGPA > 0 ? Math.min((currentCGPA / targetCGPA) * 100, 100) : 0;
    setProgress(progressPercentage);
    
    // Generate course recommendations
    const newRecommendations = generateCourseRecommendations(currentCGPA, targetCGPA);
    setRecommendations(newRecommendations);
    
    // Calculate required grades
    const requiredGradesText = calculateRequiredGrades(currentCGPA, targetCGPA, currentCredits, plannedCredits);
    setRequiredGrades(requiredGradesText);
    
    // Save data to localStorage
    saveCGPAData({
      courses: [],
      currentCGPA,
      targetCGPA,
    });
  };

  const handleCalculate = () => {
    const values = form.getValues();
    updateCalculations(values.currentCGPA, values.targetCGPA);
    toast.success("CGPA calculations updated");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            CGPA Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="currentCGPA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current CGPA</FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          min="0"
                          max="4"
                          step="0.01"
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  name="targetCGPA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target CGPA</FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          min="0"
                          max="4"
                          step="0.01"
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="currentCredits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Credits Completed</FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="plannedCredits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Planned Credits Next Term</FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <button
                type="button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                onClick={handleCalculate}
              >
                Calculate
              </button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progress Towards Target CGPA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Current: {form.getValues('currentCGPA').toFixed(2)}</span>
              <span>Target: {form.getValues('targetCGPA').toFixed(2)}</span>
            </div>
          </div>
          
          {requiredGrades && (
            <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
              <h3 className="font-semibold mb-2">Required Performance:</h3>
              <p className="text-sm">{requiredGrades}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Course Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                {recommendation}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <BottomNav />
    </div>
  );
};

export default CGPATracker;
