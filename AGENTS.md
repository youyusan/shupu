# 书谱（BookMap）开发指南

## 5分钟快速启动

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入 DEEPSEEK_API_KEY

# 启动开发服务器
pnpm dev
# 打开 http://localhost:3000
```

## 目录结构速查

```
src/
├── app/           # Next.js App Router（页面+API路由）
├── components/    # React组件（按页面分组）
├── lib/           # 非组件逻辑（AI、书籍、状态、工具）
└── types/         # 全局TypeScript类型定义
```

## 禁区列表摘要

**安全禁区（S）：**
- S1: API Key仅在服务端使用，绝不传入客户端
- S2: AI API调用只在Route Handler中发起
- S3: .env.local必须在.gitignore中
- S4: 所有用户输入必须经过Zod校验
- S5: AI输出必须经过Zod校验才能返回
- S6: Prompt必须包含注入防护（XML标签+安全规则）
- S7: 部署前确认模型API数据使用条款

**产品铁律（P）：**
- P1: 不生成用户书的内容
- P2: 不做书籍质量排名
- P3: 结构化步骤不可跳过
- P4: 推荐书籍数量3-6本
- P5: 不做用户系统/登录注册
- P6: 不做社区功能
- P7: AI推荐书籍不做强校验拦截
- P8: 不做配置页面/管理后台

**工程禁区（E）：**
- E1: Prompt模板集中管理在lib/prompts/
- E2: 组件不得直接调用API Route
- E3: 用户输入前端+后端双重截断500字
- E4: AI调用超时设置为30秒
- E5: Google Books补全必须并行且非阻塞
- E6: 不引入额外npm包（除清单列出的）
- E7: 页面导航使用Next.js useRouter
- E8: 前端状态不得在刷新后自动恢复到map页
- E9: API路由必须实现频率限制
- E10: 每个页面必须有ErrorBoundary包裹
- E11: 输入必须清洗后再拼入Prompt

## 提交前检查清单

```bash
pnpm lint              # ESLint 0错误0警告
pnpm tsc --noEmit      # 类型检查 0错误
pnpm build             # 生产构建成功
```

## 部署命令

```bash
# 首次部署
vercel

# 更新部署
vercel --prod
```

## 回滚操作

Vercel Dashboard → 项目 → Deployments → 找到目标版本 → "Promote to Production"