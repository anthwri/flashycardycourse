import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getDeckWithCards } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CardCreateModal } from "@/components/deck/card-create-modal";
import { CardEditModal } from "@/components/deck/card-edit-modal";
import { CardDeleteModal } from "@/components/deck/card-delete-modal";
import { DeckStudyButton } from "@/components/deck/deck-study-button";
import { DeckEditModal } from "@/components/deck/deck-edit-modal";
import { DeckDeleteModal } from "@/components/deck/deck-delete-modal";
import { 
  ArrowLeft, 
  Plus, 
  Edit,
  Trash2,
  Play,
  BookOpen,
  Brain
} from "lucide-react";

interface DeckPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
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
  const totalCards = cards.length;
  const studiedCards = 0; // TODO: Implement progress tracking

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{deck.title}</h1>
              {deck.description && (
                <p className="text-muted-foreground max-w-2xl">
                  {deck.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Created {new Date(deck.createdAt).toLocaleDateString()}</span>
                <span>Updated {new Date(deck.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <DeckEditModal deck={deck} />
              <DeckDeleteModal deck={deck} cardCount={totalCards} />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCards}</div>
              <p className="text-xs text-muted-foreground">
                Flashcards in this deck
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studiedCards}/{totalCards}</div>
              <Progress 
                value={totalCards > 0 ? (studiedCards / totalCards) * 100 : 0} 
                className="h-2 mt-2" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Mode</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <DeckStudyButton 
                cards={cards}
                disabled={totalCards === 0}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {totalCards === 0 ? (
          // Empty State
          <Card className="text-center py-16">
            <CardContent className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Add Your First Card</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Get started by creating your first flashcard. 
                  Add a question or term on the front and the answer on the back.
                </p>
              </div>
              <CardCreateModal 
                deckId={deckId}
                trigger={
                  <Button size="lg" className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Card
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : (
          // Cards Grid
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Cards ({totalCards})</h2>
              <CardCreateModal deckId={deckId} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <Card key={card.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Front of Card */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Front
                      </div>
                      <div className="p-3 bg-muted/50 rounded-md min-h-[60px] flex items-center">
                        <p className="text-sm">{card.front}</p>
                      </div>
                    </div>
                    
                    {/* Back of Card */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Back
                      </div>
                      <div className="p-3 bg-muted/50 rounded-md min-h-[60px] flex items-center">
                        <p className="text-sm">{card.back}</p>
                      </div>
                    </div>
                    
                    {/* Card Actions */}
                    <div className="pt-2 border-t">
                      <div className="flex gap-2">
                        <CardEditModal 
                          card={card}
                          trigger={
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-3 h-3 mr-2" />
                              Edit
                            </Button>
                          }
                        />
                        <CardDeleteModal 
                          card={card}
                          trigger={
                            <Button variant="outline" size="sm" className="flex-1">
                              <Trash2 className="w-3 h-3 mr-2" />
                              Delete
                            </Button>
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
