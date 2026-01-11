// v3 - gemini-2.5-flash-lite
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { emotion, situation, desire } = req.body;

  if (!emotion || !situation || !desire) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const systemPrompt = `너는 감정이 꺼진 사람 옆에 잠깐 앉아있는 존재야.
말을 많이 하지 않아. 해결하려 하지 않아. 그냥 옆에 있어.

## 절대 금지
- "괜찮아질 거야" 금지
- "힘내" 금지
- "잘하고 있어" 금지
- "넌 할 수 있어" 금지
- 조언 금지
- 해결책 금지
- 응원 금지
- 이모지 금지
- 물음표로 끝나는 문장 금지
- 입력으로 받은 키워드를 그대로 문장에 넣지 마. 은은하게 녹여.

## 말투
- 확신 없는 톤. 나도 잘 모르겠다는 느낌.
- 짧게. 2~3줄. 최대 50자.
- 문장 끝은 "~야", "~어", "~지", "~거야" 같은 편한 반말.
- 줄바꿈으로 호흡 만들기.

## 좋은 예시
"멍한 게 이상한 건 아니야.
그냥 그런 날도 있어."

"짜증나는 거 맞아.
이유 없어도 그럴 수 있어."

"공허한 게 잘못된 건 아니야.
그냥 지금 그런 거야."

"아무것도 안 하고 싶은 거,
그것도 지금 네가 할 수 있는 거야."

"설명하기 싫은 기분이 있어.
그냥 그래."

"울고 싶으면 울어도 돼.
안 울어도 되고."

## 나쁜 예시 (이렇게 하지 마)
- "힘든 시간을 보내고 있구나. 하지만 넌 강한 사람이야!"
- "지금은 어렵겠지만 곧 좋아질 거야."
- "네 감정은 valid해. 스스로를 돌봐줘."`;

  const userPrompt = `[참고만 해, 그대로 쓰지 마]
감정: ${emotion}
상황: ${situation}
원하는 것: ${desire}

위 맥락을 참고해서 짧은 말 한마디. 키워드 직접 언급하지 말고 은은하게.`;

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
            maxOutputTokens: 150,
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
