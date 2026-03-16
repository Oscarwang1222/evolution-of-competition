// 角色类型
export type RoleType =
  | 'juanwang'       // 卷王
  | 'normal'         // 普通人
  | 'follow'         // 跟风
  | 'super-follow'  // 超级跟风
  | 'chuang-ge'      // 创哥
  | 'top-chuang'     // 顶级创哥
  | 'balanced'       // 均衡发展
  | 'balanced-king'  // 均衡卷王
  | 'bailan'         // 摆烂

export interface Player {
  id: string
  role: RoleType
  score: number         // 累积总分
  creativity: number   // 累积创造力
  scorePerRound: number // 当轮实际分数（包含创造力加成）
  creativityPerRound: number // 当轮获得的创造力
}

export interface RoundResult {
  round: number
  players: Player[]
  energy: number  // 当前精力上限
}

// 角色配置（用于显示）
export const ROLE_CONFIGS: Record<RoleType, {
  name: string
  desc: string
  color: string
}> = {
  'juanwang': { name: '卷王', desc: '每轮 n 点全部用于分数', color: '#ff6b6b' },
  'normal': { name: '普通人', desc: '每轮 n-2 用于分数', color: '#4ecdc4' },
  'follow': { name: '跟风', desc: '每轮取平均值用于分数，剩余≥2用于创造力', color: '#45b7d1' },
  'super-follow': { name: '超级跟风', desc: '每轮取平均值用于分数，剩余全部创造力', color: '#96ceb4' },
  'chuang-ge': { name: '创哥', desc: '每轮 n-3 创造力，1 分数', color: '#ffeaa7' },
  'top-chuang': { name: '顶级创哥', desc: '每轮 n-2 创造力，2 分数', color: '#fd79a8' },
  'balanced': { name: '均衡发展', desc: '每轮 (n-2)/2 分数，(n-2)/2 创造力', color: '#a29bfe' },
  'balanced-king': { name: '均衡卷王', desc: '每轮 n/2 分数，n/2 创造力', color: '#00b894' },
  'bailan': { name: '摆烂', desc: '每轮 1 分数，1 创造力', color: '#636e72' },
}
