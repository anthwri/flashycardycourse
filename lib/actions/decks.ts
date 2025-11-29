"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createDeck as createDeckQuery,
  updateDeck as updateDeckQuery,
  deleteDeck as deleteDeckQuery,
  getUserDeck,
} from "@/lib/db/queries";
import {
  createDeckSchema,
  updateDeckSchema,
  deleteDeckSchema,
  type CreateDeckInput,
  type UpdateDeckInput,
  type DeleteDeckInput,
} from "@/lib/validations";

/**
 * Server Action: Create a new deck
 */
export async function createDeck(input: CreateDeckInput) {
  try {
    // 1. Authentication check
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Authentication required" };
    }
    
    // 2. Input validation
    const validatedInput = createDeckSchema.parse(input);
    
    // 3. Call query function (never raw database operations)
    const newDeck = await createDeckQuery({
      title: validatedInput.title,
      description: validatedInput.description,
      userId,
    });
    
    // 4. Cache revalidation
    revalidatePath("/dashboard");
    return { success: true, data: newDeck };
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Invalid input data",
        details: error.issues 
      };
    }
    
    console.error("Server action error in createDeck:", error);
    return { success: false, error: "Failed to create deck" };
  }
}

/**
 * Server Action: Update an existing deck
 */
export async function updateDeck(input: UpdateDeckInput) {
  try {
    // 1. Authentication check
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Authentication required" };
    }
    
    // 2. Input validation
    const validatedInput = updateDeckSchema.parse(input);
    
    // 3. Call query function
    const updatedDeck = await updateDeckQuery(
      validatedInput.id,
      userId,
      {
        title: validatedInput.title,
        description: validatedInput.description,
      }
    );
    
    if (!updatedDeck) {
      return { success: false, error: "Deck not found or access denied" };
    }
    
    // 4. Cache revalidation
    revalidatePath("/dashboard");
    revalidatePath(`/deck/${validatedInput.id}`);
    return { success: true, data: updatedDeck };
    
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Invalid input data",
        details: error.issues 
      };
    }
    
    console.error("Server action error in updateDeck:", error);
    return { success: false, error: "Failed to update deck" };
  }
}

/**
 * Server Action: Delete a deck
 */
export async function deleteDeck(input: DeleteDeckInput) {
  try {
    // 1. Authentication check
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Authentication required" };
    }
    
    // 2. Input validation
    const validatedInput = deleteDeckSchema.parse(input);
    
    // 3. Verify deck exists and belongs to user before deletion
    const deck = await getUserDeck(validatedInput.id, userId);
    
    if (!deck) {
      return { success: false, error: "Deck not found or access denied" };
    }
    
    // 4. Call query function
    const deletedDeck = await deleteDeckQuery(validatedInput.id, userId);
    
    if (!deletedDeck) {
      return { success: false, error: "Failed to delete deck" };
    }
    
    // 5. Cache revalidation
    revalidatePath("/dashboard");
    return { 
      success: true, 
      data: deletedDeck,
      message: `Deck "${deletedDeck.title}" has been deleted successfully`
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
    
    console.error("Server action error in deleteDeck:", error);
    return { success: false, error: "Failed to delete deck" };
  }
}
