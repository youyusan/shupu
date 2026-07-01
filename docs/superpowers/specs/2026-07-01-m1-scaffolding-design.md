# M1：项目脚手架搭建 — 规格说明

> **日期**：2026-07-01
> **前置文档**：[层4技术设计](../layer-4-technical-design.md)
> **状态**：已批准

---

## 目标

按照技术设计文档搭建完整的 Next.js 项目结构，为后续开发打好基础。

---

## 项目结构

项目根目录：`/Users/huangdong/Library/Mobile Documents/iCloud~md~obsidian/Documents/书谱/shupu/`

```
shupu/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── structured/page.tsx
│   │   ├── map/page.tsx
│   │   ├── api/structure/route.ts
│   │   ├── api/recommend/route.ts
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── error.tsx
│   ├── components/
│   │   ├── layout/
│   │   ├── home/
│   │   ├── structured/
│   │   ├── map/
│   │   └── ui/
│   ├── lib/
│   │   ├── ai/
│   │   ├── prompts/structure/
│   │   ├── prompts/recommend/
│   │   ├── books/
│   │   ├── state/
│   │   └── utils/
│   └── types/
├── public/assets/
├── scripts/
├── __tests__/
├── .env.local
├── .env.example
├── .gitignore
├── AGENTS.md
├── next.config.js
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

---

## 依赖清单

**核心运行时依赖：**
- `next`: 14.x（锁定主版本）
- `react`: ^18
- `react-dom`: ^18
- `zod`: ^3

**开发依赖：**
- `@types/node`: ^20
- `@types/react`: ^18
- `@types/react-dom`: ^18
- `autoprefixer`: ^10
- `postcss`: ^8
- `tailwindcss`: 4.0.x（锁定主版本）
- `@tailwindcss/postcss`: ^4
- `tailwind-merge`: ^2
- `typescript`: ^5

---

## 关键配置

### 1. tsconfig.json
- 路径别名：`@/*` → `src/*`
- 启用严格模式

### 2. globals.css
- Tailwind CSS 4.x 指令：`@import "tailwindcss";`
- 自定义主题变量

### 3. .env.example
```env
DEEPSEEK_API_KEY=sk-...
# OPENAI_API_KEY=sk-...
# OPENAI_BASE_URL=https://api.openai.com/v1
# OPENAI_MODEL=gpt-4o-mini
```

### 4. AGENTS.md 内容标准
1. 5分钟快速启动（安装、配置、启动）
2. 目录结构速查（5行以内）
3. 禁区列表摘要（S1-S7/P1-P8/E1-E11）
4. 提交前检查清单（lint + typecheck + 手动测试）
5. 部署命令（vercel deploy）

---

## 成功标准

| 检查项 | 通过条件 |
|--------|---------|
| 项目创建 | `pnpm create next-app@14` 成功执行 |
| 依赖安装 | `pnpm install` 无报错 |
| 开发服务器 | `pnpm dev` 启动成功，localhost:3000 可访问 |
| 代码检查 | `pnpm lint && pnpm tsc --noEmit` 0错误 |
| 目录结构 | 所有目录创建完毕 |

---

## 禁区约束（来自层4技术设计）

| 编号 | 规则 |
|------|------|
| S3 | `.env.local` 必须在 `.gitignore` 中 |
| E6 | 不引入额外 npm 包（除清单列出的） |
| E7 | 页面导航使用 Next.js useRouter |