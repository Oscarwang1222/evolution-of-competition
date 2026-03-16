import { useState, useEffect, useRef } from 'react'
import './App.css'
import type { RoleType, Player, RoundResult } from './types'
import { ROLE_CONFIGS } from './types'
import { runSimulation } from './simulation'

function App() {
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>([])
  const [rounds, setRounds] = useState(20)
  const [initialEnergy, setInitialEnergy] = useState(10)
  const [showSim, setShowSim] = useState(false)
  
  // 模拟状态
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentRound, setCurrentRound] = useState(0)
  const [players, setPlayers] = useState<Player[]>([])
  const [history, setHistory] = useState<RoundResult[]>([])
  const timerRef = useRef<number | null>(null)

  const allRoles: RoleType[] = [
    'juanwang', 'normal', 'follow', 'super-follow',
    'chuang-ge', 'top-chuang', 'balanced', 'balanced-king', 'bailan'
  ]

  const toggleRole = (role: RoleType) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role))
    } else {
      setSelectedRoles([...selectedRoles, role])
    }
  }

  const startSimulation = () => {
    if (selectedRoles.length === 0) return
    const results = runSimulation(selectedRoles, rounds, initialEnergy)
    setHistory(results)
    setCurrentRound(1)  // 从第1轮开始
    setPlayers(results[0]?.players || [])  // 直接显示第1轮数据
    setShowSim(true)
    setIsPlaying(false) // 默认暂停
  }

  // 单步运行
  const step = () => {
    if (currentRound < history.length) {
      setPlayers(history[currentRound - 1].players)
      setCurrentRound(currentRound + 1)
    }
  }

  // 播放/暂停
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    } else {
      setIsPlaying(true)
    }
  }

  // 自动播放
  useEffect(() => {
    if (isPlaying && currentRound <= history.length) {
      timerRef.current = window.setInterval(() => {
        if (currentRound <= history.length) {
          setPlayers(history[currentRound - 1].players)
          setCurrentRound(currentRound + 1)
        } else {
          setIsPlaying(false)
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
        }
      }, 500) // 每500ms一步
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPlaying, currentRound, history.length])

  // 重置
  const reset = () => {
    setIsPlaying(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setCurrentRound(0)
    setPlayers([])
    setShowSim(false)
  }

  // 重新开始
  const restart = () => {
    setIsPlaying(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setCurrentRound(1)
    setPlayers(history[0]?.players || [])
  }

  // 获取当前排名（按总分排序）
  const ranking = [...players].sort((a, b) => b.totalScore - a.totalScore)

  return (
    <div className="app">
      <header>
        <h1>🧪 模拟游戏</h1>
        <p>短期卷分数 vs 长期创造力</p>
      </header>

      {!showSim ? (
        <main>
          <section className="config-section">
            <h2>⚙️ 游戏设置</h2>
            <div className="config-row">
              <label>
                总轮数:
                <input
                  type="number"
                  value={rounds}
                  onChange={e => setRounds(Number(e.target.value))}
                  min={1} max={200}
                />
              </label>
              <label>
                初始精力上限:
                <input
                  type="number"
                  value={initialEnergy}
                  onChange={e => setInitialEnergy(Number(e.target.value))}
                  min={1} max={20}
                />
              </label>
            </div>
          </section>

          <section className="roles-section">
            <h2>🎭 选择角色</h2>
            <div className="roles-grid">
              {allRoles.map(role => (
                <button
                  key={role}
                  className={`role-card ${selectedRoles.includes(role) ? 'selected' : ''}`}
                  style={{
                    borderColor: selectedRoles.includes(role) ? ROLE_CONFIGS[role].color : '#ddd',
                    backgroundColor: selectedRoles.includes(role) ? ROLE_CONFIGS[role].color + '20' : 'white'
                  }}
                  onClick={() => toggleRole(role)}
                >
                  <span className="role-name">{ROLE_CONFIGS[role].name}</span>
                  <span className="role-desc">{ROLE_CONFIGS[role].desc}</span>
                </button>
              ))}
            </div>
          </section>

          <button
            className="start-btn"
            onClick={startSimulation}
            disabled={selectedRoles.length === 0}
          >
            开始模拟 ({selectedRoles.length} 人)
          </button>
        </main>
      ) : (
        <main>
          <section className="sim-section">
            <div className="sim-header">
              <div className="sim-info">
                <span className="round-indicator">第 {currentRound} / {rounds} 轮</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(currentRound / rounds) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="sim-controls">
                <button className="ctrl-btn" onClick={step} disabled={currentRound > rounds || isPlaying}>
                  ⏭️ 单步
                </button>
                <button className="ctrl-btn play-btn" onClick={togglePlay} disabled={currentRound > rounds}>
                  {isPlaying ? '⏸️ 暂停' : '▶️ 播放'}
                </button>
                <button className="ctrl-btn" onClick={restart}>
                  🔄 重新开始
                </button>
                <button className="ctrl-btn" onClick={reset}>
                  🏠 重新设置
                </button>
              </div>
            </div>

            {players.length > 0 ? (
              <>
                <div className="ranking">
                  <h3>🏆 当前排名</h3>
                  <div className="ranking-list">
                    {ranking.map((player, i) => (
                      <div
                        key={player.id}
                        className="ranking-item"
                        style={{ borderLeftColor: ROLE_CONFIGS[player.role].color }}
                      >
                        <span className="rank">#{i + 1}</span>
                        <span className="name">{ROLE_CONFIGS[player.role].name}</span>
                        <span className="score" title="总分 = 应试能力 × 1.05^创新能力">
                          <strong>总分: {player.totalScore.toFixed(2)}</strong>
                        </span>
                        <span className="total-score">
                          应试能力: {player.examAbility.toFixed(2)} | 创新能力: {player.creativity.toFixed(0)}
                        </span>
                        <span className="creativity">
                          <small>+{player.examAbilityPerRound.toFixed(1)}/+{player.creativityPerRound.toFixed(1)}/轮 | 精力:{player.energy}</small>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="charts">
                  <h3>📈 分数变化</h3>
                  <div className="chart-container">
                    <div className="chart">
                      {ranking.map(player => (
                        <div key={player.id} className="chart-line">
                          <span
                            className="line-label"
                            style={{ color: ROLE_CONFIGS[player.role].color }}
                          >
                            {ROLE_CONFIGS[player.role].name}
                          </span>
                          <div className="line-values">
                            {Array.from({ length: rounds }, (_, ri) => {
                              const r = history[ri]
                              const p = r?.players.find(pl => pl.id === player.id)
                              const isPast = ri < currentRound
                              return (
                                <div
                                  key={ri}
                                  className="dot"
                                  style={{
                                    backgroundColor: ROLE_CONFIGS[player.role].color,
                                    opacity: isPast ? 0.3 + (ri / Math.max(1, rounds - 1)) * 0.7 : 0.1
                                  }}
                                  title={`第 ${ri + 1} 轮: 总分 ${p?.totalScore.toFixed(2) || 0}`}
                                />
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="x-axis">
                    {rounds <= 20 ? (
                      Array.from({ length: rounds }, (_, i) => (
                        <span key={i}>{i + 1}</span>
                      ))
                    ) : (
                      Array.from({ length: 10 }, (_, i) => {
                        const idx = Math.floor((i * rounds) / 9)
                        return <span key={i}>{idx + 1}</span>
                      })
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="waiting-msg">
                <p>点击"单步"或"播放"开始模拟</p>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  )
}

export default App
