// ============================================================
// Site Content Configuration — 텍스트/데이터 관리
// ============================================================
// 사이트에 표시되는 모든 텍스트를 여기서 수정할 수 있습니다.
// ============================================================

export const SITE_CONFIG = {
  // 브랜드
  brandName: 'Arcana by H.O.S',
  copyright: '© 2026 The Studio HOS. All rights reserved.',

  // 히어로 섹션
  hero: {
    titleLeft: ['FOLLOW YOUR', 'INTUITION'],
    titleRight: ['REVEAL', 'THE ARCANA'],
    watermark: 'ARCANA',
    description:
      'Choose the card your intuition is drawn to and discover the story waiting beneath the surface.',
  },

  // 시네마틱 텍스트 섹션
  cinematic: {
    text: 'Not every answer arrives as logic. Some appear as symbols. Some as feelings. Some as a single card you cannot ignore.',
  },

  // 성능 지표 섹션
  metrics: {
    subtitle: 'INSIDE ARCANA',
    items: [
      { value: '1', label: 'YOUR STORY' },
      { value: '3', label: 'WAYS TO GO DEEPER' },
      { value: '∞', label: 'POSSIBLE STORIES' },
    ],
  },

  // 기술 섹션
  technology: {
    title: ['Arcana', 'Experience'],
    description:
      'Turn a simple card draw into a quiet moment of focus, reflection, and personal insight.',
    features: [
      {
        title: 'INTUITIVE DRAW',
        desc: 'Choose the card that naturally captures your attention.',
      },
      {
        title: 'SYMBOLIC READING',
        desc: 'Explore the archetypes, emotions, and symbols reflected in your card.',
      },
      {
        title: 'PERSONAL REFLECTION',
        desc: 'Connect the reading with the question or story already on your mind.',
      },
      {
        title: 'A QUIET MOMENT',
        desc: 'Before choosing a card, take a quiet moment to notice what is still on your mind.',
      },
    ],
  },

  // 아키텍처 섹션
  architecture: {
    subtitle: 'HOW ARCANA WORKS',
    heading: 'FROM INTUITION\nTO INTERPRETATION',
    description:
      'Three simple steps turn a passing thought into a quiet moment of reflection.',
    layers: [
      {
        step: 'STEP 01',
        title: 'YOUR QUESTION',
        description: 'Bring the thought, feeling, or situation that is already on your mind.',
        supportingText: 'Love, career, relationships, uncertainty, or a question you cannot quite put into words.',
      },
      {
        step: 'STEP 02',
        title: 'YOUR CARD',
        description: 'Let intuition guide you toward the card that naturally captures your attention.',
        supportingText: 'No complicated rules. No right or wrong choice. Simply notice where your attention goes.',
      },
      {
        step: 'STEP 03',
        title: 'YOUR READING',
        description: 'Discover a symbolic interpretation shaped around your question and selected card.',
        supportingText: 'A reflective reading designed to help you notice patterns, emotions, and possibilities.',
      },
    ],
  },

  // 푸터
  footer: {
    tagline:
      'Follow your intuition. Reveal your Arcana.',
  },

  // 네비게이션
  nav: {
    links: [
      { label: 'Arcana', scrollMultiplier: 1 },
      { label: 'Experience', scrollMultiplier: 2 },
    ],
    downloadLabel: 'Download',
  },
};
