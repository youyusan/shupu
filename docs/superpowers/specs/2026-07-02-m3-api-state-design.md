# M3：API 路由与状态管理 — 规格说明

> **日期**：2026-07-02
> **前置文档**：[层4技术设计](../../layer-4-technical-design.md)、[M1规格说明](./2026-07-01-m1-scaffolding-design.md)、[M2规格说明](./2026-07-01-m2-ai-channel-design.md)
> **状态**：已批准

---

## 目标

实现 API 路由（结构化分析、书籍推荐）和前端状态管理，包含频率限制。

---

## 文件清单

| 文件路径 | 职责 | 状态 |
|---------|------|------|
| `src/app/api/structure/route.ts` | 结构化分析 API 路由（POST） | 新建 |
| `src/app/api/recommend/route.ts` | 书籍推荐 API 路由（POST） | 新建 |
| `src/lib/rate-limiter.ts` | 频率限制工具（10次/分钟） | 新建 |
| `src/lib/state/idea-store.ts` | 前端状态管理（sessionStorage） | 新建 |

---

## API 路由设计

### 1. POST /api/structure

**请求体：**
```typescript
{
  rawInput: string;           // 1-500 字符
  previousIdea?: StructuredIdea;
  feedback?: string;
}
```

**响应体（ApiResponse<StructuredIdea>）：**
```typescript
{
  success: boolean;
  data?: StructuredIdea;
  error?: {
    code: ErrorCode;
    message: string;
  };
}
```

**处理流程：**
1. 提取客户端 IP（X-Forwarded-For 或 remoteAddress）
2. 检查频率限制（10次/分钟）
3. Zod 校验请求体
4. 输入清洗（sanitizeInput）
5. 调用 AI 结构化分析
6. Zod 校验 AI 输出
7. 返回 ApiResponse

### 2. POST /api/recommend

**请求体：**
```typescript
{
  structuredIdea: StructuredIdea;
}
```

**响应体（ApiResponse<BookRecommendation[]>）：**
```typescript
{
  success: boolean;
  data?: BookRecommendation[];
  error?: {
    code: ErrorCode;
    message: string;
  };
}
```

**处理流程：**
1. 提取客户端 IP
2. 检查频率限制
3. Zod 校验请求体
4. 调用 AI 推荐
5. Zod 校验 AI 输出
6. 返回 ApiResponse

---

## 频率限制设计

**文件：** `src/lib/rate-limiter.ts`

```typescript
export class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }>;
  private maxRequests: number;
  private windowMs: number;
  
  constructor(maxRequests = 10, windowMs = 60000) {
    this.requests = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  check(ip: string): { allowed: boolean; remaining: number; resetTime: number };
}
```

**逻辑：**
- 使用 Map 存储每个 IP 的请求计数和重置时间
- 请求时检查当前时间是否超过重置时间，是则重置计数
- 计数超过 maxRequests 则拒绝请求
- 返回剩余请求数和重置时间（用于 X-RateLimit-* 响应头）

---

## 前端状态管理设计

**文件：** `src/lib/state/idea-store.ts`

```typescript
export interface IdeaState {
  rawInput: string;
  structuredIdea?: StructuredIdea;
  recommendations?: BookRecommendation[];
}

export const ideaStore = {
  get(): IdeaState;
  set(state: Partial<IdeaState>): void;
  clear(): void;
};
```

**逻辑：**
- 使用 sessionStorage 持久化状态
- 键名：`bookmap-idea-state`
- 序列化/反序列化使用 JSON
- 刷新页面时自动恢复状态
- 隐私模式下降级为内存存储（刷新后丢失）

---

## 响应头设计

**成功响应：**
- `X-RateLimit-Limit: 10`
- `X-RateLimit-Remaining: 9`
- `X-RateLimit-Reset: <timestamp>`

**频率限制响应（429）：**
- `Retry-After: 60`

---

## 成功标准

| 检查项 | 通过条件 |
|--------|---------|
| 文件创建 | 所有文件创建完毕 |
| 类型检查 | `pnpm tsc --noEmit` 0 错误 |
| 构建验证 | `CI=true pnpm build` 成功 |
| API 路由测试 | curl 测试返回正确格式 |

---

## 禁区约束

| 编号 | 规则 | 实现方式 |
|------|------|---------|
| E6 | 不引入额外 npm 包 | 使用原生 Map + setTimeout |
| E9 | API 路由必须实现频率限制 | RateLimiter 类 |
| E8 | 前端状态不得在刷新后自动恢复到 map 页 | 状态恢复到 structured 页 |