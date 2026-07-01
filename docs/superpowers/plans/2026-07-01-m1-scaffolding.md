# M1：项目脚手架搭建 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 按照技术设计文档搭建完整的 Next.js 项目结构，为后续开发打好基础。

**架构：** 使用 pnpm create next-app@14 创建项目，安装指定依赖，创建目录结构，配置 Tailwind CSS 4.x 和 TypeScript 路径别名。

**技术栈：** Next.js 14、TypeScript、Tailwind CSS 4.x、Zod、tailwind-merge

---

## 文件清单

| 文件路径 | 职责 | 状态 |
|---------|------|------|
| `shupu/package.json` | 项目依赖管理 | 新建 |
| `shupu/tsconfig.json` | TypeScript 配置 | 修改 |
| `shupu/next.config.js` | Next.js 配置 | 修改 |
| `shupu/src/app/globals.css` | 全局样式 + Tailwind | 修改 |
| `shupu/.env.example` | 环境变量模板 | 新建 |
| `shupu/AGENTS.md` | 开发指南 | 新建 |
| `shupu/__tests__/manual-test-checklist.md` | 手动测试清单 | 新建 |
| `shupu/scripts/test-ai.ts` | AI 测试脚本（预留） | 新建 |

---

### 任务 1：创建 Next.js 项目

**文件：**
- 创建：`shupu/`（项目根目录）

- [x] **步骤 1：创建项目**

```bash
cd "/Users/huangdong/Library/Mobile Documents/iCloud~md~obsidian/Documents/书谱"
pnpm create next-app@14 shupu --typescript --tailwind --app --src-dir --import-alias "@/*" --package-manager pnpm
```

- [x] **步骤 2：验证项目创建**

```bash
ls -la shupu/
```

- [x] **步骤 3：Commit**

---

### 任务 2：安装额外依赖

**文件：**
- 修改：`shupu/package.json`

- [x] **步骤 1：安装额外依赖**

```bash
cd shupu
pnpm add zod tailwind-merge
pnpm add -D @tailwindcss/postcss tailwindcss@4
```

- [x] **步骤 2：验证依赖版本**

- [x] **步骤 3：Commit**

---

### 任务 3：创建目录结构

**文件：**
- 创建：所有目录

- [x] **步骤 1：创建目录**

```bash
cd shupu
mkdir -p src/app/api/structure src/app/api/recommend
mkdir -p src/components/{layout,home,structured,map,ui}
mkdir -p src/lib/{ai,prompts/structure,prompts/recommend,books,state,utils}
mkdir -p src/types public/assets scripts __tests__
```

- [x] **步骤 2：验证目录结构**

- [x] **步骤 3：Commit**

---

### 任务 4：配置 tsconfig.json 路径别名

**文件：**
- 修改：`shupu/tsconfig.json`

- [x] **步骤 1：读取当前配置**

- [x] **步骤 2：确认路径别名已配置**

- [x] **步骤 3：验证配置**

```bash
cd shupu
pnpm tsc --noEmit
```

- [x] **步骤 4：Commit**

---

### 任务 5：配置 Tailwind CSS 4.x

**文件：**
- 修改：`shupu/src/app/globals.css`
- 创建：`shupu/postcss.config.js`
- 删除：`shupu/tailwind.config.ts`

- [x] **步骤 1：修改 globals.css**

```css
@import "tailwindcss";

@theme {
  --color-primary: #6366f1;
  --color-primary-dark: #4f46e5;
  --color-secondary: #8b5cf6;
  --color-accent: #f472b6;
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f8fafc;
  --color-text-muted: #94a3b8;
  --color-border: #334155;
}
```

- [x] **步骤 2：创建 postcss.config.js**

- [x] **步骤 3：删除 tailwind.config.ts**

- [x] **步骤 4：验证配置**

```bash
cd shupu
pnpm build
```

- [x] **步骤 5：Commit**

---

### 任务 6：创建环境变量模板

**文件：**
- 创建：`shupu/.env.example`
- 验证：`shupu/.gitignore`

- [x] **步骤 1：创建 .env.example**

- [x] **步骤 2：验证 .gitignore 包含 .env.local**

- [x] **步骤 3：Commit**

---

### 任务 7：编写 AGENTS.md

**文件：**
- 创建：`shupu/AGENTS.md`

- [x] **步骤 1：编写 AGENTS.md**

- [x] **步骤 2：验证文件**

- [x] **步骤 3：Commit**

---

### 任务 8：创建手动测试清单

**文件：**
- 创建：`shupu/__tests__/manual-test-checklist.md`

- [x] **步骤 1：创建手动测试清单**

- [x] **步骤 2：Commit**

---

### 任务 9：创建 AI 测试脚本（预留）

**文件：**
- 创建：`shupu/scripts/test-ai.ts`

- [x] **步骤 1：创建测试脚本**

- [x] **步骤 2：Commit**

---

### 任务 10：验证项目完整性

**文件：**
- 验证：所有文件

- [x] **步骤 1：运行开发服务器**

```bash
cd shupu
pnpm dev
```

- [x] **步骤 2：运行代码检查**

```bash
cd shupu
pnpm lint && pnpm tsc --noEmit
```

- [x] **步骤 3：运行生产构建**

```bash
cd shupu
pnpm build
```

---

## 计划自检

### 1. 规格覆盖度

| 规格章节 | 对应任务 |
|---------|---------|
| 项目创建 | 任务 1 |
| 依赖安装 | 任务 2 |
| 目录结构 | 任务 3 |
| tsconfig 配置 | 任务 4 |
| Tailwind CSS 4.x | 任务 5 |
| 环境变量模板 | 任务 6 |
| AGENTS.md | 任务 7 |
| 手动测试清单 | 任务 8 |
| AI 测试脚本 | 任务 9 |
| 验证 | 任务 10 |

### 2. 占位符扫描

无占位符、TODO 或模糊描述。

### 3. 类型一致性

所有路径别名使用 `@/*`，与技术设计文档一致。