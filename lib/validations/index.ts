// Export all deck validation schemas and types
export {
  createDeckSchema,
  updateDeckSchema,
  deleteDeckSchema,
  getDeckSchema,
  type CreateDeckInput,
  type UpdateDeckInput,
  type DeleteDeckInput,
  type GetDeckInput,
} from "./deck";

// Export all card validation schemas and types
export {
  createCardSchema,
  updateCardSchema,
  deleteCardSchema,
  getCardSchema,
  createCardsSchema,
  getDeckCardsSchema,
  type CreateCardInput,
  type UpdateCardInput,
  type DeleteCardInput,
  type GetCardInput,
  type CreateCardsInput,
  type GetDeckCardsInput,
} from "./card";
