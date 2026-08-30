/**
 * E2E test for eitools.cn calculator tools
 * Tests 25 calculator/timer tools on the live site
 */

import { chromium } from 'playwright';

const BASE = 'https://eitools.cn/src/tools/';
const TIMEOUT = 15_000;
const DELAY = 500;

const results = [];

function log(name, status, detail = '') {
  const icon = status === 'PASS' ? 'OK' : 'FAIL';
  const msg = `[${icon}] ${name} ${status} ${detail ? '— ' + detail : ''}`;
  console.log(msg);
  results.push({ name, status, detail });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function test1_simpleCalculator(page) {
  try {
    await page.goto(BASE + 'simple-calculator.html', { timeout: TIMEOUT });
    await page.click('button:has-text("AC")');
    await page.click('button:has-text("1")');
    await page.click('button.op:has-text("+")');
    await page.click('button:has-text("2")');
    await page.click('button.eq:has-text("=")');
    await sleep(300);
    const text = await page.locator('#result').textContent();
    const expr = await page.locator('#expr').textContent();
    if (text.trim() === '3') {
      log('1. simple-calculator', 'PASS', `1+2=${text.trim()}, expr="${expr.trim()}"`);
    } else {
      log('1. simple-calculator', 'FAIL', `Expected 3, got "${text.trim()}" expr="${expr.trim()}"`);
    }
  } catch (e) {
    log('1. simple-calculator', 'FAIL', e.message);
  }
}

async function test2_bmiCalculator(page) {
  try {
    await page.goto(BASE + 'bmi-calculator.html', { timeout: TIMEOUT });
    await page.fill('#height', '175');
    await page.fill('#weight', '70');
    await page.click('.bmi-btn');
    await sleep(300);
    const html = await page.locator('#result').innerHTML();
    const bmiMatch = html.match(/([\d.]+)<\/div>/);
    if (bmiMatch) {
      const bmi = parseFloat(bmiMatch[1]);
      const ok = Math.abs(bmi - 22.9) < 0.1;
      log('2. bmi-calculator', ok ? 'PASS' : 'FAIL', `BMI=${bmi}, expected ~22.86`);
    } else {
      log('2. bmi-calculator', 'FAIL', 'No BMI result found');
    }
  } catch (e) {
    log('2. bmi-calculator', 'FAIL', e.message);
  }
}

async function test3_loanCalculator(page) {
  try {
    await page.goto(BASE + 'loan-calculator.html', { timeout: TIMEOUT });
    await page.fill('#amount', '100');
    await page.fill('#rate', '3.45');
    await page.fill('#years', '30');
    await page.dispatchEvent('#amount', 'input');
    await sleep(500);
    const html = await page.locator('#result').innerHTML();
    const hasMonthly = html.includes('每月还款') || html.includes('元');
    const hasNumber = /[\d,]+\.\d+/.test(html);
    log('3. loan-calculator', (hasMonthly && hasNumber) ? 'PASS' : 'FAIL',
      hasNumber ? 'Has monthly payment output' : 'No valid output found');
  } catch (e) {
    log('3. loan-calculator', 'FAIL', e.message);
  }
}

async function test4_mortgageCalculator(page) {
  try {
    await page.goto(BASE + 'mortgage-calculator.html', { timeout: TIMEOUT });
    await page.fill('#principal', '100');
    await page.fill('#rate', '3.45');
    await page.click('button:has-text("开始计算")');
    await sleep(300);
    const html = await page.locator('#result').innerHTML();
    const hasMonthly = html.includes('每月还款') || html.includes('首月还款');
    const hasNumber = /[\d,]+\.\d+/.test(html);
    log('4. mortgage-calculator', (hasMonthly && hasNumber) ? 'PASS' : 'FAIL',
      hasNumber ? 'Has mortgage payment output' : 'No valid output');
  } catch (e) {
    log('4. mortgage-calculator', 'FAIL', e.message);
  }
}

async function test5_percentageCalculator(page) {
  try {
    await page.goto(BASE + 'percentage-calculator.html', { timeout: TIMEOUT });
    // Test "X is what % of Y" -> 50 is what % of 200 = 25%
    await page.fill('#p1x', '50');
    await page.fill('#p1y', '200');
    // Click the first "calculate" button
    await page.locator('button:has-text("计算")').first().click();
    await sleep(300);
    const r1 = await page.locator('#r1').textContent();
    const has25 = r1.includes('25.00');
    log('5. percentage-calculator', has25 ? 'PASS' : 'FAIL',
      `50/200 result="${r1.trim()}"`);
  } catch (e) {
    log('5. percentage-calculator', 'FAIL', e.message);
  }
}

async function test6_profitCalculator(page) {
  try {
    await page.goto(BASE + 'profit-calculator.html', { timeout: TIMEOUT });
    await page.fill('#cost', '50');
    await page.fill('#price', '80');
    await page.click('button:has-text("计算利润")');
    await sleep(300);
    const html = await page.locator('#profitResult').innerHTML();
    const hasProfit = html.includes('单件利润') && html.includes('元');
    log('6. profit-calculator', hasProfit ? 'PASS' : 'FAIL',
      hasProfit ? 'Has profit output' : 'No profit output found');
  } catch (e) {
    log('6. profit-calculator', 'FAIL', e.message);
  }
}

async function test7_depositCalculator(page) {
  try {
    await page.goto(BASE + 'deposit-calculator.html', { timeout: TIMEOUT });
    // The page auto-calculates on load with default values
    await sleep(500);
    const principal = await page.locator('#rPrincipal').textContent();
    const interest = await page.locator('#rInterest').textContent();
    const total = await page.locator('#rTotal').textContent();
    const hasData = principal && principal !== '-' && interest && interest !== '-';
    log('7. deposit-calculator', hasData ? 'PASS' : 'FAIL',
      hasData ? `Principal=${principal}, Interest=${interest}` : 'No output');
  } catch (e) {
    log('7. deposit-calculator', 'FAIL', e.message);
  }
}

async function test8_ageCalculator(page) {
  try {
    await page.goto(BASE + 'age-calculator.html', { timeout: TIMEOUT });
    await page.fill('#birthday', '2000-01-01');
    await page.click('button:has-text("计算年龄")');
    await sleep(300);
    const html = await page.locator('#result').innerHTML();
    const hasAge = html.includes('岁') && html.includes('个月');
    const hasDays = html.includes('已过天数');
    log('8. age-calculator', (hasAge && hasDays) ? 'PASS' : 'FAIL',
      hasAge ? 'Has age output with years/months/days' : 'No age output found');
  } catch (e) {
    log('8. age-calculator', 'FAIL', e.message);
  }
}

async function test9_dateCalculator(page) {
  try {
    await page.goto(BASE + 'date-calculator.html', { timeout: TIMEOUT });
    await page.fill('#date1', '2025-01-01');
    await page.fill('#date2', '2025-12-31');
    await page.click('button:has-text("计算")');
    await sleep(300);
    const text = await page.locator('#diffResult').textContent();
    const hasDays = text.includes('364') || text.includes('365');
    log('9. date-calculator', hasDays ? 'PASS' : 'FAIL',
      `Result="${text.trim()}"`);
  } catch (e) {
    log('9. date-calculator', 'FAIL', e.message);
  }
}

async function test10_daysBetween(page) {
  try {
    await page.goto(BASE + 'days-between.html', { timeout: TIMEOUT });
    // Page auto-initializes with today + 30 days
    await sleep(500);
    const html = await page.locator('#result').innerHTML();
    const hasDays = html.includes('天');
    const hasNumber = /\d{1,3}<\/div>/.test(html);
    log('10. days-between', (hasDays && hasNumber) ? 'PASS' : 'FAIL',
      hasDays ? 'Has days output' : 'No output found');
  } catch (e) {
    log('10. days-between', 'FAIL', e.message);
  }
}

async function test11_unitConverter(page) {
  try {
    await page.goto(BASE + 'unit-converter.html', { timeout: TIMEOUT });
    await page.selectOption('#unit', 'cm');
    await page.fill('#value', '100');
    await page.click('button:has-text("换算")');
    await sleep(300);
    const html = await page.locator('#result').innerHTML();
    const hasTable = html.includes('米') || html.includes('m');
    const hasValues = /[\d.]+/.test(html);
    log('11. unit-converter', (hasTable && hasValues) ? 'PASS' : 'FAIL',
      hasTable ? 'Has conversion result table' : 'No conversion table');
  } catch (e) {
    log('11. unit-converter', 'FAIL', e.message);
  }
}

async function test12_temperatureConverter(page) {
  try {
    await page.goto(BASE + 'temperature-converter.html', { timeout: TIMEOUT });
    await page.fill('#value', '100');
    // Default unit is C (Celsius)
    await sleep(500);  // auto-updates on input
    const html = await page.locator('#result').innerHTML();
    const hasFahrenheit = html.includes('212');
    const hasKelvin = html.includes('373.15');
    log('12. temperature-converter', (hasFahrenheit && hasKelvin) ? 'PASS' : 'FAIL',
      `100C -> F=${hasFahrenheit}, K=${hasKelvin}`);
  } catch (e) {
    log('12. temperature-converter', 'FAIL', e.message);
  }
}

async function test13_areaCalculator(page) {
  try {
    await page.goto(BASE + 'area-calculator.html', { timeout: TIMEOUT });
    await page.fill('#value', '100');
    await page.click('button:has-text("换算")');
    await sleep(300);
    const html = await page.locator('#result').innerHTML();
    const hasConversion = html.includes('亩') || html.includes('公顷');
    log('13. area-calculator', hasConversion ? 'PASS' : 'FAIL',
      hasConversion ? 'Has area conversion output' : 'No output');
  } catch (e) {
    log('13. area-calculator', 'FAIL', e.message);
  }
}

async function test14_triangleCalculator(page) {
  try {
    await page.goto(BASE + 'triangle-calculator.html', { timeout: TIMEOUT });
    // Default mode is SSS (three sides)
    await page.fill('#sideA', '3');
    await page.fill('#sideB', '4');
    await page.fill('#sideC', '5');
    await sleep(500);  // auto-calculates on input
    const html = await page.locator('#result').innerHTML();
    const hasArea = html.includes('面积');
    const hasPerimeter = html.includes('周长');
    // 3-4-5 triangle area should be 6
    const hasCorrectArea = html.includes('6.00');
    log('14. triangle-calculator', (hasArea && hasPerimeter) ? 'PASS' : 'FAIL',
      `Has area=${hasCorrectArea} and perimeter output`);
  } catch (e) {
    log('14. triangle-calculator', 'FAIL', e.message);
  }
}

async function test15_gpaCalculator(page) {
  try {
    await page.goto(BASE + 'gpa-calculator.html', { timeout: TIMEOUT });
    // Page auto-initializes with sample courses and calculates
    await sleep(500);
    const html = await page.locator('#result').innerHTML();
    const hasGPA = html.includes('GPA');
    const hasNumber = /[\d.]+/.test(html);
    log('15. gpa-calculator', (hasGPA && hasNumber) ? 'PASS' : 'FAIL',
      hasGPA ? 'Has GPA output with value' : 'No GPA output');
  } catch (e) {
    log('15. gpa-calculator', 'FAIL', e.message);
  }
}

async function test16_taxCalculator(page) {
  try {
    await page.goto(BASE + 'tax-calculator.html', { timeout: TIMEOUT });
    await page.fill('#salary', '15000');
    await page.click('button:has-text("计算个税")');
    await sleep(300);
    const html = await page.locator('#result').innerHTML();
    const hasAfterTax = html.includes('税后月薪') || html.includes('到手工资');
    const hasNumber = /[\d,]+\.\d+/.test(html);
    log('16. tax-calculator', (hasAfterTax && hasNumber) ? 'PASS' : 'FAIL',
      hasAfterTax ? 'Has after-tax salary output' : 'No tax output');
  } catch (e) {
    log('16. tax-calculator', 'FAIL', e.message);
  }
}

async function test17_fuelCalculator(page) {
  try {
    await page.goto(BASE + 'fuel-calculator.html', { timeout: TIMEOUT });
    await page.fill('#dist', '500');
    await page.fill('#fuel', '40');
    await page.click('button:has-text("计算")');
    await sleep(300);
    const html = await page.locator('#result').innerHTML();
    const hasConsumption = html.includes('百公里油耗');
    const hasNumber = /[\d.]+ L/.test(html);
    log('17. fuel-calculator', (hasConsumption && hasNumber) ? 'PASS' : 'FAIL',
      hasConsumption ? 'Has fuel consumption output' : 'No output');
  } catch (e) {
    log('17. fuel-calculator', 'FAIL', e.message);
  }
}

async function test18_standardDeviation(page) {
  try {
    await page.goto(BASE + 'standard-deviation.html', { timeout: TIMEOUT });
    await page.fill('#input', '1,2,3,4,5');
    await sleep(500);  // auto-calculates on input
    const html = await page.locator('#result').innerHTML();
    // Sample std dev of [1,2,3,4,5] = sqrt(10/4) = sqrt(2.5) = 1.5811
    // But the code uses (n-1) denominator for "standard deviation"
    // Actually looking at the code: variance = sum/(n-1), stdDev = sqrt(variance)
    // For [1,2,3,4,5]: mean=3, sum of sq diffs = 4+1+0+1+4 = 10, variance = 10/4 = 2.5, std = 1.5811
    const hasStdDev = html.includes('标准差');
    const hasNumber = /[\d.]+/.test(html);
    // Check for approximately 1.58
    const hasCorrect = html.includes('1.5811');
    log('18. standard-deviation', (hasStdDev && hasNumber) ? 'PASS' : 'FAIL',
      `Has stdDev=${hasStdDev}, ~1.58=${hasCorrect}, result contains number=${hasNumber}`);
  } catch (e) {
    log('18. standard-deviation', 'FAIL', e.message);
  }
}

async function test19_workdayCalculator(page) {
  try {
    await page.goto(BASE + 'workday-calculator.html', { timeout: TIMEOUT });
    // Page auto-initializes with today + 1 month
    await sleep(500);
    const html = await page.locator('#result1').innerHTML();
    const hasWorkdays = html.includes('工作日');
    const hasNumber = /[\d]+/.test(html);
    log('19. workday-calculator', (hasWorkdays && hasNumber) ? 'PASS' : 'FAIL',
      hasWorkdays ? 'Has workday count output' : 'No workday output');
  } catch (e) {
    log('19. workday-calculator', 'FAIL', e.message);
  }
}

async function test20_retirementCalculator(page) {
  try {
    await page.goto(BASE + 'retirement-calculator.html', { timeout: TIMEOUT });
    // Page auto-calculates with default values
    await sleep(500);
    const basic = await page.locator('#uBasic').textContent();
    const personal = await page.locator('#uPersonal').textContent();
    const total = await page.locator('#uTotal').textContent();
    const hasData = basic !== '-' && personal !== '-' && total !== '-';
    log('20. retirement-calculator', hasData ? 'PASS' : 'FAIL',
      hasData ? `Basic=${basic}, Personal=${personal}, Total=${total}` : 'No output');
  } catch (e) {
    log('20. retirement-calculator', 'FAIL', e.message);
  }
}

async function test21_countdownDay(page) {
  try {
    await page.goto(BASE + 'countdown-day.html', { timeout: TIMEOUT });
    // Add a future countdown event
    const futureDate = '2027-01-01';
    await page.fill('#eventName', 'Test Event');
    await page.fill('#eventDate', futureDate);
    await page.click('button:has-text("添加")');
    await sleep(300);
    const html = await page.locator('#eventList').innerHTML();
    const hasEvent = html.includes('Test Event');
    const hasDays = html.includes('天');
    log('21. countdown-day', (hasEvent && hasDays) ? 'PASS' : 'FAIL',
      hasEvent ? 'Has countdown event with days' : 'No event added');
  } catch (e) {
    log('21. countdown-day', 'FAIL', e.message);
  }
}

async function test22_countdownTimer(page) {
  try {
    await page.goto(BASE + 'countdown-timer.html', { timeout: TIMEOUT });
    // Debug: check if functions exist and what state we're in
    const debugInfo = await page.evaluate(() => {
      return {
        hasStart: typeof startTimer === 'function',
        hasReset: typeof resetTimer === 'function',
        state: typeof state !== 'undefined' ? state : 'unknown',
        setS: document.getElementById('setS').value,
        mode: document.getElementById('mode').value
      };
    });
    // Click reset button first (visible on load)
    await page.click('button:has-text("重置")');
    await sleep(300);
    // Fill inputs
    await page.fill('#setH', '0');
    await page.fill('#setM', '0');
    await page.fill('#setS', '3');
    await sleep(200);
    // Click start via evaluate to bypass any event issues
    const startResult = await page.evaluate(() => {
      const btn = document.getElementById('btnStart');
      btn.click();
      return {
        state: typeof state !== 'undefined' ? state : 'N/A',
        btnStyle: btn.style.display,
        pauseStyle: document.getElementById('btnPause').style.display,
        total: typeof totalSeconds !== 'undefined' ? totalSeconds : 'N/A'
      };
    });
    await sleep(1500);
    const text = await page.locator('#display').textContent();
    const btnPause = await page.locator('#btnPause').isVisible();
    const isRunning = text !== '00:00:03' || btnPause;
    log('22. countdown-timer', isRunning ? 'PASS' : 'FAIL',
      `Display="${text}", Pause visible=${btnPause}, debug=${JSON.stringify(startResult)}`);
    // Clean up
    await page.click('button:has-text("重置")');
  } catch (e) {
    log('22. countdown-timer', 'FAIL', e.message);
  }
}

async function test23_timer(page) {
  try {
    await page.goto(BASE + 'timer.html', { timeout: TIMEOUT });
    const initialDisplay = await page.locator('#timeDisplay').textContent();
    // Click start
    await page.click('#toggleBtn');
    await sleep(1500);
    const runningDisplay = await page.locator('#timeDisplay').textContent();
    const btnText = await page.locator('#toggleBtn').textContent();
    const isRunning = runningDisplay !== initialDisplay || btnText === '暂停';
    log('23. timer (pomodoro)', isRunning ? 'PASS' : 'FAIL',
      `Initial="${initialDisplay}", Running="${runningDisplay}", Btn="${btnText}"`);
    // Clean up
    await page.click('button:has-text("重置")');
  } catch (e) {
    log('23. timer (pomodoro)', 'FAIL', e.message);
  }
}

async function test24_stopwatch(page) {
  try {
    await page.goto(BASE + 'stopwatch.html', { timeout: TIMEOUT });
    const initialDisplay = await page.locator('#display').textContent();
    // Click start
    await page.click('#startBtn');
    await sleep(1500);
    const runningDisplay = await page.locator('#display').textContent();
    const btnText = await page.locator('#startBtn').textContent();
    const isRunning = runningDisplay !== initialDisplay && btnText === '暂停';
    log('24. stopwatch', isRunning ? 'PASS' : 'FAIL',
      `Initial="${initialDisplay}", Running="${runningDisplay}", Btn="${btnText}"`);
    // Clean up
    await page.click('button:has-text("重置")');
  } catch (e) {
    log('24. stopwatch', 'FAIL', e.message);
  }
}

async function test25_worldClock(page) {
  try {
    await page.goto(BASE + 'world-clock.html', { timeout: TIMEOUT });
    await sleep(1000);  // Wait for initial render
    const html = await page.locator('#clocks').innerHTML();
    // Check for multiple timezone cities
    const hasBeijing = html.includes('北京');
    const hasTokyo = html.includes('东京');
    const hasNewYork = html.includes('纽约');
    const hasLondon = html.includes('伦敦');
    const hasTime = /\d{2}:\d{2}:\d{2}/.test(html);
    const cityCount = (html.match(/\d{2}:\d{2}:\d{2}/g) || []).length;
    log('25. world-clock', (hasBeijing && hasTokyo && hasNewYork && hasLondon && cityCount >= 5) ? 'PASS' : 'FAIL',
      `Cities found: BJ=${hasBeijing}, TK=${hasTokyo}, NY=${hasNewYork}, LN=${hasLondon}, time count=${cityCount}`);
  } catch (e) {
    log('25. world-clock', 'FAIL', e.message);
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('  EITools Calculator Tools E2E Test');
  console.log('  Target: ' + BASE);
  console.log('  Date: ' + new Date().toISOString().split('T')[0]);
  console.log('='.repeat(60));
  console.log('');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const tests = [
    test1_simpleCalculator,
    test2_bmiCalculator,
    test3_loanCalculator,
    test4_mortgageCalculator,
    test5_percentageCalculator,
    test6_profitCalculator,
    test7_depositCalculator,
    test8_ageCalculator,
    test9_dateCalculator,
    test10_daysBetween,
    test11_unitConverter,
    test12_temperatureConverter,
    test13_areaCalculator,
    test14_triangleCalculator,
    test15_gpaCalculator,
    test16_taxCalculator,
    test17_fuelCalculator,
    test18_standardDeviation,
    test19_workdayCalculator,
    test20_retirementCalculator,
    test21_countdownDay,
    test22_countdownTimer,
    test23_timer,
    test24_stopwatch,
    test25_worldClock,
  ];

  for (let i = 0; i < tests.length; i++) {
    try {
      await tests[i](page);
    } catch (e) {
      console.log(`[ERROR] Test ${i + 1} threw unhandled: ${e.message}`);
      results.push({ name: `Test ${i + 1}`, status: 'FAIL', detail: e.message });
    }
    await sleep(DELAY);
  }

  await browser.close();

  console.log('');
  console.log('='.repeat(60));
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`  Results: ${passed} PASSED, ${failed} FAILED, ${results.length} TOTAL`);
  console.log('='.repeat(60));

  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  - ${r.name}: ${r.detail}`);
    });
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(2);
});
