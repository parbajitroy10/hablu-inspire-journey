
import React from 'react';
import { DailyQuote } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface QuoteCardProps {
  quote: DailyQuote;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  return (
    <Card className="border-none shadow-md bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
      <CardContent className="p-6">
        <div className="text-4xl text-primary mb-2">"</div>
        <p className="text-lg font-medium italic mb-3">{quote.text}</p>
        <p className="text-right text-sm text-foreground/70">— {quote.author}</p>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
