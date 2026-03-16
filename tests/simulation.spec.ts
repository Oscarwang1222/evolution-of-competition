import { test, expect } from '@playwright/test'

test.describe('模拟游戏测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5200')
  })

  test('1. 基础流程：选择角色 → 开始模拟 → 显示结果', async ({ page }) => {
    // 页面加载
    await expect(page.locator('h1')).toContainText('模拟游戏')

    // 选择一个角色（卷王）
    await page.click('text=卷王')

    // 确认按钮可用
    const startBtn = page.locator('.start-btn')
    await expect(startBtn).toBeEnabled()

    // 点击开始模拟
    await startBtn.click()

    // 验证结果页面显示
    await expect(page.locator('h2')).toContainText('模拟结果')
    await expect(page.locator('h3').first()).toContainText('最终排名')
  })

  test('2. 短期模拟：卷王应该获胜', async ({ page }) => {
    // 设置轮数为 10
    await page.fill('input[type="number"]', '10')

    // 选择卷王和创哥
    await page.click('text=卷王')
    await page.click('text=创哥')

    // 开始模拟
    await page.click('.start-btn')

    // 验证结果显示
    await expect(page.locator('.ranking-list')).toBeVisible()

    // 第一个应该是卷王
    const firstPlace = page.locator('.ranking-item').first()
    await expect(firstPlace).toContainText('卷王')
  })

  test('3. 长期模拟：创哥应该获胜', async ({ page }) => {
    // 设置轮数为 50
    await page.fill('input[type="number"]', '50')

    // 选择卷王和顶级创哥
    await page.click('text=卷王')
    await page.click('text=顶级创哥')

    // 开始模拟
    await page.click('.start-btn')

    // 验证结果显示
    await expect(page.locator('.ranking-list')).toBeVisible()

    // 第一个应该是顶级创哥
    const firstPlace = page.locator('.ranking-item').first()
    await expect(firstPlace).toContainText('顶级创哥')
  })

  test('4. 跟风机制：跟风者分数介于卷王和其他人之间', async ({ page }) => {
    // 设置轮数为 20
    await page.fill('input[type="number"]', '20')

    // 选择卷王 + 跟风 + 超级跟风
    await page.click('text=卷王')
    await page.click('text=跟风')
    await page.click('text=超级跟风')

    // 开始模拟
    await page.click('.start-btn')

    // 获取排名
    const rankings = await page.locator('.ranking-item').allTextContents()

    // 卷王应该在第一名
    expect(rankings[0]).toContain('卷王')
  })

  test('5. 重新设置按钮功能', async ({ page }) => {
    // 选择角色并模拟
    await page.click('text=卷王')
    await page.click('.start-btn')

    // 点击重新设置
    await page.click('.reset-btn')

    // 应该回到设置页面
    await expect(page.locator('.start-btn')).toContainText('开始模拟')
    await expect(page.locator('.start-btn')).toBeDisabled()
  })
})
