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
        <button onclick="shareFacebook()" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;background:#1877f2;color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.85rem;">Facebook</button>
        <button onclick="copyLink()" style="display:inline-flex;align-items:center;gap:4px;padding:6px 14px;background:#f0f2f5;color:#333;border:none;border-radius:6px;cursor:pointer;font-size:0.85rem;font-weight:500;">复制链接</button>
      </div>`;

    // Add share result button to result boxes
    document.querySelectorAll('.result-box').forEach(function(box) {
      if (!box.querySelector('.share-result-btn')) {
        var btn = document.createElement('button');
        btn.className = 'share-result-btn';
        btn.textContent = '📤 分享结果';
        btn.style.cssText = 'margin-top:8px;padding:6px 16px;background:#4361ee;color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.85rem;float:right;';
        btn.onclick = function() { shareResult(box.textContent || box.innerText); };
        box.style.position = 'relative';
        box.appendChild(btn);
      }
    });
  }

  // Share tool result content (not just URL)
  window.shareResult = function(resultText) {
    var shareText = resultText.substring(0, 200) + (resultText.length > 200 ? '...' : '');
    var shareUrl = encodeURIComponent(window.location.href);
    var shareTitle = encodeURIComponent(document.title + ' - 结果: ' + shareText);
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: shareTitle,
        url: window.location.href
      });
    } else {
      copyLink();
    }
  };

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
  window.shareFacebook = function() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
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

  // Auto-inject breadcrumb navigation + BreadcrumbList schema for tool pages
  function injectBreadcrumb() {
    if (document.querySelector('.breadcrumb-nav')) return;
    var h1 = document.querySelector('h1');
    if (!h1) return;
    var pageName = h1.textContent.trim();
    var path = window.location.pathname;

    // Determine category and breadcrumb path
    var category = '';
    var categoryUrl = '';
    var catMap = {
      'json': { name: 'JSON工具', url: 'tools/json-tools.html' },
      'base64': { name: '编码转换', url: 'tools/dev-tools.html' },
      'hash': { name: '开发工具', url: 'tools/dev-tools.html' },
      'aes': { name: '开发工具', url: 'tools/dev-tools.html' },
      'uuid': { name: '开发工具', url: 'tools/dev-tools.html' },
      'password': { name: '开发工具', url: 'tools/dev-tools.html' },
      'regex': { name: '开发工具', url: 'tools/dev-tools.html' },
      'cron': { name: '开发工具', url: 'tools/dev-tools.html' },
      'jwt': { name: '开发工具', url: 'tools/dev-tools.html' },
      'url-encoder': { name: '开发工具', url: 'tools/dev-tools.html' },
      'html-entities': { name: '开发工具', url: 'tools/dev-tools.html' },
      'css': { name: '开发工具', url: 'tools/dev-tools.html' },
      'js-minifier': { name: '开发工具', url: 'tools/dev-tools.html' },
      'html-minify': { name: '开发工具', url: 'tools/dev-tools.html' },
      'sql': { name: '开发工具', url: 'tools/dev-tools.html' },
      'xml': { name: '开发工具', url: 'tools/dev-tools.html' },
      'markdown': { name: '文本工具', url: 'tools/text-tools.html' },
      'word-counter': { name: '文本工具', url: 'tools/text-tools.html' },
      'text-counter': { name: '文本工具', url: 'tools/text-tools.html' },
      'text-stats': { name: '文本工具', url: 'tools/text-tools.html' },
      'case-converter': { name: '文本工具', url: 'tools/text-tools.html' },
      'char-frequency': { name: '文本工具', url: 'tools/text-tools.html' },
      'word-frequency': { name: '文本工具', url: 'tools/text-tools.html' },
      'text-diff': { name: '文本工具', url: 'tools/text-tools.html' },
      'text-replace': { name: '文本工具', url: 'tools/text-tools.html' },
      'text-unique': { name: '文本工具', url: 'tools/text-tools.html' },
      'pinyin': { name: '文本工具', url: 'tools/text-tools.html' },
      'simplified': { name: '文本工具', url: 'tools/text-tools.html' },
      'cjk': { name: '文本工具', url: 'tools/text-tools.html' },
      'punctuation': { name: '文本工具', url: 'tools/text-tools.html' },
      'lorem': { name: '文本工具', url: 'tools/text-tools.html' },
      'morse': { name: '编码转换', url: 'tools/dev-tools.html' },
      'rot13': { name: '编码转换', url: 'tools/dev-tools.html' },
      'unicode': { name: '开发工具', url: 'tools/dev-tools.html' },
      'ascii': { name: '开发工具', url: 'tools/dev-tools.html' },
      'number-base': { name: '编码转换', url: 'tools/dev-tools.html' },
      'binary-converter': { name: '编码转换', url: 'tools/dev-tools.html' },
      'byte-converter': { name: '编码转换', url: 'tools/dev-tools.html' },
      'storage-converter': { name: '编码转换', url: 'tools/dev-tools.html' },
      'unit-converter': { name: '编码转换', url: 'tools/dev-tools.html' },
      'temperature': { name: '编码转换', url: 'tools/dev-tools.html' },
      'color': { name: '颜色工具', url: 'tools/image-tools.html' },
      'gradient': { name: '颜色工具', url: 'tools/image-tools.html' },
      'box-shadow': { name: '颜色工具', url: 'tools/image-tools.html' },
      'palette': { name: '颜色工具', url: 'tools/image-tools.html' },
      'image': { name: '图片工具', url: 'tools/image-tools.html' },
      'qrcode': { name: '图片工具', url: 'tools/image-tools.html' },
      'qr-decoder': { name: '图片工具', url: 'tools/image-tools.html' },
      'barcode': { name: '图片工具', url: 'tools/image-tools.html' },
      'favicon': { name: '图片工具', url: 'tools/image-tools.html' },
      'drawing': { name: '图片工具', url: 'tools/image-tools.html' },
      'svg': { name: '图片工具', url: 'tools/image-tools.html' },
      'wireframe': { name: '图片工具', url: 'tools/image-tools.html' },
      'screen-color': { name: '颜色工具', url: 'tools/image-tools.html' },
      'bmi': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'age': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'percentage': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'discount': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'loan': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'mortgage': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'compound': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'tax': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'retirement': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'deposit': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'gpa': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'ideal-weight': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'simple-calculator': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'binary-calculator': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'area': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'triangle': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'distance': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'standard-deviation': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'profit': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'stock': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'fuel': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'electricity': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'math-solver': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'housing-fund': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'social-insurance': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'credit-card': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'speed-test': { name: '计算器工具', url: 'tools/calculator-tools.html' },
      'timestamp': { name: '日期时间', url: 'tools/all-tools.html' },
      'date': { name: '日期时间', url: 'tools/all-tools.html' },
      'countdown': { name: '日期时间', url: 'tools/all-tools.html' },
      'stopwatch': { name: '日期时间', url: 'tools/all-tools.html' },
      'timer': { name: '日期时间', url: 'tools/all-tools.html' },
      'weekday': { name: '日期时间', url: 'tools/all-tools.html' },
      'year-calc': { name: '日期时间', url: 'tools/all-tools.html' },
      'workday': { name: '日期时间', url: 'tools/all-tools.html' },
      'world-clock': { name: '日期时间', url: 'tools/all-tools.html' },
      'lunar': { name: '日期时间', url: 'tools/all-tools.html' },
      'sleep': { name: '生活工具', url: 'tools/all-tools.html' },
      'food': { name: '生活工具', url: 'tools/all-tools.html' },
      'exchange': { name: '生活工具', url: 'tools/all-tools.html' },
      'phone': { name: '生活工具', url: 'tools/all-tools.html' },
      'id-card': { name: '生活工具', url: 'tools/all-tools.html' },
      'screen-resolution': { name: '生活工具', url: 'tools/all-tools.html' },
      'screen-ruler': { name: '生活工具', url: 'tools/all-tools.html' },
      'ip': { name: '开发工具', url: 'tools/dev-tools.html' },
      'subnet': { name: '开发工具', url: 'tools/dev-tools.html' },
      'meta-tag': { name: '开发工具', url: 'tools/dev-tools.html' },
      'seo': { name: '开发工具', url: 'tools/dev-tools.html' },
      'http': { name: '开发工具', url: 'tools/dev-tools.html' },
      'emoji': { name: '趣味工具', url: 'tools/all-tools.html' },
      'zodiac': { name: '趣味工具', url: 'tools/all-tools.html' },
      'chinese-zodiac': { name: '趣味工具', url: 'tools/all-tools.html' },
      'blood-type': { name: '趣味工具', url: 'tools/all-tools.html' },
      'random-number': { name: '趣味工具', url: 'tools/all-tools.html' },
      'rand-str': { name: '趣味工具', url: 'tools/all-tools.html' },
      'firework': { name: '趣味工具', url: 'tools/all-tools.html' },
      'white-noise': { name: '趣味工具', url: 'tools/all-tools.html' },
      'typing': { name: '趣味工具', url: 'tools/all-tools.html' },
      'counter': { name: '趣味工具', url: 'tools/all-tools.html' },
      'text-clock': { name: '趣味工具', url: 'tools/all-tools.html' },
      'translator': { name: '文本工具', url: 'tools/text-tools.html' },
      'rmb': { name: '生活工具', url: 'tools/all-tools.html' },
      'number-chinese': { name: '文本工具', url: 'tools/text-tools.html' },
      'invisible': { name: '文本工具', url: 'tools/text-tools.html' },
      'html-to': { name: '开发工具', url: 'tools/dev-tools.html' },
      'csv-to': { name: '开发工具', url: 'tools/dev-tools.html' },
      'line-counter': { name: '文本工具', url: 'tools/text-tools.html' },
      'list-generator': { name: '文本工具', url: 'tools/text-tools.html' },
      'number-sort': { name: '文本工具', url: 'tools/text-tools.html' },
      'text-to-image': { name: '图片工具', url: 'tools/image-tools.html' },
      'text-to-speech': { name: '文本工具', url: 'tools/text-tools.html' },
      'text-wrap': { name: '文本工具', url: 'tools/text-tools.html' },
      'text-repeater': { name: '文本工具', url: 'tools/text-tools.html' },
      'string-length': { name: '文本工具', url: 'tools/text-tools.html' },
      'placeholder': { name: '图片工具', url: 'tools/image-tools.html' },
      'id-photo': { name: '图片工具', url: 'tools/image-tools.html' }
    };

    // Match tool file name to category
    var fileName = path.split('/').pop().replace('.html', '');
    var isEn = path.includes('/en/');
    var prefix = isEn ? '../../' : '../../';
    var homeUrl = isEn ? '../../index.html' : '../../index.html';

    var cat = null;
    for (var key in catMap) {
      if (fileName.indexOf(key) === 0) {
        cat = catMap[key];
        break;
      }
    }

    // Inject breadcrumb HTML
    if (cat) {
      var nav = document.createElement('nav');
      nav.className = 'breadcrumb-nav';
      nav.setAttribute('aria-label', 'Breadcrumb');
      nav.style.cssText = 'font-size:0.85rem;color:#888;margin-bottom:8px;padding:0;';
      nav.innerHTML = '<a href="' + prefix + 'index.html" style="color:#4361ee;text-decoration:none;">首页</a> <span style="margin:0 6px;">&rsaquo;</span> <a href="' + prefix + cat.url + '" style="color:#4361ee;text-decoration:none;">' + cat.name + '</a> <span style="margin:0 6px;">&rsaquo;</span> <span style="color:#555;">' + pageName + '</span>';
      h1.parentNode.insertBefore(nav, h1);
    }

    // Inject BreadcrumbList JSON-LD schema
    if (cat) {
      var base = window.location.origin;
      var canonical = (document.querySelector('link[rel="canonical"]') || {}).href || window.location.href;
      var schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": "首页", "item": base + "/"},
          {"@type": "ListItem", "position": 2, "name": cat.name, "item": base + "/" + cat.url},
          {"@type": "ListItem", "position": 3, "name": pageName, "item": canonical}
        ]
      };
      var script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectBreadcrumb);
  } else {
    injectBreadcrumb();
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
        <a href="${prefix}shareable-content/calculator-widget.html" style="color:#999;text-decoration:none;">嵌入工具</a>
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
