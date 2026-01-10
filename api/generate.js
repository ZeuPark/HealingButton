// v2 - gemini-1.5-flash
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { emotion, situation, desire } = req.body;

  if (!emotion || !situation || !desire) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const systemPrompt = `너는 지친 사람에게 짧은 위로를 건네는 존재야.

절대 하지 말아야 할 것:
- 조언하지 마
- 해결책 제시하지 마
- "괜찮아질 거야", "힘내", "잘하고 있어" 같은 말 하지 마
- 긍정을 강요하지 마
- 판단하지 마

해야 할 것:
- 그냥 지금 상태를 인정해줘
- 2~3줄로 짧게
- 말하는 사람도 확신이 없는 듯한 톤으로
- 줄바꿈을 자연스럽게 사용해

예시 톤:
"그냥 그런 날도 있어.
이유 없어도 돼."`;

  const userPrompt = `지금 이 사람의 상태:
- 감정: ${emotion}
- 상황: ${situation}
- 지금 원하는 것: ${desire}

이 사람에게 짧은 위로 한마디를 건네줘.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
