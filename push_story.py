#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import urllib.request

DOC_TOKEN = "DsnddEMkboBn99xM1cocxpGwn3f"

def get_token():
    req = urllib.request.Request(
        "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
        data=json.dumps({"app_id": "cli_a9241615c7b8dcb3", "app_secret": "A3x7ihrLd1IJ9P1DObVubebD8kAQ6LHc"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())["tenant_access_token"]

def append_blocks(token, blocks):
    data = json.dumps({"children": blocks}, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        f"https://open.feishu.cn/open-apis/docx/v1/documents/{DOC_TOKEN}/blocks/{DOC_TOKEN}/children",
        data=data,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req) as r:
        resp = json.loads(r.read())
        if resp.get("code") != 0:
            print(f"ERROR: {resp}")
        else:
            print(f"  appended {len(blocks)} blocks OK")

def h(text):
    return {"block_type": 2, "text": {"elements": [{"text_run": {"content": "【 " + text + " 】", "text_element_style": {"bold": True}}}], "style": {"align": 1, "folded": False}}}

def p(text):
    return {"block_type": 2, "text": {"elements": [{"text_run": {"content": text}}], "style": {"align": 1, "folded": False}}}

def pb(text):
    return {"block_type": 2, "text": {"elements": [{"text_run": {"content": text, "text_element_style": {"bold": True}}}], "style": {"align": 1, "folded": False}}}

token = get_token()
print("Token OK")

# Chapter 1
append_blocks(token, [
    h("第一章：乌托邦"),
    p("所有人都处于最初的普通人状态。没有竞争，没有淘汰，每个人的精力 n=10，每轮把 n-2=8 点用于分数，2 点浪费（睡觉、娱乐）。"),
    p("普通人：每轮 +8 分数，分数曲线：线性增长，平稳、安全、无聊。"),
    pb("旁白：这是一个小镇。每个人都一样——早上起床，晚上睡觉，偶尔担心考试，但没什么大不了。日子，就这样一天天过去……直到有一天，来了一个……卷王。"),
    pb("模拟演示：10个普通人，20轮，图表显示分数线性增长，缓慢而稳定。稳定 = 缺乏动力。"),
    pb("教育落脚点：稳定不是坏事，但没有淘汰的公平，也会让进步停滞。"),
])

# Chapter 2
append_blocks(token, [
    h("第二章：第一个卷王"),
    p("小镇来了一个转学生——卷王。他每轮把所有精力 n=10 全用于分数。普通人（8分/轮）永远打不过他。"),
    pb("玩家第一次选择：你是小镇的原住民。你发现自己的分数被卷王碾压了。你会怎么做？"),
    p("选项 A：跟着卷 → 进化为卷王"),
    p("选项 B：保持普通人 → 被淘汰（重新选择角色继续）"),
    pb("模拟演示：1个卷王 vs 9个普通人，20轮。第20轮，卷王分数约200，普通人约160。"),
    pb("教育落脚点：你不卷，时代也会推着你卷。当有人开始卷，其他人只有两个选择：跟，或者被淘汰。"),
])

# Chapter 3
append_blocks(token, [
    h("第三章：群体觉醒（多米诺骨牌倒下）"),
    p("卷王拿到了第一名。其他人开始效仿。第二个、第三个……直到所有人都变成了卷王。"),
    pb("玩家选择：你看到大家都在卷。你要继续做普通人（被淘汰），还是加入他们？"),
    p("选项 A：加入卷王阵营 → 角色变为卷王，进入下一阶段"),
    p("选项 B：保持普通人 → 被淘汰"),
    pb("旁白：就这样，一个卷王变成了一群卷王。所有人都在跑，但你发现——大家都在跑，你就还是在原地。"),
    pb("模拟演示：全部都是卷王，30轮。关键转折：精力惩罚开始出现——连续5轮剩余精力小于2，精力上限 n 开始衰减。"),
    pb("教育落脚点：当所有人都在用同样的策略竞争，个体努力变成了群体内耗。每个人都更累了，但没有人真正赢。"),
])

# Chapter 4
append_blocks(token, [
    h("第四章：卷到极致（代价来临）"),
    p("所有人都变成了卷王。但系统开始显现它的残酷：精力不是无限的。连续透支，最终会累垮。"),
    pb("玩家关键选择：所有人都已经是卷王了。但你开始听到一些……抱怨。你会怎么做？"),
    p("选项 A：继续卷，告诉自己再撑一下就好了"),
    p("选项 B：寻找另一种可能……"),
    pb("模拟演示："),
    p("前20轮：分数指数级上升（每个人都+10/轮）"),
    p("第20~25轮：精力惩罚开始（有人 n 衰减到 9）"),
    p("第30轮后：n 持续衰减，总分增长放缓，最终停滞"),
    p("当所有人都精力耗尽（n=1），每轮只+1分，社会彻底停滞"),
    pb("教育落脚点：内卷是有天花板的——精力是有限的，但分数的追求是无限的。当精力耗尽，所有人的努力都在原地踏步。没有人是赢家。"),
])

# Chapter 5
append_blocks(token, [
    h("第五章：异类（摆烂者的智慧）"),
    p("在所有人都筋疲力尽的时候，有人开始问：有没有另一种方法？"),
    p("一个叫创哥的人出现了。他不跟大家比分数，他把精力分出一部分去搞创新——虽然每轮分数不高，但创新是可以累积的，而且有乘法效应。"),
    pb("创哥赢了我的分数，但赢不了我的创造力。"),
    pb("玩家选择：创哥的路线看起来很奇怪——前期分数很低，几乎垫底。但你想到了另一个问题：分数是加法，但创造力是乘法……"),
    p("选项 A：跟随创哥 → 进化为创哥"),
    p("选项 B：继续当卷王 → 角色不变"),
    pb("模拟演示：10个卷王 vs 1个创哥，50轮"),
    p("前15轮：卷王碾压创哥，创哥垫底"),
    p("第15~25轮：创哥开始追赶，差距缩小"),
    p("第25轮后：创哥凭借乘法效应反超，一骑绝尘"),
    p("关键公式：总分 = 应试能力 + 1.05^创造力"),
    p("卷王（50轮）：应试约500，创造力约0，总分约500"),
    p("创哥（50轮）：应试约80，创造力约380，总分约 80 + 1.05^380 = 天文数字"),
    pb("教育落脚点：当所有人都用同样的方式竞争时，另辟蹊径的人反而有优势。不是他们更聪明，而是他们的增长方式不同。分数是加法，创造力是指数。"),
])

# Chapter 6
append_blocks(token, [
    h("第六章：创新者的困境"),
    p("创哥路线被越来越多人看到。有人开始模仿——但不是每个人都能坚持。"),
    pb("创哥的方法需要耐心。前期你会垫底，会被嘲笑，会怀疑自己。有人中途放弃了，重新变回卷王。但真正坚持下来的人……成为了顶级创哥。"),
    pb("玩家选择：创哥的路线需要坚持。周围的人都在卷，你却在浪费时间。你要中途放弃，还是继续？"),
    p("选项 A：放弃（降级为普通人 or 卷王）→ 淘汰出局"),
    p("选项 B：坚持到底 → 进化为顶级创哥"),
    pb("模拟演示：10个卷王 vs 10个顶级创哥，60轮"),
    p("前20轮：卷王领先"),
    p("第20~40轮：顶级创哥追平"),
    p("第40轮后：顶级创哥指数级碾压"),
    p("第60轮：顶级创哥分数是卷王的数百倍"),
    pb("教育落脚点：创新最大的敌人不是竞争者，而是过程中的孤独和怀疑。创造力一旦越过临界点，其增长是卷王永远无法追赶的。"),
])

# Chapter 7
append_blocks(token, [
    h("第七章：新秩序"),
    p("世界分化成了三类人："),
    p("继续卷的卷王（精力耗尽，停滞）"),
    p("摆烂的普通人（低分但活着）"),
    p("坚持创新的创哥/顶级创哥（指数增长，最终领跑）"),
    pb("模拟演示：混合场景——卷王 + 普通人 + 创哥 + 顶级创哥，70轮"),
    p("卷王：前快后慢，最终停滞在 200~300"),
    p("普通人：稳定在 150~200"),
    p("创哥：逐渐加速，最终超越所有人"),
    p("顶级创哥：指数爆炸，一骑绝尘"),
    pb("玩家选择："),
    p("继续当卷王 → 结局：疲惫但还在跑"),
    p("转型创哥 → 结局：前苦后甜"),
    p("顶级创哥 → 结局：一骑绝尘但孤独"),
])

# Final chapter
append_blocks(token, [
    h("最终章：教育总结"),
    pb("三种人生轨迹的对比："),
    p("纯卷王：短期第1，中期第2，长期衰退——代价是精力耗尽"),
    p("均衡发展：短期垫底，缓慢上升——代价是缺乏竞争力"),
    p("创新路线：前期垫底，追平，最终指数碾压——代价是前期孤独"),
    pb("核心主旨："),
    p("1. 内卷是有天花板的：精力有限，竞争无限，最终所有人都在原地踏步"),
    p("2. 创造力是指数增长：前期的劣势会在后期变成压倒性优势"),
    p("3. 唯分数论的系统必然崩溃：当所有人都在同一个维度竞争，系统就会停滞"),
    p("4. 选择比努力更重要：创哥路线之所以赢，不是因为更努力，而是因为走了不同的路"),
    pb("旁白：故事到这里，你已经看到了四种人生。但这不是结局——这是开始。你会选择哪条路？"),
])

# Appendix
append_blocks(token, [
    h("附录：技术设计"),
    pb("模拟层（simulation.ts）"),
    p("保持独立纯函数，不依赖 UI："),
    p("runSimulation(roles, rounds, initialEnergy) → RoundResult[]"),
    p("getFinalRanking(results) → Player[]"),
    p("getScoreHistory(results) → ScoreHistory[]"),
    pb("叙事层（narrative.ts）"),
    p("负责章节配置和叙事结构："),
    p("每章的剧情文字"),
    p("章节对应的模拟参数（角色列表、轮数、精力）"),
    p("玩家选择 → 角色类型映射"),
    p("关键数据的解读文案"),
    pb("UI层（App.tsx）"),
    p("漫画展示组件（图片+对话）、选择按钮、模拟可视化（图表+排名）、教育总结页"),
])

print("\n全部写入完成！")
