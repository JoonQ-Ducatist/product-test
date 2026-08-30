/** 정의: 브라우저 목업용 카드 데이터를 localStorage에 격리하는 개발 전용 저장소다. */
import { initialCards } from '../data/cards.js';

const STORAGE_KEY = 'xcubus_cards_v7';

/** 정의: 저장된 카드가 있으면 읽고, 없거나 손상됐으면 초기 목업을 반환한다. @returns {Array<object>} 개발 전용 카드 목록 */
export function loadCards() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialCards;
  } catch {
    return initialCards;
  }
}

/** 정의: 카드 목록을 개발용 localStorage에 저장한다. @param {Array<object>} cards 저장할 카드 목록 */
export function saveCards(cards) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}
