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
    const page=await context.newPage();page.setDefaultTimeout(15000);const errors=[];page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).origin===new URL(base).origin)errors.push(`${r.status()}: ${r.url()}`)});page.on('pageerror',e=>errors.push(e.message));
    const response=await page.goto(base);assert.equal(response.status(),200);
    await page.locator('#hero-title').waitFor();await page.waitForFunction(()=>document.documentElement.dataset.enhanced==='true');await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Horizontal overflow at ${width}`);
    assert.equal(await page.evaluate(()=>document.querySelector('#menu').compareDocumentPosition(document.querySelector('#restaurant')) & Node.DOCUMENT_POSITION_FOLLOWING),4,'Menu must come before the restaurant story');
    for(const selector of ['.hero-description','.dish p','.story-copy>p:not(.eyebrow)']) {
      assert.ok(await page.locator(selector).first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=18),`Readable body text: ${selector} at ${width}`);
    }
    assert.equal(await page.locator('meta[property="og:title"]').count(),1);
    assert.match(await page.locator('meta[property="og:image"]').getAttribute('content'),/^https:\/\/.+moc83-sushi-social\.jpg$/);
    const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    assert.equal(schema['@type'],'Restaurant');assert.equal(schema.alternateName,'Moc 83');
    assert.deepEqual(schema.openingHoursSpecification.map(({dayOfWeek,opens,closes})=>({dayOfWeek,opens,closes})),[
      {dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday'],opens:'11:00',closes:'21:00'},
      {dayOfWeek:['Saturday','Sunday'],opens:'11:00',closes:'22:00'}
    ]);
    for(const hours of await page.locator('.opening-hours').all()){
      assert.deepEqual(await hours.locator('.hours-times').allTextContents(),['11:00 - 21:00','11:00 - 22:00']);
    }
    assert.equal(await page.locator('iframe').count(),0,'Maps must remain blocked before consent');
    assert.equal(await page.evaluate(()=>document.cookie),'');
    assert.doesNotMatch(await page.locator('body').innerText(),/Thank you|Invalid Code/);
    if(width<768){
      const actions=page.locator('.mobile-bar');assert.equal(await actions.isVisible(),true);
      const barBox=await actions.boundingBox();
      const hours=await page.locator('.hero-hours').boundingBox();
      assert.ok(hours.y>=0&&hours.y+hours.height<=barBox.y,'Hours must fit above mobile bar on first screen');
      const shortcut=page.locator('.menu-shortcut');
      const shortcutBox=await shortcut.boundingBox();
      assert.ok(shortcutBox.y>=0&&shortcutBox.y+shortcutBox.height<barBox.y,'Menu shortcut must be on the first screen');
      assert.ok(shortcutBox.height>=48,'Menu shortcut must be easy to tap');
      assert.equal(await shortcut.getAttribute('href'),'menu.html');
      await page.locator('.hero-image img').evaluate(el=>el.decode());
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
      const englishHours=await page.locator('.hero-hours').boundingBox();
      assert.ok(englishHours.y+englishHours.height<=(await actions.boundingBox()).y);
      await page.getByRole('button',{name:'DE',exact:true}).click();await page.waitForFunction(()=>document.documentElement.lang==='de');
    }else assert.equal(await page.locator('.mobile-bar').isVisible(),false);
    await page.getByRole('tab',{name:'Vorspeisen',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.menu-photo img').getAttribute('src').includes('vorspeisen-1280'));
    await page.locator('.menu-photo img').scrollIntoViewIfNeeded();
    await page.locator('.menu-photo img').evaluate(el=>el.decode());
    assert.match(await page.locator('.menu-photo img').getAttribute('src'),/vorspeisen-1280.webp/);
    await page.screenshot({animations:'disabled',path:`notes/mobile-qa/${engine}-vorspeisen-${width}.png`});
    const selected=page.getByRole('tab',{name:'Vorspeisen',exact:true});await selected.focus();await selected.press('ArrowRight');
    await page.waitForFunction(()=>document.getElementById('tab-3').getAttribute('aria-selected')==='true');
    await page.getByRole('tab',{name:'Getränke & Desserts',exact:true}).press('Home');
    await page.waitForFunction(()=>document.getElementById('tab-0').getAttribute('aria-selected')==='true');
    if(width===390){
      await page.route('https://www.google.com/maps?**',route=>route.fulfill({contentType:'text/html',body:'<p>Map test frame</p>'}));
      await page.locator('.map-load').click();await page.locator('.map-frame iframe').waitFor();
      assert.equal(await page.locator('.map-placeholder').isVisible(),false);
      await page.locator('.map-remove').click();assert.equal(await page.locator('iframe').count(),0);
      assert.equal(await page.locator('.map-placeholder').isVisible(),true);
    }
    async function checkContrast(){
      const ratios=await page.evaluate(()=>{
        const css=getComputedStyle(document.documentElement);
        const luminance=value=>{const c=value.trim().replace('#','');const rgb=c.match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
        const contrast=(a,b)=>{const x=luminance(css.getPropertyValue(a)),y=luminance(css.getPropertyValue(b));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
        return [contrast('--text','--bg'),contrast('--muted','--surface'),contrast('--gold','--soft')];
      });
      assert.ok(ratios[0]>=7&&ratios[1]>=7&&ratios[2]>=4.5,`Text contrast too low: ${ratios}`);
    }
    await checkContrast();
    const theme=page.locator('.theme-toggle');await theme.click();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
    await checkContrast();
    await theme.click();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
    await page.goto(new URL('menu.html',base).href);await page.locator('#menu .menu-section').first().waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Menu overflow at ${width}`);
    await page.locator('#search').fill('Dornfelder');assert.ok((await page.locator('#menu').textContent()).includes('22,50'));
    assert.equal(await page.locator('#no-results').isVisible(),false);
    await page.locator('#search').fill('zzzzzz');assert.equal(await page.locator('#no-results').isVisible(),true);
    await page.locator('#search').fill('');
    await page.locator('#sections').selectOption('9');
    assert.equal(await page.locator('#menu .menu-section:visible').count(),1);
    await page.locator('#sections').selectOption('');
    await page.locator('#search').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    assert.equal(await page.locator('#search').evaluate(el=>{const r=el.getBoundingClientRect();return el===document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)}),true,'Menu filter must remain clickable');
    await page.getByRole('button',{name:'EN',exact:true}).click();assert.equal(await page.locator('html').getAttribute('lang'),'en');
    await page.getByRole('button',{name:'DE',exact:true}).click();
    assert.equal(await page.locator('#allergene dt').count(),14);
    if(width<768){
      assert.equal(await page.locator('.quick-contact a').count(),3);
      await page.screenshot({animations:'disabled',path:`notes/mobile-qa/${engine}-menu-${width}.png`});
      await page.locator('.quick-contact a').last().click();await page.locator('dialog[open]').waitFor();
    }
    for(const legal of ['impressum.html','datenschutz.html']){
      await page.goto(new URL(legal,base).href);
      assert.equal(await page.locator('h1').isVisible(),true);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Legal page overflow: ${legal} at ${width}`);
    }
    assert.deepEqual(errors,[]);results.push({width,passed:true});await context.close();
  }
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();await page.goto(base);assert.equal(await page.locator('#hero-title').isVisible(),true);assert.equal(await page.locator('.mobile-bar a').count(),3);
  await page.screenshot({animations:'disabled',path:`notes/mobile-qa/${engine}-no-js.png`});
  await page.goto(new URL('menu.html',base).href);
  assert.equal(await page.locator('#menu .menu-section').count(),30);
  assert.ok(await page.locator('#menu .menu-price').count()>100);
  assert.equal(await page.locator('#allergene dt').count(),14);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await context.close();
  await browser.close();console.log(JSON.stringify({engine,results,staticHtmlWithoutJavaScript:true},null,2));
})().catch(e=>{console.error(e);process.exit(1);});
