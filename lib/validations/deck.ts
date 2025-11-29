import { z } from "zod";

/**
 * Schema for creating a new deck
 */
export const createDeckSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .nullable()
    .transform(val => val === null ? undefined : val),
});

/**
 * Schema for updating a deck
 */
export const updateDeckSchema = z.object({
  id: z.number().int().positive("Deck ID must be a positive integer"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .nullable()
    .transform(val => val === null ? undefined : val),
});

/**
 * Schema for deleting a deck
 */
export const deleteDeckSchema = z.object({
  id: z.number().int().positive("Deck ID must be a positive integer"),
});

/**
 * Schema for getting a deck by ID
 */
export const getDeckSchema = z.object({
  id: z.number().int().positive("Deck ID must be a positive integer"),
});

// Type inference for TypeScript
export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;
export type DeleteDeckInput = z.infer<typeof deleteDeckSchema>;
export type GetDeckInput = z.infer<typeof getDeckSchema>;
