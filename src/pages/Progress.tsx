
import React, { useState, useEffect } from 'react';
import { getCategories, calculateOverallProgress } from '@/utils/data';
import { ImprovementCategory } from '@/types';
import CategoryCard from '@/components/CategoryCard';
import ProgressRing from '@/components/ProgressRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend
} from 'recharts';

const Progress: React.FC = () => {
  const [categories, setCategories] = useState<ImprovementCategory[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  
  useEffect(() => {
    const loadedCategories = getCategories();
    setCategories(loadedCategories);
    setOverallProgress(calculateOverallProgress(loadedCategories));
  }, []);
  
  const chartData = categories.map(cat => ({
    name: cat.name,
    value: cat.progress,
    color: `bg-${cat.color}`
  }));
  
  const COLORS = ['#9b87f5', '#33C3F0', '#4CAF50', '#FF9800', '#E5DEFF'];
  
  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Your Progress</h1>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center pt-4 pb-6">
          <ProgressRing 
            progress={overallProgress} 
            size={120} 
            strokeWidth={8} 
          />
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Progress Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="grid gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-card p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
            <ProgressRing 
              progress={category.progress} 
              size={50} 
              className={`text-${category.color}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress;
