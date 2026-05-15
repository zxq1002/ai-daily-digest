## Project

**AI Daily Digest**

从 90 个 Hacker News 顶级技术博客抓取最新文章，通过 AI 多维评分筛选，生成结构化的每日精选日报。支持 Markdown 和 PDF 两种输出格式，运行于 Bun 运行时之上。

**Core Value:** 用户无需浏览数十个技术博客，即可获得当日最重要技术文章的 AI 精选摘要和中英双语翻译。

### Constraints

- **运行时**: Bun（必须保持零 npm 依赖）
- **AI 处理**: 作为 Agent Skill 运行时使用会话模型；脚本仅负责 RSS 抓取和报告生成
- **改动范围**: 脚本聚焦 RSS 抓取 + 报告生成，AI 评分/摘要/趋势分析由 Agent 会话模型完成
- **脚本入口**: `scripts/digest.ts`（RSS 抓取 `--fetch-only` / 报告生成 `--from-json`）

## Project Skills

- **digest** (`/digest`): RSS 抓取 → 会话模型 AI 评分/摘要 → 日报生成。详见 `.claude/skills/digest/SKILL.md`
