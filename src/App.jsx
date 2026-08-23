import { useEffect, useMemo, useState } from 'react';
import { categories } from './data/cards.js';
import { loadCards, saveCards } from './services/cardStore.js';
import FeedView from './features/feed/FeedView.jsx';
import UploadView from './features/upload/UploadView.jsx';
import RankingView from './features/ranking/RankingView.jsx';
import ProfileView from './features/profile/ProfileView.jsx';

const tabs = [
  ['feed', '피드', '▣'],
  ['upload', '업로드', '+'],
  ['ranking', '랭킹', '★'],
  ['profile', '프로필', '●'],
];

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [cards, setCards] = useState(loadCards);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votedIds, setVotedIds] = useState(() => new Set());

  useEffect(() => saveCards(cards), [cards]);

  const visibleCards = useMemo(
    () => activeCategory === 'ALL' ? cards : cards.filter((card) => card.category === activeCategory),
    [activeCategory, cards],
  );
  const currentCard = visibleCards[currentIndex % Math.max(visibleCards.length, 1)];

  function selectCategory(category) {
    setActiveCategory(category);
    setCurrentIndex(0);
  }

  function vote(choice) {
    if (!currentCard || votedIds.has(currentCard.id)) return;
    setCards((items) => items.map((card) => card.id !== currentCard.id ? card : {
      ...card,
      yesVotes: card.yesVotes + (choice === 'yes' ? 1 : 0),
      noVotes: card.noVotes + (choice === 'no' ? 1 : 0),
    }));
    setVotedIds((ids) => new Set([...ids, currentCard.id]));
  }

  function addCard(card) {
    setCards((items) => [card, ...items]);
    setActiveCategory('ALL');
    setCurrentIndex(0);
    setActiveTab('feed');
  }

  function deleteCard(id) {
    setCards((items) => items.filter((card) => card.id !== id));
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="eyebrow">FIRSTLOOK · PROTOTYPE</p>
        <h1>첫인상을 데이터로</h1>
        <p>사진과 질문에 대한 빠르고 존중하는 피드백</p>
      </header>

      <main className="app-main">
        {activeTab === 'feed' && <FeedView categories={categories} cards={visibleCards} card={currentCard} currentIndex={currentIndex} activeCategory={activeCategory} hasVoted={currentCard && votedIds.has(currentCard.id)} onCategoryChange={selectCategory} onPrevious={() => setCurrentIndex((index) => (index - 1 + visibleCards.length) % visibleCards.length)} onNext={() => setCurrentIndex((index) => (index + 1) % visibleCards.length)} onVote={vote} />}
        {activeTab === 'upload' && <UploadView categories={categories} onSubmit={addCard} />}
        {activeTab === 'ranking' && <RankingView cards={cards} categories={categories} onOpen={(card) => { setActiveCategory('ALL'); setCurrentIndex(Math.max(cards.findIndex((item) => item.id === card.id), 0)); setActiveTab('feed'); }} />}
        {activeTab === 'profile' && <ProfileView cards={cards} categories={categories} onDelete={deleteCard} onUpload={() => setActiveTab('upload')} />}
      </main>

      <nav className="bottom-nav" aria-label="주요 메뉴">
        {tabs.map(([id, label, icon]) => <button key={id} type="button" className={activeTab === id ? 'nav-button active' : 'nav-button'} onClick={() => setActiveTab(id)}><span aria-hidden="true">{icon}</span>{label}</button>)}
      </nav>
    </div>
  );
}
