// Export all deck-related query functions
export {
  getUserDecksWithCounts,
  getUserDecks,
  getUserDeck,
  getDeckWithCards,
  createDeck,
  updateDeck,
  deleteDeck,
  getUserDeckStats,
} from "./decks";

// Export all card-related query functions
export {
  getDeckCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
  getDeckCardCount,
  createCards,
} from "./cards";
