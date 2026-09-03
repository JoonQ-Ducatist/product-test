import { useEffect, useMemo, useState } from 'react';
import logoUrl from '../../assets/xcubus-snake-logo.png';

/** 정의: 방문마다 무작위로 보여 주는 한·영 가입 유도 문구 목록이다. */
const splashCopies = [
  { title: <>오늘 내 모습,<br />어떻게 보여요?</>, english: 'How do I look today?' },
  { title: <>이 룩, 오늘의 나를<br />더 빛나게 할까요?</>, english: 'Will this look make you shine today?' },
  { title: <>새로 산 이 옷,<br />나랑 잘 어울릴까?</>, english: 'Does this new outfit feel like you?' },
  { title: <>오늘의 분위기,<br />내가 원하는 느낌일까?</>, english: 'Is today’s vibe exactly what you wanted?' },
  { title: <>나답게 예쁜 날,<br />지금 시작해요.</>, english: 'Start a day that feels beautifully you.' },
  { title: <>거울 앞 3초,<br />오늘은 자신감 있게.</>, english: 'Three seconds in the mirror, then step out with confidence.' },
];

/** 정의: 비로그인 방문자에게 인기 콘텐츠와 인증 진입점을 보여 주는 전체 화면 스플래시다. */
export default function SplashView({ cards, onEnter }) {
  const popularCards = useMemo(
    () => [...cards].sort((a, b) => (b.yesVotes + b.noVotes) - (a.yesVotes + a.noVotes)).slice(0, 5),
    [cards],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [copy] = useState(() => splashCopies[Math.floor(Math.random() * splashCopies.length)]);

  useEffect(() => {
    if (popularCards.length < 2) return undefined;
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % popularCards.length), 3600);
    return () => window.clearInterval(timer);
  }, [popularCards.length]);

  const activeCard = popularCards[activeIndex] ?? cards[0];

  return (
    <main className="splash-screen relative mx-auto h-full max-w-none overflow-hidden bg-[#051424] text-white shadow-2xl">
      <div className="absolute inset-0" aria-hidden="true">
        <img key={activeCard.id} className="splash-media h-full w-full object-cover" style={{ objectPosition: activeCard.objectPosition }} src={activeCard.imageUrl} alt="" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,28,45,0.62)_0%,rgba(14,28,45,0.08)_35%,rgba(14,28,45,0.9)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(197,160,89,0.18),transparent_30%),radial-gradient(circle_at_84%_30%,rgba(255,255,255,0.1),transparent_26%)]" />
      </div>

      <div className="relative z-10 flex h-full flex-col px-5 pb-6 pt-10">
        <header className="flex flex-col items-center text-center">
          <img src={logoUrl} width="96" height="64" className="h-16 w-24 object-contain drop-shadow-[0_3px_12px_rgba(0,0,0,0.5)]" alt="xCubus 뱀 로고" />
          <p lang="en" className="mt-3 font-latin text-[25px] font-extrabold leading-none tracking-tight">xy by x.Cubus</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-px w-5 bg-[#c5a059]/70" />
            <p lang="en" className="font-mono text-[9px] font-bold tracking-[0.22em] text-[#ecd8a8]">MORE VIEWS, MORE YOU</p>
            <span className="h-px w-5 bg-[#c5a059]/70" />
          </div>
        </header>

        <div className="flex-1" />

        <section className="mb-4 text-center drop-shadow-md" aria-live="polite">
          <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#ecd8a8]">TODAY&apos;S LOOK CHECK</p>
          <h1 className="mt-2 font-headline text-[28px] font-extrabold leading-tight tracking-tight text-white">{copy.title}</h1>
          <p className="mt-2 text-xs text-white/75">{copy.english}</p>
        </section>

        <section className="mx-auto w-[86%] max-w-[330px] rounded-2xl border border-white/10 bg-white/[0.025] p-3 shadow-[0_14px_38px_rgba(0,0,0,0.08)] backdrop-blur-[1px]">
          <p className="mb-3 text-center text-[11px] leading-relaxed text-white/75">
            가입하고 오늘의 내 모습을 확인해 보세요.
            <span className="block text-white/55">Join to see yourself through more views.</span>
          </p>
          <div className="flex flex-col gap-2">
            <ProviderButton label="Google로 계속하기" icon="G" onClick={() => onEnter('Google')} />
            <ProviderButton label="Apple로 계속하기" icon="apple" onClick={() => onEnter('Apple')} />
            <ProviderButton label="카카오로 계속하기" icon="chat_bubble" onClick={() => onEnter('Kakao')} />
            <ProviderButton label="이메일로 계속하기" icon="mail" onClick={() => onEnter('이메일')} />
          </div>
          <p className="mt-3 text-center text-[9px] leading-relaxed text-white/45">계속하면 이용약관 및 개인정보 처리방침에 동의하게 됩니다.</p>
        </section>
      </div>
    </main>
  );
}

/** 정의: 인증 제공자별 진입 행동을 일관된 크기·접근성으로 렌더링하는 버튼이다. */
function ProviderButton({ label, icon, onClick }) {
  return (
    <button type="button" onClick={onClick} className="mx-auto flex h-10 w-[92%] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.055] px-4 text-sm font-bold text-white shadow-sm backdrop-blur-[1px] transition hover:bg-white/[0.14] focus-visible:bg-white/[0.14]">
      <span className="material-symbols-outlined text-[17px] text-[#ecd8a8]">{icon}</span>
      {label}
    </button>
  );
}
