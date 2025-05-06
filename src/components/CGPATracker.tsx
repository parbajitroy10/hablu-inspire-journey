
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Book, GraduationCap, Award, TrendingUp, X } from 'lucide-react';
import { toast } from 'sonner';
import { getCGPAData, saveCGPAData, generateCourseRecommendations } from '@/utils/cgpaUtils';

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
  semester: string;
}

interface CGPAData {
  courses: Course[];
  targetCGPA: number;
  currentCGPA: number;
}

const CGPATracker: React.FC = () => {
  const [cgpaData, setCGPAData] = useState<CGPAData>({
    courses: [],
    targetCGPA: 3.5,
    currentCGPA: 0,
  });
  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
    name: '',
    credits: 3,
    grade: 'A',
    semester: 'Current',
  });
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  useEffect(() => {
    // Load CGPA data on component mount
    const loadedData = getCGPAData();
    if (loadedData) {
      setCGPAData(loadedData);
    }
    
    // Generate course recommendations
    const courseRecs = generateCourseRecommendations(loadedData?.currentCGPA || 0, loadedData?.targetCGPA || 3.5);
    setRecommendations(courseRecs);
  }, []);

  const calculateCGPA = (courses: Course[]): number => {
    if (!courses.length) return 0;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    const gradePoints: { [key: string]: number } = {
      'A+': 4.0,
      'A': 4.0,
      'A-': 3.7,
      'B+': 3.3,
      'B': 3.0,
      'B-': 2.7,
      'C+': 2.3,
      'C': 2.0,
      'C-': 1.7,
      'D+': 1.3,
      'D': 1.0,
      'F': 0.0,
    };
    
    courses.forEach(course => {
      totalPoints += gradePoints[course.grade] * course.credits;
      totalCredits += course.credits;
    });
    
    return totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;
  };

  const handleAddCourse = () => {
    if (!newCourse.name.trim()) {
      toast.error("Please enter a course name");
      return;
    }
    
    const course: Course = {
      id: crypto.randomUUID(),
      ...newCourse
    };
    
    const updatedCourses = [...cgpaData.courses, course];
    const updatedCGPA = calculateCGPA(updatedCourses);
    
    const updatedData = {
      ...cgpaData,
      courses: updatedCourses,
      currentCGPA: updatedCGPA
    };
    
    setCGPAData(updatedData);
    saveCGPAData(updatedData);
    
    // Generate new recommendations based on updated CGPA
    const courseRecs = generateCourseRecommendations(updatedCGPA, cgpaData.targetCGPA);
    setRecommendations(courseRecs);
    
    setNewCourse({
      name: '',
      credits: 3,
      grade: 'A',
      semester: 'Current'
    });
    
    setIsAddingCourse(false);
    toast.success("Course added successfully");
  };

  const handleDeleteCourse = (id: string) => {
    const updatedCourses = cgpaData.courses.filter(course => course.id !== id);
    const updatedCGPA = calculateCGPA(updatedCourses);
    
    const updatedData = {
      ...cgpaData,
      courses: updatedCourses,
      currentCGPA: updatedCGPA
    };
    
    setCGPAData(updatedData);
    saveCGPAData(updatedData);
    
    // Generate new recommendations
    const courseRecs = generateCourseRecommendations(updatedCGPA, cgpaData.targetCGPA);
    setRecommendations(courseRecs);
    
    toast.success("Course removed");
  };

  const handleTargetChange = (value: string) => {
    const targetCGPA = parseFloat(value);
    
    const updatedData = {
      ...cgpaData,
      targetCGPA
    };
    
    setCGPAData(updatedData);
    saveCGPAData(updatedData);
    
    // Generate new recommendations based on new target
    const courseRecs = generateCourseRecommendations(cgpaData.currentCGPA, targetCGPA);
    setRecommendations(courseRecs);
  };

  const getProgressColor = () => {
    const ratio = cgpaData.currentCGPA / cgpaData.targetCGPA;
    if (ratio >= 1) return 'bg-green-500';
    if (ratio >= 0.8) return 'bg-blue-500';
    if (ratio >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const progressPercentage = Math.min(
    (cgpaData.currentCGPA / cgpaData.targetCGPA) * 100, 
    100
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            CGPA Tracker
          </CardTitle>
          <CardDescription>
            Track and improve your academic performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Current CGPA</h3>
                  <p className="text-3xl font-bold text-primary">{cgpaData.currentCGPA}</p>
                </div>
                <div>
                  <h3 className="font-medium text-right">Target CGPA</h3>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={cgpaData.targetCGPA.toString()} 
                      onValueChange={handleTargetChange}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Target" />
                      </SelectTrigger>
                      <SelectContent>
                        {[2.0, 2.5, 3.0, 3.3, 3.5, 3.7, 4.0].map(target => (
                          <SelectItem key={target} value={target.toString()}>
                            {target.toFixed(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-3 rounded-full"
                indicatorClassName={getProgressColor()}
              />
              <p className="text-sm text-muted-foreground">
                {progressPercentage < 100 
                  ? `${(cgpaData.targetCGPA - cgpaData.currentCGPA).toFixed(2)} points needed to reach target` 
                  : "You've reached your target CGPA!"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Your Courses</h3>
                {!isAddingCourse && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsAddingCourse(true)}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Course</span>
                  </Button>
                )}
              </div>
              
              {isAddingCourse && (
                <Card className="border border-dashed animate-scale-in">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="courseName">Course Name</Label>
                        <Input 
                          id="courseName" 
                          value={newCourse.name}
                          onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                          placeholder="e.g. Computer Science 101"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="credits">Credits</Label>
                          <Select 
                            value={newCourse.credits.toString()} 
                            onValueChange={(val) => setNewCourse({...newCourse, credits: parseInt(val)})}
                          >
                            <SelectTrigger id="credits">
                              <SelectValue placeholder="Credits" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map(credit => (
                                <SelectItem key={credit} value={credit.toString()}>
                                  {credit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="grade">Grade</Label>
                          <Select 
                            value={newCourse.grade} 
                            onValueChange={(val) => setNewCourse({...newCourse, grade: val})}
                          >
                            <SelectTrigger id="grade">
                              <SelectValue placeholder="Grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'].map(grade => (
                                <SelectItem key={grade} value={grade}>
                                  {grade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="semester">Semester</Label>
                          <Select 
                            value={newCourse.semester} 
                            onValueChange={(val) => setNewCourse({...newCourse, semester: val})}
                          >
                            <SelectTrigger id="semester">
                              <SelectValue placeholder="Semester" />
                            </SelectTrigger>
                            <SelectContent>
                              {['Past', 'Current', 'Future'].map(sem => (
                                <SelectItem key={sem} value={sem}>
                                  {sem}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsAddingCourse(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleAddCourse}
                        >
                          Add Course
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {cgpaData.courses.length > 0 ? (
                <div className="space-y-2">
                  {cgpaData.courses.map(course => (
                    <div 
                      key={course.id}
                      className="flex items-center justify-between p-3 rounded-md bg-card/50 hover:bg-card/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Book className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{course.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {course.credits} credit{course.credits !== 1 ? 's' : ''} • {course.semester}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          course.grade.startsWith('A') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          course.grade.startsWith('B') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          course.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {course.grade}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <Book className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No courses added yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsAddingCourse(true)}
                  >
                    Add your first course
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Course Recommendations
          </CardTitle>
          <CardDescription>
            AI-suggested courses to help you reach your target CGPA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="p-3 rounded-md bg-card/50 flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 mt-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p>{recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Add courses to get personalized recommendations</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => {
            const newRecs = generateCourseRecommendations(cgpaData.currentCGPA, cgpaData.targetCGPA);
            setRecommendations(newRecs);
            toast.success("Recommendations refreshed");
          }}>
            Refresh Recommendations
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CGPATracker;
