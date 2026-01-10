export const steps = [
  {
    id: 'emotion',
    question: '지금 무슨 느낌이야?',
    options: [
      { id: 'blank', label: '멍함' },
      { id: 'irritated', label: '짜증' },
      { id: 'empty', label: '공허' },
      { id: 'anxious', label: '불안' },
      { id: 'tired', label: '지침' },
      { id: 'unknown', label: '모르겠어' },
    ],
  },
  {
    id: 'situation',
    question: '언제부터 그랬어?',
    options: [
      { id: 'today', label: '오늘 갑자기' },
      { id: 'few-days', label: '며칠 됐어' },
      { id: 'long', label: '꽤 오래됐어' },
      { id: 'no-reason', label: '이유 없이' },
      { id: 'dont-know', label: '기억 안 나' },
    ],
  },
  {
    id: 'desire',
    question: '지금 뭐 하고 싶어?',
    options: [
      { id: 'stay-still', label: '그냥 가만히' },
      { id: 'acknowledged', label: '인정받고 싶어' },
      { id: 'disappear', label: '사라지고 싶어' },
      { id: 'cry', label: '울고 싶어' },
      { id: 'nothing', label: '아무것도' },
      { id: 'dont-know', label: '모르겠어' },
    ],
  },
];
