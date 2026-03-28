# EITools (eitools.cn) 网站提交外链建设指南

> 最后更新：2026-03-28
> 本文档列出了所有可以免费提交 eitools.cn 的渠道，按优先级排序。
> 网站定位：中文在线工具箱，109+ 个免费在线工具，纯浏览器端计算。

---

## A. 搜索引擎提交（优先级最高）

搜索引擎是最大的流量来源，必须优先完成。

| 平台 | 提交入口 | 状态 | 详细指南 |
|------|---------|------|---------|
| **Google Search Console** | https://search.google.com/search-console | 需手动操作 | 见 `GOOGLE_SEARCH_CONSOLE_GUIDE.md` |
| **百度站长平台** | https://ziyuan.baidu.com | 需手动操作 | 见 `BAIDU_SUBMIT_GUIDE.md` |
| **Bing Webmaster** | https://www.bing.com/webmasters | 需手动操作 | 见 `BING_SUBMIT_GUIDE.md` |
| **360 搜索** | http://hao.360.cn/url.html | 需手动提交 | 填写网站 URL，等待审核 |
| **Yandex Webmaster** | https://webmaster.yandex.com | 需手动操作 | 支持 IndexNow 协议 |
| **DuckDuckGo** | 无提交入口 | 自然抓取 | 通过 sitemap.xml 和外链自然收录 |
| **IndexNow（通用）** | https://www.indexnow.org | 支持 API | 已配置 key，可通过脚本批量提交 |
| **搜狗站长平台** | https://zhanzhang.sogou.com | 需手动操作 | 需注册搜狗账号验证 |
| **神马搜索（移动端）** | https://zhanzhang.sm.cn | 需手动操作 | 移动搜索，UC 浏览器内置引擎 |

### 操作清单

- [ ] Google Search Console 验证并提交 sitemap
- [ ] 百度站长平台验证并提交 sitemap
- [ ] Bing Webmaster 验证并提交 sitemap
- [ ] 360 搜索提交网站 URL
- [ ] Yandex Webmaster 验证并提交 sitemap
- [ ] 运行 `node scripts/auto-submit.js` 执行 IndexNow 批量提交
- [ ] 搜狗站长平台验证
- [ ] 神马搜索验证

---

## B. 中文网址导航站（国内流量 + SEO 外链）

中文网址导航站是获取国内直接流量和高质量外链的重要渠道。

### 一线导航站（权重高，审核严）

| 站点 | 提交入口 | 审核周期 | 备注 |
|------|---------|---------|------|
| **hao123**（百度旗下） | http://submit.hao123.com/static/auditSys/wztj.htm | 1-4 周 | 需备案，审核严格，权重最高 |
| **2345 网址导航** | https://www.2345.com/ （底部找收录入口） | 1-2 周 | 需备案 |
| **360 导航** | http://hao.360.cn/url.html | 1-2 周 | 需备案 |
| **搜狗网址导航** | https://123.sogou.com/ | 不定 | 需备案 |
| **UC 导航** | https://nav.uc.cn/ | 不定 | 需备案 |

### 二线导航站（权重中等，较易收录）

| 站点 | 提交入口 | 备注 |
|------|---------|------|
| **114啦网址导航** | https://www.114la.com/ | 老牌导航站 |
| **金山网址导航** | https://dir.ijinshan.com/ | 金山旗下 |
| **酷站网址导航** | https://www.kuozhan.com/ | 支持免费提交 |
| **1616网址导航** | https://www.1616.net/ | 老牌导航 |
| **265上网导航** | https://www.265.com/ | Google 旗下 |
| **爱绿软** | https://www.ilvruan.com/ | 软件工具导航 |

### 三线分类目录（审核宽松，适合快速获取外链）

| 站点 | 提交入口 | 备注 |
|------|---------|------|
| **587目录网** | https://www.587w.com/ | 免费收录，自动审核 |
| **分类目录导航** | https://www.flw001.com/ | 免费提交 |
| **网站目录** | https://www.wzdir.com/ | 免费提交 |
| **网站收录网** | https://www.neacg.cn/ | 免费收录 |
| **9K 导航** | https://www.i9k.cn/ | AI 工具导航，自动秒收录 |
| **爱站网收录** | https://www.aizhan.com/ | SEO 工具 + 收录 |
| **站长之家目录** | https://www.chinaz.com/ | 可提交网站 |
| **519导航** | https://www.51939.com/ | 免费提交 |
| **好网站导航** | https://www.haowz.com/ | 免费收录 |
| **酷站目录** | https://www.kuzhan.com/ | 免费提交 |
| **114分类目录** | https://www.114.fm/ | 免费提交 |
| **DMOZ 类目录** | 搜索「开放目录免费提交」 | 各类开放式目录 |
| **网址提交网** | https://www.wztj.com/ | 批量提交入口 |
| **快站目录** | https://www.kuaizhan.com/ | 免费提交 |
| **收录网** | https://www.shouluwang.com/ | 免费收录 |
| **中国网址大全** | https://www.cnwww.com/ | 免费收录 |
| **网站分类目录** | https://www.fenleidir.com/ | 免费提交 |
| **网址之家目录** | https://www.urlhome.cn/ | 免费提交 |

### 提交技巧

1. **准备标准描述**：网站名称 "EITools在线工具箱"，描述 "提供109+免费在线工具，包括JSON格式化、计算器、文本处理、图片工具等，所有计算均在浏览器端完成"
2. **选择正确分类**：提交到「工具」「软件」「效率」「实用工具」分类
3. **关键词优化**：使用 "在线工具""免费工具箱""JSON格式化""在线计算器" 等关键词
4. **批量提交策略**：先提交三线目录（快速收录），再逐步申请一二线导航

---

## C. 英文工具目录网站（国际流量 + 高权重外链）

英文目录网站通常有较高的域名权重（DA），对 Google 排名帮助极大。

### 综合工具/软件目录

| 站点 | 提交入口 | DA（域名权重） | 备注 |
|------|---------|---------------|------|
| **Product Hunt** | https://www.producthunt.com/posts/new | 93 | 最知名的新产品发布平台，需要英文描述 |
| **AlternativeTo** | https://alternativeto.net/add-app/ | 73 | 软件替代品推荐，适合以工具定位提交 |
| **G2** | https://www.g2.com/products/new | 93 | 软件评测平台，免费提交 |
| **Capterra** | https://www.capterra.com/ | 92 | 软件目录，免费提交 |
| **Software Advice** | https://www.softwareadvice.com/ | 85 | 软件咨询平台 |
| **ToolFinder** | https://www.toolfinder.co/submit | 50+ | 工具发现平台 |
| **ThereAreLinks** | https://www.therearelinks.com/submit | 30+ | 网站提交目录 |
| **SaaSHub** | https://www.saashub.com/submit | 56 | SaaS 产品目录 |

### AI 工具目录（虽然 eitools 不完全是 AI 工具，但包含部分 AI 相关功能）

| 站点 | 提交入口 | 备注 |
|------|---------|------|
| **Futurepedia** | https://www.futurepedia.io/submit | AI 工具目录 |
| **Dang.ai** | https://www.dang.ai/submit | AI 工具目录 |
| **AI Tool Hunt** | https://www.aitoolhunt.com/submit | AI 工具发现 |
| **Toolify** | https://www.toolify.ai/submit | AI 工具目录 |
| **There's An AI For That** | https://theresanaiforthat.com/submit | AI 工具搜索引擎 |

### 开发者工具目录

| 站点 | 提交入口 | 备注 |
|------|---------|------|
| **DevHub** | https://devhub.io/ | 开发者工具目录 |
| **StackShare** | https://stackshare.io/ | 技术栈分享平台 |
| **Dev.to** | https://dev.to/ | 开发者社区，可发布工具介绍文章 |
| **Hashnode** | https://hashnode.com/ | 博客平台，可写工具评测 |

### 通用免费目录（高 DA）

| 站点 | 提交入口 | DA | 备注 |
|------|---------|-----|------|
| **Jasmine Directory** | https://www.jasminedirectory.com/submit | 54 | 付费优先，免费可选 |
| **Blogarama** | https://www.blogarama.com/submit-blog | 59 | 博客目录 |
| **Spokeo** | 搜索 "submit website" | 70+ | 通用目录 |
| **Brownbook** | https://www.brownbook.net/ | 50+ | 通用目录 |

### 提交技巧

1. **英文描述模板**：
   - 名称：EITools - Free Online Toolbox
   - 描述：109+ free online tools including JSON formatter, calculators, text processors, and image tools. All processing happens in your browser - no data sent to servers.
   - 分类：Developer Tools / Online Tools / Utilities
2. **截图准备**：准备 1280x720 的英文截图
3. **利用现有外链**：引用 GitHub 仓库增加可信度

---

## D. 社交书签与内容平台（国内）

通过在社交平台发布有价值的内容来获取外链和流量。

### 技术问答/社区

| 平台 | 策略 | DA |
|------|------|-----|
| **知乎** | 回答 "有什么好用的在线工具" 类问题，植入链接 | 93 |
| **CSDN** | 发布 "推荐109个免费在线工具" 类文章 | 85 |
| **博客园** | 发布工具介绍文章 | 70 |
| **掘金** | 发布前端工具/开发者工具类文章 | 60 |
| **V2EX** | 发布 "分享：我做了一个在线工具箱" 分享帖 | 53 |
| **SegmentFault** | 发布技术工具推荐文章 | 55 |
| **开源中国** | 推荐到每日开源软件板块 | 65 |
| **简书** | 发布工具推荐文章 | 75 |
| **豆瓣** | 创建工具相关小组或讨论 | 93 |

### 内容发布平台

| 平台 | 策略 | 备注 |
|------|------|------|
| **百家号** | 发布工具评测/教程文章 | 百度系，SEO 加权 |
| **搜狐号** | 发布工具推荐文章 | SEO 加权 |
| **头条号** | 发布工具推荐文章 | 流量大 |
| **腾讯内容开放平台** | 发布文章 | QQ 浏览器推荐 |
| **网易号** | 发布文章 | 网易系流量 |
| **知乎专栏** | 发布系列文章 | 专业度高 |

### 视频平台

| 平台 | 策略 | 备注 |
|------|------|------|
| **B站** | 制作工具使用教程视频 | 描述中放链接 |
| **抖音** | 工具推荐短视频 | 评论区引导 |
| **小红书** | 工具推荐图文笔记 | 适合效率工具 |

### 书签/收藏平台

| 平台 | 提交方式 | 备注 |
|------|---------|------|
| **QQ 书签** | 收藏网站 | 百度可抓取 |
| **百度收藏** | 已下线 | - |
| **好推** | 提交网站 | 社交书签 |
| **乐收** | 收藏分享 | 社交书签 |

---

## E. 开发者社区与代码平台（国际流量）

| 平台 | 提交入口 | DA | 策略 |
|------|---------|-----|------|
| **GitHub** | https://github.com/bill1118qq/online-toolbox | 96 | 在 README 中添加项目链接和徽章 |
| **GitHub Pages** | 仓库 pages | 96 | 部署文档站 |
| **DEV.to** | https://dev.to/enter | 80 | 发布 "Building a Free Online Toolbox" 文章 |
| **Hashnode** | https://hashnode.com/ | 63 | 发布技术博客 |
| **Hacker News** | https://news.ycombinator.com/ | 94 | Show HN: 109 Free Online Tools |
| **Indie Hackers** | https://www.indiehackers.com/ | 67 | 分享项目 |
| **Reddit** | r/webdev, r/SideProject | 90+ | 分享项目 |
| **Lobste.rs** | https://lobste.rs/ | 72 | 开发者社区 |
| **Product Hunt** | （见 C 部分） | 93 | 发布产品 |

### GitHub README 优化要点

在 README.md 中加入以下内容：

```markdown
## Live Demo
Visit [eitools.cn](https://eitools.cn) to try all 109+ tools.

## Features
- 109+ free online tools
- Zero server-side processing - all computation in browser
- No registration required
- Mobile responsive

## Tools Categories
- Developer Tools (JSON, Base64, Regex, etc.)
- Text Tools (word counter, case converter, etc.)
- Calculators (BMI, loan, age, etc.)
- Image Tools (compression, resize, etc.)
```

---

## F. Web 2.0 平台（高质量外链）

通过在 Web 2.0 平台创建内容页面获取免费外链。

| 平台 | 类型 | DA | 备注 |
|------|------|-----|------|
| **Medium** | 博客 | 95 | 发布英文工具介绍文章 |
| **WordPress.com** | 博客 | 93 | 创建免费博客，发布介绍 |
| **Tumblr** | 博客 | 88 | 发布工具介绍 |
| **Blogger** | 博客 | 89 | Google 旗下，SEO 友好 |
| **Wix** | 网站 | 93 | 免费建站 |
| **Weebly** | 网站 | 90 | 免费建站 |
| **GitBook** | 文档 | 85 | 创建工具使用文档 |
| **Notion** | 文档 | 89 | 创建工具合集页面 |

---

## G. RSS / Ping 服务

通知聚合服务有新内容更新，加速收录。

| 服务 | 提交方式 | 备注 |
|------|---------|------|
| **Google Ping** | `https://www.google.com/ping?sitemap=https://eitools.cn/sitemap.xml` | 直接访问 |
| **Bing Ping** | `https://www.bing.com/ping?sitemap=https://eitools.cn/sitemap.xml` | 直接访问 |
| **Pingomatic** | https://pingomatic.com/ | 批量 ping |
| **Feedburner** | https://feedburner.google.com/ | 创建 RSS feed |

---

## H. 自动化脚本说明

本项目提供了 `scripts/auto-submit.js` 自动提交脚本，支持以下自动化操作：

1. **IndexNow 批量提交** - 自动从 sitemap.xml 提取所有 URL 并提交到 IndexNow API（同时通知 Bing 和 Yandex）
2. **搜索引擎 Ping** - 自动 ping Google、Bing 通知 sitemap 更新
3. **百度主动推送** - 如果配置了百度推送 token，可自动批量推送 URL

运行方式：
```bash
node scripts/auto-submit.js
```

---

## 执行优先级建议

### 第一阶段（第 1 周）- 必须完成
1. Google Search Console 验证 + sitemap 提交
2. 百度站长平台验证 + sitemap 提交
3. Bing Webmaster 验证 + sitemap 提交
4. 运行 IndexNow 批量提交脚本
5. 提交 360 搜索

### 第二阶段（第 2-3 周）- 高优先级
6. 提交 Product Hunt
7. 提交 AlternativeTo
8. 知乎回答 3-5 个相关问题
9. CSDN 发布 1-2 篇工具推荐文章
10. 提交 10 个三线中文导航站

### 第三阶段（第 4-6 周）- 持续进行
11. 逐步提交剩余中文导航站
12. 发布到 DEV.to、Hashnode 等国际开发者社区
13. 创建 Medium 博客文章
14. Hacker News Show HN
15. 提交 SaaSHub、G2 等英文目录

### 第四阶段（持续维护）
16. 每月运行一次 IndexNow 脚本提交新 URL
17. 在社交平台定期发布新工具介绍
18. 监控各平台收录状态

---

## 参考资源

- [IndexNow 官方文档](https://www.indexnow.org/)
- [LinkDR - 99+ Directories to Submit Your Tool](https://linkdr.com/directories)
- [5000 个免费基础外链清单（2026 年更新）](https://www.daluoseo.com/4000%E4%B8%AA%E5%85%8D%E8%B4%B9%E5%9F%BA%E7%A1%80%E5%A4%96%E9%93%BE%E6%B8%85%E5%8D%95%EF%BC%882025%E5%B9%B4%E6%9B%B4%E6%96%B0%EF%BC%89/)
- [让互联网收录你的网站 - 最全入口大全 2025](https://zhuanlan.zhihu.com/p/1975579545483616851)
- [各大搜索引擎网站收录提交入口大全](https://www.9wdn.com/detail?id=417)
