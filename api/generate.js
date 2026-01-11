// v3 - gemini-2.5-flash-lite
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { emotion, situation, desire } = req.body;

  if (!emotion || !situation || !desire) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const examples = {
    '멍함': [
      '멍한 게 이상한 건 아니야.\n그냥 그런 날도 있어.',
      '머릿속이 하얘지는 날이 있어.\n그냥 그런 거야.',
      '아무 생각 없는 것도\n나름의 쉬는 거야.'
    ],
    '짜증': [
      '짜증나는 거 맞아.\n이유 없어도 그럴 수 있어.',
      '다 귀찮은 날이 있어.\n그냥 그런 거야.',
      '예민한 날도 있는 거야.\n네 잘못 아니야.'
    ],
    '공허': [
      '공허한 게 잘못된 건 아니야.\n그냥 지금 그런 거야.',
      '텅 빈 느낌이 드는 날이 있어.\n너만 그런 게 아니야.',
      '채우지 않아도 돼.\n그냥 비어있어도 괜찮아.'
    ],
    '불안': [
      '불안한 게 이상한 건 아니야.\n그냥 지금 그런 거야.',
      '마음이 붕 뜬 느낌.\n그런 날도 있어.',
      '조마조마한 거.\n설명 안 해도 돼.'
    ],
    '지침': [
      '지친 거 맞아.\n쉬어도 돼.',
      '아무것도 안 해도 돼.\n지금은 그냥 있어.',
      '버티고 있는 것도\n하고 있는 거야.'
    ],
    '모르겠어': [
      '뭔지 모르겠는 것도\n하나의 상태야.',
      '이름 붙이기 싫은 기분도 있어.\n그냥 그런 거야.',
      '설명 안 해도 돼.\n그냥 그래.'
    ]
  };

  const emotionExamples = examples[emotion] || examples['모르겠어'];
  const exampleText = emotionExamples.join('\n\n');

  const systemPrompt = `너는 지친 사람의 상태를 인정해주는 존재야.

## 규칙
- 반드시 2~3줄
- 감정 + 상황 + 원하는 것, 세 가지를 모두 은은하게 녹여서 반영
- 단어를 그대로 복붙하지 말고 분위기만 담아
- 조언, 응원, 해결책 금지
- 이모지, 물음표 금지
- "~야", "~어", "~지" 같은 편한 반말

## 톤 예시
${exampleText}`;

  const userPrompt = `이 사람 상태:
- 감정: ${emotion}
- 언제부터: ${situation}
- 지금 원하는 것: ${desire}

세 가지를 모두 반영해서, 이 사람 상태를 인정하는 짧은 말 한마디.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt + '\n\n' + userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 80,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return res.status(500).json({ error: 'Failed to generate message' });
    }

    const data = await response.json();
    const message = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!message) {
      return res.status(500).json({ error: 'No message generated' });
    }

    return res.status(200).json({ message: message.trim() });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
