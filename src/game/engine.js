// 인생 게임 엔진: 캐릭터 생성, 기질(MBTI 축) 계산, 선택 적용, 운명 이벤트
import { FATES } from './fates'

// 기질 축: 값은 -100 ~ 100, 양수면 plus 글자(E/S/T/J), 음수면 minus 글자(I/N/F/P)
export const AXES = [
  { key: 'EI', plus: 'E', minus: 'I', plusName: '외향', minusName: '내향' },
  { key: 'SN', plus: 'S', minus: 'N', plusName: '감각', minusName: '직관' },
  { key: 'TF', plus: 'T', minus: 'F', plusName: '사고', minusName: '감정' },
  { key: 'JP', plus: 'J', minus: 'P', plusName: '판단', minusName: '인식' }
]

export const STATS = [
  { key: 'health', name: '건강', icon: '❤️' },
  { key: 'smarts', name: '지능', icon: '🧠' },
  { key: 'social', name: '사교', icon: '🤝' },
  { key: 'happiness', name: '행복', icon: '😊' },
  { key: 'wealth', name: '재산', icon: '💰' }
]

const NAMES = {
  male: ['민준', '서준', '도윤', '하준', '지호', '은우', '시우', '유찬', '태오', '건우'],
  female: ['서연', '하윤', '지우', '서아', '하은', '수아', '지안', '윤슬', '채원', '예린']
}
const SURNAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임']

const FAMILIES = [
  { key: 'poor', desc: '넉넉하지 않지만 서로 기대 사는 집', wealth: 20 },
  { key: 'normal', desc: '평범한 맞벌이 집', wealth: 45 },
  { key: 'normal2', desc: '할머니, 할아버지와 함께 사는 대가족', wealth: 40 },
  { key: 'rich', desc: '마당 넓은 집이 있는 여유로운 집', wealth: 75 }
]

export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
export const resolve = (x, c) => (typeof x === 'function' ? x(c) : x)

export function createCharacter() {
  const gender = Math.random() < 0.5 ? 'male' : 'female'
  const family = pick(FAMILIES)
  const temperament = {}
  for (const a of AXES) {
    temperament[a.key] = rand(-60, 60) || 1
  }
  const c = {
    name: pick(SURNAMES) + pick(NAMES[gender]),
    gender,
    family,
    age: 0,
    temperament,
    stats: {
      health: rand(55, 90),
      smarts: rand(30, 70),
      social: rand(30, 70),
      happiness: 60,
      wealth: family.wealth
    },
    education: null,
    job: null,
    flags: {},
    epitaph: null,
    alive: true
  }
  c.birthType = mbti(c)
  return c
}

export function mbti(c) {
  return AXES.map((a) => (c.temperament[a.key] >= 0 ? a.plus : a.minus)).join('')
}

// 특정 글자(E, N, F ...) 쪽으로 얼마나 기울었는지 -100 ~ 100
export function letterScore(c, letter) {
  const axis = AXES.find((a) => a.plus === letter || a.minus === letter)
  const v = c.temperament[axis.key]
  return letter === axis.plus ? v : -v
}

// 여러 글자에 대한 적합도 0 ~ 100
export function fitScore(c, letters) {
  if (!letters || !letters.length) return 50
  const sum = letters.reduce((s, l) => s + (letterScore(c, l) + 100) / 2, 0)
  return Math.round(sum / letters.length)
}

export function fitStars(score) {
  return clamp(Math.round(score / 20), 1, 5)
}

function applyEffects(c, effects) {
  const statDeltas = {}
  for (const [k, d] of Object.entries(effects.stats || {})) {
    const before = c.stats[k]
    c.stats[k] = clamp(before + d, 0, 100)
    if (c.stats[k] !== before) statDeltas[k] = c.stats[k] - before
  }
  for (const [k, d] of Object.entries(effects.axes || {})) {
    c.temperament[k] = clamp(c.temperament[k] + d, -100, 100)
  }
  return statDeltas
}

// 선택 결과 적용. 기질에 맞는 선택이면 행복 보너스, 반대면 기질이 조금 더 크게 흔들린다.
export function applyChoice(c, choice) {
  const typeBefore = mbti(c)
  const natural = choice.tags ? fitScore(c, choice.tags) >= 55 : null
  const effects = resolve(choice.effects, c) || {}
  const bonus = { stats: {}, axes: {} }
  if (natural === true) {
    bonus.stats.happiness = 3
  } else if (natural === false) {
    // 나답지 않은 선택은 경험이 되어 그 방향으로 기질을 한 번 더 민다
    for (const t of choice.tags) {
      const axis = AXES.find((a) => a.plus === t || a.minus === t)
      bonus.axes[axis.key] = t === axis.plus ? 4 : -4
    }
  }
  const statDeltas = applyEffects(c, effects)
  const bonusDeltas = applyEffects(c, bonus)
  for (const [k, d] of Object.entries(bonusDeltas)) statDeltas[k] = (statDeltas[k] || 0) + d
  if (choice.apply) choice.apply(c)
  return {
    text: resolve(choice.result, c),
    statDeltas,
    natural,
    typeBefore,
    typeAfter: mbti(c)
  }
}

// 다음 스테이지로 넘어가며 생기는 노화와 무작위 운명 이벤트
export function passTime(c, nextAge) {
  const prevAge = c.age
  c.age = nextAge
  if (nextAge >= 50) {
    const decline = rand(3, 8) + (c.stats.happiness < 30 ? 3 : 0)
    c.stats.health = clamp(c.stats.health - decline, 0, 100)
  }
  let fate = null
  if (Math.random() < 0.35) {
    const pool = FATES.filter((f) => prevAge <= f.maxAge && nextAge >= f.minAge && (!f.when || f.when(c)))
    if (pool.length) {
      const f = pick(pool)
      const statDeltas = applyEffects(c, { stats: resolve(f.stats, c) })
      fate = { title: f.title, text: resolve(f.text, c), statDeltas }
    }
  }
  if (c.stats.health <= 0) c.alive = false
  return fate
}

export function lifeSummary(c) {
  const s = c.stats
  const score = Math.round(s.happiness * 0.4 + s.health * 0.15 + s.social * 0.2 + s.wealth * 0.1 + s.smarts * 0.15)
  let title
  if (s.happiness >= 75) title = '웃음이 많았던 인생'
  else if (s.wealth >= 80) title = '성공을 거머쥔 인생'
  else if (s.social >= 75) title = '사람이 곁에 가득했던 인생'
  else if (s.smarts >= 80) title = '끝없이 배우던 인생'
  else if (s.happiness < 30) title = '쉽지 않았지만 버텨낸 인생'
  else title = '평범해서 소중했던 인생'
  return { score, title }
}
