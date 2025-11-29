"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface StudyCard {
  id: number;
  front: string;
  back: string;
}

interface DeckStudyButtonProps {
  cards: StudyCard[];
  disabled?: boolean;
}

export function DeckStudyButton({ cards, disabled = false }: DeckStudyButtonProps) {
  const router = useRouter();
  const params = useParams();
  const deckId = params.deckId;

  const handleStartStudy = () => {
    router.push(`/deck/${deckId}/study`);
  };

  return (
    <Button 
      className="w-full mt-2" 
      disabled={disabled}
      onClick={handleStartStudy}
    >
      <Play className="w-4 h-4 mr-2" />
      Start Studying
    </Button>
  );
}
