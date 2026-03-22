# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**EITools** (eitools.cn) — 一个中文在线工具箱网站，提供 109+ 个免费在线工具，所有计算和转换均在浏览器端完成，不传输用户数据到服务器。

技术栈：纯静态 HTML/CSS/JavaScript，无框架、无构建步骤、无 npm 依赖。部署在 Vercel 免费层。

## Commands

本项目无构建步骤。开发流程：

- **本地预览**：任意静态服务器即可，例如 `npx serve .` 或 VS Code Live Server 插件
- **部署**：推送到 main 分支，Vercel 自动部署
- **无 lint/test 命令**

## Architecture

### 目录结构

```
index.html              # 首页（109+ 工具卡片网格）
src/tools/              # 各工具独立 HTML 页面（自包含，含内联 CSS/JS）
tools/                  # 分类汇总页（calculator-tools, dev-tools, image-tools, json-tools, text-tools）
guides/                 # 27 篇 SEO 教程/指南页面
css/style.css           # 全局共享样式
js/share.js             # 社交分享组件（微信、微博、QQ、Twitter、复制链接）
robots.txt / sitemap.xml # SEO 配置
```

### 工具页面标准模板

每个工具是独立的 `src/tools/*.html` 文件，遵循固定模式：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <!-- SEO meta: title, description, og:title, og:description, og:url, canonical -->
  <!-- Schema.org 结构化数据: FAQPage 或 WebApplication -->
  <link rel="icon" href="../../favicon.svg">
  <link rel="stylesheet" href="../../css/style.css">
</head>
<body>
  <div class="tool-page">
    <div class="tool-page-header">
      <a href="../../index.html" class="back-link">← 返回首页</a>
      <h1>工具名称</h1>
    </div>
    <!-- 工具 UI -->
  </div>
  <div id="share-bar"></div>
  <script src="../../js/share.js"></script>
</body>
</html>
```

### 三种工具类型模式

1. **文本处理型**（如 base64, json-formatter）：textarea 输入 → 按钮操作 → result-box 输出
2. **计算器型**（如 bmi, loan-calculator）：表单输入 → 计算按钮 → 结果展示
3. **生成器型**（如 password-generator, qrcode）：参数配置 → 生成按钮 → 结果/画布输出

### 共享模式

- **Toast 通知**：内联 `showToast()` 函数，2 秒自动消失
- **剪贴板复制**：`navigator.clipboard.writeText()` + toast 反馈
- **社交分享**：`share.js` 自动初始化 `#share-bar` 容器
- **错误处理**：try-catch 包裹，result-box 红色边框显示错误信息

### CSS 核心类

- `.container` — 首页内容容器（max-width: 1200px）
- `.tool-page` — 工具页容器（max-width: 960px）
- `.tools-grid` — 响应式卡片网格（auto-fill, minmax 260px）
- `.tool-card` — 白色卡片 + hover 效果
- `.btn` / `.btn-primary` / `.btn-secondary` — 按钮样式
- `.result-box` — 输出区域（成功绿色边框，错误红色边框）
- `.split-view` — 双栏编辑器/预览布局
- `.toast` — 固定定位通知气泡

主色：`#4361ee`（蓝），背景：`#f0f2f5`，响应式断点 768px。

## Adding New Tools

1. 创建 `src/tools/<tool-name>.html`，复制上述标准模板
2. 工具功能用内联 `<script>` 实现（vanilla JS，无外部依赖）
3. 添加 SEO meta 和 Schema.org 结构化数据
4. 在 `index.html` 的 `.tools-grid` 中添加工具卡片
5. 在 `sitemap.xml` 中添加 URL 条目
6. 在对应分类页（`tools/*.html`）中添加链接

## SEO Requirements

所有页面必须包含：
- `<title>` 格式：`工具名 - 在线工具箱`
- `<meta name="description">` 中文描述
- Open Graph 标签（og:title, og:description, og:url）
- `<link rel="canonical">` 指向 eitools.cn
- Schema.org JSON-LD（FAQPage 或 WebApplication）
- `lang="zh-CN"`

## Constraints

- 零外部 JS 依赖（仅 qrcode 工具使用一个 CDN 库）
- 所有数据处理在浏览器端完成，禁止发送用户数据到外部服务
- 单文件自包含（HTML + 内联 CSS + 内联 JS），仅引用 `css/style.css` 和 `js/share.js`
- 预算 ¥1000，域名 ¥55/年，部署免费，勿引入付费服务
