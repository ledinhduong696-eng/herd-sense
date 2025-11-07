import { Question } from '../types';

export const surveyQuestions: Question[] = [
  {
    id: 'q1',
    type: 'multiple_choice',
    text: 'Chọn lĩnh vực bạn thấy mình gắn bó nhất:\n(Chọn 1 lĩnh vực gần gũi nhất với bạn)',
    options: [
      "🎓 Học tập / định hướng tương lai",
      "💬 Mạng xã hội và xu hướng online",
      "👕 Thời trang / phong cách cá nhân",
      "🤝 Tình bạn / nhóm bạn thân",
      "🎶 Giải trí / âm nhạc / thần tượng",
    ],
    category: 'awareness',
  },
  {
    id: 'q2',
    type: 'likert',
    text: 'Bạn có thường xuyên làm theo những gì bạn bè của bạn làm không?',
    category: 'conformity',
  },
  {
    id: 'q3',
    type: 'likert',
    text: 'Bạn có cảm thấy áp lực phải mặc đồ giống như bạn bè của bạn không?',
    category: 'conformity',
  },
  {
    id: 'q4',
    type: 'likert',
    text: 'Bạn có sợ bị cô lập nếu không làm theo nhóm không?',
    category: 'fear_of_exclusion',
  },
  {
    id: 'q5',
    type: 'likert',
    text: 'Bạn có thường thay đổi ý kiến của mình để phù hợp với đa số không?',
    category: 'conformity',
  },
  {
    id: 'q6',
    type: 'likert',
    text: 'Bạn có cảm thấy khó khăn khi nói "không" với bạn bè không?',
    category: 'peer_pressure',
  },
  {
    id: 'q7',
    type: 'multiple_choice',
    text: 'Khi có một xu hướng mới ở trường, bạn thường làm gì?',
    options: [
      'Tham gia ngay lập tức',
      'Đợi xem phản ứng của mọi người trước',
      'Chỉ tham gia nếu bạn thực sự thích',
      'Không quan tâm đến xu hướng',
    ],
    category: 'trend_following',
  },
  {
    id: 'q8',
    type: 'multiple_choice',
    text: 'Nếu nhóm bạn của bạn quyết định làm điều gì đó sai trái, bạn sẽ:',
    options: [
      'Tham gia vì không muốn bị xa lánh',
      'Im lặng nhưng không tham gia',
      'Nói rõ ý kiến và từ chối',
      'Cố gắng thuyết phục họ không làm',
    ],
    category: 'peer_pressure',
  },
  {
    id: 'q9',
    type: 'likert',
    text: 'Bạn có thường xuyên so sánh bản thân với người khác trên mạng xã hội không?',
    category: 'social_comparison',
  },
  {
    id: 'q10',
    type: 'likert',
    text: 'Bạn có cảm thấy lo lắng khi không được mời vào các nhóm chat của bạn bè không?',
    category: 'fear_of_exclusion',
  },
  {
    id: 'q11',
    type: 'multiple_choice',
    text: 'Khi đưa ra quyết định quan trọng, yếu tố nào ảnh hưởng đến bạn nhiều nhất?',
    options: [
      'Ý kiến của bạn bè',
      'Ý kiến của gia đình',
      'Suy nghĩ của chính bạn',
      'Những gì phổ biến trên mạng xã hội',
    ],
    category: 'decision_making',
  },
  {
    id: 'q12',
    type: 'open_ended',
    text: 'Hãy kể về một lần bạn cảm thấy áp lực phải làm theo nhóm. Bạn đã phản ứng như thế nào?',
    category: 'peer_pressure',
  },
  {
    id: 'q13',
    type: 'open_ended',
    text: 'Theo bạn, điều gì khiến học sinh dễ bị ảnh hưởng bởi hành vi bầy đàn?',
    category: 'awareness',
  },
];
