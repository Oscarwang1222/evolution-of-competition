import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto('http://localhost:5174');

// 点击选择角色
await page.getByText('卷王').click();
await page.getByText('创哥').click();

// 开始模拟
await page.getByText('开始模拟').click();

// 等待显示
await page.waitForSelector('.ranking-item');
const initial = await page.locator('.ranking-item').first().textContent();
console.log('初始:', initial.trim());

// 点击单步
await page.getByText('单步').click();
await page.waitForTimeout(200);

const after = await page.locator('.ranking-item').first().textContent();
console.log('第一步后:', after.trim());

await browser.close();
