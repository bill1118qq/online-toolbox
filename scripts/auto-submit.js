/**
 * EITools (eitools.cn) 自动提交脚本
 *
 * 功能：
 * 1. 从 sitemap.xml 提取所有 URL
 * 2. 通过 IndexNow API 批量提交 URL 到 Bing/Yandex 等搜索引擎
 * 3. 百度主动推送（需配置 token）
 *
 * 用法：
 *   node scripts/auto-submit.js                    # 全部执行（IndexNow + 百度）
 *   node scripts/auto-submit.js --indexnow         # 仅 IndexNow
 *   node scripts/auto-submit.js --baidu            # 仅百度推送
 *   node scripts/auto-submit.js --verify-key       # 验证 IndexNow key 文件是否可访问
 *   node scripts/auto-submit.js --sitemap-only     # 仅提取并打印 URL
 *   node scripts/auto-submit.js --urls=5           # 仅提交最近 5 个 URL（测试用）
 *
 * 环境变量（可选）：
 *   BAIDU_PUSH_TOKEN - 百度站长平台推送 token
 */

const https = require('https');
const http = require('http');

// ===== 配置 =====
const CONFIG = Object.freeze({
  host: 'eitools.cn',
  sitemapUrl: 'https://eitools.cn/sitemap.xml',
  sitemapEnUrl: 'https://eitools.cn/sitemap-en.xml',
  indexNowKey: 'e3a5926c4b2b9bf5d2ea4ad54814b062',
  indexNowEndpoints: Object.freeze([
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ]),
  indexNowBatchSize: 10000,
  indexNowRetryCount: 2,
  indexNowRetryDelayMs: 3000,
  baiduPushBaseUrl: 'http://data.zz.baidu.com/urls?site=eitools.cn',
  requestTimeout: 30000,
});

// ===== 工具函数 =====

function logSuccess(message) {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] OK   ${message}`);
}

function logError(message) {
  const ts = new Date().toISOString().slice(11, 19);
  console.error(`[${ts}] ERR  ${message}`);
}

function logInfo(message) {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] INFO ${message}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 发起 HTTP/HTTPS 请求
 * @param {string} urlStr
 * @param {{method?: string, headers?: Record<string, string>, body?: string}} options
 * @returns {Promise<{statusCode: number, body: string}>}
 */
function makeRequest(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const { method = 'GET', headers = {}, body = undefined } = options;
    const parsedUrl = new URL(urlStr);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method,
      headers,
      timeout: CONFIG.requestTimeout,
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request to ${urlStr} timed out`));
    });

    if (body !== undefined) {
      req.write(body);
    }
    req.end();
  });
}

/**
 * 从 sitemap.xml 提取 URL 列表
 * @param {string} sitemapUrl
 * @returns {Promise<string[]>}
 */
async function fetchUrlsFromSitemap(sitemapUrl) {
  logInfo(`Fetching sitemap: ${sitemapUrl}`);
  const { statusCode, body } = await makeRequest(sitemapUrl);

  if (statusCode !== 200) {
    throw new Error(`Failed to fetch sitemap: HTTP ${statusCode}`);
  }

  const locMatches = body.match(/<loc>(.*?)<\/loc>/g);
  if (!locMatches || locMatches.length === 0) {
    throw new Error('No URLs found in sitemap');
  }

  const urls = locMatches.map((match) => match.replace(/<\/?loc>/g, ''));
  logSuccess(`Found ${urls.length} URLs in ${sitemapUrl}`);
  return urls;
}

// ===== IndexNow 提交 =====

/**
 * 验证 IndexNow key 文件是否可通过网络访问
 * @returns {Promise<boolean>}
 */
async function verifyIndexNowKey() {
  logInfo('Verifying IndexNow key files...');

  const keyFileUrls = [
    `https://${CONFIG.host}/indexnow-key.txt`,
    `https://${CONFIG.host}/${CONFIG.indexNowKey}.txt`,
  ];

  const results = await Promise.allSettled(
    keyFileUrls.map(async (url) => {
      const { statusCode, body } = await makeRequest(url);
      const content = body.trim();
      const valid = statusCode === 200 && content === CONFIG.indexNowKey;
      return { url, statusCode, content, valid };
    })
  );

  let allValid = true;
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { url, statusCode, content, valid } = result.value;
      if (valid) {
        logSuccess(`Key file OK: ${url}`);
      } else {
        logError(`Key file INVALID: ${url} (HTTP ${statusCode}, content: "${content}")`);
        allValid = false;
      }
    } else {
      logError(`Key file check failed: ${result.reason.message}`);
      allValid = false;
    }
  });

  return allValid;
}

/**
 * 向单个 IndexNow 端点提交 URL（带重试）
 * @param {string} endpoint
 * @param {string[]} urls
 * @returns {Promise<{success: boolean, endpoint: string, statusCode?: number, error?: string}>}
 */
async function submitToSingleEndpoint(endpoint, urls) {
  const payload = JSON.stringify({
    host: CONFIG.host,
    key: CONFIG.indexNowKey,
    urlList: urls,
  });

  for (let attempt = 0; attempt <= CONFIG.indexNowRetryCount; attempt++) {
    if (attempt > 0) {
      logInfo(`Retry ${attempt}/${CONFIG.indexNowRetryCount} for ${new URL(endpoint).hostname}...`);
      await sleep(CONFIG.indexNowRetryDelayMs * attempt);
    }

    try {
      const { statusCode } = await makeRequest(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        body: payload,
      });

      if (statusCode === 200 || statusCode === 202) {
        return { success: true, endpoint, statusCode };
      }
      return { success: false, endpoint, statusCode };
    } catch (err) {
      if (attempt === CONFIG.indexNowRetryCount) {
        return { success: false, endpoint, error: err.message };
      }
    }
  }

  return { success: false, endpoint, error: 'Max retries exceeded' };
}

/**
 * 通过 IndexNow API 批量提交 URL
 * @param {string[]} urls
 * @returns {Promise<void>}
 */
async function submitToIndexNow(urls) {
  if (urls.length === 0) {
    logInfo('No URLs to submit via IndexNow');
    return;
  }

  logInfo(`Submitting ${urls.length} URLs to IndexNow (${CONFIG.indexNowEndpoints.length} endpoints)...`);

  // Verify key first
  const keyValid = await verifyIndexNowKey();
  if (!keyValid) {
    logError('IndexNow key verification failed. Submission may be rejected.');
    logError('Ensure both files exist on the server:');
    logError(`  - https://${CONFIG.host}/indexnow-key.txt`);
    logError(`  - https://${CONFIG.host}/${CONFIG.indexNowKey}.txt`);
    logError('Both files should contain exactly: ' + CONFIG.indexNowKey);
  }

  const totalBatches = Math.ceil(urls.length / CONFIG.indexNowBatchSize);

  for (let i = 0; i < urls.length; i += CONFIG.indexNowBatchSize) {
    const batch = urls.slice(i, i + CONFIG.indexNowBatchSize);
    const batchNumber = Math.floor(i / CONFIG.indexNowBatchSize) + 1;

    logInfo(`Batch ${batchNumber}/${totalBatches}: ${batch.length} URLs`);

    // Submit to all endpoints in parallel
    const results = await Promise.allSettled(
      CONFIG.indexNowEndpoints.map((ep) => submitToSingleEndpoint(ep, batch))
    );

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { endpoint, success, statusCode, error } = result.value;
        const hostname = new URL(endpoint).hostname;
        if (success) {
          logSuccess(`IndexNow ${hostname}: accepted (HTTP ${statusCode})`);
        } else {
          logError(`IndexNow ${hostname}: rejected (HTTP ${statusCode}) ${error || ''}`);
        }
      } else {
        logError(`IndexNow submission failed: ${result.reason.message}`);
      }
    });
  }

  logSuccess('IndexNow submission complete');
}

// ===== 百度主动推送 =====

/**
 * 百度主动推送 URL
 * @param {string[]} urls
 * @returns {Promise<void>}
 */
async function pushToBaidu(urls) {
  const baiduToken = process.env.BAIDU_PUSH_TOKEN;
  if (!baiduToken) {
    logInfo('Baidu push skipped: BAIDU_PUSH_TOKEN not set');
    logInfo('To enable, run:');
    logInfo('  BAIDU_PUSH_TOKEN=your_token node scripts/auto-submit.js --baidu');
    logInfo('Get token from: https://ziyuan.baidu.com -> 普通收录 -> API推送');
    return;
  }

  if (urls.length === 0) {
    logInfo('No URLs to push to Baidu');
    return;
  }

  const baiduPushUrl = `${CONFIG.baiduPushBaseUrl}&token=${baiduToken}`;
  logInfo(`Pushing ${urls.length} URLs to Baidu...`);

  // Baidu push API accepts URLs separated by newlines, max 2000 per request
  const batchSize = 2000;
  const totalBatches = Math.ceil(urls.length / batchSize);

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const body = batch.join('\n');

    try {
      const result = await makeRequest(baiduPushUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': Buffer.byteLength(body),
        },
        body,
      });

      let response;
      try {
        response = JSON.parse(result.body);
      } catch {
        logError(`Baidu batch ${batchNumber}: invalid JSON response`);
        continue;
      }

      if (result.statusCode === 200 && response.success !== undefined) {
        logSuccess(
          `Baidu batch ${batchNumber}/${totalBatches}: ${response.success} success, ${response.remain} remaining`
        );
        if (response.error) {
          logError(`Baidu error: ${response.error} - ${response.message}`);
        }
      } else if (result.statusCode === 200 && response.error) {
        logError(`Baidu batch ${batchNumber}: ${response.error} - ${response.message}`);
      } else {
        logError(`Baidu batch ${batchNumber}: HTTP ${result.statusCode}`);
      }
    } catch (err) {
      logError(`Baidu batch ${batchNumber} failed: ${err.message}`);
    }
  }

  logSuccess('Baidu push complete');
}

// ===== 解析命令行参数 =====

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    indexnow: args.includes('--indexnow'),
    baidu: args.includes('--baidu'),
    verifyKey: args.includes('--verify-key'),
    sitemapOnly: args.includes('--sitemap-only'),
    urlLimit: (() => {
      const match = args.find((a) => a.startsWith('--urls='));
      if (match) {
        const num = parseInt(match.split('=')[1], 10);
        return Number.isNaN(num) ? 0 : Math.max(0, num);
      }
      return 0;
    })(),
    runAll: args.length === 0,
  };
}

// ===== 主流程 =====

async function main() {
  const flags = parseArgs();

  console.log('========================================');
  console.log('  EITools Auto Submission Script');
  console.log('  Site: https://eitools.cn');
  console.log(`  Date: ${new Date().toISOString()}`);
  console.log('========================================');
  console.log();

  // Verify key only mode
  if (flags.verifyKey) {
    await verifyIndexNowKey();
    return;
  }

  // Step 1: Fetch URLs from sitemap
  const urls = await fetchUrlsFromSitemap(CONFIG.sitemapUrl);
  let enUrls = [];
  try {
    enUrls = await fetchUrlsFromSitemap(CONFIG.sitemapEnUrl);
  } catch {
    logInfo('English sitemap not available, skipping');
  }

  const allUrls = [...urls, ...enUrls];
  const uniqueUrls = [...new Set(allUrls)];

  // Apply URL limit if specified (useful for testing)
  const submissionUrls = flags.urlLimit > 0
    ? uniqueUrls.slice(0, flags.urlLimit)
    : uniqueUrls;

  logInfo(`Total unique URLs: ${uniqueUrls.length} (${urls.length} CN + ${enUrls.length} EN)`);
  if (flags.urlLimit > 0) {
    logInfo(`URL limit applied: submitting ${submissionUrls.length} URLs`);
  }
  console.log();

  if (flags.sitemapOnly) {
    console.log('=== URL List ===');
    uniqueUrls.forEach((url) => console.log(url));
    return;
  }

  // Step 2: IndexNow submission
  if (flags.indexnow || flags.runAll) {
    console.log('--- IndexNow Submission ---');
    await submitToIndexNow(submissionUrls);
    console.log();
  }

  // Step 3: Baidu push
  if (flags.baidu || flags.runAll) {
    console.log('--- Baidu Active Push ---');
    await pushToBaidu(urls); // Only CN URLs for Baidu
    console.log();
  }

  console.log('========================================');
  console.log('  All tasks completed!');
  console.log('========================================');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
