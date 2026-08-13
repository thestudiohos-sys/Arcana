import { PremiumReadingRequest, PremiumReadingResult, PremiumCardInterpretation } from '../types/reading';

// Local Deterministic Hash for phrase variation
function getDeterministicHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ============================================================================
// 13 Major Arcana Cards x 3 Roles Matrix (Current Flow, Hidden Meaning, Carry Forward)
// ============================================================================
const CARD_ROLE_INTERPRETATIONS: Record<
  string,
  Record<
    'currentFlow' | 'hiddenMeaning' | 'carryForward',
    { headlineKo: string; textKo: string; headlineEn: string; textEn: string }
  >
> = {
  fool: {
    currentFlow: {
      headlineKo: '새로운 흐름이 열리는 첫 시작점',
      textKo: '지금 상황은 조심스럽지만 마음 한편에서 순수한 가능성과 새로운 첫걸음을 향한 기운이 크게 불어오고 있는 시기입니다.',
      headlineEn: 'The threshold of an unwritten beginning',
      textEn: 'Your situation invites a fresh wave of open potential, urging you to step forward with lightness.',
    },
    hiddenMeaning: {
      headlineKo: '확신이 없어도 나아가고 싶은 내면의 욕구',
      textKo: '겉으로는 완벽한 준비를 기다리는 것처럼 보여도, 깊은 마음속에는 조건 없이 일단 시작해보고 싶은 자유로운 직관이 숨어 있습니다.',
      headlineEn: 'A quiet desire for leap over perfection',
      textEn: 'Beneath outward caution lies an inner impulse to trust the journey before every detail is solved.',
    },
    carryForward: {
      headlineKo: '결과를 미리 재단하지 않는 유연한 마음',
      textKo: '모든 실패 가능성을 사전에 차단하려 애쓰기보다, 마음을 열고 첫걸음이 주는 순수한 배움을 간직해보세요.',
      headlineEn: 'An open mindset that steps past fear of error',
      textEn: 'Carry forward the willingness to explore without demanding an immediate guaranteed outcome.',
    },
  },
  magician: {
    currentFlow: {
      headlineKo: '자원과 의지가 모이는 주도적 순간',
      textKo: '원하는 방향으로 상황을 가다듬을 수 있는 핵심 도구와 생각들이 이미 당신 주위에 놓여 있는 흐름입니다.',
      headlineEn: 'An active focus shaping your immediate choices',
      textEn: 'The elements required to direct your path are aligned and ready for active intention.',
    },
    hiddenMeaning: {
      headlineKo: '이미 내면에 준비된 스스로에 대한 확신',
      textKo: '상황이 복잡해 보이지만, 실제로는 당신이 이미 판단하고 조율할 수 있는 능력을 충분히 지니고 있음을 암시합니다.',
      headlineEn: 'Unacknowledged capability waiting for expression',
      textEn: 'Deep down, you hold more control and creative agency than current doubts suggest.',
    },
    carryForward: {
      headlineKo: '내 의도로 조율해나가는 당당한 태도',
      textKo: '외부의 반응에 휩쓸리기보다, 내가 가진 명확한 기준과 도구를 바탕으로 현실을 가다듬는 태도를 지니세요.',
      headlineEn: 'Active intention that turns thought into practice',
      textEn: 'Focus your attention on applying the tools you possess with calm, deliberate confidence.',
    },
  },
  high_priestess: {
    currentFlow: {
      headlineKo: '소음 뒤에 숨은 조용한 직관의 시간',
      textKo: '외부의 시끄러운 주장보다, 마음속 깊은 곳에서 울리는 고요한 감각이 훨씬 선명하게 작동하고 있는 흐름입니다.',
      headlineEn: 'Stillness that allows inner voice to emerge',
      textEn: 'Your current situation calls for quiet observation as subtle intuitive signals reveal themselves.',
    },
    hiddenMeaning: {
      headlineKo: '아직 밖으로 말하지 않은 내면의 진짜 아는 느낌',
      textKo: '말이나 논리로 다 설명하진 못해도, 당신은 이미 이 상황의 본질이 무엇인지 직관적으로 감지하고 있을 수 있습니다.',
      headlineEn: 'A deep inner knowing awaiting validation',
      textEn: 'A truth you already sense is staying quiet beneath the surface noise of daily concerns.',
    },
    carryForward: {
      headlineKo: '서두르지 않고 침묵 속에 답을 기다리는 지혜',
      textKo: '억지로 당장 대답을 내놓으려 하기보다, 조용히 마음을 가다듬고 직관이 완전히 숙성할 때까지 기다려보세요.',
      headlineEn: 'Patience that honors sub-surface wisdom',
      textEn: 'Carry forward the trust to wait quietly until your inner clarity ripens naturally.',
    },
  },
  empress: {
    currentFlow: {
      headlineKo: '따뜻한 돌봄과 성장의 기운',
      textKo: '상황이 조급함 대신 따뜻한 관심과 정성을 바라고 있으며, 풍요로운 결실을 향해 천천히 익어가는 흐름입니다.',
      headlineEn: 'A nurturing atmosphere fostering subtle growth',
      textEn: 'Current conditions thrive when approached with gentleness, patience, and caring attention.',
    },
    hiddenMeaning: {
      headlineKo: '스스로와 주변을 더 따뜻하게 품고 싶은 감정',
      textKo: '엄격한 통제보다는 나 자신과 타인에게 포용적인 공간을 제공하고 싶어 하는 마음이 바닥에 흐르고 있습니다.',
      headlineEn: 'A yearning for abundance and emotional comfort',
      textEn: 'Beneath tactical plans rests a desire for genuine harmony, self-care, and generative warmth.',
    },
    carryForward: {
      headlineKo: '나 자신을 아끼고 성장을 기다려주는 마음',
      textKo: '스스로를 혹독하게 채찍질하기보다, 씨앗이 꽃을 피우듯 정성을 다하며 자연스러운 성장을 지켜봐주세요.',
      headlineEn: 'Self-compassion that sustains ongoing expansion',
      textEn: 'Nurture your efforts with grace and allow time for meaningful progress to mature.',
    },
  },
  emperor: {
    currentFlow: {
      headlineKo: '질서와 명확한 기준이 요구되는 순간',
      textKo: '감정에 흔들리기보다 중심을 잡고, 튼튼한 경계와 구체적인 규칙을 바로 세워야 하는 현재의 흐름입니다.',
      headlineEn: 'A demand for clear structure and boundaries',
      textEn: 'Your situation naturally prompts a need for firm positioning, order, and established clarity.',
    },
    hiddenMeaning: {
      headlineKo: '불안을 막기 위해 기준을 세우려는 마음',
      textKo: '상황이 비틀어지지 않도록 스스로 경계를 명확히 하고, 안전한 틀을 만들고자 하는 욕구가 크게 작용하고 있습니다.',
      headlineEn: 'An underlying search for lasting stability',
      textEn: 'Underneath uncertainty lies a healthy motivation to create safe and firm structural limits.',
    },
    carryForward: {
      headlineKo: '흔들리지 않는 원칙과 나만의 경계',
      textKo: '타인의 시선에 부화뇌동하지 않고, 내가 지키고 싶은 존엄과 원칙을 바로 세우는 태도를 가져가세요.',
      headlineEn: 'Grounded authority rooted in self-respect',
      textEn: 'Maintain clear personal boundaries and lead your decisions with structured stability.',
    },
  },
  lovers: {
    currentFlow: {
      headlineKo: '진정성 있는 연결과 조화의 시점',
      textKo: '마음이 통하는 대화나 진솔한 가치관의 일치가 매우 중요하게 작용하는 현재 상황입니다.',
      headlineEn: 'A focal point of alignment and choice',
      textEn: 'Relationships and values call for openhearted alignment and authentic connection right now.',
    },
    hiddenMeaning: {
      headlineKo: '진심으로 받아들여지고 싶은 욕망',
      textKo: '겉으로 보이는 문제 너머에는, 내 진짜 모습을 이해받고 깊은 조화를 이루고 싶다는 바람이 들어 있습니다.',
      headlineEn: 'A deeper wish for mutual understanding',
      textEn: 'Hidden in this moment is a desire to feel truly seen and aligned in core intentions.',
    },
    carryForward: {
      headlineKo: '내 솔직한 가치에 부합하는 선택',
      textKo: '타협을 위한 건조한 타협보다, 내 가슴이 진정으로 수긍하는 올바른 연결과 선택을 가져가보세요.',
      headlineEn: 'Heart-centered choices that preserve integrity',
      textEn: 'Choose paths that honor your genuine values and foster respectful, transparent connections.',
    },
  },
  chariot: {
    currentFlow: {
      headlineKo: '목표를 향해 추진력을 발휘할 때',
      textKo: '망설임을 끝내고 내가 정한 방향을 향해 앞으로 나아가고 싶어 하는 강한 기운이 드러나는 흐름입니다.',
      headlineEn: 'Active momentum driving past hesitation',
      textEn: 'Energy is gathering to push forward and take constructive charge of conflicting elements.',
    },
    hiddenMeaning: {
      headlineKo: '상황을 내가 이끌고 싶은 통제 의지',
      textKo: '주변의 불확실함에 밀려다니지 않고, 스스로 고삐를 쥐고 주도권을 잡고 싶어 하는 마음이 작동하고 있습니다.',
      headlineEn: 'A drive to master disparate internal forces',
      textEn: 'Beneath the surface is a determination to harmonise opposing feelings into a singular push.',
    },
    carryForward: {
      headlineKo: '흔들림 없이 유지하는 방향성과 추진력',
      textKo: '작은 걸림돌에 마음을 쓰기보다, 처음에 정한 목표를 향해 조용하지만 단호하게 걸음을 이어가세요.',
      headlineEn: 'Steadfast determination focused on the path',
      textEn: 'Keep your eyes on the chosen direction, steering through distractions with resolute focus.',
    },
  },
  strength: {
    currentFlow: {
      headlineKo: '부드러운 인내와 내면의 조율',
      textKo: '강하게 부딪히기보다, 조용히 마음을 거두고 인내로 상황을 길들이는 부드러운 힘의 흐름입니다.',
      headlineEn: 'Soft power and patient self-mastery',
      textEn: 'Force is unnecessary; current conditions respond best to calm composure and gentle persistence.',
    },
    hiddenMeaning: {
      headlineKo: '감정의 소란을 차분히 누르고 있는 노력',
      textKo: '마음속에서 솟구치는 불안이나 화를 억지로 누르기보다, 스스로를 토닥이며 조율하고 있는 모습이 숨어 있습니다.',
      headlineEn: 'Inner resilience quietly managing turbulence',
      textEn: 'You possess a resilient emotional reserve that is quietly steadying your reactions.',
    },
    carryForward: {
      headlineKo: '자신을 믿는 조용하고 강인한 마음',
      textKo: '소리를 높이지 않아도 나를 지킬 수 있습니다. 유연하지만 쉽게 부러지지 않는 부드러운 힘을 간직하세요.',
      headlineEn: 'Gentle endurance that overcomes hardship',
      textEn: 'Rely on inner grace, calm breathing, and persistent gentleness as your greatest strength.',
    },
  },
  hermit: {
    currentFlow: {
      headlineKo: '내면으로 시선을 돌리는 성찰의 시간',
      textKo: '외부의 소음과 자극에서 한 걸음 떨어져, 조용히 나만의 등불을 밝히고 의미를 되짚어볼 시기입니다.',
      headlineEn: 'A reflective pause away from external noise',
      textEn: 'The present moment invites introspection, helping you seek clarity from within rather than without.',
    },
    hiddenMeaning: {
      headlineKo: '혼자만의 시간이 주는 안전함과 필요성',
      textKo: '남들의 조언이나 판단보다, 스스로 납득할 수 있는 깊은 지혜를 발견하고 싶어 하는 고요한 욕구가 있습니다.',
      headlineEn: 'A deep need for solitary self-discovery',
      textEn: 'Underneath current questions lies a quiet longing for space to contemplate without pressure.',
    },
    carryForward: {
      headlineKo: '내 등불을 따라 걷는 조용한 지혜',
      textKo: '남들과 속도를 비교하지 마세요. 내가 스스로 발견한 조용한 확신과 성찰을 내일의 기준으로 삼으세요.',
      headlineEn: 'Independent clarity learned from quiet study',
      textEn: 'Trust the quiet insight gathered in moments of solitude to guide your ongoing decisions.',
    },
  },
  wheel_of_fortune: {
    currentFlow: {
      headlineKo: '계절이 바뀌듯 다가오는 전환점',
      textKo: '정체되어 있던 기운이 움직이기 시작하며, 새로운 순환과 변곡점이 찾아오는 흐름입니다.',
      headlineEn: 'A shifting tide bringing a new chapter',
      textEn: 'Circumstances are entering a dynamic phase of natural transition and subtle reorientation.',
    },
    hiddenMeaning: {
      headlineKo: '변화에 대한 기대와 불안의 공존',
      textKo: '상황이 바뀔 것을 예감하면서도, 통제할 수 없는 흐름에 대한 미지의 감정이 바닥에 흘러가고 있습니다.',
      headlineEn: 'An awareness of natural life cycles',
      textEn: 'Implicit in your mind is the understanding that no phase, heavy or light, stays static forever.',
    },
    carryForward: {
      headlineKo: '흐름을 인정하고 유연하게 대처하는 태도',
      textKo: '바람을 억지로 막으려 하지 말고, 변화의 기운을 타고 내가 원하는 지점으로 조용히 노를 저어가세요.',
      headlineEn: 'Adaptability that rides the natural flow',
      textEn: 'Embrace incoming change with agility, knowing every turn offers a fresh perspective.',
    },
  },
  star: {
    currentFlow: {
      headlineKo: '마음에 스며드는 희망과 회복의 빛',
      textKo: '모든 먹구름 너머로 다시 조용한 영감과 시선의 넓어짐이 찾아오고 있는 가벼운 흐름입니다.',
      headlineEn: 'A beacon of renewal clearing the horizon',
      textEn: 'Hope and inspiring perspective are quietly returning, shedding light on a constructive path.',
    },
    hiddenMeaning: {
      headlineKo: '다시 잘해보고 싶은 순수한 기원',
      textKo: '상처나 낙담 아래에는 여전히 시들지 않은 희망과 아름다운 삶을 향한 열망이 숨 쉬고 있습니다.',
      headlineEn: 'An unquenched faith in positive resolution',
      textEn: 'Beneath momentary worry remains a durable spark of optimism waiting to be acknowledged.',
    },
    carryForward: {
      headlineKo: '멀리 보고 한 걸음씩 딛는 긍정성',
      textKo: '당장의 작은 걸림돌에 얽매이지 말고, 당신이 궁극적으로 바라는 희망의 등불을 바라보며 나아가세요.',
      headlineEn: 'Persevering hope anchored in personal peace',
      textEn: 'Keep your eyes on long-term renewal, moving forward with quiet optimism and steady steps.',
    },
  },
  moon: {
    currentFlow: {
      headlineKo: '아직 수면 위로 드러나지 않은 불확실함',
      textKo: '직관과 감정은 또렷하지만, 주변 여건의 윤곽이 완전히 밝혀지지 않아 유보적인 흐름입니다.',
      headlineEn: 'An evocative realm of intuition and shadow',
      textEn: 'Current dynamics feel layered and ambiguous, prompting intuition over literal logic.',
    },
    hiddenMeaning: {
      headlineKo: '확인되지 않은 가정에 대한 감정적 부풀림',
      textKo: '실제 일어난 사실보다, 마음속에서 상상하거나 두려워하는 관점이 더 크게 느껴지고 있을 수 있습니다.',
      headlineEn: 'Unspoken anxieties magnifying minor doubts',
      textEn: 'A portion of current weight stems from unverified assumptions rather than concrete reality.',
    },
    carryForward: {
      headlineKo: '서두르지 않고 수면이 가라앉길 기다림',
      textKo: '안개가 걷히기 전에 성급하게 결론짓지 마세요. 시간이 지나 윤곽이 드러날 때까지 마음을 보살피세요.',
      headlineEn: 'Mindful patience until clarity surfaces',
      textEn: 'Do not rush into final judgements while shadows linger; allow facts to naturally illuminate.',
    },
  },
  sun: {
    currentFlow: {
      headlineKo: '명료한 확신과 밝은 생명력',
      textKo: '모호함이 사라지고 당신의 솔직한 기준과 생기가 당당하게 드러나는 긍정적인 흐름입니다.',
      headlineEn: 'Clear warmth illuminating your true path',
      textEn: 'Joyful clarity and direct authenticity take center stage, dispelling lingering hesitations.',
    },
    hiddenMeaning: {
      headlineKo: '더 이상 숨지 않고 자신 있게 표현하려는 마음',
      textKo: '자신을 제약하던 틀을 깨고, 있는 그대로의 내 모습과 의도를 당당히 밝히고 싶은 욕구가 작용하고 있습니다.',
      headlineEn: 'An inner longing for open self-expression',
      textEn: 'Beneath doubts lies a desire to step fully into the light and embrace uncomplicated joy.',
    },
    carryForward: {
      headlineKo: '숨김없는 솔직함과 밝은 에너지',
      textKo: '복잡한 머뭇거림을 덜어내세요. 당신이 마주한 명확함을 바탕으로 밝고 순수한 걸음을 이어가세요.',
      headlineEn: 'Unfiltered clarity and confident warmth',
      textEn: 'Carry forward simple honesty, trusting the warmth of your genuine intentions to clear the way.',
    },
  },
};

// ============================================================================
// PREMIUM 3-CARD DEEP READING MOCK GENERATOR (Priority 6)
// ============================================================================
export async function generateMockPremiumReading(
  request: PremiumReadingRequest
): Promise<PremiumReadingResult> {
  // Simulate AI processing delay (850ms)
  await new Promise((resolve) => setTimeout(resolve, 850));

  const { entryType, storyText, ritualType, cards, language } = request;
  const isKo = language === 'ko';

  const c1 = cards[0];
  const c2 = cards[1];
  const c3 = cards[2];

  // Helper safe snippet
  const trimmedStory = storyText.trim();
  const maxLen = isKo ? 40 : 60;
  const storySnippet = trimmedStory
    ? `"${trimmedStory.slice(0, maxLen)}${trimmedStory.length > maxLen ? '...' : ''}"`
    : '';

  // Get Card Role interpretations from matrix
  const c1Data = CARD_ROLE_INTERPRETATIONS[c1.id]?.currentFlow || CARD_ROLE_INTERPRETATIONS.star.currentFlow;
  const c2Data = CARD_ROLE_INTERPRETATIONS[c2.id]?.hiddenMeaning || CARD_ROLE_INTERPRETATIONS.moon.hiddenMeaning;
  const c3Data = CARD_ROLE_INTERPRETATIONS[c3.id]?.carryForward || CARD_ROLE_INTERPRETATIONS.sun.carryForward;

  // 1. Card Interpretations Array
  const cardInterpretations: [
    PremiumCardInterpretation,
    PremiumCardInterpretation,
    PremiumCardInterpretation
  ] = [
    {
      role: 'currentFlow',
      roleTitle: isKo ? 'Card 1 · 지금의 흐름' : 'Card 1 · Current Flow',
      card: c1,
      headline: isKo ? c1Data.headlineKo : c1Data.headlineEn,
      interpretation: isKo
        ? `${storySnippet ? `${storySnippet}를 떠올릴 때, ` : ''}${c1.nameKo || c1.name}(${c1.name})는 ${c1Data.textKo}`
        : `${storySnippet ? `Reflecting on your note (${storySnippet}): ` : ''}${c1.name} indicates ${c1Data.textEn.toLowerCase()}`,
    },
    {
      role: 'hiddenMeaning',
      roleTitle: isKo ? 'Card 2 · 숨겨진 의미' : 'Card 2 · Hidden Meaning',
      card: c2,
      headline: isKo ? c2Data.headlineKo : c2Data.headlineEn,
      interpretation: isKo
        ? `겉으로 드러난 상황 너머, ${c2.nameKo || c2.name}(${c2.name})는 ${c2Data.textKo}`
        : `Beneath the surface layer, ${c2.name} points out ${c2Data.textEn.toLowerCase()}`,
    },
    {
      role: 'carryForward',
      roleTitle: isKo ? 'Card 3 · 앞으로 가져갈 메시지' : 'Card 3 · Message to Carry Forward',
      card: c3,
      headline: isKo ? c3Data.headlineKo : c3Data.headlineEn,
      interpretation: isKo
        ? `이 경험을 통해 ${c3.nameKo || c3.name}(${c3.name}) 카드가 전하는 길잡이는 ${c3Data.textKo}`
        : `Moving forward, ${c3.name} offers the orientation that ${c3Data.textEn.toLowerCase()}`,
    },
  ];

  // 2. Card Connection Narrative Synthesis (Card 1 -> Card 2 -> Card 3)
  const connectionHeadline = isKo
    ? `${c1.nameKo || c1.name}의 흐름에서 ${c2.nameKo || c2.name}의 통찰을 지나 ${c3.nameKo || c3.name}의 태도로 이어지는 이야기`
    : `How ${c1.name}, ${c2.name}, and ${c3.name} weave your story together`;

  const cardConnection = isKo
    ? `첫 번째 카드 [${c1.nameKo || c1.name}]에서 나타난 지금의 기운은 두 번째 카드 [${c2.nameKo || c2.name}]가 조명하는 숨겨진 감정적 깊이와 직면하게 됩니다. 나아가고 싶은 의지와 아직 남아 있는 불확실함이 교차하는 순간, 세 번째 카드 [${c3.nameKo || c3.name}]는 조급한 결론 대신 당신이 마음에 지녀야 할 현실적이고 균형 잡힌 기준을 제시해줍니다.`
    : `The initial energy reflected in [${c1.name}] meets the hidden underlying layer brought to light by [${c2.name}]. As the urge to move forward balances against subtle internal hesitations, your final card [${c3.name}] grounds the journey by proposing a clear, resilient orientation to carry forward.`;

  // 3. Multi-paragraph Deep Reading
  const deepReadingHeadline = isKo ? '당신의 이야기 심층 해석' : 'Your Deep Reading Synthesis';
  
  const p1 = isKo
    ? `작성하신 ${entryType} 관련 이야기(${storySnippet || '마음에 남아 있는 일'})를 천천히 들어다보면, 당장 모든 답을 얻어내려는 조급함보다 내면의 진짜 의도를 되찾는 과정이 중요함을 알 수 있습니다.`
    : `Looking deeply into your note on ${entryType.toLowerCase()} (${storySnippet || 'your shared situation'}), this moment asks not for forced answers, but for honoring the authentic truth within your process.`;

  const p2 = isKo
    ? `세 장의 카드는 현재의 상황이 단순한 정체나 우연이 아님을 보여줍니다. ${c1.nameKo || c1.name}가 드러내는 흐름 속에서 ${c2.nameKo || c2.name}의 메시지를 가만히 경청할 때, 외부 소음에 흔들리지 않는 중심이 바로 세워집니다.`
    : `The three archetypes reveal that current events are a meaningful phase of calibration. By pairing the flow of ${c1.name} with the subtle warning of ${c2.name}, your inner core stabilizes against external turbulence.`;

  const p3 = isKo
    ? `${ritualType === 'blessing' ? '좋은 기운을 마음에 담은 만큼, ' : ritualType === 'release' ? '무거운 감정을 한 걸음 내려놓은 만큼, ' : '차분하게 성찰을 거친 만큼, '}마지막 카드 [${c3.nameKo || c3.name}]가 안내하는 가치에 집중할 때 마음에 한층 더 선명한 자유로움이 찾아올 것입니다.`
    : `Having engaged in a moment of quiet reflection, carrying the anchor of [${c3.name}] will allow your choices to feel increasingly unburdened and clear.`;

  // 4. Emotional Pattern & Watch For
  const emotionalPattern = isKo
    ? '결과를 빠르게 확인하고 싶을수록 불안한 기분에 필요 이상의 의미를 부여하는 마음의 패턴이 나타날 수 있습니다.'
    : 'A subtle pattern may emerge where a desire for quick resolution amplifies sensitivity to minor uncertainties.';

  const watchFor = isKo
    ? '아직 명확히 확인되지 않은 타인의 반응이나 추측을 사실로 단정 지어 미리 걱정하는 점을 주의해보세요.'
    : 'Notice any tendency to treat unverified assumptions or emotional projections as settled real-world facts.';

  // 5. Practical Real-world Actions (3 steps)
  let actions: [string, string, string];
  if (isKo) {
    if (entryType === 'CONCERN' || entryType === 'UNEASY') {
      actions = [
        '오늘 내가 직접 영향을 줄 수 있는 요소와 그렇지 못한 요소를 종이에 나누어 적어보기',
        '이번 주 동안 아직 일어나지 않은 일에 대한 염려가 떠오를 때 3초간 깊게 숨 고르기',
        '중요한 결정을 내리기 전, 확인해야 할 객관적 사실 한 가지를 명확히 체크하기',
      ];
    } else if (entryType === 'RELATIONSHIP') {
      actions = [
        '상대방의 의도를 단정하기 전에 내가 관계에서 느끼는 솔직한 필요를 한 문장으로 적어보기',
        '대화를 나누기 전, 나 자신의 마음이 충분히 차분해질 수 있는 조용한 시간을 먼저 갖기',
        '상대와 나 사이의 건강한 경계를 존중하며 내 일상의 조화로운 리듬 지키기',
      ];
    } else {
      actions = [
        '마음에 떠오른 핵심 소망이나 감정을 수첩에 가볍게 적어보고 오늘 밤은 쉬어주기',
        '목표를 향해 오늘 5분 이내로 실행할 수 있는 가장 작은 현실적 행동 하나 실천하기',
        '결과에 대한 부담을 내려놓고 과정 자체가 주는 조용한 성찰의 가치 조명하기',
      ];
    }
  } else {
    actions = [
      'Write down factors within your direct control versus those that belong to time or others.',
      'Take three slow breaths whenever an unverified assumption creates emotional tension.',
      'Identify one small, 5-minute practical step that honors your true values today.',
    ];
  }

  // 6. Closing Message & Disclaimer
  const closingMessage = isKo
    ? `모든 대답을 당장 손에 쥐지 않아도, [${c3.nameKo || c3.name}]가 비추는 다음 한 걸음은 이미 당신 앞에 선명합니다.`
    : `You do not need every answer all at once; the direction illuminated by [${c3.name}] is enough for your next single step.`;

  const disclaimer = isKo
    ? '이 3장 심층 리딩은 타로의 원형적 상징을 활용한 자기 성찰 및 엔터테인먼트 경험입니다. 중요한 개인적 결정은 실제 상황과 정보도 함께 고려해주세요.'
    : 'This 3-card deep reading uses tarot symbolism for reflection and entertainment. For important life choices, consider real-world facts and circumstances as well.';

  const readingId = `premium-deep-reading-${Math.floor(100000 + getDeterministicHash(storyText + c1.id + c2.id + c3.id) % 900000)}`;

  return {
    readingId,
    cards: cardInterpretations,
    connectionHeadline,
    cardConnection,
    deepReadingHeadline,
    deepReadingParagraphs: [p1, p2, p3],
    emotionalPattern,
    watchFor,
    actions,
    closingMessage,
    disclaimer,
  };
}
