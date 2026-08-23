/** @param {{ cards: object[], categories: object, onDelete: Function, onUpload: Function }} props */
export default function ProfileView({ cards, categories, onDelete, onUpload }) {
  const mine = cards.filter((card) => card.isMyUpload);
  const votes = mine.reduce((sum, card) => sum + card.yesVotes + card.noVotes, 0);
  const yes = mine.reduce((sum, card) => sum + card.yesVotes, 0);
  const approval = votes ? Math.round(yes / votes * 100) : 0;
  return <section className="view-stack"><div className="section-heading"><p className="eyebrow">MY INSIGHTS</p><h2>내 사진 분석</h2></div><div className="metrics"><div><strong>{mine.length}</strong><span>내 업로드</span></div><div><strong>{votes.toLocaleString()}</strong><span>받은 투표</span></div><div><strong>{approval}%</strong><span>평균 긍정률</span></div></div><div className="section-row"><h3>내가 업로드한 카드</h3><button type="button" className="text-button" onClick={onUpload}>새로 업로드</button></div><div className="my-posts">{mine.map((card) => <article className="post-item" key={card.id}><img src={card.imageUrl} alt="" /><div><small className="card-topline"><em>{categories[card.category]?.label}</em><strong>@{card.author}</strong></small><strong>{card.question}</strong></div><button type="button" className="text-button danger" onClick={() => onDelete(card.id)}>삭제</button></article>)}{mine.length === 0 && <p className="panel empty-state">업로드한 사진이 없습니다.</p>}</div></section>;
}
