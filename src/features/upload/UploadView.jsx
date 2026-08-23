import { useState } from 'react';

/** @param {{ categories: object, onSubmit: Function }} props */
export default function UploadView({ categories, onSubmit }) {
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState('Business');
  const [question, setQuestion] = useState('');
  const [author, setAuthor] = useState('my_look_daily');
  const [error, setError] = useState('');

  function chooseFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('이미지 파일만 선택할 수 있습니다.'); return; }
    setError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  function submit(event) {
    event.preventDefault();
    if (!preview || !question.trim() || !author.trim()) { setError('사진, 질문, 닉네임을 모두 입력해 주세요.'); return; }
    onSubmit({ id: `local-${Date.now()}`, author: author.trim(), category, question: question.trim(), imageUrl: preview, yesVotes: 0, noVotes: 0, isMyUpload: true, timestamp: '방금 전', fileName });
  }

  return <section className="view-stack">
    <div className="section-heading"><p className="eyebrow">LOCAL PROTOTYPE</p><h2>사진 업로드</h2><p>현재 파일은 이 브라우저에만 저장되는 목업입니다.</p></div>
    <form className="panel form-stack" onSubmit={submit}>
      <label>사진 선택<input type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseFile} /></label>
      {preview && <img className="preview-image" src={preview} alt={`${fileName} 미리보기`} />}
      <label>카테고리<select value={category} onChange={(event) => setCategory(event.target.value)}>{Object.entries(categories).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}</select></label>
      <label>질문<textarea value={question} onChange={(event) => setQuestion(event.target.value)} maxLength="140" placeholder="예: 첫인상에서 신뢰감이 느껴지나요?" /></label>
      <label>닉네임<input value={author} onChange={(event) => setAuthor(event.target.value)} maxLength="30" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary" type="submit">목업 피드에 추가</button>
    </form>
  </section>;
}
