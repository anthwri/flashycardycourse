import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDeckWithCards } from "@/lib/db/queries";
import StudyPageWrapper from "./study-page-wrapper";

interface StudyPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { deckId: deckIdParam } = await params;
  const deckId = parseInt(deckIdParam, 10);
  
  if (isNaN(deckId)) {
    redirect("/dashboard");
  }

  // Fetch deck with cards using query function
  const deckData = await getDeckWithCards(deckId, userId);
  
  if (!deckData) {
    redirect("/dashboard");
  }

  const { deck, cards } = deckData;

  // Redirect if no cards to study
  if (cards.length === 0) {
    redirect(`/deck/${deckId}?message=no-cards`);
  }

  return (
    <StudyPageWrapper 
      deck={deck}
      cards={cards}
      deckId={deckId}
    />
  );
}
