// 진학 경로와 직업. locked(c)가 문자열을 반환하면 그 이유로 선택 불가.
export const EDUCATIONS = [
  {
    key: 'medical', label: '의대·약대 진학', tags: ['S', 'J'],
    locked: (c) => (c.stats.smarts < 80 ? '지능 80 이상 필요' : null),
    effects: { stats: { smarts: 8, happiness: -4, social: -3 } },
    result: '밤새 해부학 책을 붙잡는 6년이 시작됐다.'
  },
  {
    key: 'science', label: '4년제 이공계 진학', tags: ['N', 'T'],
    locked: (c) => (c.stats.smarts < 55 ? '지능 55 이상 필요' : null),
    effects: { stats: { smarts: 8 } },
    result: '실험 보고서와 과제의 늪. 그래도 풀리는 순간의 짜릿함이 있다.'
  },
  {
    key: 'humanities', label: '4년제 인문·사회계 진학', tags: ['N', 'F'],
    locked: (c) => (c.stats.smarts < 45 ? '지능 45 이상 필요' : null),
    effects: { stats: { smarts: 5, social: 5 } },
    result: '토론과 발표, 끝없는 레포트. 세상을 보는 눈이 넓어졌다.'
  },
  {
    key: 'arts', label: '예체능 대학 진학', tags: ['P', 'F'],
    locked: (c) => (c.stats.wealth < 30 ? '레슨비 부담 (재산 30 이상 필요)' : null),
    effects: { stats: { happiness: 8, wealth: -8 } },
    result: '작업실에서 밤을 새우는 날들. 좋아하는 걸 하니 힘든 줄 모른다.'
  },
  {
    key: 'college', label: '전문대·직업학교', tags: ['S', 'T'],
    effects: { stats: { smarts: 3, wealth: 3 } },
    result: '실습 위주의 수업. 손에 익는 기술이 늘어간다.'
  },
  {
    key: 'work', label: '바로 사회로 뛰어들기', tags: ['S', 'P'],
    effects: { stats: { wealth: 10, smarts: -2, social: 4 } },
    result: '또래보다 빨리 월급을 받기 시작했다. 사회는 생각보다 냉정하고, 생각보다 재밌다.'
  },
  {
    key: 'retry', label: '재수하기', tags: ['J', 'I'],
    effects: { stats: { smarts: 14, happiness: -8, social: -4 } },
    result: '독서실의 1년. 성적은 올랐지만 친구들의 대학 생활 사진이 아프다.',
    retry: true
  }
]

export const EDU_LABEL = Object.fromEntries(EDUCATIONS.map((e) => [e.key, e.label.replace(' 진학', '')]))

// edu: 필요한 학력 (없으면 누구나), tags: 잘 맞는 기질
export const JOBS = [
  { key: 'doctor', label: '의사', edu: ['medical'], tags: ['S', 'T', 'J'], wealth: 30, happiness: 0 },
  { key: 'pharmacist', label: '약사', edu: ['medical'], tags: ['I', 'S', 'J'], wealth: 22, happiness: 3 },
  { key: 'developer', label: '개발자', edu: ['science'], tags: ['I', 'N', 'T'], wealth: 20, happiness: 2 },
  { key: 'researcher', label: '연구원', edu: ['science', 'medical'], tags: ['I', 'N', 'T', 'J'], wealth: 14, happiness: 4 },
  { key: 'engineer', label: '엔지니어', edu: ['science', 'college'], tags: ['S', 'T', 'J'], wealth: 16, happiness: 2 },
  { key: 'nurse', label: '간호사', edu: ['college', 'science'], tags: ['S', 'F', 'J'], wealth: 12, happiness: 2 },
  { key: 'teacher', label: '교사', edu: ['humanities', 'science', 'arts'], tags: ['E', 'S', 'F', 'J'], wealth: 10, happiness: 5 },
  { key: 'civil', label: '공무원', edu: ['humanities', 'science', 'college'], tags: ['S', 'J'], wealth: 10, happiness: 2 },
  { key: 'marketer', label: '마케터·기획자', edu: ['humanities', 'arts'], tags: ['E', 'N'], wealth: 14, happiness: 3 },
  { key: 'writer', label: '작가·기자', edu: ['humanities', 'arts'], tags: ['I', 'N', 'F', 'P'], wealth: 4, happiness: 8 },
  { key: 'designer', label: '디자이너·아티스트', edu: ['arts'], tags: ['N', 'F', 'P'], wealth: 6, happiness: 8 },
  { key: 'chef', label: '요리사', edu: ['college', 'work'], tags: ['S', 'P'], wealth: 8, happiness: 6 },
  { key: 'sales', label: '영업직', tags: ['E', 'T'], wealth: 14, happiness: 0 },
  { key: 'creator', label: '크리에이터', tags: ['E', 'N', 'P'], wealth: 5, happiness: 8, gamble: true },
  { key: 'founder', label: '창업', tags: ['E', 'N', 'T'], wealth: 0, happiness: 4, gamble: true },
  { key: 'office', label: '회사원', tags: [], wealth: 10, happiness: 0 }
]
