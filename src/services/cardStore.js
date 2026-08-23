import { initialCards } from '../data/cards.js';

const STORAGE_KEY = 'firstlook_cards_v7';

/** @returns {Array<object>} Development-only local mock data. */
export function loadCards() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialCards;
  } catch {
    return initialCards;
  }
}

/** @param {Array<object>} cards */
export function saveCards(cards) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}
