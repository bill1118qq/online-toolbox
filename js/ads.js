// EITools AdSense 广告组件
// 在页面加载后动态插入广告位，方便统一管理
(function() {
  // AdSense 发布商 ID - 需要替换为实际的 ca-pub-XXXXX
  const ADSENSE_CLIENT = 'ca-pub-XXXXX';

  function createAdSlot(containerId, adSlot, format) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', ADSENSE_CLIENT);
    ins.setAttribute('data-ad-slot', adSlot);
    ins.setAttribute('data-ad-format', format || 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');
    container.appendChild(ins);
    try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
  }

  // 在 DOM 加载后初始化广告
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAds);
  } else {
    initAds();
  }

  function initAds() {
    // 首页顶部横幅
    createAdSlot('ad-top-banner', '', 'auto');
    // 内容区域广告
    createAdSlot('ad-content-1', '', 'auto');
    createAdSlot('ad-content-2', '', 'auto');
    // 底部横幅
    createAdSlot('ad-bottom-banner', '', 'auto');
  }
})();
