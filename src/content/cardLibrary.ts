// ============================================================
// Card Meaning Library — KO/EN content for the 22 Major Arcana
// ============================================================
// Used to generate static, crawlable pages at /cards/ and /ko/cards/
// (see vite.config.ts → cardPagesPlugin). Keep this file dependency-free
// so the build plugin can load it directly.
//
// Writing rules (PRODUCT_PRINCIPLES.md):
// - Reflection, never prediction. No "you will...", no guaranteed outcomes.
// - No fear. Difficult cards (Death, Tower, Devil) are framed as change,
//   release and choice, ending with something hopeful and practical.
// - KO and EN carry the same structure and depth.
// ============================================================

export interface CardLibraryText {
  name: string;
  keywords: string[];
  summary: string;
  meaning: string;
  questions: string[];
  practice: string;
}

export interface CardLibraryEntry {
  /** URL slug, e.g. "the-fool" → /cards/the-fool/ */
  slug: string;
  /** Matching card id in the in-app deck (src/config/tarotCards.ts), when the card is in it. */
  appId?: string;
  numeral: string;
  symbol: string;
  en: CardLibraryText;
  ko: CardLibraryText;
}

export const CARD_LIBRARY: CardLibraryEntry[] = [
  {
    slug: 'the-fool',
    appId: 'fool',
    numeral: '0',
    symbol: '🃏',
    en: {
      name: 'The Fool',
      keywords: ['Beginnings', 'Openness', 'Leap'],
      summary: 'A fresh start approached with curiosity rather than certainty.',
      meaning:
        'The Fool stands at the edge of something new, without a full map. In reflection it asks what you would try if you allowed yourself to be a beginner again. It is less about recklessness and more about trusting that you can learn along the way.',
      questions: [
        'Where in my life am I waiting to feel completely ready?',
        'What small first step would feel light rather than heavy?',
      ],
      practice: 'Choose one tiny thing you have never tried and do it today, just to notice how it feels.',
    },
    ko: {
      name: '광대',
      keywords: ['시작', '열린 마음', '첫걸음'],
      summary: '확신보다 호기심으로 맞이하는 새로운 시작.',
      meaning:
        '광대는 완성된 지도 없이 새로운 길의 가장자리에 서 있습니다. 성찰의 관점에서 이 카드는 스스로를 다시 초보자로 허락한다면 무엇을 해 보고 싶은지 묻습니다. 무모함보다는, 걸어가면서 배워도 괜찮다는 믿음에 가깝습니다.',
      questions: [
        '나는 어디에서 "완벽하게 준비될 때"만 기다리고 있나요?',
        '무겁지 않고 가볍게 느껴지는 첫걸음은 무엇일까요?',
      ],
      practice: '한 번도 해 보지 않은 아주 작은 일 하나를 오늘 해 보고, 그때의 느낌을 살펴보세요.',
    },
  },
  {
    slug: 'the-magician',
    appId: 'magician',
    numeral: 'I',
    symbol: '🪄',
    en: {
      name: 'The Magician',
      keywords: ['Agency', 'Focus', 'Creation'],
      summary: 'Noticing the tools you already hold and putting them to use.',
      meaning:
        'The Magician gathers what is on the table and turns attention into action. It invites you to see the skills, time and support already within reach. The card is about focus: one clear intention often moves further than many scattered ones.',
      questions: [
        'What resources do I already have that I tend to overlook?',
        'If I focused on just one intention this week, what would it be?',
      ],
      practice: 'Write down three strengths you can use right now, then pick one task to apply them to.',
    },
    ko: {
      name: '마법사',
      keywords: ['주도성', '집중', '창조'],
      summary: '이미 손에 쥔 도구를 알아차리고 써 보는 힘.',
      meaning:
        '마법사는 탁자 위에 놓인 것들을 모아 주의를 행동으로 바꿉니다. 이 카드는 이미 닿을 수 있는 곳에 있는 능력과 시간, 도움을 돌아보게 합니다. 여러 갈래로 흩어진 마음보다 하나의 분명한 의도가 더 멀리 나아갈 때가 많습니다.',
      questions: [
        '내가 이미 가졌는데 자주 지나치는 자원은 무엇인가요?',
        '이번 주에 단 하나의 의도에만 집중한다면 무엇일까요?',
      ],
      practice: '지금 바로 쓸 수 있는 나의 강점 세 가지를 적고, 그것을 적용할 일 하나를 골라 보세요.',
    },
  },
  {
    slug: 'the-high-priestess',
    appId: 'high_priestess',
    numeral: 'II',
    symbol: '🌙',
    en: {
      name: 'The High Priestess',
      keywords: ['Intuition', 'Stillness', 'Inner Knowing'],
      summary: 'Listening to the quiet sense beneath the noise.',
      meaning:
        'The High Priestess sits between what is visible and what is felt. She suggests that not every answer needs to be argued out loud; some become clear when you slow down. This card supports pausing, journaling and paying attention to recurring feelings or dreams.',
      questions: [
        'What do I sense about this situation that I have not said out loud?',
        'When I am quiet, which thought keeps returning?',
      ],
      practice: 'Spend five minutes without your phone and write whatever surfaces, without editing.',
    },
    ko: {
      name: '여사제',
      keywords: ['직감', '고요함', '내면의 감각'],
      summary: '소음 아래에 있는 조용한 감각에 귀 기울이기.',
      meaning:
        '여사제는 눈에 보이는 것과 느껴지는 것 사이에 앉아 있습니다. 모든 답이 소리 내어 따져 봐야만 나오는 것은 아니며, 속도를 늦출 때 선명해지는 답도 있다고 말합니다. 잠시 멈추기, 기록하기, 반복되는 감정이나 꿈에 주의를 기울이는 일을 지지하는 카드입니다.',
      questions: [
        '이 상황에 대해 느끼지만 아직 말로 꺼내지 않은 것은 무엇인가요?',
        '조용해질 때마다 다시 떠오르는 생각은 무엇인가요?',
      ],
      practice: '휴대폰 없이 5분 동안 떠오르는 것을 고치지 말고 그대로 적어 보세요.',
    },
  },
  {
    slug: 'the-empress',
    appId: 'empress',
    numeral: 'III',
    symbol: '👑',
    en: {
      name: 'The Empress',
      keywords: ['Nurture', 'Growth', 'Abundance'],
      summary: 'Letting things grow through care, patience and comfort.',
      meaning:
        'The Empress represents nourishment: of projects, relationships and yourself. She reminds you that growth often needs warmth and time rather than pressure. In reflection, she asks where you could offer yourself the same care you easily give others.',
      questions: [
        'What in my life is growing slowly and needs patience?',
        'How could I care for my body or mood a little more today?',
      ],
      practice: 'Do one comforting thing for yourself on purpose: a slow meal, a walk, or real rest.',
    },
    ko: {
      name: '여황제',
      keywords: ['돌봄', '성장', '풍요'],
      summary: '돌봄과 인내, 편안함으로 무언가를 자라게 하는 힘.',
      meaning:
        '여황제는 일과 관계, 그리고 나 자신을 키워 내는 양분을 상징합니다. 성장에는 압박보다 따뜻함과 시간이 필요할 때가 많다는 것을 일깨웁니다. 다른 사람에게 쉽게 건네는 돌봄을 나에게도 줄 수 있는 곳이 어디인지 묻는 카드입니다.',
      questions: [
        '지금 내 삶에서 천천히 자라고 있어 인내가 필요한 것은 무엇인가요?',
        '오늘 내 몸이나 기분을 조금 더 돌볼 방법은 무엇일까요?',
      ],
      practice: '천천히 먹는 한 끼, 산책, 제대로 된 휴식처럼 나를 위한 편안한 일 하나를 의식적으로 해 보세요.',
    },
  },
  {
    slug: 'the-emperor',
    appId: 'emperor',
    numeral: 'IV',
    symbol: '🏛️',
    en: {
      name: 'The Emperor',
      keywords: ['Structure', 'Boundaries', 'Stability'],
      summary: 'Building steady ground through clear structure and boundaries.',
      meaning:
        'The Emperor brings order to uncertainty. He suggests that routines, plans and honest boundaries can make you feel safer and freer at the same time. Reflect on where a little more structure would relieve, rather than restrict, you.',
      questions: [
        'Which boundary would protect my energy right now?',
        'What simple routine would make my days feel steadier?',
      ],
      practice: 'Write a short plan for tomorrow with just three priorities, and keep it visible.',
    },
    ko: {
      name: '황제',
      keywords: ['구조', '경계', '안정'],
      summary: '분명한 구조와 경계로 단단한 바탕을 만드는 힘.',
      meaning:
        '황제는 불확실함에 질서를 가져옵니다. 일상의 루틴과 계획, 솔직한 경계가 나를 더 안전하면서도 자유롭게 만들 수 있다고 말합니다. 조금 더 구조를 세웠을 때 답답해지기보다 오히려 숨이 트일 곳이 어디인지 돌아보세요.',
      questions: [
        '지금 내 에너지를 지켜 줄 경계는 무엇인가요?',
        '하루를 더 안정적으로 느끼게 해 줄 간단한 루틴은 무엇일까요?',
      ],
      practice: '내일의 우선순위 세 가지만 담은 짧은 계획을 적어 눈에 보이는 곳에 두세요.',
    },
  },
  {
    slug: 'the-hierophant',
    numeral: 'V',
    symbol: '📜',
    en: {
      name: 'The Hierophant',
      keywords: ['Guidance', 'Tradition', 'Learning'],
      summary: 'Learning from shared wisdom while deciding what fits you.',
      meaning:
        'The Hierophant points to teachers, traditions and communities that carry knowledge. It can invite you to seek advice or return to practices that once grounded you. It also asks which inherited rules still serve you and which you are ready to adapt.',
      questions: [
        'Whose guidance would help me see this more clearly?',
        'Which "should" am I following that I have never questioned?',
      ],
      practice: 'Ask someone you trust for their perspective on one question you have been carrying alone.',
    },
    ko: {
      name: '교황',
      keywords: ['가르침', '전통', '배움'],
      summary: '함께 쌓아 온 지혜에서 배우되, 나에게 맞는 것을 고르기.',
      meaning:
        '교황은 지식을 이어 온 스승과 전통, 공동체를 가리킵니다. 조언을 구하거나, 예전에 나를 붙잡아 주던 습관으로 돌아가 보라고 권할 수 있습니다. 동시에 물려받은 규칙 중 무엇이 여전히 나를 돕고, 무엇을 내게 맞게 바꿀 준비가 되었는지도 묻습니다.',
      questions: [
        '누구의 조언이 이 일을 더 분명하게 보도록 도와줄까요?',
        '한 번도 의심해 보지 않고 따르고 있는 "해야 한다"는 무엇인가요?',
      ],
      practice: '혼자 품고 있던 질문 하나를 믿는 사람에게 털어놓고, 그 사람의 관점을 들어 보세요.',
    },
  },
  {
    slug: 'the-lovers',
    appId: 'lovers',
    numeral: 'VI',
    symbol: '💞',
    en: {
      name: 'The Lovers',
      keywords: ['Connection', 'Choice', 'Alignment'],
      summary: 'Choices that bring your actions closer to your values.',
      meaning:
        'The Lovers is about meaningful connection and the choices that shape it. Beyond romance, it asks whether what you do matches what you truly care about. The card encourages honest conversations and decisions made from alignment rather than fear of missing out.',
      questions: [
        'Which choice in front of me feels most like "me"?',
        'What do I need to say honestly in an important relationship?',
      ],
      practice: 'List your top three values, then check one upcoming decision against them.',
    },
    ko: {
      name: '연인',
      keywords: ['연결', '선택', '조화'],
      summary: '나의 행동을 내가 아끼는 가치에 가깝게 만드는 선택.',
      meaning:
        '연인 카드는 의미 있는 연결과 그 연결을 빚어 가는 선택에 관한 카드입니다. 연애를 넘어서, 내가 하는 일이 정말 소중히 여기는 것과 맞닿아 있는지 묻습니다. 놓칠까 봐 두려워서가 아니라 마음이 맞는 방향으로 내리는 결정과 솔직한 대화를 응원합니다.',
      questions: [
        '눈앞의 선택 중 가장 "나다운" 것은 무엇인가요?',
        '소중한 관계에서 솔직하게 말해야 할 것은 무엇인가요?',
      ],
      practice: '내가 가장 중요하게 여기는 가치 세 가지를 적고, 다가오는 결정 하나를 그 기준에 비춰 보세요.',
    },
  },
  {
    slug: 'the-chariot',
    appId: 'chariot',
    numeral: 'VII',
    symbol: '⚔️',
    en: {
      name: 'The Chariot',
      keywords: ['Direction', 'Will', 'Movement'],
      summary: 'Moving forward by steering, not by forcing.',
      meaning:
        'The Chariot shows momentum guided by intention. It suggests gathering competing feelings and pointing them in one direction. The card is less about winning and more about steady, chosen progress.',
      questions: [
        'Where do I want to be heading, in one sentence?',
        'Which inner conflict is slowing me down?',
      ],
      practice: 'Pick one goal and take one concrete step toward it before the day ends.',
    },
    ko: {
      name: '전차',
      keywords: ['방향', '의지', '전진'],
      summary: '억지로 밀어붙이기보다 방향을 잡으며 나아가기.',
      meaning:
        '전차는 의도에 이끌리는 추진력을 보여 줍니다. 서로 다른 방향으로 끌리는 마음들을 모아 한 방향을 가리키도록 해 보라고 말합니다. 이기는 것보다, 스스로 선택한 꾸준한 전진에 가까운 카드입니다.',
      questions: [
        '내가 향하고 싶은 곳을 한 문장으로 말한다면?',
        '나를 느리게 만드는 마음속 갈등은 무엇인가요?',
      ],
      practice: '목표 하나를 골라 오늘이 가기 전에 그쪽으로 구체적인 한 걸음을 내디뎌 보세요.',
    },
  },
  {
    slug: 'strength',
    appId: 'strength',
    numeral: 'VIII',
    symbol: '🦁',
    en: {
      name: 'Strength',
      keywords: ['Courage', 'Gentleness', 'Self-Control'],
      summary: 'Quiet courage that works through patience and kindness.',
      meaning:
        'Strength shows a calm hand resting on a lion: power without harshness. It reminds you that being gentle with strong emotions can be braver than fighting them. The card supports self-compassion and steady presence in hard moments.',
      questions: [
        'Which feeling am I trying to overpower instead of understand?',
        'Where have I already shown quiet courage lately?',
      ],
      practice: 'When a strong emotion rises today, take three slow breaths and name it before reacting.',
    },
    ko: {
      name: '힘',
      keywords: ['용기', '부드러운 힘', '자기 조절'],
      summary: '인내와 다정함으로 발휘되는 조용한 용기.',
      meaning:
        '힘 카드는 사자 위에 차분히 손을 얹은 모습으로, 거칠지 않은 힘을 보여 줍니다. 강한 감정과 싸우기보다 부드럽게 대하는 것이 더 용감할 수 있다는 것을 일깨웁니다. 어려운 순간에 나를 다정하게 대하고 차분히 머무는 힘을 응원합니다.',
      questions: [
        '이해하기보다 누르려고 애쓰는 감정은 무엇인가요?',
        '최근 내가 이미 보여 준 조용한 용기는 무엇인가요?',
      ],
      practice: '오늘 강한 감정이 올라오면 반응하기 전에 천천히 세 번 숨 쉬고 그 감정의 이름을 불러 보세요.',
    },
  },
  {
    slug: 'the-hermit',
    appId: 'hermit',
    numeral: 'IX',
    symbol: '🏮',
    en: {
      name: 'The Hermit',
      keywords: ['Reflection', 'Solitude', 'Wisdom'],
      summary: 'Stepping back to find your own light.',
      meaning:
        'The Hermit walks alone with a lantern, lighting only the next few steps. This card honors time away from noise to understand what you really think. Solitude here is restorative, not lonely, and the insight you find can later be shared.',
      questions: [
        'What would I decide if no one else\'s opinion mattered?',
        'How much quiet time have I given myself lately?',
      ],
      practice: 'Schedule a short, intentional alone time this week and protect it like an appointment.',
    },
    ko: {
      name: '은둔자',
      keywords: ['성찰', '고요함', '지혜'],
      summary: '한 걸음 물러나 나만의 등불을 찾는 시간.',
      meaning:
        '은둔자는 바로 앞 몇 걸음만 비추는 등불을 들고 홀로 걷습니다. 소음에서 벗어나 내가 정말 어떻게 생각하는지 알아 가는 시간을 존중하는 카드입니다. 이때의 혼자 있음은 외로움이 아니라 회복이며, 그 안에서 얻은 깨달음은 나중에 나눌 수 있습니다.',
      questions: [
        '다른 사람의 의견이 중요하지 않다면 나는 무엇을 선택할까요?',
        '최근 나에게 조용한 시간을 얼마나 주었나요?',
      ],
      practice: '이번 주에 짧게라도 의도적으로 혼자 있는 시간을 정하고, 약속처럼 지켜 보세요.',
    },
  },
  {
    slug: 'wheel-of-fortune',
    appId: 'wheel_of_fortune',
    numeral: 'X',
    symbol: '🎡',
    en: {
      name: 'Wheel of Fortune',
      keywords: ['Change', 'Cycles', 'Turning Point'],
      summary: 'Remembering that seasons change, and so do you.',
      meaning:
        'The Wheel turns: highs and lows rarely last forever. This card invites you to notice patterns in your life and to respond to change with flexibility. It is not a promise of luck, but a reminder that how you meet a turning point matters.',
      questions: [
        'What cycle keeps repeating for me, and what does it teach?',
        'Which part of this change can I actually influence?',
      ],
      practice: 'Look back one year: write one thing that changed for the better without you expecting it.',
    },
    ko: {
      name: '운명의 수레바퀴',
      keywords: ['변화', '순환', '전환점'],
      summary: '계절이 바뀌듯 나도 변해 간다는 것을 기억하기.',
      meaning:
        '수레바퀴는 돕니다. 좋은 때도 힘든 때도 영원히 머무는 경우는 드뭅니다. 이 카드는 내 삶에서 반복되는 흐름을 알아차리고, 변화에 유연하게 반응해 보라고 권합니다. 행운을 약속하는 카드가 아니라, 전환점을 어떻게 맞이하느냐가 중요하다는 것을 일깨우는 카드입니다.',
      questions: [
        '나에게 반복되는 흐름은 무엇이고, 그것이 알려 주는 것은 무엇인가요?',
        '이 변화에서 내가 실제로 영향을 줄 수 있는 부분은 어디인가요?',
      ],
      practice: '1년 전을 돌아보며, 기대하지 않았는데 좋아진 일 하나를 적어 보세요.',
    },
  },
  {
    slug: 'justice',
    numeral: 'XI',
    symbol: '⚖️',
    en: {
      name: 'Justice',
      keywords: ['Fairness', 'Honesty', 'Balance'],
      summary: 'Seeing a situation clearly and fairly, including your own part.',
      meaning:
        'Justice holds scales and a clear blade: balance and honest judgment. It asks you to weigh the facts calmly and own your choices without harsh self-blame. Fairness here includes being fair to yourself.',
      questions: [
        'What are the facts, separate from my fears or hopes?',
        'Where do I need to take responsibility, and where can I let go of blame?',
      ],
      practice: 'Write the situation in two columns: what I know, and what I assume.',
    },
    ko: {
      name: '정의',
      keywords: ['공정함', '정직', '균형'],
      summary: '나의 몫까지 포함해 상황을 분명하고 공정하게 바라보기.',
      meaning:
        '정의는 저울과 곧은 검으로 균형과 정직한 판단을 상징합니다. 사실을 차분히 따져 보고, 지나친 자책 없이 내 선택을 책임져 보라고 말합니다. 여기서의 공정함에는 나 자신에게 공정한 것도 포함됩니다.',
      questions: [
        '두려움이나 바람과 분리했을 때, 실제 사실은 무엇인가요?',
        '내가 책임질 부분은 어디이고, 내려놓아도 되는 자책은 무엇인가요?',
      ],
      practice: '상황을 "내가 아는 것"과 "내가 짐작하는 것" 두 칸으로 나누어 적어 보세요.',
    },
  },
  {
    slug: 'the-hanged-man',
    numeral: 'XII',
    symbol: '🔄',
    en: {
      name: 'The Hanged Man',
      keywords: ['Pause', 'Perspective', 'Surrender'],
      summary: 'A pause that lets you see things from a new angle.',
      meaning:
        'The Hanged Man hangs calmly, viewing the world upside down. This card suggests that waiting is not always wasted time; a pause can reveal a perspective you could not see while rushing. It invites letting go of control where pushing is not helping.',
      questions: [
        'What might this situation look like from the other person\'s side?',
        'Where am I pushing when a pause might help more?',
      ],
      practice: 'Before deciding on something today, sleep on it, or wait one hour and look again.',
    },
    ko: {
      name: '매달린 사람',
      keywords: ['멈춤', '새로운 관점', '내려놓음'],
      summary: '새로운 각도에서 바라보게 해 주는 멈춤.',
      meaning:
        '매달린 사람은 거꾸로 매달린 채 평온하게 세상을 바라봅니다. 기다림이 언제나 낭비는 아니며, 서두를 때는 보이지 않던 관점이 멈춤 속에서 드러날 수 있다고 말합니다. 밀어붙여도 나아지지 않는 곳에서는 통제를 조금 내려놓아 보라고 권합니다.',
      questions: [
        '상대의 자리에서 보면 이 상황은 어떻게 보일까요?',
        '잠시 멈추는 편이 더 나을 텐데 계속 밀어붙이고 있는 곳은 어디인가요?',
      ],
      practice: '오늘 무언가를 결정하기 전에 하룻밤 자고 보거나, 한 시간 뒤에 다시 살펴보세요.',
    },
  },
  {
    slug: 'death',
    numeral: 'XIII',
    symbol: '🦋',
    en: {
      name: 'Death',
      keywords: ['Endings', 'Transformation', 'Release'],
      summary: 'Closing one chapter so another can begin. It is about change, not literal loss.',
      meaning:
        'Despite its name, the Death card is about transformation, not physical death. It marks the natural end of a phase, habit or role, making room for something new. Endings can feel uncomfortable, and this card gently honors both the grief and the relief they may bring.',
      questions: [
        'What am I holding onto that has already quietly ended?',
        'What would I like to make space for next?',
      ],
      practice: 'Let go of one small thing that no longer fits: an old file, an item, or a commitment.',
    },
    ko: {
      name: '죽음',
      keywords: ['마무리', '변화', '내려놓음'],
      summary: '한 장을 닫아야 다음 장이 열립니다. 실제 상실이 아니라 변화에 관한 카드입니다.',
      meaning:
        '이름과 달리 죽음 카드는 실제 죽음이 아니라 변화를 뜻합니다. 하나의 시기나 습관, 역할이 자연스럽게 끝나고 새로운 것이 들어올 자리가 생기는 순간을 보여 줍니다. 끝은 불편하게 느껴질 수 있으며, 이 카드는 그때의 아쉬움과 홀가분함을 모두 다정하게 인정합니다.',
      questions: [
        '이미 조용히 끝났는데도 내가 붙잡고 있는 것은 무엇인가요?',
        '다음으로 어떤 것을 위한 자리를 만들고 싶나요?',
      ],
      practice: '오래된 파일, 물건, 약속처럼 더 이상 맞지 않는 작은 것 하나를 정리해 보세요.',
    },
  },
  {
    slug: 'temperance',
    numeral: 'XIV',
    symbol: '🏺',
    en: {
      name: 'Temperance',
      keywords: ['Balance', 'Moderation', 'Healing'],
      summary: 'Finding a middle path and mixing things in the right measure.',
      meaning:
        'Temperance pours water between two cups, blending slowly and carefully. It suggests patience, moderation and integrating different parts of your life. Healing and progress here come from small, consistent adjustments rather than extremes.',
      questions: [
        'Where am I swinging between extremes?',
        'What small adjustment would bring a little more balance this week?',
      ],
      practice: 'Choose one habit to adjust by just 10%: a little more rest, a little less screen time.',
    },
    ko: {
      name: '절제',
      keywords: ['균형', '조절', '회복'],
      summary: '중간의 길을 찾아 알맞은 만큼 섞어 내는 지혜.',
      meaning:
        '절제는 두 잔 사이로 물을 천천히, 조심스럽게 옮겨 담습니다. 인내와 적당함, 그리고 삶의 서로 다른 부분을 하나로 어우르는 일을 이야기합니다. 이 카드에서의 회복과 성장은 극단이 아니라 작고 꾸준한 조정에서 옵니다.',
      questions: [
        '나는 어디에서 극단 사이를 오가고 있나요?',
        '이번 주에 균형을 조금 더 찾아 줄 작은 조정은 무엇일까요?',
      ],
      practice: '쉬는 시간은 조금 더, 화면 보는 시간은 조금 덜처럼 습관 하나를 10%만 조정해 보세요.',
    },
  },
  {
    slug: 'the-devil',
    numeral: 'XV',
    symbol: '⛓️',
    en: {
      name: 'The Devil',
      keywords: ['Attachment', 'Habits', 'Awareness'],
      summary: 'Noticing what holds you, so you can choose differently.',
      meaning:
        'The Devil shows figures loosely chained, chains they could lift off. It points to habits, patterns or beliefs that feel stronger than they are. This card is not a warning of evil; it is an invitation to notice where you have more choice than you think.',
      questions: [
        'Which habit or thought pattern keeps pulling me back?',
        'What is one small way I could loosen its grip?',
      ],
      practice: 'Notice one automatic habit today and, just once, choose a different response.',
    },
    ko: {
      name: '악마',
      keywords: ['집착', '습관', '알아차림'],
      summary: '나를 붙잡는 것을 알아차리면, 다르게 선택할 수 있습니다.',
      meaning:
        '악마 카드 속 인물들은 느슨한 사슬에 묶여 있고, 그 사슬은 스스로 벗을 수 있습니다. 실제보다 강하게 느껴지는 습관이나 패턴, 믿음을 가리키는 카드입니다. 나쁜 일을 경고하는 카드가 아니라, 생각보다 내게 선택지가 더 많다는 것을 알아차려 보라는 초대입니다.',
      questions: [
        '나를 자꾸 되돌려 놓는 습관이나 생각의 패턴은 무엇인가요?',
        '그 힘을 조금 느슨하게 할 작은 방법은 무엇일까요?',
      ],
      practice: '오늘 자동으로 나오는 습관 하나를 알아차리고, 딱 한 번만 다르게 반응해 보세요.',
    },
  },
  {
    slug: 'the-tower',
    numeral: 'XVI',
    symbol: '🗼',
    en: {
      name: 'The Tower',
      keywords: ['Sudden Change', 'Truth', 'Rebuilding'],
      summary: 'When something unstable falls away, clearer ground can appear.',
      meaning:
        'The Tower depicts a structure struck by lightning: an unexpected shake-up. In reflection, it can point to beliefs or plans built on shaky ground that are ready to be rebuilt more honestly. It does not predict disaster; it reminds you that you can rebuild with what you have learned.',
      questions: [
        'What recent surprise showed me something true?',
        'If I rebuilt this part of my life, what would I do differently?',
      ],
      practice: 'Write down one lesson from a recent disruption and one way it could guide your next step.',
    },
    ko: {
      name: '탑',
      keywords: ['갑작스러운 변화', '진실', '다시 세우기'],
      summary: '불안정한 것이 무너진 자리에 더 분명한 바탕이 드러날 수 있습니다.',
      meaning:
        '탑은 번개를 맞은 건물로, 예상하지 못한 흔들림을 보여 줍니다. 성찰의 관점에서는 흔들리는 바탕 위에 세운 믿음이나 계획을 더 솔직하게 다시 세울 때가 되었음을 가리킬 수 있습니다. 재난을 예고하는 카드가 아니라, 배운 것을 가지고 다시 지을 수 있다는 것을 일깨우는 카드입니다.',
      questions: [
        '최근의 뜻밖의 일은 나에게 어떤 진실을 보여 주었나요?',
        '이 부분을 다시 세운다면 무엇을 다르게 하고 싶나요?',
      ],
      practice: '최근의 흔들림에서 얻은 교훈 하나와, 그것이 다음 걸음을 어떻게 이끌 수 있을지 적어 보세요.',
    },
  },
  {
    slug: 'the-star',
    appId: 'star',
    numeral: 'XVII',
    symbol: '✦',
    en: {
      name: 'The Star',
      keywords: ['Hope', 'Renewal', 'Perspective'],
      summary: 'Quiet hope returning after a difficult time.',
      meaning:
        'The Star appears after the storm, pouring water under an open sky. It speaks of renewal, gentle healing and trusting that things can improve. The card invites you to rest, reconnect with what inspires you and let hope be a practice rather than a guarantee.',
      questions: [
        'What gives me even a small sense of hope right now?',
        'What part of me is ready to heal or rest?',
      ],
      practice: 'Write down one thing you are looking forward to, however small.',
    },
    ko: {
      name: '별',
      keywords: ['희망', '회복', '새로운 시선'],
      summary: '힘든 시간 뒤에 조용히 돌아오는 희망.',
      meaning:
        '별은 폭풍이 지난 뒤, 열린 하늘 아래에서 물을 붓는 모습으로 나타납니다. 회복과 부드러운 치유, 그리고 나아질 수 있다는 믿음을 이야기합니다. 쉬어 가며 나에게 영감을 주는 것과 다시 연결되고, 희망을 보장이 아닌 연습으로 삼아 보라고 권합니다.',
      questions: [
        '지금 아주 작게라도 희망을 주는 것은 무엇인가요?',
        '나의 어떤 부분이 회복하거나 쉬어 갈 준비가 되었나요?',
      ],
      practice: '아무리 작더라도 기다려지는 일 하나를 적어 보세요.',
    },
  },
  {
    slug: 'the-moon',
    appId: 'moon',
    numeral: 'XVIII',
    symbol: '☾',
    en: {
      name: 'The Moon',
      keywords: ['Intuition', 'Uncertainty', 'Hidden Feelings'],
      summary: 'Moving gently through uncertainty and mixed feelings.',
      meaning:
        'The Moon lights a path that is only partly visible. It reflects times when feelings are complex and the full picture is unclear. Rather than a warning, it invites you to treat uncertainty with patience and to notice what your dreams and emotions might be telling you.',
      questions: [
        'Which feeling am I finding hard to name?',
        'What would help me feel a little safer while things are unclear?',
      ],
      practice: 'Before sleep, write one sentence about how you feel, without trying to solve it.',
    },
    ko: {
      name: '달',
      keywords: ['직관', '불확실함', '숨겨진 감정'],
      summary: '불확실함과 뒤섞인 감정 속을 천천히 지나가기.',
      meaning:
        '달은 일부만 보이는 길을 비춥니다. 감정이 복잡하고 전체 그림이 잘 보이지 않는 시기를 비추는 카드입니다. 경고가 아니라, 불확실함을 인내심 있게 대하며 꿈과 감정이 들려주는 이야기에 귀 기울여 보라는 초대입니다.',
      questions: [
        '이름 붙이기 어려운 감정은 무엇인가요?',
        '모든 것이 분명하지 않은 동안 조금 더 안심하게 해 줄 것은 무엇일까요?',
      ],
      practice: '잠들기 전, 해결하려 하지 말고 지금의 기분을 한 문장으로 적어 보세요.',
    },
  },
  {
    slug: 'the-sun',
    appId: 'sun',
    numeral: 'XIX',
    symbol: '☀',
    en: {
      name: 'The Sun',
      keywords: ['Clarity', 'Vitality', 'Openness'],
      summary: 'Warmth, clarity and the simple joy of being seen.',
      meaning:
        'The Sun brings light to what was confusing and warmth to what felt heavy. It invites openness, play and sharing what you have to offer. The card encourages you to notice and enjoy what is already going well.',
      questions: [
        'What is going better than I give it credit for?',
        'Where could I let myself be a little more visible or playful?',
      ],
      practice: 'Spend a few minutes outside or in natural light, and note one thing that feels good.',
    },
    ko: {
      name: '태양',
      keywords: ['명료함', '활력', '개방성'],
      summary: '따뜻함과 명료함, 그리고 있는 그대로 보이는 기쁨.',
      meaning:
        '태양은 혼란스럽던 것에 빛을, 무겁게 느껴지던 것에 따뜻함을 가져옵니다. 마음을 열고, 즐겁게, 내가 가진 것을 나누어 보라고 권합니다. 이미 잘 흘러가고 있는 것을 알아차리고 누려 보라는 카드입니다.',
      questions: [
        '생각보다 잘 되고 있는데 내가 인정하지 않는 것은 무엇인가요?',
        '조금 더 드러내거나 즐겁게 해도 좋을 곳은 어디인가요?',
      ],
      practice: '잠시 밖에 나가거나 햇빛 아래에 머물며, 기분 좋은 것 하나를 적어 보세요.',
    },
  },
  {
    slug: 'judgement',
    numeral: 'XX',
    symbol: '🎺',
    en: {
      name: 'Judgement',
      keywords: ['Awakening', 'Reflection', 'Renewal'],
      summary: 'Looking back honestly to answer a new call forward.',
      meaning:
        'Judgement shows figures rising at the sound of a trumpet: a moment of awakening. It invites you to review your path with honesty and compassion, and to forgive yourself where needed. From that clarity, a renewed sense of purpose can emerge.',
      questions: [
        'What have I learned about myself this past season?',
        'What is quietly calling me to begin again?',
      ],
      practice: 'Write a short note of forgiveness to your past self about one thing.',
    },
    ko: {
      name: '심판',
      keywords: ['깨어남', '돌아봄', '새로워짐'],
      summary: '솔직하게 돌아보며 앞으로의 부름에 답하기.',
      meaning:
        '심판 카드는 나팔 소리에 사람들이 일어나는 모습으로, 깨어나는 순간을 보여 줍니다. 지나온 길을 솔직하고도 다정하게 돌아보고, 필요한 곳에서는 스스로를 용서해 보라고 권합니다. 그 명료함 속에서 새로워진 목적이 떠오를 수 있습니다.',
      questions: [
        '지난 시간 동안 나에 대해 새로 알게 된 것은 무엇인가요?',
        '다시 시작해 보라고 조용히 나를 부르는 것은 무엇인가요?',
      ],
      practice: '과거의 나에게 한 가지 일에 대해 용서하는 짧은 메모를 적어 보세요.',
    },
  },
  {
    slug: 'the-world',
    numeral: 'XXI',
    symbol: '🌍',
    en: {
      name: 'The World',
      keywords: ['Completion', 'Wholeness', 'Integration'],
      summary: 'Recognizing how far you have come before the next journey.',
      meaning:
        'The World marks the completion of a cycle and a sense of wholeness. It invites you to pause and acknowledge what you have finished, learned and become. Celebrating an ending well helps you start the next chapter with a lighter heart.',
      questions: [
        'What have I completed that I have not yet celebrated?',
        'What do I want to carry with me into the next chapter?',
      ],
      practice: 'Mark one recent accomplishment in a small, personal way: tell someone or write it down.',
    },
    ko: {
      name: '세계',
      keywords: ['완성', '온전함', '통합'],
      summary: '다음 여정을 앞두고 내가 얼마나 왔는지 알아봐 주기.',
      meaning:
        '세계 카드는 하나의 순환이 완성되고 온전해지는 감각을 나타냅니다. 잠시 멈추어 내가 마친 것, 배운 것, 그리고 달라진 나를 인정해 보라고 권합니다. 마무리를 잘 기념하면 다음 장을 더 가벼운 마음으로 시작할 수 있습니다.',
      questions: [
        '이미 마쳤는데 아직 축하하지 않은 일은 무엇인가요?',
        '다음 장으로 가져가고 싶은 것은 무엇인가요?',
      ],
      practice: '최근에 해낸 일 하나를 누군가에게 말하거나 적어 두는 식으로, 작게나마 기념해 보세요.',
    },
  },
];

export function findCardBySlug(slug: string): CardLibraryEntry | undefined {
  return CARD_LIBRARY.find((card) => card.slug === slug);
}

export function findCardByAppId(appId: string): CardLibraryEntry | undefined {
  return CARD_LIBRARY.find((card) => card.appId === appId);
}
