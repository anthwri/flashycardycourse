import { db } from "@/lib/db";
import { decksTable, cardsTable } from "@/lib/db/schema";
import { eq, and, count, desc } from "drizzle-orm";

/**
 * Get all decks for a user with card counts
 */
export async function getUserDecksWithCounts(userId: string) {
  try {
    const decksWithCounts = await db
      .select({
        id: decksTable.id,
        title: decksTable.title,
        description: decksTable.description,
        createdAt: decksTable.createdAt,
        updatedAt: decksTable.updatedAt,
        cardCount: count(cardsTable.id),
      })
      .from(decksTable)
      .leftJoin(cardsTable, eq(cardsTable.deckId, decksTable.id))
      .where(eq(decksTable.userId, userId))
      .groupBy(
        decksTable.id, 
        decksTable.title, 
        decksTable.description, 
        decksTable.createdAt,
        decksTable.updatedAt
      )
      .orderBy(desc(decksTable.createdAt));

    return decksWithCounts;
  } catch (error) {
    console.error("Database error in getUserDecksWithCounts:", error);
    throw error;
  }
}

/**
 * Get all decks for a user (without card counts for simple listing)
 */
export async function getUserDecks(userId: string) {
  try {
    return await db
      .select()
      .from(decksTable)
      .where(eq(decksTable.userId, userId))
      .orderBy(desc(decksTable.createdAt));
  } catch (error) {
    console.error("Database error in getUserDecks:", error);
    throw error;
  }
}

/**
 * Get a specific deck by ID, ensuring it belongs to the user
 */
export async function getUserDeck(deckId: number, userId: string) {
  try {
    const deck = await db
      .select()
      .from(decksTable)
      .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
      .limit(1);

    return deck.length > 0 ? deck[0] : null;
  } catch (error) {
    console.error("Database error in getUserDeck:", error);
    throw error;
  }
}

/**
 * Get a deck with all its cards
 */
export async function getDeckWithCards(deckId: number, userId: string) {
  try {
    // First verify deck ownership
    const deck = await getUserDeck(deckId, userId);
    
    if (!deck) {
      return null;
    }

    // Get all cards for the deck
    const cards = await db
      .select()
      .from(cardsTable)
      .where(eq(cardsTable.deckId, deckId))
      .orderBy(desc(cardsTable.updatedAt));

    return { deck, cards };
  } catch (error) {
    console.error("Database error in getDeckWithCards:", error);
    throw error;
  }
}

/**
 * Create a new deck
 */
export async function createDeck(data: { 
  title: string; 
  description?: string; 
  userId: string; 
}) {
  try {
    const [newDeck] = await db
      .insert(decksTable)
      .values({
        title: data.title,
        description: data.description,
        userId: data.userId,
      })
      .returning();

    return newDeck;
  } catch (error) {
    console.error("Database error in createDeck:", error);
    throw error;
  }
}

/**
 * Update a deck (ensuring user ownership)
 */
export async function updateDeck(
  deckId: number, 
  userId: string, 
  data: { title?: string; description?: string }
) {
  try {
    const [updatedDeck] = await db
      .update(decksTable)
      .set({ 
        ...data, 
        updatedAt: new Date() 
      })
      .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
      .returning();

    return updatedDeck || null;
  } catch (error) {
    console.error("Database error in updateDeck:", error);
    throw error;
  }
}

/**
 * Delete a deck (ensuring user ownership)
 * Cards will be automatically deleted due to cascade relationship
 */
export async function deleteDeck(deckId: number, userId: string) {
  try {
    const [deletedDeck] = await db
      .delete(decksTable)
      .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
      .returning();

    return deletedDeck || null;
  } catch (error) {
    console.error("Database error in deleteDeck:", error);
    throw error;
  }
}

/**
 * Get deck statistics for a user
 */
export async function getUserDeckStats(userId: string) {
  try {
    const stats = await db
      .select({
        totalDecks: count(decksTable.id),
      })
      .from(decksTable)
      .where(eq(decksTable.userId, userId));

    const totalCards = await db
      .select({
        totalCards: count(cardsTable.id),
      })
      .from(cardsTable)
      .leftJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
      .where(eq(decksTable.userId, userId));

    return {
      totalDecks: stats[0]?.totalDecks || 0,
      totalCards: totalCards[0]?.totalCards || 0,
    };
  } catch (error) {
    console.error("Database error in getUserDeckStats:", error);
    throw error;
  }
}
