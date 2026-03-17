import type { Player, RoleType, RoundResult } from './types'

// 创造力乘数基数
const CREATIVITY_MULTIPLIER = 1.05

// 计算某角色在指定精力上限时的分数/创造力分配
function getAllocation(role: RoleType, n: number): { score: number; creativity: number } {
  switch (role) {
    case 'juanwang':
      return { score: n, creativity: 0 }
    case 'normal':
      return { score: Math.max(0, n - 2), creativity: 0 }
    case 'chuang-ge':
      return { score: 1, creativity: Math.max(0, n - 3) }
    case 'top-chuang':
      return { score: 2, creativity: Math.max(0, n - 2) }
    case 'balanced': {
      const half = Math.floor((n - 2) / 2)
      return { score: half, creativity: half }
    }
    case 'balanced-king': {
      const half = Math.floor(n / 2)
      return { score: half, creativity: half }
    }
    case 'bailan':
      return { score: 1, creativity: 1 }
    case 'follow':
    case 'super-follow':
      // 这两个需要动态计算，先返回占位
      return { score: 0, creativity: 0 }
    default:
      return { score: 0, creativity: 0 }
  }
}

// 计算跟风类角色的分配（基于全场非跟风者的平均分数精力）
function getFollowAllocation(
  role: RoleType,
  n: number,
  otherScoreEnergy: number
): { score: number; creativity: number } {
  if (role === 'follow') {
    // 跟风：平均值用于分数，剩余≥2用于创造力
    const remaining = Math.max(0, n - otherScoreEnergy)
    if (remaining >= 2) {
      return { score: otherScoreEnergy, creativity: remaining }
    } else {
      return { score: n, creativity: 0 }
    }
  } else {
    // 超级跟风：平均值用于分数，剩余全部创造力
    return { score: otherScoreEnergy, creativity: Math.max(0, n - otherScoreEnergy) }
  }
}

// 创建玩家
function createPlayer(id: string, role: RoleType, energy: number): Player {
  return {
    id,
    role,
    totalScore: 0,
    examAbility: 0,
    creativity: 0,
    examAbilityPerRound: 0,
    creativityPerRound: 0,
    energy,
  }
}

// 运行一轮模拟
function runRound(players: Player[], n: number): Player[] {
  // 第一步：计算除了跟风和超级跟风之外的人的平均"用于分数的精力"
  const nonFollowPlayers = players.filter(p => p.role !== 'follow' && p.role !== 'super-follow')
  let totalScoreEnergy = 0
  for (const p of nonFollowPlayers) {
    const alloc = getAllocation(p.role, n)
    totalScoreEnergy += alloc.score
  }
  const avgScoreEnergy = nonFollowPlayers.length > 0
    ? totalScoreEnergy / nonFollowPlayers.length
    : 0

  // 第二步：每个玩家计算分配并更新
  return players.map(p => {
    let allocation: { score: number; creativity: number }

    if (p.role === 'follow' || p.role === 'super-follow') {
      allocation = getFollowAllocation(p.role, n, avgScoreEnergy)
    } else {
      allocation = getAllocation(p.role, n)
    }

    // 基础分数 = 用于分数的精力（应试能力）
    const examAbility = allocation.score

    // 实际分数 = 基础分数 × 1.05 ^ 总创造力（创新能力）
    const multiplier = Math.pow(CREATIVITY_MULTIPLIER, p.creativity)
    const actualScore = examAbility * multiplier

    // 新的创造力 = 旧的创造力 + 当轮获得的创造力
    const newCreativity = p.creativity + allocation.creativity

    return {
      ...p,
      examAbilityPerRound: examAbility,
      // 累计应试能力 = 旧 + 当轮
      examAbility: p.examAbility + examAbility,
      // 总分 = 旧总分 + 当轮实际分数
      totalScore: p.totalScore + actualScore,
      // 累计创新能力 = 旧 + 当轮
      creativity: newCreativity,
      // 当轮获得的创新能力
      creativityPerRound: allocation.creativity,
      // 当前精力上限
      energy: n,
    }
  })
}

// 检查本轮所有玩家的分数精力是否都 < 2
function isAllScoreEnergyBelow2(players: Player[], n: number): boolean {
  for (const p of players) {
    let scoreEnergy: number
    if (p.role === 'follow' || p.role === 'super-follow') {
      const nonFollowPlayers = players.filter(pp => pp.role !== 'follow' && pp.role !== 'super-follow')
      let total = 0
      for (const pp of nonFollowPlayers) {
        const alloc = getAllocation(pp.role, n)
        total += alloc.score
      }
      const avg = nonFollowPlayers.length > 0 ? total / nonFollowPlayers.length : 0
      const alloc = getFollowAllocation(p.role, n, avg)
      scoreEnergy = alloc.score
    } else {
      const alloc = getAllocation(p.role, n)
      scoreEnergy = alloc.score
    }

    if (scoreEnergy >= 2) {
      return false
    }
  }
  return true
}

// 主模拟函数
export function runSimulation(
  roles: RoleType[],
  rounds: number,
  initialEnergy: number = 10
): RoundResult[] {
  if (roles.length === 0) return []

  // 初始化玩家
  let players: Player[] = roles.map((role, i) =>
    createPlayer(`player-${i}`, role, initialEnergy)
  )

  const results: RoundResult[] = []
  let consecutiveBelow2 = 0
  let currentEnergy = initialEnergy

  for (let r = 1; r <= rounds; r++) {
    // 运行一轮
    players = runRound(players, currentEnergy)

    // 检查是否需要降低上限
    if (isAllScoreEnergyBelow2(players, currentEnergy)) {
      consecutiveBelow2++
      if (consecutiveBelow2 >= 5) {
        currentEnergy = Math.max(1, currentEnergy - 1)
        consecutiveBelow2 = 0
      }
    } else {
      consecutiveBelow2 = 0
    }

    results.push({
      round: r,
      players: players.map(p => ({ ...p })),
      energy: currentEnergy,
    })
  }

  return results
}

// 获取最终排名
export function getFinalRanking(results: RoundResult[]): Player[] {
  if (results.length === 0) return []
  const finalRound = results[results.length - 1]
  return [...finalRound.players].sort((a, b) => b.totalScore - a.totalScore)
}

// 获取每轮的分数变化（用于图表）
export function getScoreHistory(results: RoundResult[]): { round: number; scores: Record<string, number> }[] {
  return results.map(r => ({
    round: r.round,
    scores: Object.fromEntries(r.players.map(p => [p.id, p.totalScore]))
  }))
}
