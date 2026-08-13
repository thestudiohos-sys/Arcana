import { Language, ReadingResult, TarotCardData, TopicType, RitualType } from '../types/reading';
import { TAROT_CARDS_I18N } from '../config/tarotCards';
import { DICTIONARY } from '../config/dictionary';

// Simple deterministic hash to pick phrase variation without pure random instability
function getDeterministicVariationIndex(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % max;
}

interface GenerateReadingParams {
  language?: Language;
  topic: TopicType;
  customTopic?: string;
  userText?: string;
  ritualType?: RitualType;
  cardId: TarotCardData['id'];
}

export async function generateMockReading({
  language = 'en',
  topic,
  customTopic,
  userText = '',
  ritualType = 'reflection',
  cardId,
}: GenerateReadingParams): Promise<ReadingResult> {
  // Artificial delay (750ms) to simulate AI processing without calling any API (0 cost)
  await new Promise((resolve) => setTimeout(resolve, 750));

  const cards = TAROT_CARDS_I18N[language] || TAROT_CARDS_I18N.en;
  const card = cards.find((c) => c.id === cardId) || cards[0];
  const dict = DICTIONARY[language] || DICTIONARY.en;

  const topicLabel =
    topic === 'CUSTOM' && customTopic?.trim()
      ? customTopic.trim()
      : (dict.reading.topics as Record<string, string>)[topic] || topic;

  // Trimmed context snippet (40-80 chars safe preview)
  const trimmedUserText = userText.trim();
  const maxLen = language === 'ko' ? 40 : 60;
  const contextSnippet = trimmedUserText
    ? `"${trimmedUserText.slice(0, maxLen)}${trimmedUserText.length > maxLen ? '...' : ''}"`
    : '';

  const hashKey = `${topic}_${cardId}_${ritualType}_${trimmedUserText}`;
  const varIdx = getDeterministicVariationIndex(hashKey, 2);

  let headline = '';
  let currentSituation = '';
  let possibility = '';
  let signals = '';
  let action = '';
  let talismanMessage = '';

  if (language === 'ko') {
    // -------------------------------------------------------------
    // KO READINGS
    // -------------------------------------------------------------

    // 1. HEADLINES (Card + EntryType + RitualType)
    if (cardId === 'star') {
      if (ritualType === 'blessing') {
        headline = varIdx === 0
          ? `${topicLabel}을(를) 바라는 마음에 희망의 온기가 스며듭니다.`
          : `서두르지 않아도 잔잔한 가능성이 피어납니다.`;
      } else if (ritualType === 'release') {
        headline = varIdx === 0
          ? `무거운 짐을 내려놓을 때 마음에 가벼운 빛이 찾아옵니다.`
          : `불안의 시선을 거두고 조용한 회복을 마주하세요.`;
      } else {
        headline = varIdx === 0
          ? `${topicLabel}의 정답을 서두르기보다 가능성을 넓힐 순간.`
          : `시선을 조금 멀리 둘 때 비로소 선명해지는 방향.`;
      }
    } else if (cardId === 'moon') {
      if (ritualType === 'blessing') {
        headline = varIdx === 0
          ? `숨겨진 감정의 밑바탕에서 조용한 지혜가 싹틉니다.`
          : `선명하지 않아도 직관은 이미 바른 길을 바라봅니다.`;
      } else if (ritualType === 'release') {
        headline = varIdx === 0
          ? `불확실함을 억지로 조급한 결론으로 바꾸지 마세요.`
          : `지나가는 찝찝함에 필요 이상의 의미를 부여하지 마세요.`;
      } else {
        headline = varIdx === 0
          ? `${topicLabel}의 성급한 판단보다 조용한 관찰이 필요한 때.`
          : `모든 것이 당장 밝혀질 필요는 없습니다.`;
      }
    } else {
      // SUN
      if (ritualType === 'blessing') {
        headline = varIdx === 0
          ? `${topicLabel}에 대한 당신의 소망이 선명한 확신이 됩니다.`
          : `밝은 에너지와 명료한 의식이 앞으로 나아갑니다.`;
      } else if (ritualType === 'release') {
        headline = varIdx === 0
          ? `답답했던 그늘이 걷히고 솔직한 명료함이 찾아옵니다.`
          : `복잡함을 덜어내면 이미 알고 있는 답이 보입니다.`;
      } else {
        headline = varIdx === 0
          ? `${topicLabel}을(를) 바라보는 마음에 선명한 기준이 필요합니다.`
          : `당신 안의 자신감을 다시 마주할 시간입니다.`;
      }
    }

    // 2. CURRENT SITUATION (Layer A: Card base + EntryType context)
    const contextPrefix = contextSnippet
      ? `작성해주신 이야기(${contextSnippet})를 바탕으로 바라볼 때, `
      : '';

    if (cardId === 'star') {
      currentSituation = `${contextPrefix}별(The Star) 카드는 지금 ${topicLabel} 영역에서 모든 답이 당장 손에 잡히지 않더라도, 내면에 조용한 회복의 씨앗이 자라고 있음을 보여줍니다.`;
    } else if (cardId === 'moon') {
      currentSituation = `${contextPrefix}달(The Moon) 카드는 ${topicLabel}에 대해 감정과 직관은 강하지만, 아직 모든 상황이 수면 위로 명확히 드러나지 않았음을 뜻합니다.`;
    } else {
      currentSituation = `${contextPrefix}태양(The Sun) 카드는 ${topicLabel}에 관해 억눌려 있던 불안을 거두고, 당신의 솔직한 기준과 확신을 일깨워주는 상징입니다.`;
    }

    // 3. PERSONALIZED READING / POSSIBILITY (Layer B & C: RitualType tone + EntryType perspective)
    if (topic === 'DREAM') {
      if (ritualType === 'blessing') {
        possibility = '이 꿈은 단순한 상상이 아니라, 마음속 긍정적인 기대와 바라는 에너지의 반영으로 바라볼 수 있습니다.';
      } else if (ritualType === 'release') {
        possibility = '꿈에 남은 불편한 잔상은 미래의 사건을 예고하는 것이 아니라, 마음에 쌓인 긴장을 풀고 휴식이 필요함을 일깨워줍니다.';
      } else {
        possibility = '꿈의 강렬함에 이끌리기보다, 깨어난 후 마음에 남은 핵심 감정이 무엇이었는지 조용히 짚어보는 계기로 삼으세요.';
      }
    } else if (topic === 'RELATIONSHIP') {
      if (ritualType === 'release') {
        possibility = '상대의 속마음을 섣불리 단정하기보다, 지금 내가 느낀 서운함이나 불안의 거리를 한 단계 넓히는 것이 도움이 됩니다.';
      } else {
        possibility = '관계에서의 확신은 상대를 조종하는 것이 아니라, 내가 원하는 경계와 소통의 의도를 선명히 하는 데서 시작됩니다.';
      }
    } else if (topic === 'UNEASY') {
      possibility = '최근 발생한 찝찝한 상황은 앞으로 나쁜 일이 생길 신호가 아니라, 잠시 속도를 줄이고 나 자신을 보살피라는 상징적 쉼표입니다.';
    } else if (topic === 'WISH') {
      possibility = '바라는 바가 클수록 결과를 조급해하지 말고, 오늘 당장 실천할 수 있는 작은 일부터 가볍게 시작해보세요.';
    } else {
      // CONCERN & CUSTOM
      possibility = '고민의 답을 한 번에 내려 하기보다, 지금 통제할 수 있는 일과 통제할 수 없는 일을 분리해서 바라보는 지혜가 필요합니다.';
    }

    // 4. SIGNALS (Noticing patterns)
    if (cardId === 'star') {
      signals = '일상에서 우연히 마주치는 따뜻한 한 문장, 마음을 누그러뜨리는 조용한 순간에 시선을 두어보세요.';
    } else if (cardId === 'moon') {
      signals = '급하게 결론을 촉구하는 주변의 목소리보다, 스스로의 내면이 느끼는 조용한 감정 변화를 가만히 관찰해보세요.';
    } else {
      signals = '생각만 하던 것을 솔직하게 표현할 수 있는 기회나, 확실한 자신감을 주는 작은 계기에 주목해보세요.';
    }

    // 5. SMALL ACTION (Layer E)
    if (topic === 'DREAM') {
      action = '꿈에서 가장 기억에 남는 장면이나 감정을 수첩에 한 줄로만 적고, 오늘 하루는 가볍게 털어내 보세요.';
    } else if (topic === 'CONCERN') {
      action = '현재 고민에 영향을 주는 핵심 요소 3가지를 종이에 적어보고, 내가 직접 바꿀 수 있는 항목 1개만 골라보세요.';
    } else if (topic === 'WISH') {
      action = '마음속 소망을 향해 오늘 당장 5분 안에 할 수 있는 가장 작은 행동 1가지를 정해 실행해보세요.';
    } else if (topic === 'RELATIONSHIP') {
      action = '상대에게 대답을 요구하기 전에, 내가 관계에서 진정으로 원하는 바를 한 문장으로 정리해보세요.';
    } else if (topic === 'UNEASY') {
      action = '지금 실제로 확인된 "객관적 사실"과 머릿속의 "불안한 기분"을 구분하여 차분하게 적어보세요.';
    } else {
      action = '오늘 하루 마음에 가장 강하게 머문 질문 하나를 적어보고, 서두르지 않는 밤을 가져보세요.';
    }

    // 6. CLOSING MESSAGE (Layer F)
    if (cardId === 'star') {
      talismanMessage = '모든 답이 한 번에 보이지 않아도, 다음에 디딜 한 걸음은 충분히 선명합니다.';
    } else if (cardId === 'moon') {
      talismanMessage = '불확실함은 나쁜 신호가 아니라, 마음의 직관을 가만히 들여다볼 시간이 필요하다는 뜻입니다.';
    } else {
      talismanMessage = '명료함은 밖에서 구하는 것이 아니라, 당신이 이미 아는 답을 마주할 때 시작됩니다.';
    }

  } else {
    // -------------------------------------------------------------
    // EN READINGS
    // -------------------------------------------------------------

    // 1. HEADLINES (Card + EntryType + RitualType)
    if (cardId === 'star') {
      if (ritualType === 'blessing') {
        headline = varIdx === 0
          ? `A quiet warmth of hope settles into your focus on ${topicLabel.toLowerCase()}.`
          : `Without any rush, a gentle possibility begins to open.`;
      } else if (ritualType === 'release') {
        headline = varIdx === 0
          ? `Setting down heavy thoughts brings a lighter horizon into view.`
          : `Turn away from fear and step into quiet emotional recovery.`;
      } else {
        headline = varIdx === 0
          ? `A time to broaden your perspective rather than forcing an immediate answer.`
          : `Direction becomes clear when you give yourself room to breathe.`;
      }
    } else if (cardId === 'moon') {
      if (ritualType === 'blessing') {
        headline = varIdx === 0
          ? `Quiet intuitive wisdom stirs beneath the surface of your thoughts.`
          : `Even without full visibility, intuition points toward genuine truth.`;
      } else if (ritualType === 'release') {
        headline = varIdx === 0
          ? `Do not force uncertainty into a hasty conclusion.`
          : `Allow passing uneasy feelings to settle without adding weight.`;
      } else {
        headline = varIdx === 0
          ? `A moment for gentle observation over immediate judgement regarding ${topicLabel.toLowerCase()}.`
          : `Not everything needs to reveal itself all at once.`;
      }
    } else {
      // SUN
      if (ritualType === 'blessing') {
        headline = varIdx === 0
          ? `Your earnest wish regarding ${topicLabel.toLowerCase()} illuminates a clear boundary.`
          : `Vital energy and transparent clarity guide your next step.`;
      } else if (ritualType === 'release') {
        headline = varIdx === 0
          ? `Shadows dissolve as honest clarity takes center stage.`
          : `Simplifying the situation unveils the answer you already knew.`;
      } else {
        headline = varIdx === 0
          ? `A moment to establish a clearer personal standard for ${topicLabel.toLowerCase()}.`
          : `Reconnect with the authentic confidence quiet within you.`;
      }
    }

    // 2. CURRENT SITUATION (Layer A: Card base + EntryType context)
    const contextPrefix = contextSnippet
      ? `Reflecting on what you shared (${contextSnippet}): `
      : '';

    if (cardId === 'star') {
      currentSituation = `${contextPrefix}The Star signifies that even if immediate outcomes remain unconfirmed in your ${topicLabel.toLowerCase()} area, a quiet renewal is steadily taking root within.`;
    } else if (cardId === 'moon') {
      currentSituation = `${contextPrefix}The Moon suggests that while intuition and emotion are strong regarding ${topicLabel.toLowerCase()}, key aspects are still unfolding beneath the surface.`;
    } else {
      currentSituation = `${contextPrefix}The Sun reveals a moment where doubt gives way to clarity, inspiring you to honor your authentic voice in ${topicLabel.toLowerCase()}.`;
    }

    // 3. PERSONALIZED READING / POSSIBILITY (Layer B & C: RitualType tone + EntryType perspective)
    if (topic === 'DREAM') {
      if (ritualType === 'blessing') {
        possibility = 'Rather than predicting literal events, this dream reflects your mind embracing uplifting possibilities and quiet hope.';
      } else if (ritualType === 'release') {
        possibility = 'Unsettling dream imagery is not a sign of bad fortune, but a symbolic prompt for your nervous system to rest and release tension.';
      } else {
        possibility = 'Instead of analyzing every detail, notice the primary feeling that remained when you woke and acknowledge it gently.';
      }
    } else if (topic === 'RELATIONSHIP') {
      if (ritualType === 'release') {
        possibility = 'Rather than guessing another person’s hidden thoughts, create gentle emotional space and focus on your own sense of grounding.';
      } else {
        possibility = 'Clarity in relationships comes from understanding your own boundaries and desires rather than seeking to control outcomes.';
      }
    } else if (topic === 'UNEASY') {
      possibility = 'Passing moments of discomfort are not warnings of future misfortunate, but a gentle reminder to slow down and check in with yourself.';
    } else if (topic === 'WISH') {
      possibility = 'Allow your hope to inspire small, grounded actions today rather than demanding immediate finality.';
    } else {
      // CONCERN & CUSTOM
      possibility = 'Separate what is genuinely within your control right now from what belongs to time or circumstances beyond immediate reach.';
    }

    // 4. SIGNALS (Noticing patterns)
    if (cardId === 'star') {
      signals = 'Notice subtle, encouraging phrases in everyday life and moments that bring unexpected emotional stillness.';
    } else if (cardId === 'moon') {
      signals = 'Observe subtle shifts in your intuition without feeling pressured by external demands for quick answers.';
    } else {
      signals = 'Look for opportunities to express your truth openly and moments that restore genuine inner energy.';
    }

    // 5. SMALL ACTION (Layer E)
    if (topic === 'DREAM') {
      action = 'Write down the single main emotion from your dream in one sentence, then let the rest go for today.';
    } else if (topic === 'CONCERN') {
      action = 'List 3 factors influencing your current situation and circle the single one you can directly influence today.';
    } else if (topic === 'WISH') {
      action = 'Choose one tiny action taking under 5 minutes that aligns with what you hope to cultivate.';
    } else if (topic === 'RELATIONSHIP') {
      action = 'Before seeking answers from others, state in one clear sentence what you need to feel peaceful.';
    } else if (topic === 'UNEASY') {
      action = 'Write down verified facts in one column and your worries in another to separate reality from apprehension.';
    } else {
      action = 'Identify the main question staying with you tonight and allow yourself to leave it unanswered for now.';
    }

    // 6. CLOSING MESSAGE (Layer F)
    if (cardId === 'star') {
      talismanMessage = 'Even when the entire horizon is not yet visible, the next single step remains clear.';
    } else if (cardId === 'moon') {
      talismanMessage = 'Uncertainty is not a negative sign; it is an invitation to listen quietly to your intuition.';
    } else {
      talismanMessage = 'Clarity begins not by searching outside, but by standing firm in what you already know.';
    }
  }

  const readingId = `mock-reading-${Math.floor(100000 + Math.random() * 900000)}`;
  const disclaimer =
    language === 'ko'
      ? '이 리딩은 개인적 성찰과 마음 정리를 돕는 콘텐츠입니다. 미래의 특정 결과를 단정하거나 전문적인 법률·의학·재정적 조언을 대체하지 않습니다.'
      : 'This reading is crafted for personal reflection and emotional grounding. It does not predict guaranteed future outcomes or substitute professional advice.';

  return {
    readingId,
    selectedCard: card,
    headline,
    currentSituation,
    possibility,
    signals,
    action,
    talismanMessage,
    disclaimer,
  };
}
