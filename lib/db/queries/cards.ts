import { db } from "@/lib/db";
import { cardsTable, decksTable } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Get all cards for a specific deck (with ownership verification)
 */
export async function getDeckCards(deckId: number, userId: string) {
  try {
    // First verify deck ownership
    const deckExists = await db
      .select({ id: decksTable.id })
      .from(decksTable)
      .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
      .limit(1);

    if (!deckExists.length) {
      return null; // Deck not found or user doesn't own it
    }

    // Get cards for the deck
    const cards = await db
      .select()
      .from(cardsTable)
      .where(eq(cardsTable.deckId, deckId))
      .orderBy(desc(cardsTable.updatedAt));

    return cards;
  } catch (error) {
    console.error("Database error in getDeckCards:", error);
    throw error;
  }
}

/**
 * Get a specific card by ID (with ownership verification through deck)
 */
export async function getCard(cardId: number, userId: string) {
  try {
    const cardWithDeck = await db
      .select({
        id: cardsTable.id,
        deckId: cardsTable.deckId,
        front: cardsTable.front,
        back: cardsTable.back,
        createdAt: cardsTable.createdAt,
        updatedAt: cardsTable.updatedAt,
      })
      .from(cardsTable)
      .leftJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
      .where(and(eq(cardsTable.id, cardId), eq(decksTable.userId, userId)))
      .limit(1);

    return cardWithDeck.length > 0 ? cardWithDeck[0] : null;
  } catch (error) {
    console.error("Database error in getCard:", error);
    throw error;
  }
}

/**
 * Create a new card in a deck (with ownership verification)
 */
export async function createCard(data: {
  deckId: number;
  front: string;
  back: string;
  userId: string; // For ownership verification
}) {
  try {
    // First verify deck ownership
    const deckExists = await db
      .select({ id: decksTable.id })
      .from(decksTable)
      .where(and(eq(decksTable.id, data.deckId), eq(decksTable.userId, data.userId)))
      .limit(1);

    if (!deckExists.length) {
      return null; // Deck not found or user doesn't own it
    }

    // Create the card
    const [newCard] = await db
      .insert(cardsTable)
      .values({
        deckId: data.deckId,
        front: data.front,
        back: data.back,
      })
      .returning();

    return newCard;
  } catch (error) {
    console.error("Database error in createCard:", error);
    throw error;
  }
}

/**
 * Update a card (with ownership verification through deck)
 */
export async function updateCard(
  cardId: number,
  userId: string,
  data: { front?: string; back?: string }
) {
  try {
    // First verify card exists and user owns the deck
    const cardExists = await db
      .select({ id: cardsTable.id, deckId: cardsTable.deckId })
      .from(cardsTable)
      .leftJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
      .where(and(eq(cardsTable.id, cardId), eq(decksTable.userId, userId)))
      .limit(1);

    if (!cardExists.length) {
      return null; // Card not found or user doesn't own the deck
    }

    // Update the card
    const [updatedCard] = await db
      .update(cardsTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(cardsTable.id, cardId))
      .returning();

    return updatedCard;
  } catch (error) {
    console.error("Database error in updateCard:", error);
    throw error;
  }
}

/**
 * Delete a card (with ownership verification through deck)
 */
export async function deleteCard(cardId: number, userId: string) {
  try {
    // First verify card exists and user owns the deck
    const cardExists = await db
      .select({ id: cardsTable.id, deckId: cardsTable.deckId })
      .from(cardsTable)
      .leftJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
      .where(and(eq(cardsTable.id, cardId), eq(decksTable.userId, userId)))
      .limit(1);

    if (!cardExists.length) {
      return null; // Card not found or user doesn't own the deck
    }

    // Delete the card
    const [deletedCard] = await db
      .delete(cardsTable)
      .where(eq(cardsTable.id, cardId))
      .returning();

    return deletedCard;
  } catch (error) {
    console.error("Database error in deleteCard:", error);
    throw error;
  }
}

/**
 * Get cards count for a specific deck (with ownership verification)
 */
export async function getDeckCardCount(deckId: number, userId: string) {
  try {
    // First verify deck ownership
    const deckExists = await db
      .select({ id: decksTable.id })
      .from(decksTable)
      .where(and(eq(decksTable.id, deckId), eq(decksTable.userId, userId)))
      .limit(1);

    if (!deckExists.length) {
      return null; // Deck not found or user doesn't own it
    }

    // Count cards in the deck
    const result = await db
      .select({ count: cardsTable.id })
      .from(cardsTable)
      .where(eq(cardsTable.deckId, deckId));

    return result.length;
  } catch (error) {
    console.error("Database error in getDeckCardCount:", error);
    throw error;
  }
}

/**
 * Create multiple cards at once (batch insert)
 */
export async function createCards(data: {
  deckId: number;
  cards: Array<{ front: string; back: string }>;
  userId: string; // For ownership verification
}) {
  try {
    // First verify deck ownership
    const deckExists = await db
      .select({ id: decksTable.id })
      .from(decksTable)
      .where(and(eq(decksTable.id, data.deckId), eq(decksTable.userId, data.userId)))
      .limit(1);

    if (!deckExists.length) {
      return null; // Deck not found or user doesn't own it
    }

    // Prepare cards data for insertion
    const cardsToInsert = data.cards.map(card => ({
      deckId: data.deckId,
      front: card.front,
      back: card.back,
    }));

    // Insert all cards
    const newCards = await db
      .insert(cardsTable)
      .values(cardsToInsert)
      .returning();

    return newCards;
  } catch (error) {
    console.error("Database error in createCards:", error);
    throw error;
  }
}
