import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserDecksWithCounts, getUserDeckStats } from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, BookOpen, Brain, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user's decks with card counts using query function
  const decksWithCounts = await getUserDecksWithCounts(userId);
  
  // Calculate totals from the data
  const totalDecks = decksWithCounts.length;
  const totalCards = decksWithCounts.reduce((sum, deck) => sum + deck.cardCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Decks</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDecks}</div>
              <p className="text-xs text-muted-foreground">
                Flashcard collections
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCards}</div>
              <p className="text-xs text-muted-foreground">
                Individual flashcards
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCards > 0 ? "Ready" : "Start"}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalCards > 0 ? "Begin studying" : "Create your first deck"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {totalDecks === 0 ? (
          // Empty State
          <Card className="text-center py-16">
            <CardContent className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Create Your First Deck</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Get started by creating your first flashcard deck. 
                  Organize your learning materials and begin mastering new concepts.
                </p>
              </div>
              <Button size="lg" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create Deck
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Decks Grid
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Decks</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Deck
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decksWithCounts.map((deck) => (
                <Link key={deck.id} href={`/deck/${deck.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg truncate">{deck.title}</CardTitle>
                      </div>
                      {deck.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {deck.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {deck.cardCount > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>0/{deck.cardCount}</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                      )}
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Updated {new Date(deck.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
