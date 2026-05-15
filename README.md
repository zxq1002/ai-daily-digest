# AI Daily Digest

skill 制作详情可查看 ➡️ https://mp.weixin.qq.com/s/rkQ28KTZs5QeZqjwSCvR4Q

从 [Andrej Karpathy](https://x.com/karpathy) 推荐的 90 个 Hacker News 顶级技术博客中抓取最新文章，通过 AI 多维评分筛选，生成一份结构化的每日精选日报。

> **作为 Agent Skill 运行时，直接使用智能体会话模型进行 AI 处理，无需任何外部 API Key。兼容 Claude Code、OpenClaw、Hermes Agent 等主流 Agent 平台。**
>
> 信息源来自 [Hacker News Popularity Contest 2025](https://refactoringenglish.com/tools/hn-popularity/)，涵盖 simonwillison.net、paulgraham.com、overreacted.io、gwern.net、krebsonsecurity.com 等。

## 使用方式

作为 Agent Skill 使用，在对话中输入 `/digest`（或平台等效命令）即可启动交互式引导流程：

```
/digest
```

Agent 会依次询问：

| 参数 | 选项 | 默认值 |
|------|------|--------|
| 时间范围 | 24h / 48h / 72h / 7天 | 48h |
| 精选数量 | 10 / 15 / 20 篇 | 15 篇 |
| 输出语言 | 中文 / English | 中文 |

配置会自动保存到 `~/.hn-daily-digest/config.json`，下次运行可一键复用。

### 工作流程

```
RSS 抓取 → 时间过滤 → [会话模型: AI 评分+分类 → AI 摘要+翻译 → 趋势总结] → 报告生成
```

1. **RSS 抓取**（脚本 `--fetch-only`）— 并发抓取 90 个源，输出文章 JSON
2. **AI 评分**（会话模型）— 从相关性、质量、时效性三维度打分，六分类归类，关键词提取
3. **AI 摘要**（会话模型）— 为 Top N 文章生成中文标题翻译、结构化摘要、推荐理由
4. **趋势总结**（会话模型）— 归纳当日技术圈 2-3 个宏观趋势
5. **报告生成**（脚本 `--from-json`）— 组装完整 Markdown 日报，含 Mermaid 图表

### 直接命令行运行

```bash
# Step 1: 抓取文章
npx -y bun scripts/digest.ts --hours 48 --fetch-only > articles.json

# Step 2: 使用任意 AI 工具处理 articles.json，生成 processed.json
# （作为 Agent Skill 时，Agent 自动完成此步骤）

# Step 3: 生成报告
npx -y bun scripts/digest.ts --from-json processed.json --output ./digest.md

# 输出 PDF 格式
npx -y bun scripts/digest.ts --from-json processed.json --format pdf --output ./digest.pdf
```

## 功能

### 五步处理流水线

```
RSS 抓取 → 时间过滤 → AI 评分+分类 → AI 摘要+翻译 → 趋势总结
```

1. **RSS 抓取** — 并发抓取 90 个源（10 路并发，15s 超时），兼容 RSS 2.0 和 Atom 格式
2. **时间过滤** — 按指定时间窗口筛选近期文章
3. **AI 评分** — 从相关性、质量、时效性三个维度打分（1-10），同时完成分类和关键词提取
4. **AI 摘要** — 为 Top N 文章生成结构化摘要（4-6 句）、中文标题翻译、推荐理由
5. **趋势总结** — AI 归纳当日技术圈 2-3 个宏观趋势

### 日报结构

生成的 Markdown 文件包含以下板块：

| 板块 | 内容 |
|------|------|
| 📝 今日看点 | 3-5 句话的宏观趋势总结 |
| 🏆 今日必读 | Top 3 深度展示：中英双语标题、摘要、推荐理由、关键词 |
| 📊 数据概览 | 统计表格 + Mermaid 饼图（分类分布）+ Mermaid 柱状图（高频关键词）+ ASCII 纯文本图 + 话题标签云 |
| 分类文章列表 | 按 6 大分类分组，每篇含中文标题、来源、相对时间、评分、摘要、关键词 |

### 六大分类体系

| 分类 | 覆盖范围 |
|------|----------|
| 🤖 AI / ML | AI、机器学习、LLM、深度学习 |
| 🔒 安全 | 安全、隐私、漏洞、加密 |
| ⚙️ 工程 | 软件工程、架构、编程语言、系统设计 |
| 🛠 工具 / 开源 | 开发工具、开源项目、新发布的库/框架 |
| 💡 观点 / 杂谈 | 行业观点、个人思考、职业发展 |
| 📝 其他 | 不属于以上分类的内容 |

## 亮点

- **零外部依赖** — 作为 Skill 运行时无需任何 API Key，AI 处理由智能体会话模型完成
- **纯 TypeScript** — 单文件 RSS 抓取 + 报告生成，基于 Bun 运行时，无第三方库
- **中英双语** — 所有标题自动翻译为中文，原文标题保留为链接文字
- **结构化摘要** — 4-6 句覆盖核心问题→关键论点→结论的完整概述，30 秒判断是否值得读
- **可视化统计** — Mermaid 图表（GitHub/Obsidian 原生渲染）+ ASCII 柱状图（终端友好）+ 标签云
- **智能分类** — AI 自动将文章归入 6 大类别，按类浏览高效直观
- **趋势洞察** — 归纳当天技术圈的宏观趋势，把握大方向
- **配置记忆** — 偏好参数自动持久化，日常使用一键运行

## 环境要求

- [Bun](https://bun.sh) 运行时（通过 `npx -y bun` 自动安装）
- 网络连接（访问 RSS 源）
- 作为 Agent Skill 使用时，无需任何外部 AI API Key

### PDF 生成功能的前置条件

如果要使用 PDF 格式输出功能（`--format pdf`），需要确保以下依赖已安装：

1. **Node.js 依赖**: 初始化项目并安装 Playwright
   ```bash
   npm init -y
   npm install playwright
   ```

2. **浏览器二进制文件**: 下载 Chromium 浏览器
   ```bash
   npx playwright install chromium
   ```

3. **系统依赖**（Linux 服务器环境）: 安装运行 Chromium 所需的系统库
   ```bash
   # Ubuntu/Debian（推荐方式）
   npx playwright install-deps chromium

   # 或手动安装
   sudo apt-get update
   sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2
   ```

4. **中文字体**（必须）: 安装中文字体以避免 PDF 中文字符间距异常
   ```bash
   # Ubuntu/Debian - 安装思源黑体和文泉驿字体
   sudo apt-get install -y fonts-noto-cjk fonts-noto-color-emoji fonts-wqy-microhei fonts-wqy-zenhei

   # 刷新字体缓存
   sudo fc-cache -fv

   # 验证字体安装
   fc-list :lang=zh | grep -E "(Noto|WenQuanYi)"
   ```

> 💡 **提示**: 如果 PDF 生成失败并提示浏览器找不到，请检查步骤 2 是否已完成。如果在 Docker 或 Linux 服务器上运行，请确保步骤 3 和 4 的系统依赖已安装。**中文字体（步骤 4）是生成正确中文 PDF 的必要条件，缺少会导致文字间距异常。**

## JSON 数据格式

### `--fetch-only` 输出格式

```json
{
  "articles": [
    {
      "title": "Article Title",
      "link": "https://example.com/article",
      "pubDate": "2026-05-15T10:00:00.000Z",
      "description": "Article description...",
      "sourceName": "example.com",
      "sourceUrl": "https://example.com"
    }
  ],
  "stats": {
    "totalFeeds": 90,
    "successFeeds": 85,
    "totalArticles": 200,
    "filteredArticles": 45,
    "hours": 48
  }
}
```

### `--from-json` 输入格式

```json
{
  "articles": [
    {
      "title": "Article Title",
      "link": "https://example.com/article",
      "pubDate": "2026-05-15T10:00:00.000Z",
      "description": "Article description...",
      "sourceName": "example.com",
      "sourceUrl": "https://example.com",
      "score": 25,
      "scoreBreakdown": { "relevance": 8, "quality": 9, "timeliness": 8 },
      "category": "ai-ml",
      "keywords": ["LLM", "GPT-5", "benchmark"],
      "titleZh": "中文标题",
      "summary": "4-6句中文摘要...",
      "reason": "推荐理由..."
    }
  ],
  "highlights": "今日技术圈趋势总结...",
  "stats": {
    "totalFeeds": 90,
    "successFeeds": 85,
    "totalArticles": 200,
    "filteredArticles": 45,
    "hours": 48
  }
}
```

## 信息源

90 个 RSS 源精选自 Hacker News 社区最受欢迎的独立技术博客，包括但不限于：

> Simon Willison · Paul Graham · Dan Abramov · Gwern · Krebs on Security · Antirez · John Gruber · Troy Hunt · Mitchell Hashimoto · Steve Blank · Eli Bendersky · Fabien Sanglard ...

完整列表内嵌于 `scripts/digest.ts`。
