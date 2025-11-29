"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckCircle, 
  XCircle,
  Shuffle,
  Minus,
  Trophy,
  Target
} from "lucide-react";

interface StudyCard {
  id: number;
  front: string;
  back: string;
}

interface StudyModeProps {
  cards: StudyCard[];
  onClose: () => void;
}

export function StudyMode({ cards, onClose }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyCards, setStudyCards] = useState(cards);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [neitherCount, setNeitherCount] = useState(0);

  const currentCard = studyCards[currentIndex];
  const totalCards = studyCards.length;
  const progress = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;

  // Shuffle cards function
  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setStudyCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setNeitherCount(0);
  };

  // Navigation functions
  const goToNext = useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, totalCards]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  // Handle flip
  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  // Handle correct/incorrect/skip responses
  const handleCorrect = useCallback(() => {
    setCorrectCount(correctCount + 1);
    goToNext();
  }, [correctCount, goToNext]);

  const handleIncorrect = useCallback(() => {
    setIncorrectCount(incorrectCount + 1);
    goToNext();
  }, [incorrectCount, goToNext]);

  const handleSkip = useCallback(() => {
    setNeitherCount(neitherCount + 1);
    goToNext();
  }, [neitherCount, goToNext]);

  // Handle finishing the session (go to results)
  const handleFinish = useCallback(() => {
    setCurrentIndex(totalCards); // This will trigger the results screen
  }, [totalCards]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentIndex === totalCards - 1) {
            handleFinish();
          } else {
            goToNext();
          }
          break;
        case ' ':
        case 'Enter':
          event.preventDefault();
          handleFlip();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case 's':
        case 'S':
          event.preventDefault();
          handleSkip();
          break;
        case 'c':
        case 'C':
          if (isFlipped) {
            event.preventDefault();
            handleCorrect();
          }
          break;
        case 'x':
        case 'X':
          if (isFlipped) {
            event.preventDefault();
            handleIncorrect();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalCards, isFlipped, goToNext, goToPrevious, handleFlip, handleCorrect, handleIncorrect, handleSkip, handleFinish, onClose]);

  if (!currentCard) {
    const accuracyRate = correctCount > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;
    
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-full max-w-lg mx-4">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-3xl font-bold mb-2">Study Session Complete!</h2>
            <p className="text-muted-foreground mb-8">
              Great job! You&apos;ve completed all {totalCards} cards in this deck.
            </p>

            {/* Results Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border">
                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                <div className="text-xs text-green-600 font-medium">Correct</div>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border">
                <XCircle className="w-8 h-8 text-red-500 mb-2" />
                <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
                <div className="text-xs text-red-600 font-medium">Incorrect</div>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-950/30 rounded-lg border">
                <Minus className="w-8 h-8 text-gray-500 mb-2" />
                <div className="text-2xl font-bold text-gray-600">{neitherCount}</div>
                <div className="text-xs text-gray-600 font-medium">Skipped</div>
              </div>
            </div>

            {/* Accuracy Rate */}
            {(correctCount + incorrectCount) > 0 && (
              <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-muted/30 rounded-lg">
                <Target className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Accuracy Rate:</span>
                <span className="font-semibold text-lg">{accuracyRate}%</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button onClick={shuffleCards} variant="outline" className="px-6">
                <Shuffle className="w-4 h-4 mr-2" />
                Study Again
              </Button>
              <Button onClick={onClose} className="px-6">
                Finish Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Card {currentIndex + 1} of {totalCards}
              </Badge>
            </div>
            <Progress value={progress} className="w-32 h-2" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={shuffleCards}>
            <Shuffle className="w-4 h-4 mr-2" />
            Shuffle
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Flashcard */}
          <Card 
            className="w-full aspect-[3/2] relative cursor-pointer hover:shadow-lg transition-shadow mb-8"
            onClick={handleFlip}
          >
            <CardContent className="flex items-center justify-center h-full p-8 text-center">
              <div className="space-y-4 w-full">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {isFlipped ? 'Back' : 'Front'}
                </div>
                <div className="text-lg md:text-xl lg:text-2xl font-medium leading-relaxed">
                  {isFlipped ? currentCard.back : currentCard.front}
                </div>
                {!isFlipped && (
                  <div className="text-sm text-muted-foreground">
                    Click or press Space/Enter to reveal answer
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4">
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFlip}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Flip Card
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={currentIndex === totalCards - 1 ? handleFinish : goToNext}
                disabled={false}
              >
                {currentIndex === totalCards - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Answer Buttons */}
          <div className="flex justify-center gap-3 mt-6">
            {isFlipped ? (
              // Show answer buttons when flipped
              <>
                <Button
                  variant="destructive"
                  onClick={handleIncorrect}
                  className="px-6"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Incorrect
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="px-6"
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Skip
                </Button>
                <Button
                  onClick={handleCorrect}
                  className="px-6"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Correct
                </Button>
              </>
            ) : (
              // Show skip button even when not flipped
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="px-6"
              >
                <Minus className="w-4 h-4 mr-2" />
                Skip Card
              </Button>
            )}
          </div>

          {/* Keyboard shortcuts info */}
          <div className="mt-8 text-center text-xs text-muted-foreground space-y-1">
            <p>
              <strong>Navigation:</strong> Arrow keys to move {currentIndex === totalCards - 1 ? '(→ to finish)' : ''} • Space/Enter to flip • S to skip
            </p>
            <p>
              <strong>Answers:</strong> C for correct • X for incorrect • Escape to exit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
