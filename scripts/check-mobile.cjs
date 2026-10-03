// Run with PLAYWRIGHT_MODULE set to an installed Playwright module, if needed.
const playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const engine=process.env.BROWSER_ENGINE||'chromium';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.argv[2]||'http://127.0.0.1:4173/M-c-83/';
(async()=>{
  fs.mkdirSync('notes/mobile-qa',{recursive:true});
  const browser=await playwright[engine].launch({headless:true,...(engine==='chromium'&&process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
  const results=[];
  for(const [width,height] of [[320,568],[375,812],[390,844],[430,932],[768,1024],[1440,900]]){
    const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:width<768?3:1,isMobile:width<768,hasTouch:width<768});
    const page=await context.newPage();const errors=[];page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).origin===new URL(base).origin)errors.push(`${r.status()}: ${r.url()}`)});page.on('pageerror',e=>errors.push(e.message));
    const response=await page.goto(base);assert.equal(response.status(),200);
    await page.locator('#hero-title').waitFor();await page.waitForFunction(()=>document.documentElement.dataset.enhanced==='true');await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Horizontal overflow at ${width}`);
    if(width<768){
      const actions=page.locator('.mobile-bar');assert.equal(await actions.isVisible(),true);
      assert.equal(await actions.locator('a,button').count(),3);
      assert.equal(await actions.locator('a').first().getAttribute('href'),'tel:039464159682');
      assert.match(await actions.locator('a').nth(1).getAttribute('href'),/google.com\/maps/);
      for(const target of await actions.locator('a,button').all()){
        const box=await target.boundingBox();assert.ok(box.height>=44&&box.width>=44);
        assert.ok(await target.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}),'Action covered by another element');
      }
      await page.screenshot({animations:'disabled',path:`notes/mobile-qa/${engine}-home-${width}.png`});
      const toggle=page.locator('.hamburger');await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');
      await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'false');
      await actions.locator('a,button').last().click();assert.equal(await page.locator('dialog').evaluate(e=>e.open),true);
      await page.screenshot({animations:'disabled',path:`notes/mobile-qa/${engine}-booking-${width}.png`});
      await page.getByRole('button',{name:'Schließen',exact:true}).click();assert.equal(await page.locator('dialog').evaluate(e=>e.open),false);
      await page.getByRole('button',{name:'EN',exact:true}).click();
      await actions.getByRole('link',{name:'Get directions',exact:true}).waitFor();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      await page.getByRole('button',{name:'DE',exact:true}).click();await page.waitForFunction(()=>document.documentElement.lang==='de');
    }else assert.equal(await page.locator('.mobile-bar').isVisible(),false);
    await page.getByRole('tab',{name:'Vorspeisen',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.menu-photo img').getAttribute('src').includes('vorspeisen-1280'));
    await page.locator('.menu-photo img').evaluate(el=>el.decode());
    assert.match(await page.locator('.menu-photo img').getAttribute('src'),/vorspeisen-1280.webp/);
    await page.screenshot({animations:'disabled',path:`notes/mobile-qa/${engine}-vorspeisen-${width}.png`});
    const selected=page.getByRole('tab',{name:'Vorspeisen',exact:true});await selected.focus();await selected.press('ArrowRight');
    await page.waitForFunction(()=>document.getElementById('tab-3').getAttribute('aria-selected')==='true');
    await page.getByRole('tab',{name:'Getränke & Desserts',exact:true}).press('Home');
    await page.waitForFunction(()=>document.getElementById('tab-0').getAttribute('aria-selected')==='true');
    const theme=page.locator('.theme-toggle');await theme.click();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
    await theme.click();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
    await page.goto(new URL('menu.html',base).href);await page.locator('#menu .menu-section').first().waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Menu overflow at ${width}`);
    await page.locator('#search').fill('Dornfelder');assert.ok((await page.locator('#menu').textContent()).includes('22,50'));
    if(width<768){
      assert.equal(await page.locator('.quick-contact a').count(),3);
      await page.screenshot({animations:'disabled',path:`notes/mobile-qa/${engine}-menu-${width}.png`});
      await page.locator('.quick-contact a').last().click();await page.locator('dialog[open]').waitFor();
    }
    assert.deepEqual(errors,[]);results.push({width,passed:true});await context.close();
  }
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();await page.goto(base);assert.equal(await page.locator('#hero-title').isVisible(),true);assert.equal(await page.locator('.mobile-bar a').count(),3);
  await page.screenshot({animations:'disabled',path:`notes/mobile-qa/${engine}-no-js.png`});await context.close();
  await browser.close();console.log(JSON.stringify({engine,results,staticHtmlWithoutJavaScript:true},null,2));
})().catch(e=>{console.error(e);process.exit(1);});
