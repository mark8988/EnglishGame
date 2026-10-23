const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}:{})});
 try{const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.spoken=[];Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},speak(u){window.spoken.push(u.text)}}});window.SpeechSynthesisUtterance=class{constructor(t){this.text=t}}});
 await page.goto('http://127.0.0.1:8000');
 assert.equal(await page.evaluate(()=>products.length),111);
 assert.equal(await page.evaluate(()=>new Set(products.map(p=>p.id)).size),111);
 await page.evaluate(()=>{state=fresh();render();next()});
 for(let i=0;i<5;i++){
  assert.equal(await page.evaluate(()=>mode),i);
  const before=await page.evaluate(()=>state.coins);
  if(i>=2){assert.equal(await page.locator('#question').innerText(),'🎧 聽一聽，再作答');await page.locator('#speak').click();assert.equal(await page.evaluate(()=>spoken.at(-1)),await page.evaluate(()=>current.en.split(' / ')[0]));}
  if(i===4){await page.locator('#spellInput').fill(await page.evaluate(()=>current.en==='blond(e)'?'blond':current.en==='have (got) to'?'have to':current.en.split(' / ')[0]));await page.locator('#spelling button').click()}
  else{const id=await page.evaluate(()=>current.id);await page.locator(`[data-answer="${id}"]`).click()}
  assert.equal(await page.evaluate(()=>state.coins),before+[2,5,8,12,15][i]);
  await page.evaluate(()=>answer(current.id));assert.equal(await page.evaluate(()=>state.coins),before+[2,5,8,12,15][i]);
  await page.locator('#next').click();
 }
 await page.evaluate(()=>{state.coins=1000;buy('roof');state.durability.roof=1;depreciate();render()});assert.equal(await page.evaluate(()=>has('roof')),false);
 await page.locator('[data-tab="shop"]').click();await page.locator('[data-buy="roof"]').click();assert.equal(await page.evaluate(()=>state.durability.roof),100);assert.equal(await page.evaluate(()=>state.owned.filter(x=>x==='roof').length),1);
 await page.locator('#category').selectOption('食');assert.equal(await page.locator('.product').count(),20);
 await page.evaluate(()=>{state.food=0;buy('extra1');buy('extra1')});assert.equal(await page.evaluate(()=>state.food),50);
 await page.evaluate(()=>{plant('carrot',0);harvest(0)});assert.equal(await page.evaluate(()=>state.garden[0].id),'carrot');await page.evaluate(()=>{state.turn+=3;harvest(0)});assert.equal(await page.evaluate(()=>state.garden[0]),null);
 await page.evaluate(()=>{buy('extra21');state.display=['extra21'];save();render()});assert.equal(await page.locator('.display-item').count(),1);
 await page.locator('#invite').click();const link=await page.locator('#inviteLink').inputValue();assert(link.includes('visit='));await page.goto(link);assert.equal(await page.locator('dialog[open]').count(),1);assert.match(await page.locator('dialog').innerText(),/圍巾/);assert.equal(await page.evaluate(()=>has('roof')),true);
 await page.locator('dialog button').click();await page.reload();assert.equal(await page.evaluate(()=>state.durability.roof),100);
 await page.locator('[data-tab="words"]').click();assert.equal(await page.locator('.word').count(),224);await page.locator('#search').fill('blanket');assert.equal(await page.locator('.word').count(),1);
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
 console.log('PASS: 111 products, 5 reward levels, 3 listening modes, spelling, no duplicate rewards, depreciation/repurchase, categories, food, planting/harvest, display, invitation, persistence, vocabulary, mobile, no JS errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
