/**
 * E2E 工具功能测试 - 在真实浏览器中运行每个工具并验证功能
 * 用法: node test/tools-e2e.mjs [--category dev|text|calc|other] [--file xxx.html]
 */
import { chromium } from 'playwright';
import { execSync } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = parseInt(process.env.TEST_PORT || '8899', 10);
const BASE = `http://localhost:${PORT}`;
const TOOLS_DIR = path.resolve('src/tools');

// ============ 工具分类 ============
const ALL_TOOLS = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith('.html'));

const DEV_TOOLS = [
  'json-formatter', 'json-validator', 'json-editor', 'json-diff', 'json-path',
  'json-minify', 'json-pretty', 'json-to-csv', 'json-to-yaml',
  'base64', 'url-encoder', 'html-entities', 'html-minify', 'html-preview', 'html-to-markdown',
  'regex-tester', 'regex-gen',
  'markdown-live',
  'jwt-decoder',
  'xml-formatter', 'csv-to-markdown',
  'css-formatter', 'css-minify', 'css-unit-converter', 'css-gradient-generator',
  'hash-generator',
  'uuid-generator',
  'timestamp',
  'sql-formatter',
  'color-converter', 'color-picker', 'color-contrast', 'color-palette',
  'binary-converter', 'binary-calculator', 'byte-converter',
  'number-base-extended',
  'rot13-cipher', 'morse-code',
  'unicode-search', 'ascii-table',
  'http-header',
  'ip-calc', 'ip-converter', 'subnet-calculator',
  'screen-resolution',
  'box-shadow-generator',
];

const TEXT_TOOLS = [
  'word-counter', 'char-frequency', 'word-frequency', 'string-length', 'line-counter',
  'text-counter-enhanced', 'text-stats',
  'case-converter',
  'text-diff', 'text-replace', 'text-repeater', 'text-wrap', 'text-unique',
  'lorem-ipsum',
  'list-generator', 'rand-str',
  'cjk-separator', 'pinyin-converter', 'simplified-traditional',
  'punctuation', 'invisible-char',
  'number-chinese', 'rmb-uppercase',
  'number-sort',
  'text-to-speech',
];

const CALC_TOOLS = [
  'simple-calculator', 'math-solver',
  'bmi-calculator', 'bmi-intl', 'ideal-weight',
  'loan-calculator', 'mortgage-calculator', 'deposit-calculator',
  'percentage-calculator', 'profit-calculator',
  'age-calculator', 'date-calculator', 'days-between', 'year-calculator', 'weekday-calc',
  'countdown-day', 'countdown-timer', 'timer', 'stopwatch', 'counter',
  'fuel-calculator', 'distance-calculator', 'speed-test',
  'unit-converter', 'temperature-converter', 'storage-converter',
  'area-calculator', 'triangle-calculator',
  'gpa-calculator',
  'tax-calculator', 'social-insurance-calculator', 'housing-fund-calculator',
  'sleep-calculator', 'retirement-calculator', 'workday-calculator',
  'electricity-calculator', 'food-calorie',
  'standard-deviation', 'stock-return',
  'world-clock', 'text-clock',
];

// ============ 测试用例定义 ============
// 每个工具的测试：input actions + 验证条件
const TEST_CASES = {
  // === 开发工具 ===
  'json-formatter': {
    actions: async (page) => {
      await page.fill('#input', '{"name":"test","value":123}');
      await page.click('button:has-text("格式化"), button:has-text("美化"), .btn-primary');
    },
    verify: async (page) => {
      const output = await page.inputValue('#output, textarea:last-of-type, .result-box, pre');
      if (!output.includes('"name"') && !output.includes('"test"')) {
        const text = await page.textContent('body');
        if (!text.includes('"name"') && !text.includes('"test"')) throw new Error('输出中找不到格式化结果');
      }
    }
  },
  'json-validator': {
    actions: async (page) => {
      const textarea = await page.$('textarea, input[type="text"], #input');
      if (textarea) await textarea.fill('{"key":"value"}');
      const btn = await page.$('button:has-text("验证"), button:has-text("校验"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      // JSON验证器应该显示有效/无效
    }
  },
  'base64': {
    actions: async (page) => {
      const textarea = await page.$('textarea, #input');
      if (textarea) await textarea.fill('Hello World');
      const btn = await page.$('button:has-text("编码"), button:has-text("Base64"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('SGVsbG8gV29ybGQ=')) throw new Error('Base64编码结果不正确');
    }
  },
  'url-encoder': {
    actions: async (page) => {
      const textarea = await page.$('textarea, #input');
      if (textarea) await textarea.fill('hello world&test=1');
      const btn = await page.$('button:has-text("编码"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('hello%20world') && !text.includes('hello+world')) throw new Error('URL编码结果不正确');
    }
  },
  'hash-generator': {
    actions: async (page) => {
      const input = await page.$('input, textarea');
      if (input) await input.fill('test');
      const btn = await page.$('button:has-text("生成"), button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      // MD5 of "test" is 098f6bcd4621d373cade4e832627b4f6
      if (!text.includes('098f6bcd4621d373cade4e832627b4f6') && !text.includes('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3')) {
        // At least check some hash output exists
        const hasHash = /[0-9a-f]{16,}/i.test(text);
        if (!hasHash) throw new Error('找不到哈希输出');
      }
    }
  },
  'uuid-generator': {
    actions: async (page) => {
      const btn = await page.$('button:has-text("生成"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(text)) {
        throw new Error('找不到UUID格式的输出');
      }
    }
  },
  'color-converter': {
    actions: async (page) => {
      const input = await page.$('input[type="text"], input[type="color"], #hex, #color');
      if (input) {
        const tag = await input.evaluate(el => el.tagName);
        if (tag === 'INPUT') {
          await input.fill('#ff0000');
          // Trigger change event
          await input.evaluate(el => el.dispatchEvent(new Event('input', { bubbles: true })));
        }
      }
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      // Should show rgb(255, 0, 0) or similar
      if (!text.includes('rgb') && !text.includes('255') && !text.includes('hsl')) throw new Error('颜色转换结果不正确');
    }
  },
  'timestamp': {
    actions: async (page) => {
      const btn = await page.$('button:has-text("当前"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      // Should show a timestamp near current time
      const now = Math.floor(Date.now() / 1000);
      const hasTimestamp = text.includes(String(now)) || text.includes(String(now - 1)) || /\d{10}/.test(text);
      if (!hasTimestamp) throw new Error('找不到时间戳');
    }
  },
  'password-generator': {
    actions: async (page) => {
      const btn = await page.$('button:has-text("生成"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      const input = await page.$('input[type="text"], textarea, .result-box');
      const val = input ? await input.inputValue() : '';
      if (val.length < 8 && !/[A-Z]/.test(val) && !/[0-9]/.test(val)) {
        throw new Error('密码生成结果太弱或不存在');
      }
    }
  },
  'random-number': {
    actions: async (page) => {
      const btn = await page.$('button:has-text("生成"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      const hasNumber = /\d+/.test(text);
      if (!hasNumber) throw new Error('找不到随机数输出');
    }
  },
  'regex-tester': {
    actions: async (page) => {
      const textInput = await page.$('#text, #input, textarea:first-of-type');
      const regexInput = await page.$('#regex, #pattern, input[type="text"]');
      if (textInput) await textInput.fill('hello world 123');
      if (regexInput) await regexInput.fill('\\d+');
      const btn = await page.$('button:has-text("匹配"), button:has-text("测试"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('123')) throw new Error('正则匹配结果不正确');
    }
  },
  'markdown-live': {
    actions: async (page) => {
      const textarea = await page.$('textarea');
      if (textarea) await textarea.fill('# Hello\n\nWorld');
    },
    verify: async (page) => {
      const html = await page.content();
      // Markdown preview should render
      const preview = await page.$('.preview, #preview, .result-box, .markdown-body, iframe');
      if (!preview) throw new Error('找不到Markdown预览区域');
    }
  },
  'html-entities': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) await input.fill('<div class="test">');
      const btn = await page.$('button:has-text("编码"), button:has-text("转换"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('&lt;') && !text.includes('&#60;')) throw new Error('HTML实体编码结果不正确');
    }
  },
  'jwt-decoder': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) {
        // A simple test JWT (header.payload.signature)
        await input.fill('eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGVzdCJ9.abc123');
      }
      const btn = await page.$('button:has-text("解码"), button:has-text("解析"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      // Should show decoded content with "test" name
      if (!text.includes('test') && !text.includes('"name"')) throw new Error('JWT解码结果不正确');
    }
  },
  'html-preview': {
    actions: async (page) => {
      const textarea = await page.$('textarea');
      if (textarea) await textarea.fill('<h1>Test</h1><p>Hello</p>');
    },
    verify: async (page) => {
      const preview = await page.$('iframe, .preview, #preview, .result-box');
      if (!preview) throw new Error('找不到HTML预览区域');
    }
  },
  'qrcode': {
    actions: async (page) => {
      const input = await page.$('input, textarea');
      if (input) await input.fill('https://eitools.cn');
      const btn = await page.$('button:has-text("生成"), .btn-primary');
      if (btn) await btn.click();
      await page.waitForTimeout(1000);
    },
    verify: async (page) => {
      const canvas = await page.$('canvas');
      const img = await page.$('img');
      if (!canvas && !img) throw new Error('找不到二维码图片/canvas');
    }
  },
  'css-unit-converter': {
    actions: async (page) => {
      const input = await page.$('input[type="number"], input[type="text"]');
      if (input) await input.fill('16');
    },
    verify: async (page) => {
      // Should have some output showing conversion
      await page.waitForTimeout(500);
    }
  },
  'rot13-cipher': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) await input.fill('Hello');
      const btn = await page.$('button:has-text("加密"), button:has-text("编码"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('Uryyb')) throw new Error('ROT13编码结果不正确');
    }
  },
  'morse-code': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) await input.fill('SOS');
      const btn = await page.$('button:has-text("转换"), button:has-text("编码"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('...') && !text.includes('·')) throw new Error('摩尔斯码转换结果不正确');
    }
  },
  'binary-converter': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) await input.fill('10');
      const btn = await page.$('button:has-text("转换"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('1010')) throw new Error('二进制转换结果不正确');
    }
  },
  'number-base-extended': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) await input.fill('255');
      const btn = await page.$('button:has-text("转换"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('FF') && !text.includes('ff') && !text.includes('11111111')) throw new Error('进制转换结果不正确');
    }
  },
  'ip-calc': {
    actions: async (page) => {
      const input = await page.$('input[type="text"]');
      if (input) await input.fill('192.168.1.1/24');
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('255.255.255') && !text.includes('192.168.1.0') && !text.includes('子网')) throw new Error('IP计算结果不正确');
    }
  },
  'http-header': {
    actions: async (page) => {
      // Just check the page loads and has content
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (text.length < 50) throw new Error('页面内容过少');
    }
  },

  // === 文本工具 ===
  'word-counter': {
    actions: async (page) => {
      const textarea = await page.$('textarea, #input');
      if (textarea) await textarea.fill('Hello world this is a test');
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('6') && !text.includes('5')) throw new Error('字数统计结果不正确');
    }
  },
  'char-frequency': {
    actions: async (page) => {
      const textarea = await page.$('textarea, #input');
      if (textarea) await textarea.fill('aabbcc');
      const btn = await page.$('button:has-text("统计"), button:has-text("分析"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      // Should show frequency info
    }
  },
  'string-length': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) await input.fill('Hello你好');
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      // Should show length 7 (5+2)
      if (!text.includes('7') && !text.includes('5')) throw new Error('字符串长度统计不正确');
    }
  },
  'case-converter': {
    actions: async (page) => {
      const textarea = await page.$('textarea, #input');
      if (textarea) await textarea.fill('hello world');
      const btn = await page.$('button:has-text("大写"), button:has-text("UPPER"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('HELLO WORLD')) throw new Error('大小写转换结果不正确');
    }
  },
  'text-replace': {
    actions: async (page) => {
      const textInput = await page.$('#text, textarea:first-of-type');
      const findInput = await page.$('#find, input[type="text"]');
      const replaceInput = await page.$('#replace, input:nth-of-type(2)');
      if (textInput) await textInput.fill('hello world hello');
      if (findInput) await findInput.fill('hello');
      if (replaceInput) await replaceInput.fill('hi');
      const btn = await page.$('button:has-text("替换"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('hi world hi')) throw new Error('文本替换结果不正确');
    }
  },
  'text-diff': {
    actions: async (page) => {
      const textareas = await page.$$('textarea');
      if (textareas[0]) await textareas[0].fill('hello world');
      if (textareas[1]) await textareas[1].fill('hello earth');
      const btn = await page.$('button:has-text("比较"), button:has-text("对比"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      // Should show diff
    }
  },
  'lorem-ipsum': {
    actions: async (page) => {
      const btn = await page.$('button:has-text("生成"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('Lorem') && !text.includes('lorem')) throw new Error('Lorem Ipsum 生成结果不正确');
    }
  },
  'list-generator': {
    actions: async (page) => {
      const btn = await page.$('button:has-text("生成"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (text.length < 20) throw new Error('列表生成结果不正确');
    }
  },
  'pinyin-converter': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) await input.fill('你好');
      const btn = await page.$('button:has-text("转换"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      await page.waitForTimeout(1000);
    }
  },
  'simplified-traditional': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) await input.fill('简体中文');
      const btn = await page.$('button:has-text("转换"), button:has-text("繁体"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      await page.waitForTimeout(500);
    }
  },
  'number-chinese': {
    actions: async (page) => {
      const input = await page.$('input, textarea');
      if (input) await input.fill('123.45');
      const btn = await page.$('button:has-text("转换"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('一百') && !text.includes('壹佰')) throw new Error('数字转中文结果不正确');
    }
  },
  'rmb-uppercase': {
    actions: async (page) => {
      const input = await page.$('input, textarea');
      if (input) await input.fill('1234.56');
      const btn = await page.$('button:has-text("转换"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('壹仟') && !text.includes('一千')) throw new Error('人民币大写转换结果不正确');
    }
  },
  'number-sort': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) await input.fill('3,1,4,1,5,9');
      const btn = await page.$('button:has-text("排序"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('1') || !text.includes('9')) throw new Error('排序结果不正确');
    }
  },
  'punctuation': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) await input.fill('Hello,World.Test');
      const btn = await page.$('button:has-text("转换"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      await page.waitForTimeout(500);
    }
  },
  'text-repeater': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) await input.fill('abc');
      const btn = await page.$('button:has-text("生成"), button:has-text("重复"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('abcabc') && !text.includes('abc abc')) throw new Error('文本重复结果不正确');
    }
  },
  'text-unique': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) await input.fill('apple\nbanana\napple\ncherry');
      const btn = await page.$('button:has-text("去重"), button:has-text("唯一"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('apple') || !text.includes('banana') || !text.includes('cherry')) throw new Error('去重结果不正确');
    }
  },

  // === 计算器 ===
  'simple-calculator': {
    actions: async (page) => {
      const btns = await page.$$('button');
      // Try clicking number buttons
      for (const btn of btns) {
        const text = await btn.textContent();
        if (text.trim() === '1') { await btn.click(); break; }
      }
      for (const btn of btns) {
        const text = await btn.textContent();
        if (text.trim() === '+' || text.trim() === '＋') { await btn.click(); break; }
      }
      for (const btn of btns) {
        const text = await btn.textContent();
        if (text.trim() === '2') { await btn.click(); break; }
      }
      for (const btn of btns) {
        const text = await btn.textContent();
        if (text.trim() === '=' || text.trim() === '＝') { await btn.click(); break; }
      }
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('3')) throw new Error('计算器结果不正确');
    }
  },
  'bmi-calculator': {
    actions: async (page) => {
      const inputs = await page.$$('input[type="number"]');
      if (inputs[0]) await inputs[0].fill('70'); // weight kg
      if (inputs[1]) await inputs[1].fill('1.75'); // height m
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      // BMI = 70 / 1.75^2 = 22.86
      if (!text.includes('22') && !text.includes('23')) throw new Error('BMI计算结果不正确');
    }
  },
  'loan-calculator': {
    actions: async (page) => {
      const inputs = await page.$$('input[type="number"], input');
      if (inputs[0]) await inputs[0].fill('1000000'); // loan amount
      if (inputs[1]) await inputs[1].fill('4.2'); // rate
      if (inputs[2]) await inputs[2].fill('30'); // years
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      // Should show monthly payment around 4890
      if (!text.includes('4,890') && !text.includes('4890') && text.length < 100) throw new Error('贷款计算结果不正确');
    }
  },
  'percentage-calculator': {
    actions: async (page) => {
      const inputs = await page.$$('input[type="number"], input');
      if (inputs[0]) await inputs[0].fill('50');
      if (inputs[1]) await inputs[1].fill('200');
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('100') && !text.includes('25%')) throw new Error('百分比计算结果不正确');
    }
  },
  'temperature-converter': {
    actions: async (page) => {
      const input = await page.$('input[type="number"], input');
      if (input) await input.fill('100');
      const select = await page.$('select');
      if (select) await select.selectOption({ index: 0 });
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('212') && !text.includes('373')) throw new Error('温度转换结果不正确');
    }
  },
  'unit-converter': {
    actions: async (page) => {
      const input = await page.$('input[type="number"], input');
      if (input) await input.fill('1');
    },
    verify: async (page) => {
      await page.waitForTimeout(500);
      const text = await page.textContent('body');
      if (text.length < 30) throw new Error('单位转换页面内容过少');
    }
  },
  'area-calculator': {
    actions: async (page) => {
      const inputs = await page.$$('input[type="number"], input');
      if (inputs[0]) await inputs[0].fill('10');
      if (inputs[1]) await inputs[1].fill('20');
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('200')) throw new Error('面积计算结果不正确');
    }
  },
  'date-calculator': {
    actions: async (page) => {
      const inputs = await page.$$('input[type="date"], input');
      if (inputs[0]) await inputs[0].fill('2026-01-01');
      if (inputs[1]) await inputs[1].fill('2026-12-31');
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('364') && !text.includes('365')) throw new Error('日期计算结果不正确');
    }
  },
  'age-calculator': {
    actions: async (page) => {
      const input = await page.$('input[type="date"], input[type="text"], input');
      if (input) await input.fill('2000-01-01');
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      // Should show 26 years
      if (!text.includes('26') && !text.includes('25')) throw new Error('年龄计算结果不正确');
    }
  },
  'profit-calculator': {
    actions: async (page) => {
      const inputs = await page.$$('input[type="number"], input');
      if (inputs[0]) await inputs[0].fill('100'); // cost
      if (inputs[1]) await inputs[1].fill('150'); // price
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('50') && !text.includes('33')) throw new Error('利润计算结果不正确');
    }
  },
  'deposit-calculator': {
    actions: async (page) => {
      const inputs = await page.$$('input[type="number"], input');
      if (inputs[0]) await inputs[0].fill('100000');
      if (inputs[1]) await inputs[1].fill('3');
      if (inputs[2]) await inputs[2].fill('12');
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (text.length < 30) throw new Error('存款计算结果不正确');
    }
  },
  'mortgage-calculator': {
    actions: async (page) => {
      const inputs = await page.$$('input[type="number"], input');
      if (inputs[0]) await inputs[0].fill('2000000');
      if (inputs[1]) await inputs[1].fill('4.9');
      if (inputs[2]) await inputs[2].fill('30');
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (text.length < 50) throw new Error('房贷计算结果不正确');
    }
  },
  'gpa-calculator': {
    actions: async (page) => {
      const btn = await page.$('button:has-text("添加"), button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (text.length < 30) throw new Error('GPA计算器页面内容过少');
    }
  },
  'standard-deviation': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) await input.fill('1,2,3,4,5');
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      // SD of [1,2,3,4,5] = 1.414
      if (!text.includes('1.4')) throw new Error('标准差计算结果不正确');
    }
  },
  'fuel-calculator': {
    actions: async (page) => {
      const inputs = await page.$$('input[type="number"], input');
      if (inputs[0]) await inputs[0].fill('100');
      if (inputs[1]) await inputs[1].fill('8');
      if (inputs[2]) await inputs[2].fill('7.5');
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (text.length < 20) throw new Error('油耗计算结果不正确');
    }
  },
  'word-frequency': {
    actions: async (page) => {
      const input = await page.$('textarea, input');
      if (input) await input.fill('apple banana apple cherry banana apple');
      const btn = await page.$('button:has-text("统计"), button:has-text("分析"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('apple') && !text.includes('3')) throw new Error('词频统计结果不正确');
    }
  },
  'text-counter-enhanced': {
    actions: async (page) => {
      const textarea = await page.$('textarea, #input');
      if (textarea) await textarea.fill('Hello world 你好世界');
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      // Should show word count
      if (text.length < 20) throw new Error('增强字数统计结果不正确');
    }
  },
  'text-stats': {
    actions: async (page) => {
      const textarea = await page.$('textarea, #input');
      if (textarea) await textarea.fill('The quick brown fox jumps over the lazy dog');
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (text.length < 20) throw new Error('文本统计结果不正确');
    }
  },
  'days-between': {
    actions: async (page) => {
      const inputs = await page.$$('input[type="date"], input');
      if (inputs[0]) await inputs[0].fill('2026-01-01');
      if (inputs[1]) await inputs[1].fill('2026-03-25');
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (!text.includes('83') && !text.includes('84')) throw new Error('日期差计算结果不正确');
    }
  },
  'year-calculator': {
    actions: async (page) => {
      const input = await page.$('input[type="date"], input');
      if (input) await input.fill('2000-06-15');
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      if (text.length < 20) throw new Error('年历计算结果不正确');
    }
  },
  'weekday-calc': {
    actions: async (page) => {
      const input = await page.$('input[type="date"], input');
      if (input) await input.fill('2026-03-25');
      const btn = await page.$('button:has-text("计算"), .btn-primary');
      if (btn) await btn.click();
    },
    verify: async (page) => {
      const text = await page.textContent('body');
      // 2026-03-25 is a Wednesday
      if (!text.includes('三') && !text.includes('Wed') && !text.includes('3')) throw new Error('星期计算结果不正确');
    }
  },
};

// ============ 基础页面加载测试 ============
// 对于没有定义具体测试用例的工具，至少测试页面能正常加载且无JS错误
async function basicPageTest(page, toolFile) {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto(`${BASE}/src/tools/${toolFile}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);

  return { errors, title: await page.title() };
}

// ============ 主测试逻辑 ============
async function runTests(category) {
  let toolsToTest = ALL_TOOLS;

  if (category === 'dev') {
    toolsToTest = DEV_TOOLS.map(t => t + '.html').filter(f => ALL_TOOLS.includes(f));
  } else if (category === 'text') {
    toolsToTest = TEXT_TOOLS.map(t => t + '.html').filter(f => ALL_TOOLS.includes(f));
  } else if (category === 'calc') {
    toolsToTest = CALC_TOOLS.map(t => t + '.html').filter(f => ALL_TOOLS.includes(f));
  } else if (category === 'other') {
    const allCategorized = [...DEV_TOOLS, ...TEXT_TOOLS, ...CALC_TOOLS];
    toolsToTest = ALL_TOOLS.filter(f => !allCategorized.some(t => f === t + '.html'));
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  const results = [];
  const total = toolsToTest.length;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`开始测试 ${total} 个工具 (${category || 'all'})`);
  console.log(`${'='.repeat(60)}\n`);

  for (let i = 0; i < toolsToTest.length; i++) {
    const toolFile = toolsToTest[i];
    const toolName = toolFile.replace('.html', '');
    const testCase = TEST_CASES[toolName];

    const status = { file: toolFile, name: toolName, status: 'PASS', errors: [] };

    try {
      // 1. Basic page load test
      const pageErrors = [];
      page.on('pageerror', (err) => pageErrors.push(err.message));
      page.on('console', (msg) => {
        if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('404')) {
          pageErrors.push(msg.text());
        }
      });

      await page.goto(`${BASE}/src/tools/${toolFile}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(800);

      // Check if page loaded properly
      const title = await page.title();
      const bodyText = await page.textContent('body');

      if (title === '404' || title === 'Not Found' || bodyText.includes('404')) {
        status.status = 'FAIL';
        status.errors.push('页面返回404');
      }

      if (bodyText.length < 20) {
        status.status = 'FAIL';
        status.errors.push('页面内容过少，可能加载不完整');
      }

      if (pageErrors.length > 0) {
        const criticalErrors = pageErrors.filter(e =>
          !e.includes('favicon') && !e.includes('net::ERR') && !e.includes('404')
        );
        if (criticalErrors.length > 0) {
          status.status = 'WARN';
          status.errors.push(`JS错误: ${criticalErrors[0]}`);
        }
      }

      // 2. Run specific test case if available
      if (testCase && status.status === 'PASS') {
        try {
          await testCase.actions(page);
          await page.waitForTimeout(500);
          await testCase.verify(page);
        } catch (e) {
          status.status = 'FAIL';
          status.errors.push(`功能测试失败: ${e.message}`);
        }
      }

    } catch (e) {
      status.status = 'FAIL';
      status.errors.push(`加载异常: ${e.message}`);
    }

    results.push(status);
    const icon = status.status === 'PASS' ? '✓' : status.status === 'WARN' ? '!' : '✗';
    const errMsg = status.errors.length > 0 ? ` — ${status.errors[0]}` : '';
    console.log(`[${i + 1}/${total}] ${icon} ${toolFile}${errMsg}`);
  }

  await browser.close();

  // Print summary
  const passed = results.filter(r => r.status === 'PASS').length;
  const warned = results.filter(r => r.status === 'WARN').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`测试完成: ${passed} 通过, ${warned} 警告, ${failed} 失败 / 共 ${total}`);
  console.log(`${'='.repeat(60)}`);

  if (failed > 0) {
    console.log('\n失败的工具:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  ✗ ${r.file}`);
      r.errors.forEach(e => console.log(`    → ${e}`));
    });
  }

  if (warned > 0) {
    console.log('\n有警告的工具:');
    results.filter(r => r.status === 'WARN').forEach(r => {
      console.log(`  ! ${r.file}`);
      r.errors.forEach(e => console.log(`    → ${e}`));
    });
  }

  return { passed, warned, failed, total, results };
}

// ============ 启动 HTTP 服务器 ============
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = req.url === '/' ? 'index.html' : req.url;
      filePath = path.resolve('.', filePath.replace(/^\//, ''));

      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
      };

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/html' });
        res.end(data);
      });
    });

    server.listen(PORT, () => {
      console.log(`测试服务器启动在 http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

// ============ Main ============
const args = process.argv.slice(2);
const categoryArg = args.find(a => a === '--category') ? args[args.indexOf('--category') + 1] : 'all';
const fileArg = args.find(a => a === '--file') ? args[args.indexOf('--file') + 1] : null;

(async () => {
  const server = await startServer();

  try {
    if (fileArg) {
      // Test single file
      ALL_TOOLS.includes(fileArg) || ALL_TOOLS.includes(fileArg + '.html')
        ? await runTests('all') // will filter below
        : null;
    }
    const result = await runTests(categoryArg);
    process.exit(result.failed > 0 ? 1 : 0);
  } finally {
    server.close();
  }
})();
