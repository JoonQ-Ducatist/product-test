/**
 * FirstLook - Quantitative Intuition & Realtime Impression Analytics
 * Application Logic, Gesture/Swipe Engine & Category Theming
 */

// Category Theme System
const CATEGORY_THEMES = {
  Business: {
    name: '비즈니스 / 출근',
    primaryColor: '#00f0ff',
    textColor: 'text-cyan-400',
    dotBg: 'bg-cyan-400',
    dotGlow: '#00f0ff',
    badgeBorder: 'border-cyan-400/40',
    badgeText: 'text-cyan-400',
    laserColor: '#00f0ff',
    laserGlow: '0 0 12px #00f0ff',
    liveTag: 'Live Business'
  },
  Dating: {
    name: '소개팅 / 데이트',
    primaryColor: '#ff2d78',
    textColor: 'text-pink-400',
    dotBg: 'bg-pink-500',
    dotGlow: '#ff2d78',
    badgeBorder: 'border-pink-500/40',
    badgeText: 'text-pink-400',
    laserColor: '#ff2d78',
    laserGlow: '0 0 12px #ff2d78',
    liveTag: 'Live Dating'
  },
  Workout: {
    name: '운동 / 피트니스',
    primaryColor: '#ff3b30',
    textColor: 'text-rose-400',
    dotBg: 'bg-rose-500',
    dotGlow: '#ff3b30',
    badgeBorder: 'border-rose-500/40',
    badgeText: 'text-rose-400',
    laserColor: '#ff3b30',
    laserGlow: '0 0 12px #ff3b30',
    liveTag: 'Live Fitness'
  },
  Interview: {
    name: '면접 / 커리어',
    primaryColor: '#6366f1',
    textColor: 'text-indigo-400',
    dotBg: 'bg-indigo-500',
    dotGlow: '#6366f1',
    badgeBorder: 'border-indigo-500/40',
    badgeText: 'text-indigo-400',
    laserColor: '#6366f1',
    laserGlow: '0 0 12px #6366f1',
    liveTag: 'Live Career'
  },
  Style: {
    name: '데일리 / 스타일',
    primaryColor: '#a855f7',
    textColor: 'text-purple-400',
    dotBg: 'bg-purple-500',
    dotGlow: '#a855f7',
    badgeBorder: 'border-purple-500/40',
    badgeText: 'text-purple-400',
    laserColor: '#a855f7',
    laserGlow: '0 0 12px #a855f7',
    liveTag: 'Live Style'
  },
  Profile: {
    name: 'SNS 프로필',
    primaryColor: '#fbbf24',
    textColor: 'text-amber-400',
    dotBg: 'bg-amber-400',
    dotGlow: '#fbbf24',
    badgeBorder: 'border-amber-400/40',
    badgeText: 'text-amber-400',
    laserColor: '#fbbf24',
    laserGlow: '0 0 12px #fbbf24',
    liveTag: 'Live Profile'
  }
};

// Dataset with User Images and Custom Framing / Object Position
const INITIAL_CARDS = [
  {
    id: 'card-1',
    author: 'career_mode',
    category: 'Business',
    categoryIcon: 'work',
    question: '비즈니스 캐주얼 룩으로\n전문성이 느껴지나요?',
    subtext: 'Does this business casual look feel professional?',
    imageUrl: 'assets/images/card1_business.jpg',
    objectPosition: 'center 12%',
    yesVotes: 1280,
    noVotes: 210,
    nodeId: 'NODE: 89.B',
    isMyUpload: true,
    timestamp: '10분 전'
  },
  {
    id: 'card-2',
    author: 'daily_look',
    category: 'Dating',
    categoryIcon: 'favorite',
    question: '소개팅에서 이 첫인상을 보면\n호감이 생길 것 같나요?',
    subtext: 'Would you be interested after seeing this first impression on a blind date?',
    imageUrl: 'assets/images/card2_dating.png',
    objectPosition: 'center 38%',
    yesVotes: 942,
    noVotes: 88,
    nodeId: 'NODE: 54.D',
    isMyUpload: true,
    timestamp: '30분 전'
  },
  {
    id: 'card-3',
    author: 'office_pro',
    category: 'Business',
    categoryIcon: 'work',
    question: '오늘 출근길에 이 사람을 보면\n신뢰가 갈 것 같나요?',
    subtext: 'Does this person inspire trust on their first day?',
    imageUrl: 'assets/images/card3_office.png',
    objectPosition: 'center 38%',
    yesVotes: 1430,
    noVotes: 190,
    nodeId: 'NODE: 71.C',
    isMyUpload: false,
    timestamp: '1시간 전'
  },
  {
    id: 'card-4',
    author: 'fit_queen',
    category: 'Workout',
    categoryIcon: 'fitness_center',
    question: '이 운동복 스타일이 이 사람의\n건강한 매력을 잘 보여주나요?',
    subtext: 'Does this workout style showcase their healthy charm?',
    imageUrl: 'assets/images/card4_workout.png',
    objectPosition: 'center 34%',
    yesVotes: 1105,
    noVotes: 95,
    nodeId: 'NODE: 33.E',
    isMyUpload: false,
    timestamp: '2시간 전'
  }
];

// App State
let appCards = [];
let currentCardIndex = 0;
let currentSelectedFile = null;
let currentSelectedDataUrl = '';
let currentCategory = 'Business';
let currentCategoryIcon = 'work';
let votedCards = new Set();
let isAnimating = false;

// Load stored cards or initialize
function initData() {
  const stored = localStorage.getItem('firstlook_cards_v4');
  if (stored) {
    try {
      appCards = JSON.parse(stored);
    } catch (e) {
      appCards = [...INITIAL_CARDS];
    }
  } else {
    appCards = [...INITIAL_CARDS];
    saveCards();
  }
}

function saveCards() {
  try {
    localStorage.setItem('firstlook_cards_v4', JSON.stringify(appCards));
  } catch (e) {
    console.warn('Storage quota exceeded, caching in memory only');
  }
}

// Navigation Tab Switcher
function switchTab(tabName) {
  document.querySelectorAll('.tab-view').forEach(view => {
    view.classList.remove('active');
    view.classList.add('hidden');
  });

  const targetView = document.getElementById(`view-${tabName}`);
  if (targetView) {
    targetView.classList.remove('hidden');
    targetView.classList.add('active');
  }

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('active', 'text-cyan-glow');
    btn.classList.add('text-slate-400');
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active', 'text-cyan-glow');
      btn.classList.remove('text-slate-400');
    }
  });

  if (tabName === 'ranking') {
    renderRanking();
  } else if (tabName === 'profile') {
    renderProfile();
  } else if (tabName === 'feed') {
    renderStorySegments();
    renderCurrentFeedCard('none');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Story Segment Progress Bars
function renderStorySegments() {
  const container = document.getElementById('story-segments');
  if (!container) return;

  const currentCard = appCards[currentCardIndex];
  const theme = currentCard ? (CATEGORY_THEMES[currentCard.category] || CATEGORY_THEMES.Business) : CATEGORY_THEMES.Business;

  container.innerHTML = appCards.map((_, idx) => {
    let stateClass = '';
    let customStyle = '';
    if (idx < currentCardIndex) {
      stateClass = 'passed';
      customStyle = `background-color: ${theme.primaryColor}80;`;
    } else if (idx === currentCardIndex) {
      stateClass = 'active';
      customStyle = `background-color: ${theme.primaryColor}; box-shadow: 0 0 8px ${theme.primaryColor};`;
    }
    return `<div class="story-bar flex-1 ${stateClass}" style="${customStyle}" data-index="${idx}"></div>`;
  }).join('');

  container.querySelectorAll('.story-bar').forEach(bar => {
    bar.addEventListener('click', (e) => {
      const targetIdx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      if (!isNaN(targetIdx) && targetIdx !== currentCardIndex) {
        goToCard(targetIdx, targetIdx > currentCardIndex ? 'next' : 'prev');
      }
    });
  });
}

// Render Feed Card with Dynamic Category Theming & Image Framing
function renderCurrentFeedCard(direction = 'next') {
  if (appCards.length === 0) return;

  if (currentCardIndex >= appCards.length) currentCardIndex = 0;
  if (currentCardIndex < 0) currentCardIndex = appCards.length - 1;

  const card = appCards[currentCardIndex];
  const nextIdx = (currentCardIndex + 1) % appCards.length;
  const nextCard = appCards[nextIdx];

  const activeLayer = document.getElementById('active-card-layer');
  const cardImg = document.getElementById('feed-card-image');
  const peekImg = document.getElementById('peek-image');
  const catText = document.getElementById('feed-category-text');
  const catIcon = document.getElementById('feed-category-icon');
  const feedCategoryBadge = document.getElementById('feed-category');
  const authorText = document.getElementById('feed-author');
  const questionText = document.getElementById('feed-question');
  const subtextEl = document.getElementById('feed-subtext');
  const nodeId = document.getElementById('node-id');
  const voteResult = document.getElementById('vote-result-container');
  const voteActions = document.getElementById('vote-actions');

  // Dynamic Theme Elements
  const liveTagText = document.getElementById('live-tag-text');
  const liveDotPing = document.getElementById('live-dot-ping');
  const liveDotSolid = document.getElementById('live-dot-solid');
  const laserBar = document.getElementById('laser-bar');

  const theme = CATEGORY_THEMES[card.category] || CATEGORY_THEMES.Business;

  if (peekImg && nextCard) {
    peekImg.src = nextCard.imageUrl;
    peekImg.style.objectPosition = nextCard.objectPosition || 'center top';
  }

  // Handle animation transition
  if (direction !== 'none' && activeLayer) {
    isAnimating = true;
    activeLayer.className = 'absolute inset-0 w-full h-full transition-transform duration-300 ease-out will-change-transform ' + 
      (direction === 'next' ? 'card-enter-up' : 'card-enter-down');
    
    setTimeout(() => {
      activeLayer.className = 'absolute inset-0 w-full h-full transition-transform duration-300 ease-out will-change-transform';
      isAnimating = false;
    }, 350);
  }

  // Apply Image & Framing
  cardImg.src = card.imageUrl;
  cardImg.style.objectPosition = card.objectPosition || 'center top';

  // Apply Category & Author
  catText.textContent = card.category;
  if (catIcon) {
    catIcon.textContent = card.categoryIcon || 'insights';
    catIcon.style.color = theme.primaryColor;
  }
  if (feedCategoryBadge) {
    feedCategoryBadge.style.borderColor = `${theme.primaryColor}50`;
  }
  authorText.textContent = `@${card.author}`;
  questionText.innerHTML = card.question.replace(/\n/g, '<br/>');
  if (subtextEl) subtextEl.textContent = card.subtext || '실시간 피드백 투표에 참여해 보세요';
  nodeId.textContent = card.nodeId || 'NODE: 89.B';

  // Apply Category Color Theme to "Live Test" Tag & Blinking Dot
  if (liveTagText) {
    liveTagText.textContent = theme.liveTag;
    liveTagText.style.color = theme.primaryColor;
  }
  if (liveDotPing) {
    liveDotPing.style.backgroundColor = theme.primaryColor;
  }
  if (liveDotSolid) {
    liveDotSolid.style.backgroundColor = theme.primaryColor;
    liveDotSolid.style.boxShadow = `0 0 8px ${theme.dotGlow}`;
  }
  if (laserBar) {
    laserBar.style.backgroundColor = theme.laserColor;
    laserBar.style.boxShadow = theme.laserGlow;
  }

  renderStorySegments();

  if (votedCards.has(card.id)) {
    showVoteResults(card, theme);
  } else {
    voteResult.classList.add('hidden');
    voteActions.classList.remove('hidden');
  }
}

// Navigation between cards
function nextCard() {
  if (isAnimating) return;
  const nextIdx = (currentCardIndex + 1) % appCards.length;
  goToCard(nextIdx, 'next');
}

function prevCard() {
  if (isAnimating) return;
  const prevIdx = (currentCardIndex - 1 + appCards.length) % appCards.length;
  goToCard(prevIdx, 'prev');
}

function goToCard(idx, direction = 'next') {
  currentCardIndex = idx;
  renderCurrentFeedCard(direction);
}

// Handle Vote Action
function castVote(isYes) {
  const card = appCards[currentCardIndex];
  if (!card) return;

  if (isYes) {
    card.yesVotes = (card.yesVotes || 0) + 1;
  } else {
    card.noVotes = (card.noVotes || 0) + 1;
  }
  votedCards.add(card.id);
  saveCards();

  const theme = CATEGORY_THEMES[card.category] || CATEGORY_THEMES.Business;
  showVoteResults(card, theme);
  showToast(isYes ? 'YES 투표가 반영되었습니다 (+1)' : 'NO 피드백이 전송되었습니다');
}

function showVoteResults(card, theme) {
  const voteResult = document.getElementById('vote-result-container');
  const voteActions = document.getElementById('vote-actions');
  const yesPercentEl = document.getElementById('yes-percent');
  const noPercentEl = document.getElementById('no-percent');
  const totalVotesEl = document.getElementById('total-votes');
  const trustScoreEl = document.getElementById('trust-score-val');
  const yesBar = document.getElementById('yes-bar');
  const noBar = document.getElementById('no-bar');

  const total = (card.yesVotes || 0) + (card.noVotes || 0);
  const yesPct = total > 0 ? Math.round((card.yesVotes / total) * 100) : 50;
  const noPct = 100 - yesPct;

  yesPercentEl.textContent = `${yesPct}%`;
  noPercentEl.textContent = `${noPct}%`;
  totalVotesEl.textContent = total.toLocaleString();
  if (trustScoreEl) {
    trustScoreEl.textContent = (85 + (yesPct * 0.14)).toFixed(1) + ' / 100';
  }

  yesBar.style.width = `${yesPct}%`;
  noBar.style.width = `${noPct}%`;

  voteActions.classList.add('hidden');
  voteResult.classList.remove('hidden');
}

// Global Toast System
function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
  }, 2200);
}

// -------------------------------------------------------------
// Gesture Engine: Touch Swipe, Mouse Drag, Wheel Scroll & Keys
// -------------------------------------------------------------
function setupGestureEngine() {
  const container = document.getElementById('swipe-container');
  const activeLayer = document.getElementById('active-card-layer');
  if (!container || !activeLayer) return;

  let startY = 0;
  let startX = 0;
  let currentY = 0;
  let currentX = 0;
  let isDragging = false;
  const SWIPE_THRESHOLD = 50;

  // Touch Events
  container.addEventListener('touchstart', (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) return;
    const touch = e.touches[0];
    startY = touch.clientY;
    startX = touch.clientX;
    currentY = startY;
    currentX = startX;
    isDragging = true;
    activeLayer.style.transition = 'none';
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    currentY = touch.clientY;
    currentX = touch.clientX;
    const deltaY = currentY - startY;
    const deltaX = currentX - startX;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      const damp = 0.55;
      activeLayer.style.transform = `translateY(${deltaY * damp}px) scale(${1 - Math.abs(deltaY) * 0.0003})`;
    }
  }, { passive: true });

  container.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    activeLayer.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
    const deltaY = currentY - startY;

    if (deltaY < -SWIPE_THRESHOLD) {
      nextCard();
    } else if (deltaY > SWIPE_THRESHOLD) {
      prevCard();
    } else {
      activeLayer.style.transform = 'translateY(0) scale(1)';
    }
  });

  // Mouse Drag Support for Desktop
  container.addEventListener('mousedown', (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) return;
    startY = e.clientY;
    startX = e.clientX;
    currentY = startY;
    currentX = startX;
    isDragging = true;
    activeLayer.style.transition = 'none';
    container.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentY = e.clientY;
    currentX = e.clientX;
    const deltaY = currentY - startY;
    const damp = 0.45;
    activeLayer.style.transform = `translateY(${deltaY * damp}px) scale(${1 - Math.abs(deltaY) * 0.0003})`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = 'default';
    activeLayer.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
    const deltaY = currentY - startY;

    if (deltaY < -SWIPE_THRESHOLD) {
      nextCard();
    } else if (deltaY > SWIPE_THRESHOLD) {
      prevCard();
    } else {
      activeLayer.style.transform = 'translateY(0) scale(1)';
    }
  });

  // Wheel / Trackpad Scroll Handler
  let lastWheelTime = 0;
  container.addEventListener('wheel', (e) => {
    const feedView = document.getElementById('view-feed');
    if (!feedView || !feedView.classList.contains('active')) return;

    e.preventDefault();
    const now = Date.now();
    if (now - lastWheelTime < 400) return;

    if (e.deltaY > 20) {
      lastWheelTime = now;
      nextCard();
    } else if (e.deltaY < -20) {
      lastWheelTime = now;
      prevCard();
    }
  }, { passive: false });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    const feedView = document.getElementById('view-feed');
    if (!feedView || !feedView.classList.contains('active')) return;

    if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'j') {
      e.preventDefault();
      nextCard();
    } else if (e.key === 'ArrowUp' || e.key === 'k') {
      e.preventDefault();
      prevCard();
    } else if (e.key === 'y' || e.key === 'Y' || e.key === '1') {
      castVote(true);
    } else if (e.key === 'n' || e.key === 'N' || e.key === '2') {
      castVote(false);
    }
  });
}

// -------------------------------------------------------------
// Local File Upload & Realtime Ingestion
// -------------------------------------------------------------
function setupLocalFileUpload() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('local-file-input');
  const placeholder = document.getElementById('upload-placeholder');
  const previewContainer = document.getElementById('upload-preview-container');
  const previewImg = document.getElementById('upload-preview-img');
  const fileNameLabel = document.getElementById('file-name-label');
  const fileSizeLabel = document.getElementById('file-size-label');
  const removeBtn = document.getElementById('remove-image-btn');
  const changeBtn = document.getElementById('change-image-btn');
  const uploadForm = document.getElementById('upload-form');

  dropzone.addEventListener('click', (e) => {
    if (e.target.closest('#remove-image-btn') || e.target.closest('#change-image-btn')) return;
    if (!currentSelectedDataUrl) fileInput.click();
  });

  changeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetFileUploadState();
  });

  fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files && files.length > 0) handleSelectedFile(files[0]);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('border-cyan-glow', 'bg-cyan-glow/10');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('border-cyan-glow', 'bg-cyan-glow/10');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) handleSelectedFile(files[0]);
  });

  function handleSelectedFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG, WEBP 등)만 업로드할 수 있습니다.');
      return;
    }

    currentSelectedFile = file;
    const reader = new FileReader();

    reader.onload = (event) => {
      currentSelectedDataUrl = event.target.result;
      previewImg.src = currentSelectedDataUrl;
      fileNameLabel.textContent = file.name;
      fileSizeLabel.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

      placeholder.classList.add('hidden');
      previewContainer.classList.remove('hidden');
      showToast('로컬 이미지가 선택되었습니다.');
    };

    reader.readAsDataURL(file);
  }

  function resetFileUploadState() {
    currentSelectedFile = null;
    currentSelectedDataUrl = '';
    fileInput.value = '';
    previewImg.src = '';
    previewContainer.classList.add('hidden');
    placeholder.classList.remove('hidden');
  }

  // Category Picker with live theme styling
  const categoryBtns = document.querySelectorAll('.category-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => {
        b.classList.remove('border-cyan-glow', 'bg-cyan-glow/15', 'text-cyan-glow');
        b.classList.add('border-surface-container-high', 'bg-surface-container', 'text-slate-300');
      });
      btn.classList.add('border-cyan-glow', 'bg-cyan-glow/15', 'text-cyan-glow');
      btn.classList.remove('border-surface-container-high', 'bg-surface-container', 'text-slate-300');

      currentCategory = btn.getAttribute('data-category');
      currentCategoryIcon = btn.getAttribute('data-icon');
    });
  });

  // Preset Question Suggestions
  const presetTags = document.querySelectorAll('.preset-tag');
  const questionInput = document.getElementById('question-input');
  presetTags.forEach(tag => {
    tag.addEventListener('click', () => {
      questionInput.value = tag.textContent.trim();
      questionInput.focus();
    });
  });

  // Form Submit
  uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!currentSelectedDataUrl) {
      alert('로컬 사진을 선택해 주세요!');
      fileInput.click();
      return;
    }

    const questionVal = questionInput.value.trim() || '첫인상에서 호감과 신뢰감이 느껴지나요?';
    const authorVal = document.getElementById('author-input').value.trim() || 'my_look';

    const newCard = {
      id: 'card-' + Date.now(),
      author: authorVal,
      category: currentCategory,
      categoryIcon: currentCategoryIcon,
      question: questionVal,
      subtext: '실시간 첫인상 피드백을 수집 중입니다',
      imageUrl: currentSelectedDataUrl,
      objectPosition: 'center 20%',
      yesVotes: 1,
      noVotes: 0,
      nodeId: 'NODE: ' + Math.floor(Math.random() * 90 + 10) + '.A',
      isMyUpload: true,
      timestamp: '방금 전'
    };

    appCards.unshift(newCard);
    saveCards();
    currentCardIndex = 0;

    resetFileUploadState();
    questionInput.value = '';

    showToast('새 사진이 업로드되어 피드 맨 앞에 등록되었습니다!');
    
    setTimeout(() => {
      switchTab('feed');
    }, 350);
  });
}

// -------------------------------------------------------------
// Rankings & Profile Renderers
// -------------------------------------------------------------
function renderRanking() {
  const list = document.getElementById('ranking-list');
  if (!list) return;

  const sorted = [...appCards].sort((a, b) => {
    const totalA = (a.yesVotes || 0) + (a.noVotes || 0);
    const totalB = (b.yesVotes || 0) + (b.noVotes || 0);
    const rateA = totalA > 0 ? a.yesVotes / totalA : 0;
    const rateB = totalB > 0 ? b.yesVotes / totalB : 0;
    return rateB - rateA;
  });

  list.innerHTML = sorted.map((card, idx) => {
    const total = (card.yesVotes || 0) + (card.noVotes || 0);
    const pct = total > 0 ? Math.round((card.yesVotes / total) * 100) : 50;
    const rankColor = idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-500';
    const theme = CATEGORY_THEMES[card.category] || CATEGORY_THEMES.Business;

    return `
      <div class="p-3 rounded-2xl bg-surface-container border border-surface-container-high flex items-center gap-3.5 hover:border-cyan-glow/40 transition-colors cursor-pointer" onclick="viewCardFromRanking('${card.id}')">
        <span class="font-headline font-extrabold text-lg ${rankColor} w-5 text-center">${idx + 1}</span>
        
        <img src="${card.imageUrl}" alt="${card.author}" style="object-position: ${card.objectPosition || 'center top'};" class="w-14 h-14 rounded-xl object-cover border border-white/10" />

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-headline font-bold text-sm text-white truncate">@${card.author}</span>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-high" style="color: ${theme.primaryColor}; border: 1px solid ${theme.primaryColor}30;">${card.category}</span>
          </div>
          <p class="text-xs text-slate-400 truncate mt-0.5">${card.question.replace(/\n/g, ' ')}</p>
          <div class="flex items-center gap-3 mt-1 text-[11px] font-mono text-slate-400">
            <span>참여: <strong class="text-white">${total.toLocaleString()}</strong></span>
            <span>신뢰지수: <strong style="color: ${theme.primaryColor};">${(85 + (pct * 0.14)).toFixed(1)}</strong></span>
          </div>
        </div>

        <div class="text-right">
          <div class="font-headline font-extrabold text-base" style="color: ${theme.primaryColor};">${pct}%</div>
          <span class="text-[10px] font-mono text-slate-400">YES율</span>
        </div>
      </div>
    `;
  }).join('');
}

function viewCardFromRanking(cardId) {
  const idx = appCards.findIndex(c => c.id === cardId);
  if (idx !== -1) {
    currentCardIndex = idx;
    switchTab('feed');
  }
}

function renderProfile() {
  const myPosts = appCards.filter(c => c.isMyUpload);
  const myUploadsCount = document.getElementById('my-uploads-count');
  const myVotesCount = document.getElementById('my-votes-count');
  const myAvgApproval = document.getElementById('my-avg-approval');
  const list = document.getElementById('my-posts-list');

  myUploadsCount.textContent = myPosts.length;

  let totalVotes = 0;
  let totalYes = 0;
  myPosts.forEach(p => {
    totalVotes += (p.yesVotes || 0) + (p.noVotes || 0);
    totalYes += (p.yesVotes || 0);
  });

  myVotesCount.textContent = totalVotes.toLocaleString();
  const avg = totalVotes > 0 ? ((totalYes / totalVotes) * 100).toFixed(1) + '%' : '0.0%';
  myAvgApproval.textContent = avg;

  if (myPosts.length === 0) {
    list.innerHTML = `
      <div class="p-8 rounded-2xl bg-surface-container border border-dashed border-surface-container-high text-center">
        <span class="material-symbols-outlined text-4xl text-slate-500 mb-2">image_not_supported</span>
        <p class="text-sm text-slate-300 font-headline font-bold">아직 업로드한 사진이 없습니다</p>
        <p class="text-xs text-slate-500 mt-1">로컬 사진을 업로드하고 실시간 분석을 받아보세요</p>
        <button onclick="switchTab('upload')" class="mt-4 px-4 py-2 bg-cyan-glow/15 border border-cyan-glow text-cyan-glow rounded-xl text-xs font-bold font-headline">
          첫 사진 업로드하기
        </button>
      </div>
    `;
    return;
  }

  list.innerHTML = myPosts.map(post => {
    const total = (post.yesVotes || 0) + (post.noVotes || 0);
    const pct = total > 0 ? Math.round((post.yesVotes / total) * 100) : 50;
    const theme = CATEGORY_THEMES[post.category] || CATEGORY_THEMES.Business;

    return `
      <div class="p-3.5 rounded-2xl bg-surface-container border border-surface-container-high flex gap-3 items-center">
        <img src="${post.imageUrl}" alt="My Upload" style="object-position: ${post.objectPosition || 'center top'};" class="w-16 h-20 rounded-xl object-cover border border-white/10" />
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold" style="background-color: ${theme.primaryColor}20; color: ${theme.primaryColor}; border: 1px solid ${theme.primaryColor}40;">${post.category}</span>
            <span class="text-[10px] text-slate-400 font-mono">${post.timestamp || '최근'}</span>
          </div>
          <p class="text-xs text-white font-medium line-clamp-2 mt-1.5">${post.question.replace(/\n/g, ' ')}</p>
          
          <div class="mt-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold" style="color: ${theme.primaryColor};">YES ${pct}%</span>
              <span class="text-[10px] text-slate-400 font-mono">(${total.toLocaleString()}명)</span>
            </div>
            <button onclick="deleteCard('${post.id}')" class="text-slate-500 hover:text-rose-400 transition-colors p-1" title="삭제">
              <span class="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function deleteCard(id) {
  if (confirm('이 사진을 피드에서 삭제하시겠습니까?')) {
    appCards = appCards.filter(c => c.id !== id);
    saveCards();
    renderProfile();
    showToast('업로드 항목이 삭제되었습니다.');
  }
}

// -------------------------------------------------------------
// App Initialization
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initData();
  setupGestureEngine();
  setupLocalFileUpload();
  renderStorySegments();
  renderCurrentFeedCard('none');

  const notifBtn = document.getElementById('notification-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      showToast('새로운 실시간 투표 18건이 업데이트되었습니다.');
      const badge = document.getElementById('notif-badge');
      if (badge) badge.classList.add('hidden');
    });
  }
});
