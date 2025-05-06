
import { toast } from 'sonner';

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

// Get CGPA data from local storage
export const getCGPAData = (): CGPAData | null => {
  const stored = localStorage.getItem('inspire-cgpa');
  return stored ? JSON.parse(stored) : null;
};

// Save CGPA data to local storage
export const saveCGPAData = (data: CGPAData): void => {
  localStorage.setItem('inspire-cgpa', JSON.stringify(data));
};

// Generate course recommendations based on current and target CGPA
export const generateCourseRecommendations = (currentCGPA: number, targetCGPA: number): string[] => {
  // Default recommendations
  if (currentCGPA === 0) {
    return [
      "Start with foundational courses in your major to build a strong base.",
      "Consider taking courses with known supportive professors for your first semester.",
      "Balance your course load with a mix of difficulty levels."
    ];
  }
  
  const gap = targetCGPA - currentCGPA;
  
  if (gap <= 0) {
    return [
      "Great job! You've reached your target CGPA. Consider challenging yourself with advanced courses.",
      "Look into research opportunities or internships to enhance your skills.",
      "Consider mentoring other students or becoming a teaching assistant."
    ];
  }
  
  if (gap < 0.5) {
    return [
      "You're close to your target! Focus on courses where you excel to boost your CGPA.",
      "Consider retaking any courses with low grades if your university allows grade replacement.",
      "Form or join study groups for your more challenging classes."
    ];
  }
  
  if (gap < 1.0) {
    return [
      "Take advantage of professor office hours and academic support services.",
      "Consider a lighter course load to focus more deeply on each subject.",
      "Identify your learning style and seek courses that match it.",
      "Develop a strategic study schedule with specific goals for each course."
    ];
  }
  
  // Larger gap requires more significant intervention
  return [
    "Meet with an academic advisor to create a detailed improvement plan.",
    "Consider starting with foundational courses to rebuild your academic confidence.",
    "Enroll in study skills workshops offered by your university.",
    "Take advantage of all available tutoring services.",
    "Consider summer courses to focus on challenging subjects with fewer distractions."
  ];
};

// Calculate required grades to achieve target CGPA
export const calculateRequiredGrades = (
  currentCGPA: number,
  targetCGPA: number,
  currentCredits: number,
  plannedCredits: number
): string => {
  if (currentCredits === 0) {
    return `You need to maintain a ${targetCGPA.toFixed(2)} GPA in your courses.`;
  }
  
  // Calculate required GPA for upcoming courses
  const totalCreditsAfter = currentCredits + plannedCredits;
  const currentPoints = currentCGPA * currentCredits;
  const targetPoints = targetCGPA * totalCreditsAfter;
  const neededPoints = targetPoints - currentPoints;
  const requiredGPA = neededPoints / plannedCredits;
  
  if (requiredGPA > 4.0) {
    return `You'll need to earn more than a 4.0 in your upcoming ${plannedCredits} credits, which isn't possible. Consider adjusting your target or taking more credits.`;
  }
  
  if (requiredGPA <= 0) {
    return `You've already achieved your target CGPA. Any passing grade will maintain it.`;
  }
  
  // Convert the required GPA to a letter grade estimate
  let letterGrade = '';
  if (requiredGPA >= 3.7) letterGrade = 'A- or higher';
  else if (requiredGPA >= 3.3) letterGrade = 'B+ or higher';
  else if (requiredGPA >= 3.0) letterGrade = 'B or higher';
  else if (requiredGPA >= 2.7) letterGrade = 'B- or higher';
  else if (requiredGPA >= 2.3) letterGrade = 'C+ or higher';
  else if (requiredGPA >= 2.0) letterGrade = 'C or higher';
  else letterGrade = 'D or higher';
  
  return `You need to maintain a ${requiredGPA.toFixed(2)} GPA (${letterGrade}) in your upcoming ${plannedCredits} credits.`;
};
