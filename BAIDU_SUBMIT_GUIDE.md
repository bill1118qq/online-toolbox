# 百度收录操作指南

## 步骤 1: 注册百度站长平台
1. 打开 https://ziyuan.baidu.com
2. 用百度账号登录
3. 点击「用户中心」→「站点管理」→「添加网站」
4. 输入 `https://eitools.cn`
5. 选择验证方式：**HTML 标签验证**

## 步骤 2: 验证站点
1. 百度会给你一个 meta 标签，格式如：
   `<meta name="baidu-site-verification" content="xxxxxx">`
2. 告诉我这个 content 值，我会把它加到 index.html 的 <head> 中
3. 点击「验证」按钮

## 步骤 3: 提交 sitemap
1. 验证通过后，进入「普通收录」→「链接提交」
2. 输入 sitemap URL: `https://eitools.cn/sitemap.xml`
3. 点击「提交」

## 步骤 4: 获取推送 API token
1. 进入「普通收录」→「资源提交」→「API提交」
2. 获取推送接口地址和 token
3. 格式为: `http://data.zz.baidu.com/urls?site=eitools.cn&token=XXXXX`
4. 告诉我 token 值，我可以批量推送所有 231 个 URL

## 备选: 文件验证
如果选择文件验证，百度会给你一个文件名如 `baidu_verify_xxxx.html`
告诉我文件名，我直接创建这个文件到根目录

## 注意事项
- 百度收录新站通常需要 1-2 周
- 提交 sitemap 后百度会自动发现新页面
- 可以用百度的「抓取诊断」工具检查收录状态
- 百度更偏好中文内容，我们的站点内容完全匹配
