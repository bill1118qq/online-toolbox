// EITools AdSense 广告组件（v2）
// 统一读取 js/ads-config.js 的配置：
//   - client 未配置（空或占位 ca-pub-XXXXX）时，本脚本不做任何事，不发网络请求
//   - client 配置后，动态加载 adsbygoogle.js 并初始化各广告位
// 合规约束：每页最多 3 个展示广告单元（AdSense 政策）
(function () {
  'use strict';

  var cfg = window.EITOOLS_ADS || {};
  var client = (cfg.client || '').trim();

  // 占位符 / 空值 → 不加载任何广告
  if (!client || client.indexOf('XXXXX') !== -1) {
    return;
  }

  // 广告位定义：容器 id → {slot, format}
  // 首页：top / content / bottom；工具页：inpage（容器不存在时自动跳过）
  var AD_SLOTS = [
    { id: 'ad-top-banner', slot: cfg.slots.top || '', format: 'auto' },
    { id: 'ad-content-1', slot: cfg.slots.content || '', format: 'auto' },
    { id: 'ad-bottom-banner', slot: cfg.slots.bottom || '', format: 'auto' },
    { id: 'ad-inpage-1', slot: cfg.slots.inpage || '', format: 'auto' }
  ];

  function initAds() {
    AD_SLOTS.forEach(function (def) {
      var container = document.getElementById(def.id);
      if (!container) return;
      // 容器必须可见才插入广告（避免 AdSense 无效展示判定）
      if (container.style.display === 'none') {
        container.style.display = 'block';
      }
      var ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', client);
      if (def.slot) ins.setAttribute('data-ad-slot', def.slot);
      ins.setAttribute('data-ad-format', def.format);
      ins.setAttribute('data-full-width-responsive', 'true');
      container.appendChild(ins);
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) { /* 忽略单次 push 失败 */ }
    });
  }

  function loadAdScript() {
    var s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(client);
    document.head.appendChild(s);
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  loadAdScript();
  ready(initAds);
})();
