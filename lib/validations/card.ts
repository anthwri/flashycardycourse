import { z } from "zod";

/**
 * Schema for creating a new card
 */
export const createCardSchema = z.object({
  deckId: z.number().int().positive("Deck ID must be a positive integer"),
  front: z
    .string()
    .min(1, "Front content is required")
    .max(2000, "Front content must be less than 2000 characters")
    .trim(),
  back: z
    .string()
    .min(1, "Back content is required")
    .max(2000, "Back content must be less than 2000 characters")
    .trim(),
});

/**
 * Schema for updating a card
 */
export const updateCardSchema = z.object({
  id: z.number().int().positive("Card ID must be a positive integer"),
  front: z
    .string()
    .min(1, "Front content is required")
    .max(2000, "Front content must be less than 2000 characters")
    .trim()
    .optional(),
  back: z
    .string()
    .min(1, "Back content is required")
    .max(2000, "Back content must be less than 2000 characters")
    .trim()
    .optional(),
});

/**
 * Schema for deleting a card
 */
export const deleteCardSchema = z.object({
  id: z.number().int().positive("Card ID must be a positive integer"),
});

/**
 * Schema for getting a card by ID
 */
export const getCardSchema = z.object({
  id: z.number().int().positive("Card ID must be a positive integer"),
});

/**
 * Schema for creating multiple cards at once
 */
export const createCardsSchema = z.object({
  deckId: z.number().int().positive("Deck ID must be a positive integer"),
  cards: z
    .array(
      z.object({
        front: z
          .string()
          .min(1, "Front content is required")
          .max(2000, "Front content must be less than 2000 characters")
          .trim(),
        back: z
          .string()
          .min(1, "Back content is required")
          .max(2000, "Back content must be less than 2000 characters")
          .trim(),
      })
    )
    .min(1, "At least one card is required")
    .max(100, "Cannot create more than 100 cards at once"),
});

/**
 * Schema for getting cards by deck ID
 */
export const getDeckCardsSchema = z.object({
  deckId: z.number().int().positive("Deck ID must be a positive integer"),
});

// Type inference for TypeScript
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type DeleteCardInput = z.infer<typeof deleteCardSchema>;
export type GetCardInput = z.infer<typeof getCardSchema>;
export type CreateCardsInput = z.infer<typeof createCardsSchema>;
export type GetDeckCardsInput = z.infer<typeof getDeckCardsSchema>;
