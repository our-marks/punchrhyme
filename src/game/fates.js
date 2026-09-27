// 선택과 무관하게 무작위로 찾아오는 운명 이벤트
export const FATES = [
  { title: '독감', minAge: 0, maxAge: 100, text: '독한 감기에 걸려 일주일을 앓아누웠다.', stats: { health: -8, happiness: -3 } },
  { title: '강아지', minAge: 6, maxAge: 80, text: '비 오는 날 떨고 있던 강아지를 데려왔다. 이름은 "콩이".', stats: { happiness: 10, health: 3 } },
  { title: '뜻밖의 인연', minAge: 10, maxAge: 90, text: '버스 옆자리 사람과 이야기가 너무 잘 통했다. 오래 갈 친구가 생겼다.', stats: { social: 8, happiness: 4 } },
  { title: '골절', minAge: 8, maxAge: 60, text: '계단에서 넘어져 깁스를 했다. 친구들이 깁스에 낙서를 해줬다.', stats: { health: -10, social: 2 } },
  { title: '복권 5등', minAge: 20, maxAge: 100, text: '편의점에서 산 복권이 5등에 당첨됐다. 5천 원이지만 기분은 최고.', stats: { happiness: 3, wealth: 1 } },
  { title: '주식 대박', minAge: 25, maxAge: 75, text: '잊고 있던 주식이 세 배가 되어 있었다!', stats: { wealth: 15, happiness: 5 } },
  { title: '주식 폭락', minAge: 25, maxAge: 75, text: '남들 따라 산 주식이 반토막 났다...', stats: { wealth: -15, happiness: -6 } },
  { title: '교통사고', minAge: 18, maxAge: 90, text: '신호 위반 차량에 부딪혔다. 크게 다치진 않았지만 한동안 재활이 필요했다.', stats: { health: -18, happiness: -5 } },
  { title: '유산', minAge: 30, maxAge: 80, text: '먼 친척이 작은 땅을 남겨주셨다.', stats: { wealth: 12 } },
  { title: '이사', minAge: 5, maxAge: 18, text: '부모님 사정으로 전학을 가게 됐다. 새 학교, 새 친구들.', stats: { social: -6, smarts: 2 } },
  { title: '인생 책', minAge: 12, maxAge: 90, text: '우연히 집어 든 책 한 권이 생각을 완전히 바꿔놓았다.', stats: { smarts: 8, happiness: 3 } },
  { title: '번아웃', minAge: 25, maxAge: 60, when: (c) => c.job, text: '어느 날 아침, 도저히 일어날 수가 없었다. 몸과 마음이 방전됐다.', stats: { health: -10, happiness: -10 } }
]
