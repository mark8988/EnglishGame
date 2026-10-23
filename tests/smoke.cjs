const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}:{})});
 try{const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.spoken=[];Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},speak(u){window.spoken.push(u.text)}}});window.SpeechSynthesisUtterance=class{constructor(t){this.text=t}}});
 await page.goto('http://127.0.0.1:8000');
 assert.equal(await page.locator('.floorplan').getAttribute('open'),null);
 for(let i=0;i<3;i++){const response=await page.request.get(`http://127.0.0.1:8000/assets/rooms/sheet-${i}.png`);assert.equal(response.status(),200);assert.match(response.headers()['content-type'],/image/)}
 await page.locator('#roomSelect').selectOption('kitchen');assert.equal(await page.locator('#roomTitle').innerText(),'廚房');assert.match(await page.locator('#interiorArt').getAttribute('aria-label'),/廚房/);await page.locator('#roomSelect').selectOption('living');
 const sceneSize=await page.locator('#scene').boundingBox();assert(sceneSize.width>500&&sceneSize.height>330,'Desktop interior must be large');
 assert.equal(await page.locator('.roof').isVisible(),false);
 assert.equal(await page.evaluate(()=>products.length),123);
 assert.equal(await page.evaluate(()=>PET_SPECIES.length),28);assert.equal(await page.locator('[data-adopt]').count(),28);assert.equal(await page.evaluate(()=>new Set(PET_SPECIES.map(p=>p.id)).size),28);
 assert.equal(await page.evaluate(()=>new Set(products.map(p=>p.id)).size),123);
 await page.evaluate(()=>{state=fresh();render();next()});
 for(let i=0;i<5;i++){
  assert.equal(await page.evaluate(()=>mode),i);
  const before=await page.evaluate(()=>state.coins);
  if(i>=2){assert.match(await page.locator('#question').innerText(),/聽一聽，再作答/);await page.locator('#speak').click();assert.equal(await page.evaluate(()=>spoken.at(-1)),await page.evaluate(()=>current.en.split(' / ')[0]));}
  if(i===1||i===4){await page.locator('#spellInput').fill(await page.evaluate(()=>current.en==='blond(e)'?'blond':current.en==='have (got) to'?'have to':current.en.split(' / ')[0]));await page.locator('#spelling button').click()}
  else{const id=await page.evaluate(()=>current.id);await page.locator(`[data-answer="${id}"]`).click()}
  assert.equal(await page.evaluate(()=>state.coins),before+[5,8,12,16,20][i]);
  await page.evaluate(()=>answer(current.id));assert.equal(await page.evaluate(()=>state.coins),before+[5,8,12,16,20][i]);
  await page.locator('#next').click();
 }
 // Typing tasks reject empty and incorrect input, accept spelling variants, and hide choices.
 await page.evaluate(()=>{state.turn=1;next();current=WORDS.find(w=>w.en==='blanket');$('question').textContent=current.zh});
 assert.equal(await page.locator('#answers button').count(),0);assert(await page.locator('#speak').isHidden());
 const typingCoins=await page.evaluate(()=>state.coins);const turnBefore=await page.evaluate(()=>state.turn);
 await page.locator('#spelling button').click();assert.equal(await page.evaluate(()=>state.turn),turnBefore);
 await page.locator('#spellInput').fill('blankit');await page.locator('#spelling button').click();assert.equal(await page.evaluate(()=>state.coins),typingCoins);assert.match(await page.locator('#feedback').innerText(),/blanket/);
 await page.evaluate(()=>{state.turn=1;next();current=WORDS.find(w=>w.en==='blanket')});await page.locator('#spellInput').fill('  BLANKET  ');await page.locator('#spelling button').click();assert.equal(await page.evaluate(()=>state.coins),typingCoins+8);
 await page.evaluate(()=>{current=WORDS.find(w=>w.en==='have (got) to')});assert(await page.evaluate(()=>spellingCorrect('have to')&&spellingCorrect('have got to')));
 await page.evaluate(()=>{state.coins=1000;buy('roof');state.durability.roof=1;depreciate();render()});assert.equal(await page.evaluate(()=>has('roof')),false);
 await page.locator('[data-tab="shop"]').click();await page.locator('[data-buy="roof"]').click();assert.equal(await page.evaluate(()=>state.durability.roof),100);assert.equal(await page.evaluate(()=>state.owned.filter(x=>x==='roof').length),1);
 await page.locator('#category').selectOption('食');assert.equal(await page.locator('.product').count(),20);
 await page.evaluate(()=>{state.food=0;buy('extra1');buy('extra1')});assert.equal(await page.evaluate(()=>state.food),50);
 await page.evaluate(()=>{plant('carrot',0);harvest(0)});assert.equal(await page.evaluate(()=>state.garden[0].id),'carrot');await page.evaluate(()=>{state.turn+=3;harvest(0)});assert.equal(await page.evaluate(()=>state.garden[0]),null);
 await page.evaluate(()=>{buy('extra21');state.roomDisplays[state.room]=['extra21'];save();render()});assert.equal(await page.locator('.display-item').count(),1);
 await page.locator('.floorplan summary').click();
 await page.locator('[data-room="kitchen"]').click();assert.equal(await page.locator('.display-item').count(),0);
 await page.locator('[data-room="living"]').click();assert.equal(await page.locator('.display-item').count(),1);assert.equal(await page.locator('[data-room]').count(),11);
 // Every room can be reached on the map; only one current location is marked.
 for(const id of await page.evaluate(()=>ROOMS.map(r=>r[0]))){await page.locator(`[data-room="${id}"]`).click();assert.equal(await page.locator('#roomTabs [aria-current="location"]').count(),1);assert.equal(await page.locator('#roomTabs [aria-current="location"]').getAttribute('data-room'),id);assert.match(await page.locator('#floorplanLocation').innerText(),new RegExp(await page.locator('#roomTitle').innerText()));}
 await page.reload();assert.equal(await page.locator('[aria-current="location"]').getAttribute('data-room'),'garage');
 await page.locator('.floorplan summary').click();
 await page.locator('[data-room="living"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[aria-current="location"]').getAttribute('data-room'),'living');
 await page.evaluate(()=>{state.coins=1000;adoptPet('cheetah');adoptPet('alien');adoptPet('dragon');adoptPet('kitten')});assert.equal(await page.evaluate(()=>state.pets.length),3);
 assert.equal(await page.locator('.pet-sprite').count(),3);
 await page.evaluate(()=>{state.pets[0].food=10;buy('pet-kibble')});assert.equal(await page.evaluate(()=>state.petInventory['pet-kibble']),1);
 await page.locator('[data-care="pet-kibble"][data-pet="0"]').click();assert.equal(await page.evaluate(()=>state.pets[0].food),40);assert.equal(await page.evaluate(()=>state.petInventory['pet-kibble']),0);
 await page.evaluate(()=>carePet(0,'pet-kibble'));assert.equal(await page.evaluate(()=>state.pets[0].food),40);
 await page.evaluate(()=>{buy('pet-coat');carePet(0,'pet-coat')});assert.equal(await page.evaluate(()=>state.pets[0].equipment.clothes),'pet-coat');
 await page.evaluate(()=>{state.durability['pet-coat']=1;depreciate();tickPets();render()});assert.equal(await page.evaluate(()=>state.pets[0].equipment.clothes),undefined);
 await page.locator('[data-rename="0"] input').fill('<小獵豹>');await page.locator('[data-rename="0"] button').click();assert.match(await page.locator('.pet-card').first().innerText(),/<小獵豹>/);
 await page.reload();assert.equal(await page.evaluate(()=>state.pets[0].name),'<小獵豹>');assert.equal(await page.evaluate(()=>state.roomDisplays.living[0]),'extra21');
 await page.locator('#invite').click();const link=await page.locator('#inviteLink').inputValue();assert(link.includes('visit='));await page.goto(link);assert.equal(await page.locator('dialog[open]').count(),1);assert.match(await page.locator('dialog').innerText(),/圍巾/);assert.equal(await page.evaluate(()=>has('roof')),true);
 await page.locator('dialog button').click();await page.reload();assert.equal(await page.evaluate(()=>state.durability.roof),99);
 await page.locator('[data-tab="words"]').click();assert.equal(await page.locator('.word').count(),224);await page.locator('#search').fill('blanket');assert.equal(await page.locator('.word').count(),1);
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.waitForFunction(()=>Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0));assert.equal(await page.locator('.lily-art').count(),1);assert.deepEqual(errors,[]);
 console.log('PASS: 28 unique pet species, 123 products, adoption limits, paid supplies, pet care, clothing wear, safe rename, 11 rooms, independent displays, 5 reward levels, 3 listening modes, spelling, no duplicate rewards, depreciation/repurchase, categories, food, planting/harvest, display, invitation, persistence, vocabulary, mobile, no JS errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
