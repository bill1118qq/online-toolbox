# Bing 收录操作指南

## 步骤 1: 注册 Bing Webmaster
1. 打开 https://www.bing.com/webmasters
2. 用 Microsoft 账号登录（或注册）
3. 输入 `eitools.cn`，点击「添加」

## 步骤 2: 验证站点
选择以下任一方式：
- **XML 文件验证**: 下载 bing-site-auth.xml，放到网站根目录
- **HTML meta 标签**: 添加 `<meta name="msvalidate.01" content="XXXXX">`
- **DNS CNAME**: 添加 CNAME 记录

## 步骤 3: 提交 sitemap
1. 验证通过后，进入「站点管理」
2. 找到「站点地图」→「提交站点地图」
3. 输入: `https://eitools.cn/sitemap.xml`

## 注意
- 我们已经通过 IndexNow 向 Bing 提交了 370 个 URL
- IndexNow 的效果通常 24-48 小时内生效
- Bing 站长平台可以监控索引状态
- Bing 的索引数据会共享给 Yahoo
