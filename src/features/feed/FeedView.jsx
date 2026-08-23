/**
 * @param {{ categories: object, cards: object[], card: object, currentIndex: number, activeCategory: string, hasVoted: boolean, onCategoryChange: Function, onPrevious: Function, onNext: Function, onVote: Function }} props
 */
export default function FeedView({ categories, cards, card, currentIndex, activeCategory, hasVoted, onCategoryChange, onPrevious, onNext, onVote }) {
  if (!card) return <section className="panel empty-state"><h2>표시할 카드가 없습니다.</h2><p>다른 카테고리를 선택하거나 새 사진을 업로드해 주세요.</p></section>;
  const theme = categories[card.category];
  const total = card.yesVotes + card.noVotes;
  const approval = total ? Math.round((card.yesVotes / total) * 100) : 0;
  return <section className="view-stack">
    <div className="section-heading"><p className="eyebrow">LIVE STREAM</p><h2>첫인상 피드</h2></div>
    <div className="filter-row" aria-label="카테고리 필터">
      <button type="button" className={activeCategory === 'ALL' ? 'chip active' : 'chip'} onClick={() => onCategoryChange('ALL')}>전체</button>
      {Object.entries(categories).map(([id, category]) => <button type="button" key={id} className={activeCategory === id ? 'chip active' : 'chip'} onClick={() => onCategoryChange(id)}>{category.label}</button>)}
    </div>
    <article className="feed-card" style={{ '--accent': theme.color }}>
      <img className="feed-image" src={card.imageUrl} alt={`${card.category} 카테고리의 ${card.author} 업로드 사진`} />
      <div className="card-body">
        <div className="card-meta"><span>{theme.icon} {theme.label}</span><span>@{card.author}</span></div>
        <p className="author">{card.timestamp} · {String(currentIndex + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}</p>
        <h3>{card.question}</h3>
        {hasVoted ? <div className="vote-result"><strong>현재 긍정률 {approval}%</strong><span>유효 투표 {total.toLocaleString()}표 · 결과는 참고용 피드백입니다.</span></div> : <div className="vote-actions"><button type="button" className="button button-yes" onClick={() => onVote('yes')}>YES</button><button type="button" className="button button-no" onClick={() => onVote('no')}>NO</button></div>}
      </div>
    </article>
    <div className="pager"><button type="button" className="button button-secondary" onClick={onPrevious}>이전</button><button type="button" className="button button-secondary" onClick={onNext}>다음</button></div>
  </section>;
}
