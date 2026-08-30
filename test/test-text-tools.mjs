/**
 * E2E Test: Text Tools on eitools.cn
 * Tests core functionality of 23 text-related tools.
 *
 * Usage: npx playwright test test/test-text-tools.mjs
 * Or directly: node test/test-text-tools.mjs
 */

import { chromium } from 'playwright';

const BASE_URL = 'https://eitools.cn/src/tools/';
const DELAY_MS = 500;
const TIMEOUT_MS = 15000;

const results = [];

function logResult(tool, status, detail) {
  const icon = status === 'PASS' ? 'PASS' : 'FAIL';
  const entry = { tool, status, detail: detail || '' };
  results.push(entry);
  console.log(`  [${icon}] ${tool}${detail ? ' -- ' + detail : ''}`);
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testTool(browser, name, urlPath, testFn) {
  const fullUrl = BASE_URL + urlPath;
  const context = await browser.newContext({ timeout: TIMEOUT_MS });
  const page = await context.newPage();

  try {
    // Collect console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS });
    await page.waitForTimeout(300);

    await testFn(page);

    if (consoleErrors.length > 0) {
      logResult(name, 'PASS', '(with JS console warnings)');
    } else {
      logResult(name, 'PASS');
    }
  } catch (err) {
    logResult(name, 'FAIL', err.message.substring(0, 120));
  } finally {
    await context.close();
    await delay(DELAY_MS);
  }
}

async function main() {
  console.log('Starting E2E tests for eitools.cn text tools...\n');

  const browser = await chromium.launch({ headless: true });

  // 1. word-counter.html
  await testTool(browser, 'word-counter', 'word-counter.html', async (page) => {
    await page.fill('#textInput', 'Hello world this is a test');
    const totalChars = await page.textContent('#totalChars');
    if (parseInt(totalChars) !== 26) throw new Error(`Expected totalChars=26, got ${totalChars}`);
    const englishWords = await page.textContent('#englishWords');
    if (parseInt(englishWords) !== 6) throw new Error(`Expected englishWords=6, got ${englishWords}`);
  });

  // 2. char-frequency.html
  await testTool(browser, 'char-frequency', 'char-frequency.html', async (page) => {
    await page.fill('#text', 'aabbbcccc');
    const result = await page.textContent('#result');
    if (!result.includes('a') || !result.includes('b') || !result.includes('c')) {
      throw new Error('Frequency result missing character entries');
    }
    const summary = await page.textContent('#summary');
    if (!summary.includes('9')) throw new Error('Summary should show total 9 characters');
  });

  // 3. word-frequency.html
  await testTool(browser, 'word-frequency', 'word-frequency.html', async (page) => {
    await page.selectOption('#mode', 'word');
    await page.fill('#input', 'apple banana apple cherry banana apple');
    await page.waitForTimeout(300);
    const result = await page.textContent('#result');
    if (!result.includes('apple') || !result.includes('banana')) {
      throw new Error('Word frequency result missing entries');
    }
    const totalInfo = await page.textContent('#totalInfo');
    if (!totalInfo.includes('3') || !totalInfo.includes('6')) {
      throw new Error(`Expected total info with 3 words and 6 occurrences, got: ${totalInfo}`);
    }
  });

  // 4. string-length.html
  await testTool(browser, 'string-length', 'string-length.html', async (page) => {
    await page.fill('#input', 'Hello你好');
    const chars = await page.textContent('#chars');
    if (parseInt(chars) !== 7) throw new Error(`Expected chars=7, got ${chars}`);
    const chinese = await page.textContent('#chinese');
    if (parseInt(chinese) !== 2) throw new Error(`Expected chinese=2, got ${chinese}`);
    const english = await page.textContent('#english');
    if (parseInt(english) !== 5) throw new Error(`Expected english=5, got ${english}`);
  });

  // 5. text-stats.html
  await testTool(browser, 'text-stats', 'text-stats.html', async (page) => {
    await page.fill('#input', 'Hello world! This is a test.');
    const charCount = await page.textContent('#charCount');
    if (parseInt(charCount.replace(/,/g, '')) !== 28) throw new Error(`Expected charCount=28, got ${charCount}`);
    const sentenceCount = await page.textContent('#sentenceCount');
    if (parseInt(sentenceCount.replace(/,/g, '')) !== 2) throw new Error(`Expected 2 sentences, got ${sentenceCount}`);
  });

  // 6. case-converter.html - uppercase test
  await testTool(browser, 'case-converter', 'case-converter.html', async (page) => {
    await page.fill('#input', 'hello world');
    await page.click('button:has-text("全部大写 UPPER")');
    await page.waitForTimeout(300);
    const result = await page.textContent('#result');
    if (!result.includes('HELLO WORLD')) throw new Error(`Expected HELLO WORLD, got ${result}`);
  });

  // 7. text-diff.html
  await testTool(browser, 'text-diff', 'text-diff.html', async (page) => {
    await page.fill('#textA', 'line1\nline2\nline3');
    await page.fill('#textB', 'line1\nmodified\nline3\nline4');
    await page.click('button:has-text("对比差异")');
    await page.waitForTimeout(300);
    const result = await page.textContent('#result');
    if (!result) throw new Error('No diff result returned');
    const stats = await page.textContent('#stats');
    if (!stats) throw new Error('No stats returned');
  });

  // 8. text-replace.html
  await testTool(browser, 'text-replace', 'text-replace.html', async (page) => {
    await page.fill('#inputText', 'hello world, hello everyone');
    await page.fill('#findText', 'hello');
    await page.fill('#replaceText', 'hi');
    await page.click('button:has-text("替换")');
    await page.waitForTimeout(300);
    const resultText = await page.inputValue('#resultText');
    if (resultText !== 'hi world, hi everyone') throw new Error(`Expected "hi world, hi everyone", got "${resultText}"`);
    const stats = await page.textContent('#stats');
    if (!stats.includes('2')) throw new Error(`Expected 2 replacements, got ${stats}`);
  });

  // 9. text-repeater.html
  await testTool(browser, 'text-repeater', 'text-repeater.html', async (page) => {
    await page.fill('#text', 'abc');
    await page.fill('#count', '3');
    await page.selectOption('#separator', 'newline');
    await page.click('button:has-text("生成")');
    await page.waitForTimeout(300);
    const output = await page.inputValue('#output');
    if (output !== 'abc\nabc\nabc') throw new Error(`Expected repeated abc, got "${output}"`);
  });

  // 10. text-unique.html
  await testTool(browser, 'text-unique', 'text-unique.html', async (page) => {
    await page.fill('#input', 'apple\nbanana\napple\ncherry\nbanana\napple');
    await page.click('button:has-text("去重")');
    await page.waitForTimeout(300);
    const output = await page.inputValue('#output');
    const lines = output.split('\n').filter(l => l.trim());
    if (lines.length !== 3) throw new Error(`Expected 3 unique lines, got ${lines.length}`);
    if (!lines.includes('apple') || !lines.includes('banana') || !lines.includes('cherry')) {
      throw new Error('Output missing expected unique entries');
    }
  });

  // 11. lorem-ipsum.html
  await testTool(browser, 'lorem-ipsum', 'lorem-ipsum.html', async (page) => {
    await page.selectOption('#type', 'lorem');
    await page.fill('#count', '2');
    await page.click('button:has-text("生成")');
    await page.waitForTimeout(300);
    const result = await page.textContent('#result');
    if (!result || !result.includes('Lorem') && !result.toLowerCase().includes('lorem')) {
      throw new Error('Lorem ipsum output missing Lorem keyword');
    }
  });

  // 12. list-generator.html
  await testTool(browser, 'list-generator', 'list-generator.html', async (page) => {
    await page.fill('#input', 'A\nB\nC\nD\nE');
    await page.click('button:has-text("随机排序")');
    await page.waitForTimeout(300);
    const output = await page.textContent('#output');
    if (!output || !output.includes('A') || !output.includes('E')) {
      throw new Error('List generator output missing expected items');
    }
  });

  // 13. pinyin-converter.html
  await testTool(browser, 'pinyin-converter', 'pinyin-converter.html', async (page) => {
    await page.fill('#input', '你好世界');
    await page.uncheck('#withTone');
    await page.click('button:has-text("转换")');
    await page.waitForTimeout(500);
    const result = await page.textContent('#result');
    if (!result) throw new Error('No pinyin result returned');
    // Verify it contains roman letters (pinyin), not hex codes like \u4f60
    const hasPinyinLetters = /^[a-zA-Z\s]+$/.test(result.trim());
    if (!hasPinyinLetters) {
      throw new Error(`Result appears to not be pinyin: "${result}"`);
    }
  });

  // 14. simplified-traditional.html
  await testTool(browser, 'simplified-traditional', 'simplified-traditional.html', async (page) => {
    await page.fill('#input', '简体中文转换工具');
    await page.click('button:has-text("简体 → 繁体")');
    await page.waitForTimeout(300);
    const result = await page.textContent('#result');
    if (!result) throw new Error('No result returned');
    // Should contain traditional characters like 國, 語, 轉 etc
    const hasTraditional = result.includes('國') || result.includes('語') || result.includes('轉') || result.includes('體');
    if (!hasTraditional) {
      throw new Error(`Result does not appear to contain traditional Chinese: "${result}"`);
    }
  });

  // 15. case-converter.html - multiple case conversions
  await testTool(browser, 'case-converter-multiple', 'case-converter.html', async (page) => {
    await page.fill('#input', 'hello world test');
    // Test title case
    await page.click('button:has-text("首字母大写 Title")');
    await page.waitForTimeout(300);
    let result = await page.textContent('#result');
    if (!result.includes('Hello')) throw new Error(`Title case failed: ${result}`);
    // Test snake case
    await page.click('button:has-text("蛇形命名 snake_case")');
    await page.waitForTimeout(300);
    result = await page.textContent('#result');
    if (!result.includes('hello_world_test')) throw new Error(`Snake case failed: ${result}`);
    // Test camelCase
    await page.click('button:has-text("驼峰命名 camelCase")');
    await page.waitForTimeout(300);
    result = await page.textContent('#result');
    if (!result.includes('helloWorldTest')) throw new Error(`Camel case failed: ${result}`);
  });

  // 16. cjk-separator.html
  await testTool(browser, 'cjk-separator', 'cjk-separator.html', async (page) => {
    await page.fill('#text', '今天天气真好');
    await page.selectOption('#mode', '1');
    await page.selectOption('#format', 'newline');
    await page.waitForTimeout(300);
    const output = await page.inputValue('#output');
    const lines = output.split('\n').filter(l => l.trim());
    if (lines.length !== 6) throw new Error(`Expected 6 separated chars, got ${lines.length}: "${output}"`);
  });

  // 17. punctuation.html
  await testTool(browser, 'punctuation', 'punctuation.html', async (page) => {
    await page.fill('#input', '你好，世界！这是一段测试。');
    await page.click('button:has-text("中文标点 → 英文标点")');
    await page.waitForTimeout(300);
    const output = await page.inputValue('#output');
    if (!output.includes(',') || !output.includes('!') || !output.includes('.')) {
      throw new Error(`Punctuation conversion failed: "${output}"`);
    }
    // Should not contain Chinese punctuation
    if (output.includes('，') || output.includes('！') || output.includes('。')) {
      throw new Error(`Chinese punctuation still present: "${output}"`);
    }
  });

  // 18. morse-code.html
  await testTool(browser, 'morse-code', 'morse-code.html', async (page) => {
    await page.fill('#text', 'SOS');
    await page.click('button:has-text("→")');
    await page.waitForTimeout(300);
    const morse = await page.inputValue('#morse');
    if (!morse.includes('...') || !morse.includes('---')) {
      throw new Error(`Expected morse code for SOS, got: "${morse}"`);
    }
  });

  // 19. rot13-cipher.html
  await testTool(browser, 'rot13-cipher', 'rot13-cipher.html', async (page) => {
    // Ensure ROT13 method is selected (it's default)
    await page.fill('#input', 'Hello');
    await page.waitForTimeout(300);
    const output = await page.inputValue('#output');
    if (!output.includes('Uryyb')) {
      throw new Error(`Expected Uryyb from ROT13 of Hello, got: "${output}"`);
    }
  });

  // 20. binary-converter.html
  await testTool(browser, 'binary-converter', 'binary-converter.html', async (page) => {
    await page.fill('#textInput', '10');
    await page.waitForTimeout(300);
    const binOutput = await page.inputValue('#binOutput');
    if (!binOutput.includes('00110001') || !binOutput.includes('00110000')) {
      throw new Error(`Expected binary for "10", got: "${binOutput}"`);
    }
    // Also check the decimal output
    const decOutput = await page.inputValue('#decOutput');
    if (!decOutput.includes('49') || !decOutput.includes('48')) {
      throw new Error(`Expected decimal for "10", got: "${decOutput}"`);
    }
  });

  // 21. number-sort.html
  await testTool(browser, 'number-sort', 'number-sort.html', async (page) => {
    await page.fill('#input', '3,1,4,1,5,9');
    await page.waitForTimeout(300);
    const output = await page.inputValue('#output');
    // Default should be ascending
    const nums = output.split(',').map(s => s.trim());
    if (nums.length !== 6) throw new Error(`Expected 6 numbers, got ${nums.length}`);
    // Check ascending order
    for (let i = 1; i < nums.length; i++) {
      if (parseInt(nums[i]) < parseInt(nums[i - 1])) {
        throw new Error(`Not sorted ascending: ${output}`);
      }
    }
  });

  // 22. text-counter-enhanced.html
  await testTool(browser, 'text-counter-enhanced', 'text-counter-enhanced.html', async (page) => {
    await page.fill('#text', 'Hello world! 你好世界');
    await page.waitForTimeout(300);
    const stats = await page.textContent('#stats');
    if (!stats) throw new Error('No stats returned');
    if (!stats.includes('总字符数') || !stats.includes('中文字数')) {
      throw new Error(`Stats missing expected labels: ${stats.substring(0, 100)}`);
    }
    const details = await page.textContent('#details');
    if (!details) throw new Error('No details returned');
  });

  // 23. rmb-uppercase.html
  await testTool(browser, 'rmb-uppercase', 'rmb-uppercase.html', async (page) => {
    await page.fill('#amount', '12345.67');
    await page.waitForTimeout(300);
    const result = await page.textContent('#result');
    if (!result) throw new Error('No result returned');
    if (!result.includes('壹万') && !result.includes('万')) {
      throw new Error(`Expected RMB uppercase output with 壹万, got: ${result}`);
    }
    if (!result.includes('圆') && !result.includes('元')) {
      throw new Error(`Expected RMB uppercase output with 圆 or 元, got: ${result}`);
    }
  });

  await browser.close();

  // Print summary
  console.log('\n========================================');
  console.log('          TEST SUMMARY');
  console.log('========================================');

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;

  results.forEach(r => {
    console.log(`  [${r.status}] ${r.tool}${r.detail ? ' -- ' + r.detail : ''}`);
  });

  console.log('----------------------------------------');
  console.log(`  Total: ${total}  |  Passed: ${passed}  |  Failed: ${failed}`);
  console.log('========================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(2);
});
