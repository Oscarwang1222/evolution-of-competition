import type { Player, RoleType, RoundResult } from './types'

// ============================================================
// 新版总分公式（破局版本）
// 
// 前几章（1-4章）：只看应试分数排名
// 第五章引入新公式：
//   总分 = 应试基础分 + 创造力 × (系数 + 1)
//   系数 = min(应试分 / 100, 3)
// 
// 关键设计：
// - 纯卷王：应试高所以系数高，但创造力=0无法乘法加成
// - 纯创哥：创造力高但应试太低（≈50），系数只有0.5，总分上限被锁死
// - 均衡发展：应试≈200（系数=2）+ 创造力≈200，总分指数爆发
// ============================================================

const EXAM_COEFFICIENT = 100  // 每100分应试提升一级系数

// 计算总分（新公式）
// totalScore = examAbility + creativity × (coefficient + 1)
// 系数 = min(exam / 100, 3)
function calculateTotalScore(examAbility: number, creativity: number): number {
  const coefficient = Math.min(examAbility / EXAM_COEFFICIENT, 3)
  // 纯卷王：exam高但creativity=0，总分=exam
  // 纯创哥：creativity高但exam低，系数被压低，总分受限
  // 均衡发展：exam够高+creativity积累，双重爆发
  return examAbility + creativity * (coefficient + 1)
}

// 计算某角色在指定精力上限时的分数/创造力分配
function getAllocation(role: RoleType, n: number): { score: number; creativity: number } {
  switch (role) {
    case 'juanwang':
      return { score: n, creativity: 0 }
    case 'normal':
      return { score: Math.max(0, n - 2), creativity: 0 }
    case 'chuang-ge':
      // 纯创哥：极少应试，极少创造（只够维持生存），精力留给休息
      // 每轮1分应试 + 2分创造 + 7分休息（不内耗）
      return { score: 1, creativity: 2 }
    case 'top-chuang':
      return { score: 2, creativity: Math.max(0, n - 2) }
    case 'balanced': {
      const half = Math.floor((n - 2) / 2)
      return { score: half, creativity: half }
    }
    case 'balanced-king': {
      // 全面发展型：应试和创造均衡，但偏向创造（6:4）
      const available = n - 2
      const score = Math.floor(available * 0.4)
      const creativity = Math.floor(available * 0.6)
      return { score, creativity }
    }
    case 'bailan':
      return { score: 1, creativity: 1 }
    case 'follow':
    case 'super-follow':
      // 这两个需要动态计算，由 getFollowAllocation 处理
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
    // 跟风：跟随平均值用于分数，但保证自身剩余≥2
    // 先确保剩余≥2，最多用 n-2 用于分数
    const maxScore = n - 2
    const score = Math.min(otherScoreEnergy, maxScore)
    // 剩余（n-2）用于跟风创造力
    const creativity = Math.max(0, maxScore - score)
    return { score, creativity }
  } else {
    // 超级跟风：用完剩余精力给创造力（不保证剩余≥2）
    const score = Math.min(otherScoreEnergy, n)
    const creativity = Math.max(0, n - otherScoreEnergy)
    return { score, creativity }
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
    consecutiveBelow2: 0,  // 连续剩余精力<2的轮数
  }
}

// 运行一轮模拟
function runRound(players: Player[]): Player[] {
  // 第一步：计算除了跟风和超级跟风之外的人的平均"用于分数的精力"（基于各自精力）
  const nonFollowPlayers = players.filter(p => p.role !== 'follow' && p.role !== 'super-follow')
  let totalScoreEnergy = 0
  for (const p of nonFollowPlayers) {
    const alloc = getAllocation(p.role, p.energy)
    totalScoreEnergy += alloc.score
  }
  const avgScoreEnergy = nonFollowPlayers.length > 0
    ? totalScoreEnergy / nonFollowPlayers.length
    : 0

  // 第二步：每个玩家计算分配并更新
  return players.map(p => {
    let allocation: { score: number; creativity: number }

    if (p.role === 'follow' || p.role === 'super-follow') {
      allocation = getFollowAllocation(p.role, p.energy, avgScoreEnergy)
    } else {
      allocation = getAllocation(p.role, p.energy)
    }

    // 当轮应试能力 = 用于分数的精力
    const examAbilityThisRound = allocation.score
    // 当轮创新能力 = 用于创新的精力
    const creativityThisRound = allocation.creativity
    
    // 累计创新能力 = 旧 + 当轮
    const newCreativity = p.creativity + creativityThisRound
    // 累计应试能力 = 旧 + 当轮
    const newExamAbility = p.examAbility + examAbilityThisRound
    
    // 每一轮重新计算总分（新版公式：鼓励全面发展）
    const totalScore = calculateTotalScore(newExamAbility, newCreativity)

    // 计算剩余精力
    const remainingEnergy = p.energy - (allocation.score + allocation.creativity)

    // 更新连续低于2的计数
    let newConsecutiveBelow2 = p.consecutiveBelow2
    if (remainingEnergy < 2) {
      newConsecutiveBelow2++
    } else {
      newConsecutiveBelow2 = 0
    }

    // 检查是否需要精力衰减（连续5轮剩余精力 < 2）
    let newEnergy = p.energy
    if (newConsecutiveBelow2 >= 5) {
      newEnergy = Math.max(1, p.energy - 1)
      newConsecutiveBelow2 = 0
    }

    return {
      ...p,
      examAbilityPerRound: examAbilityThisRound,
      // 累计应试能力 = 旧 + 当轮
      examAbility: newExamAbility,
      // 总分 = min(应试,300) × log(1+创造力/50) + 创造力
      totalScore: totalScore,
      // 累计创新能力 = 旧 + 当轮
      creativity: newCreativity,
      // 当轮创新能力
      creativityPerRound: creativityThisRound,
      // 更新精力上限
      energy: newEnergy,
      // 更新连续计数
      consecutiveBelow2: newConsecutiveBelow2,
    }
  })
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

  for (let r = 1; r <= rounds; r++) {
    // 运行一轮
    players = runRound(players)

    results.push({
      round: r,
      players: players.map(p => ({ ...p })),
      energy: players[0]?.energy || initialEnergy,  // 兼容旧代码
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
