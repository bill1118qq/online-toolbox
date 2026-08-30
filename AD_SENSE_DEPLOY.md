# AdSense 部署与上线操作手册（eitools.cn）

> 代码侧已 100% 就绪：全站（首页 + 163 个中文工具页 + 英文版）已接入广告位，
> 只差一个真实的 AdSense 发布商 ID。本手册覆盖申请 → 替换 → 生效全流程。
> 更新：2026-08-30

---

## 一、代码侧现状（已部署）

| 组件 | 文件 | 说明 |
|------|------|------|
| 统一配置 | `js/ads-config.js` | **全站唯一需要改的 JS 文件**。`client` 留空 = 全站零广告请求 |
| 广告组件 | `js/ads.js` | 读 config；ID 有效才加载 adsbygoogle.js 并渲染广告位 |
| 首页广告位 | `index.html` / `en/index.html` | top / content-1 / bottom 三个容器，每页 ≤3 个广告单元（政策合规） |
| 工具页广告位 | `src/tools/*.html`（163 个）、`en/src/tools/*.html`（20 个） | 每个工具页 1 个内容区广告位 |
| 授权声明 | `ads.txt` | 根目录，AdSense 站点验证必需（当前为占位 pub ID） |
| 隐私披露 | `privacy.html` | 已含 AdSense Cookie 与第三方服务披露，无需改动 |

设计要点：ID 未配置时**不发任何广告请求**（不会拖慢页面、不会产生无效展示判定）；拿到 ID 后只改 2 个文件即可全站生效。

---

## 二、申请 AdSense（需要青见本人操作，约 15-30 分钟 + 审核数天）

1. 打开 https://adsense.google.com/start/ ，用 Google 账号登录
2. 填写站点 URL：`https://eitools.cn`
3. 国家/地区选中国，收款方式选你方便的方式（电汇/西联，审核通过后到「付款」里补全收款信息）
4. 站点验证：Google 会让你把一段代码放进网站 `<head>`，或上传 ads.txt。
   **本项目走 ads.txt 路线即可**——见下一步，先替换 pub ID 再提交验证。
5. 提交后 Google 审核（通常 2-14 天，工具站需内容充足：本站 156+ 工具 + 27 篇 guides + about/contact/privacy 页齐全，通过率较好）

⚠️ 两个硬性条件：
- 提交审核时网站必须能正常访问（本站 Vercel 常驻，OK）
- `ads.txt` 必须能在 `https://eitools.cn/ads.txt` 直接访问到（本次已部署占位版，替换 ID 后即满足）

---

## 三、拿到发布商 ID 后（2 处替换，5 分钟）

AdSense 后台「账户 → 设置 → 账户信息」里的发布商 ID，格式 `pub-1234567890123456`。

```bash
cd claude_earn_money

# 1) 替换 js/ads-config.js 里的 client
python3 - <<'EOF'
import re
s = open('js/ads-config.js', encoding='utf-8').read()
s = re.sub(r"client:\s*'',", "client: 'ca-pub-你的ID',", s)
open('js/ads-config.js', 'w', encoding='utf-8').write(s)
EOF

# 2) 替换 ads.txt 里的占位 pub ID（注意：不带 ca- 前缀）
sed -i '' 's/pub-XXXXXXXXXXXXXXXX/pub-你的ID/' ads.txt

git add -A && git commit -m "feat: enable Google AdSense with publisher ID" && git push
```

push 后 Vercel 自动部署，约 1 分钟内全站广告生效。验证：
- `https://eitools.cn/ads.txt` 返回你的 pub ID 行
- 打开任意工具页，源码里出现 `pagead2.googlesyndication.com` 请求
- AdSense 后台「广告 → 概览」开始出现展示数据

---

## 四、可选增强（审核通过后）

1. **自动广告（推荐开启）**：AdSense 后台「广告 → 按网站 → 自动广告」开启后，
   Google 自动在全站挑位置放广告，**代码无需任何改动**（与手动广告位共享同一加载脚本）。
   注意：开启后实际广告数量由 Google 控制，手动位 + 自动位合计每页可能超 3 个，属政策允许（自动广告不计数）。
2. **广告单元细化**：在后台为「首页顶部」「工具页内容」分别创建广告单元，
   把 slot ID 填进 `js/ads-config.js` 的 `slots` 字段，便于按位置看收入。
3. **屏蔽低质页面**：若某工具页跳出率极高，可在 AdSense 后台将其排除出自动广告。

## 五、收益预期（供参考）

工具站 RPM 通常 $1-4/千次展示（中文流量偏低、英文流量偏高）。
若 GA4 显示日均 500-1000 PV，月广告收入大致在 $10-60 区间；英文版 `/en/` 收录起来后 RPM 更高。
先跑 4-6 周数据再决定要不要调广告密度。

## 六、风险与红线（违反会被封号）

- 禁止自己点自己网站上的广告（不要用个人设备刷）
- 禁止诱导点击（"点广告支持我们"之类文案/箭头指向广告）
- 禁止把广告放在没有内容的页面；工具页有功能交互算有效内容
- 每页手动广告单元 ≤3（当前实现已满足）
- 不要在登录后页面/敏感页面放广告（本站无此类页面）
