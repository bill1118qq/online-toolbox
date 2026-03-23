// Google Analytics
(function(){
  var s = document.createElement('script');
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-HHMQZC85HG';
  s.async = true;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-HHMQZC85HG');
})();

// share.js - 社交分享按钮（微信/微博/QQ/复制链接）
// 在工具页面底部引入: <script src="../../js/share.js"></script>
(function() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  const desc = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');

  function init() {
    const el = document.getElementById('share-bar');
    if (!el) return;
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 0;margin-top:24px;border-top:1px solid #eee;">
        <span style="font-size:0.85rem;color:#888;margin-right:4px;">分享：</span>
        <button onclick="shareWeibo()" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;background:#e6162d;color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.85rem;font-weight:500;">微博</button>
        <button onclick="shareQQ()" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;background:#12b7f5;color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.85rem;font-weight:500;">QQ</button>
        <button onclick="shareWeChat()" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;background:#07c160;color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.85rem;font-weight:500;">微信</button>
        <button onclick="shareTwitter()" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;background:#1a1a2e;color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.85rem;">X</button>
        <button onclick="copyLink()" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;background:#f0f2f5;color:#333;border:none;border-radius:6px;cursor:pointer;font-size:0.85rem;font-weight:500;">复制链接</button>
      </div>`;
  }

  window.shareWeibo = function() {
    window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${title}`, '_blank');
  };
  window.shareQQ = function() {
    window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&desc=${desc}`, '_blank');
  };
  window.shareWeChat = function() {
    const qr = document.createElement('div');
    qr.id = 'wx-qr';
    qr.style.css = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;';
    qr.innerHTML = `<div style="background:white;padding:24px;border-radius:12px;text-align:center;max-width:300px;">
      <p style="font-weight:600;margin-bottom:12px;">微信扫码分享</p>
      <div id="wx-qr-img"></div>
      <p style="font-size:0.8rem;color:#888;margin-top:8px;">打开微信 → 扫一扫</p>
      <button onclick="document.getElementById('wx-qr').remove()" style="margin-top:12px;padding:8px 24px;background:#f0f2f5;border:none;border-radius:6px;cursor:pointer;">关闭</button>
    </div>`;
    qr.onclick = function(e) { if (e.target === qr) qr.remove(); };
    document.body.appendChild(qr);
    // Generate QR code via API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${url}`;
    document.getElementById('wx-qr-img').innerHTML = `<img src="${qrUrl}" alt="QR" style="width:200px;height:200px;">`;
  };
  window.shareTwitter = function() {
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
  };
  window.copyLink = function() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const btn = event.target;
      const orig = btn.textContent;
      btn.textContent = '已复制!';
      setTimeout(() => btn.textContent = orig, 1500);
    });
  };

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Auto-inject footer with legal links (if no footer exists)
  function injectFooter() {
    if (document.querySelector('footer') || document.querySelector('.site-footer')) return;
    // Determine root path depth for correct link prefixes
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    let prefix = '';
    if (depth >= 2 && path.includes('/src/') || path.includes('/guides/')) {
      prefix = '../';
    } else if (depth >= 1 && path.includes('/tools/')) {
      prefix = '../';
    }
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.style.cssText = 'margin-top:40px;padding:20px 0;text-align:center;font-size:0.85rem;color:#999;border-top:1px solid #eee;';
    footer.innerHTML = `<div style="max-width:960px;margin:0 auto;padding:0 20px;">
      <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;">
        <a href="${prefix}about.html" style="color:#999;text-decoration:none;">关于我们</a>
        <a href="${prefix}contact.html" style="color:#999;text-decoration:none;">联系我们</a>
        <a href="${prefix}privacy.html" style="color:#999;text-decoration:none;">隐私政策</a>
        <a href="${prefix}terms.html" style="color:#999;text-decoration:none;">服务条款</a>
      </div>
      <p>&copy; 2026 EITools 在线工具箱 - 所有工具均在浏览器本地运行</p>
    </div>`;
    document.body.appendChild(footer);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }
})();
