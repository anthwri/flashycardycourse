"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createCard as createCardQuery,
  updateCard as updateCardQuery,
  deleteCard as deleteCardQuery,
  getCard,
  createCards as createCardsQuery,
} from "@/lib/db/queries";
import {
  createCardSchema,
  updateCardSchema,
  deleteCardSchema,
  createCardsSchema,
  type CreateCardInput,
  type UpdateCardInput,
  type DeleteCardInput,
  type CreateCardsInput,
} from "@/lib/validations";

/**
 * Server Action: Create a new card
 */
export async function createCard(input: CreateCardInput) {
  try {
    // 1. Authentication check
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Authentication required" };
    }
    
    // 2. Input validation
    const validatedInput = createCardSchema.parse(input);
    
    // 3. Call query function (includes ownership verification)
    const newCard = await createCardQuery({
      deckId: validatedInput.deckId,
      front: validatedInput.front,
      back: validatedInput.back,
      userId, // For ownership verification
    });
    
    if (!newCard) {
      return { success: false, error: "Deck not found or access denied" };
    }
    
    // 4. Cache revalidation
    revalidatePath("/dashboard");
    revalidatePath(`/decks/${validatedInput.deckId}`);
    return { success: true, data: newCard };
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Invalid input data",
        details: error.issues 
      };
    }
    
    console.error("Server action error in createCard:", error);
    return { success: false, error: "Failed to create card" };
  }
}

/**
 * Server Action: Update an existing card
 */
export async function updateCard(input: UpdateCardInput) {
  try {
    // 1. Authentication check
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Authentication required" };
    }
    
    // 2. Input validation
    const validatedInput = updateCardSchema.parse(input);
    
    // 3. Call query function (includes ownership verification)
    const updatedCard = await updateCardQuery(
      validatedInput.id,
      userId,
      {
        front: validatedInput.front,
        back: validatedInput.back,
      }
    );
    
    if (!updatedCard) {
      return { success: false, error: "Card not found or access denied" };
    }
    
    // 4. Cache revalidation
    revalidatePath("/dashboard");
    revalidatePath(`/decks/${updatedCard.deckId}`);
    return { success: true, data: updatedCard };
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Invalid input data",
        details: error.issues 
      };
    }
    
    console.error("Server action error in updateCard:", error);
    return { success: false, error: "Failed to update card" };
  }
}

/**
 * Server Action: Delete a card
 */
export async function deleteCard(input: DeleteCardInput) {
  try {
    // 1. Authentication check
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Authentication required" };
    }
    
    // 2. Input validation
    const validatedInput = deleteCardSchema.parse(input);
    
    // 3. Get card info before deletion (for revalidation path)
    const card = await getCard(validatedInput.id, userId);
    
    if (!card) {
      return { success: false, error: "Card not found or access denied" };
    }
    
    // 4. Call query function
    const deletedCard = await deleteCardQuery(validatedInput.id, userId);
    
    if (!deletedCard) {
      return { success: false, error: "Failed to delete card" };
    }
    
    // 5. Cache revalidation
    revalidatePath("/dashboard");
    revalidatePath(`/decks/${card.deckId}`);
    return { 
      success: true, 
      data: deletedCard,
      message: "Card has been deleted successfully"
    };
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Invalid input data",
        details: error.issues 
      };
    }
    
    console.error("Server action error in deleteCard:", error);
    return { success: false, error: "Failed to delete card" };
  }
}

/**
 * Server Action: Create multiple cards at once
 */
export async function createCards(input: CreateCardsInput) {
  try {
    // 1. Authentication check
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Authentication required" };
    }
    
    // 2. Input validation
    const validatedInput = createCardsSchema.parse(input);
    
    // 3. Call query function (includes ownership verification)
    const newCards = await createCardsQuery({
      deckId: validatedInput.deckId,
      cards: validatedInput.cards,
      userId, // For ownership verification
    });
    
    if (!newCards) {
      return { success: false, error: "Deck not found or access denied" };
    }
    
    // 4. Cache revalidation
    revalidatePath("/dashboard");
    revalidatePath(`/decks/${validatedInput.deckId}`);
    return { 
      success: true, 
      data: newCards,
      message: `Successfully created ${newCards.length} card${newCards.length !== 1 ? 's' : ''}`
    };
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Invalid input data",
        details: error.issues 
      };
    }
    
    console.error("Server action error in createCards:", error);
    return { success: false, error: "Failed to create cards" };
  }
}
