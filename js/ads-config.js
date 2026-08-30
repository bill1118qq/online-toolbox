// EITools AdSense 统一配置
// 唯一需要修改的文件：拿到 AdSense 审批通过后的发布商 ID 后，
// 把下方 client 替换为真实的 ca-pub-XXXXXXXXXXXX 即可全站生效。
// 留空或保留 ca-pub-XXXXX 占位时，全站不加载任何广告脚本（零无效请求）。
window.EITOOLS_ADS = {
  client: '',          // 例：'ca-pub-1234567890123456'
  // 每个广告容器（data-ad-slot 留空 = 由 AdSense 自动匹配广告单元）
  slots: {
    top: '',
    content: '',
    bottom: '',
    inpage: ''
  }
};
