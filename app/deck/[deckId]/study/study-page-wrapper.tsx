"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudyMode } from "@/components/deck/study-mode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, BookOpen, Clock } from "lucide-react";

interface StudyCard {
  id: number;
  front: string;
  back: string;
}

interface Deck {
  id: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface StudyPageWrapperProps {
  deck: Deck;
  cards: StudyCard[];
  deckId: number;
}

export default function StudyPageWrapper({ deck, cards, deckId }: StudyPageWrapperProps) {
  const [isStudying, setIsStudying] = useState(false);
  const router = useRouter();

  const handleStartStudy = () => {
    setIsStudying(true);
  };

  const handleEndStudy = () => {
    // Navigate back to dashboard when study session ends
    router.push('/dashboard');
  };

  const handleBackToDeck = () => {
    router.push(`/deck/${deckId}`);
  };

  if (isStudying) {
    return (
      <StudyMode 
        cards={cards}
        onClose={handleEndStudy}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={handleBackToDeck}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Deck
            </Button>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Study: {deck.title}</h1>
            {deck.description && (
              <p className="text-muted-foreground max-w-2xl">
                {deck.description}
              </p>
            )}
          </div>
        </div>

        {/* Study Session Start Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Ready to Study?</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                You're about to study {cards.length} flashcard{cards.length !== 1 ? 's' : ''} from this deck.
                Take your time and focus on learning!
              </p>

              {/* Study Stats Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  <div className="text-center">
                    <div className="font-semibold">{cards.length}</div>
                    <div className="text-xs text-muted-foreground">Cards</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div className="text-center">
                    <div className="font-semibold">~{Math.ceil(cards.length * 0.5)} min</div>
                    <div className="text-xs text-muted-foreground">Est. Time</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <Play className="w-5 h-5 text-muted-foreground" />
                  <div className="text-center">
                    <div className="font-semibold">Interactive</div>
                    <div className="text-xs text-muted-foreground">Mode</div>
                  </div>
                </div>
              </div>

              {/* Study Tips */}
              <div className="text-left bg-muted/20 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-2">Study Tips:</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Try to recall the answer before flipping the card</li>
                  <li>• Mark yourself honestly - it helps with learning</li>
                  <li>• Use keyboard shortcuts: Space to flip, arrows to navigate</li>
                  <li>• Take breaks if you need to stay focused</li>
                </ul>
              </div>

              {/* Start Button */}
              <Button 
                size="lg" 
                className="px-8"
                onClick={handleStartStudy}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Study Session
              </Button>

              <div className="text-xs text-muted-foreground">
                Press Escape anytime during study to return here
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
