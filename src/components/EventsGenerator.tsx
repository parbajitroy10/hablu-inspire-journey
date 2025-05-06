
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, RefreshCw, Filter } from 'lucide-react';
import { toast } from 'sonner';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'indoor' | 'outdoor' | 'games' | 'competition' | 'marathon' | 'academic';
  attendees: number;
  image?: string;
}

const categories = [
  { value: 'indoor', label: 'Indoor' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'games', label: 'Games' },
  { value: 'competition', label: 'Competition' },
  { value: 'marathon', label: 'Marathon' },
  { value: 'academic', label: 'Academic' }
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Local Chess Tournament',
    description: 'Join our monthly chess tournament. All skill levels welcome!',
    date: '2025-05-15',
    time: '14:00',
    location: 'Community Center',
    category: 'indoor',
    attendees: 24
  },
  {
    id: '2',
    title: 'College Debate Championship',
    description: 'Annual debate championship with participants from various universities.',
    date: '2025-05-20',
    time: '10:00',
    location: 'University Auditorium',
    category: 'competition',
    attendees: 120
  },
  {
    id: '3',
    title: 'Spring 5K Marathon',
    description: 'A fun 5K run through the scenic city park. Perfect for all fitness levels.',
    date: '2025-05-25',
    time: '08:00',
    location: 'City Park',
    category: 'marathon',
    attendees: 350
  },
  {
    id: '4',
    title: 'Beach Volleyball Tournament',
    description: 'Teams of 4 compete in this exciting beach volleyball event.',
    date: '2025-06-01',
    time: '11:00',
    location: 'Central Beach',
    category: 'outdoor',
    attendees: 80
  },
  {
    id: '5',
    title: 'Hackathon 2025',
    description: '24-hour coding competition to solve real-world problems.',
    date: '2025-06-10',
    time: '09:00',
    location: 'Tech Innovation Hub',
    category: 'competition',
    attendees: 200
  },
  {
    id: '6',
    title: 'Board Game Night',
    description: 'Weekly board game night featuring strategy and party games.',
    date: '2025-05-12',
    time: '19:00',
    location: 'The Game Café',
    category: 'games',
    attendees: 35
  },
  {
    id: '7',
    title: 'Academic Research Symposium',
    description: 'Present and discuss recent academic research across disciplines.',
    date: '2025-05-30',
    time: '13:00',
    location: 'University Research Center',
    category: 'academic',
    attendees: 150
  }
];

// Helper function to generate more events
const generateMoreEvents = (count: number): Event[] => {
  const newEvents: Event[] = [];
  const eventTitles = [
    'Local Basketball Tournament', 
    'Book Club Meeting', 
    'Open Mic Night',
    'Coding Workshop', 
    'Art Exhibition', 
    'Science Fair',
    'Trivia Night', 
    'Photography Contest',
    'Dance Competition', 
    'Student Research Conference'
  ];
  
  const locations = [
    'Student Center', 
    'Campus Library', 
    'Sports Complex',
    'City Hall', 
    'Community Park', 
    'Local Theater',
    'University Quadrangle', 
    'Conference Center'
  ];
  
  const categories: ('indoor' | 'outdoor' | 'games' | 'competition' | 'marathon' | 'academic')[] = 
    ['indoor', 'outdoor', 'games', 'competition', 'marathon', 'academic'];
  
  for (let i = 0; i < count; i++) {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 30));
    const dateString = randomDate.toISOString().split('T')[0];
    
    const hours = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
    const minutes = Math.random() > 0.5 ? '00' : '30';
    const timeString = `${hours}:${minutes}`;
    
    newEvents.push({
      id: `generated-${Date.now()}-${i}`,
      title: eventTitles[Math.floor(Math.random() * eventTitles.length)],
      description: 'Join this exciting event with your fellow students and community members!',
      date: dateString,
      time: timeString,
      location: locations[Math.floor(Math.random() * locations.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      attendees: Math.floor(Math.random() * 200) + 10
    });
  }
  
  return newEvents;
};

const EventsGenerator: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const filteredEvents = selectedCategories.length > 0
    ? events.filter(event => selectedCategories.includes(event.category))
    : events;
  
  const handleGenerateMoreEvents = () => {
    setIsGenerating(true);
    
    // Simulate AI generating events with a delay
    setTimeout(() => {
      const newEvents = generateMoreEvents(3);
      setEvents(prevEvents => [...prevEvents, ...newEvents]);
      setIsGenerating(false);
      toast.success('New events generated successfully!');
    }, 1500);
  };
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'indoor': return 'bg-blue-100 text-blue-800';
      case 'outdoor': return 'bg-green-100 text-green-800';
      case 'games': return 'bg-purple-100 text-purple-800';
      case 'competition': return 'bg-red-100 text-red-800';
      case 'marathon': return 'bg-yellow-100 text-yellow-800';
      case 'academic': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Upcoming Events</h2>
          <Button 
            onClick={handleGenerateMoreEvents} 
            disabled={isGenerating}
            size="sm"
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Generate More Events
              </>
            )}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter by:</span>
          {categories.map((category) => (
            <Badge 
              key={category.value}
              variant={selectedCategories.includes(category.value) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => handleCategoryToggle(category.value)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className={`${getCategoryColor(event.category)}`}>
                  {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  {event.attendees}
                </div>
              </div>
              <CardTitle className="mt-2">{event.title}</CardTitle>
              <CardDescription className="line-clamp-2">{event.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {event.time}
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  {event.location}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No events found matching your filter criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSelectedCategories([])}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventsGenerator;
