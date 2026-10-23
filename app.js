const KEY='english-cottage-v1';
const fresh=()=>({coins:30,warmth:35,food:50,solved:0,owned:[],seen:[],turn:0,display:[],durability:{},garden:[],pets:[],petInventory:{},room:"living",roomDisplays:{}});
let state=fresh();try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Number.isFinite(s.coins)&&Array.isArray(s.owned)&&Array.isArray(s.seen))state={...state,...s}}catch{}
const ROOMS=[['living','客廳','🛋️'],['kitchen','廚房','🍳'],['room1','房間一','🚪'],['room2','房間二','🚪'],['room3','房間三','🚪'],['dressing','更衣室','👗'],['study','書房','📚'],['bedroom','臥室','🛏️'],['bathroom','浴室','🛁'],['balcony','陽台','🌿'],['garage','車庫','🚗']];
if(!ROOMS.some(r=>r[0]===state.room))state.room='living';
for(const [id] of ROOMS)if(!Array.isArray(state.roomDisplays[id]))state.roomDisplays[id]=id==='living'?[...state.display]:[];
function switchRoom(id){if(!ROOMS.some(r=>r[0]===id))return;state.room=id;save();render()}
const products=[
{id:'roof',name:'修好漏水屋頂',en:'fix',icon:'🛠️',cost:60,desc:'擋住雪水，每回合少流失 2 點溫暖。'},
{id:'window',name:'換上完整窗戶',en:'glass',icon:'🪟',cost:50,desc:'擋住冷風，每回合少流失 2 點溫暖。'},
{id:'soup',name:'一碗熱湯',en:'bowl · hot',icon:'🍲',cost:15,desc:'飽足 +40、溫暖 +10，可重複購買。'},
{id:'coat',name:'柔軟大衣',en:'coat',icon:'🧥',cost:40,desc:'溫暖 +20，幫莉莉抵禦寒冷。'},
{id:'blanket',name:'厚厚毛毯',en:'blanket',icon:'🧶',cost:35,desc:'溫暖 +20，睡覺也不怕冷。'},
{id:'fire',name:'溫暖壁爐',en:'hot',icon:'🔥',cost:100,desc:'溫暖 +35，每回合回暖 3 點。'},
{id:'floor',name:'全新木地板',en:'floor',icon:'🪵',cost:65,desc:'溫暖 +10，告別潮濕的地面。'},
{id:'bed',name:'舒適小床',en:'dream',icon:'🛏️',cost:80,desc:'溫暖 +15，讓莉莉做個好夢。'},
{id:'rug',name:'圓形地毯',en:'circle',icon:'🟠',cost:45,desc:'為房間添上一點柔軟的色彩。'},
{id:'book',name:'小小閱讀角',en:'comic book',icon:'📚',cost:55,desc:'讓每個冬夜都有故事陪伴。'},
{id:'plant',name:'窗邊綠植',en:'grow',icon:'🪴',cost:40,desc:'就算是冬天，也有新的希望。'}];
products.forEach(p=>p.category="修繕");
products.push(...EXTRA_PRODUCTS,...PET_PRODUCTS);
const $=id=>document.getElementById(id);const has=id=>state.owned.includes(id)&& (state.durability[id]??100)>0;const clamp=n=>Math.max(0,Math.min(100,n));
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{$('story').textContent='瀏覽器無法儲存進度，請保持本頁開啟。'}}
function render(){
 for(const [id] of ROOMS)if(!Array.isArray(state.roomDisplays[id]))state.roomDisplays[id]=[];
 $("roomTabs").innerHTML=ROOMS.map(([id,name,icon])=>`<button class="plan-room" style="grid-area:${id}" data-room="${id}" aria-pressed="${state.room===id}" ${state.room===id?'aria-current="location"':''} aria-label="${name}${state.room===id?'，目前所在房間':'，點選前往'}"><span class="plan-icon" aria-hidden="true">${artIcon(icon,id,"room")}</span><b>${name}</b><small>${state.room===id?'● 你在這裡':'點選前往'}</small></button>`).join('')+'<div class="plan-hall" aria-hidden="true">走　廊</div>';
 $("floorplanLocation").textContent='📍 目前位置：'+ROOMS.find(r=>r[0]===state.room)[1];
 $("roomTitle").textContent=ROOMS.find(r=>r[0]===state.room)[1];
 $("room").dataset.space=state.room;
 $("roomMarker").textContent=ROOMS.find(r=>r[0]===state.room)[2];
 renderGarden();
 renderPets();
 $('inviteStatus').textContent='分享的是目前小屋快照，朋友參觀不會更改你的存檔。';
 $('coins').textContent=`🪙 ${state.coins} 金幣`;$('progress').textContent=`已修繕 ${products.filter(p=>p.category==="修繕"&&has(p.id)).length} / 10 · 收藏 ${state.owned.length}`;
 $('roof').classList.toggle('fixed',has('roof'));$('window').classList.toggle('fixed',has('window'));$('leak').hidden=has('roof');$('floor').classList.toggle('fixed',has('floor'));$('room').classList.toggle('cozy',has('roof')&&has('window'));
 $('decor').innerHTML=['fire','bed','rug','book','plant'].filter(id=>has(id)&&({fire:'living',bed:'bedroom',rug:'living',book:'study',plant:'balcony'}[id]===state.room)).map(id=>`<div class="furniture ${id}">${artIcon(products.find(p=>p.id===id).icon,id)}</div>`).join('');
 document.querySelector('.dress').style.background=has('coat')?'#66897d':'#b17776';
 $('speech').textContent=state.food<25?'肚子咕嚕咕嚕…想喝熱湯。':state.warmth<30?'風好冷…我們一起修好家吧。':has('bed')?'這裡越來越像夢想中的家了！':'謝謝你，今天又暖了一點！';
 $('vitals').innerHTML=[['🌡 溫暖',state.warmth],['🍲 飽足',state.food],['✦ 已完成',state.solved]].map(([label,n],i)=>`<div class="vital"><label>${label}<span>${n}${i<2?'%':' 題'}</span></label><div class="track"><i style="width:${i<2?n:Math.min(100,state.solved/224*100)}%"></i></div></div>`).join('');
 const all=products.filter(p=>p.category==='修繕'&&p.id!=='soup').every(p=>has(p.id));
 $('story').textContent=all?'✨ 暖屋完成！莉莉終於有一個安全又溫暖的家。你仍可繼續挑戰全部單字、照顧莉莉。':'「等雪停了，我想邀請朋友來家裡喝熱湯。」—— 莉莉';
 $('missionText').textContent=!has('roof')?'① 累積 60 金幣，先修好屋頂，讓房子不再漏水。':!has('window')?'② 花 50 金幣修好窗戶，擋住外面的暴風雪。':!has('fire')?'③ 添購壁爐，讓小屋持續回暖。':all?'完成全部修繕！繼續學習並維持飽足與溫暖。':'④ 挑選家具，完成 10 項永久修繕與裝飾。';
 $('shopCount').textContent=`共 ${products.length} 項商品，包含食衣住行育樂與寵物用品。`;
 $('collection').innerHTML=state.owned.filter(id=>id.startsWith('extra')&&has(id)).map(id=>{const p=products.find(x=>x.id===id);return `<button data-display="${id}" aria-pressed="${state.roomDisplays[state.room].includes(id)}">${p.icon} ${p.name}${state.roomDisplays[state.room].includes(id)?' ✓':''}</button>`}).join('');
 $('decor').innerHTML+=state.roomDisplays[state.room].filter(has).map((id,i)=>{const p=products.find(x=>x.id===id);return `<div class="display-item" style="left:${5+i*23}%">${artIcon(p.icon,p.id)}<small>${p.name}</small></div>`}).join('');
 $('products').innerHTML=products.filter(p=>$('category').value==='全部'||p.category===$('category').value).map(p=>`<div class="product"><div class="icon">${artIcon(p.icon,p.id)}</div><div class="info"><b>${p.name}</b><p>${p.category} · ${p.desc}${p.petSupply&&p.consumable?` · 背包 ${state.petInventory[p.id]||0} 份`:""}${state.owned.includes(p.id)?` · 耐久 ${state.durability[p.id]??100}%`:''}</p></div><button data-buy="${p.id}" ${has(p.id)||state.coins<p.cost?'disabled':''}>${has(p.id)?'✓ 已擁有':`${state.owned.includes(p.id)?'重新購買 ':''}🪙 ${p.cost}`}</button></div>`).join('');
}
function buy(id){const p=products.find(p=>p.id===id);if(!p||state.coins<p.cost||has(id))return;state.coins-=p.cost;if(p.petSupply&&p.consumable){state.petInventory[id]=(state.petInventory[id]||0)+1}else if(p.consumable){state.food=clamp(state.food+p.food)}else if(id==='soup'){state.food=clamp(state.food+40);state.warmth=clamp(state.warmth+10)}else{if(!state.owned.includes(id))state.owned.push(id);state.durability[id]=100;state.warmth=clamp(state.warmth+(p.petSupply?0:p.warmth??({coat:20,blanket:20,fire:35,floor:10,bed:15}[id]||5)))}save();render()}
let current,locked=false,reverse=false,mode=0;
const rewards=[2,5,8,12,15];
const modeNames=['入門・英翻中','普通・看中文寫英文','進階・聽音選中文','挑戰・聽音辨英文','大師・聽音拼字'];
const audioSupported=()=> 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function next(){
 locked=false;$('feedback').textContent='';$('next').hidden=true;
 mode=state.turn%5;if(mode>=2&&!audioSupported()){mode=state.turn%2;$('feedback').textContent='此瀏覽器不支援語音，已切換閱讀任務。請使用支援語音的瀏覽器玩聽力。'}
 let pool=WORDS.filter(w=>!state.seen.includes(w.id));if(!pool.length){state.seen=[];pool=WORDS}
 current=pool[Math.floor(Math.random()*pool.length)];reverse=mode===1||mode===3;
 $('reward').textContent=`${modeNames[mode]} · 答對 +${rewards[mode]} 金幣`;
 $('qtype').textContent=modeNames[mode];$('question').textContent=mode>=2?'🎧 聽一聽，再作答':reverse?current.zh:current.en;
 $('speak').textContent=mode>=2?'▶ 播放 / 重聽題目':'🔊 聽英文發音';
 $('taskTitle').textContent=mode>=2?'聽力委託：聽見冬日的聲音':'小鎮的單字委託';
 $('spelling').hidden=mode!==1&&mode!==4;
 $('spellInput').placeholder=mode===1?'請輸入中文意思對應的英文':'請輸入聽到的英文';
 $('spellInput').setAttribute('aria-label',mode===1?'看中文輸入英文':'輸入聽到的英文');
 $('speak').hidden=mode===1;$('spellInput').value='';$('spellInput').disabled=false;$('spelling').querySelector('button').disabled=false;
 $('answers').hidden=mode===1||mode===4;
 const choices=shuffle([current,...shuffle(WORDS.filter(w=>w.id!==current.id)).slice(0,mode===0?2:mode===3?5:3)]);
 $('answers').innerHTML=(mode===1||mode===4?[]:choices).map(w=>`<button data-answer="${w.id}">${reverse?w.en:w.zh}</button>`).join('');
}
function normalize(s){return s.toLowerCase().trim().replace(/\s+/g,' ')}
function spellingCorrect(value){let variants=current.en.split(' / ');if(current.en==='blond(e)')variants=['blond','blonde'];if(current.en==='have (got) to')variants=['have to','have got to'];return variants.some(v=>normalize(v)===normalize(value))}
function answer(id){if(locked)return;if((mode===1||mode===4)&&!String(id).trim()){$('feedback').textContent='先試著輸入英文，再送出答案喔。';$('spellInput').focus();return}locked=true;const ok=(mode===1||mode===4)?spellingCorrect(id):id===current.id;$('spellInput').disabled=true;$('spelling').querySelector('button').disabled=true;state.turn++;depreciate();tickPets();document.querySelectorAll('[data-answer]').forEach(b=>{b.disabled=true;if(+b.dataset.answer===current.id)b.classList.add('correct');else if(+b.dataset.answer===id)b.classList.add('wrong')});if(ok){state.coins+=rewards[mode];state.solved++;state.seen.push(current.id)}state.food=clamp(state.food-1);state.warmth=clamp(state.warmth-(has('roof')?0:2)-(has('window')?0:2)+(has('fire')?3:0));if(state.food===0||state.warmth===0){state.food=Math.max(20,state.food);state.warmth=Math.max(15,state.warmth);$('feedback').textContent='鄰居送來緊急物資，莉莉暫時安全了。先買熱湯、修好房子吧！ '}
 $('feedback').textContent+=(ok?`✓ 答對了！獲得 ${rewards[mode]} 金幣。`:'再記一次，下次一定會！')+` ${current.en} → ${current.zh}`;$('next').hidden=false;save();render()}
function speak(text){if('speechSynthesis'in window){speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(text.split(' / ')[0]);u.lang='en-US';u.rate=.8;u.onerror=()=>{$('feedback').textContent='語音播放失敗，請確認裝置有英文語音並重試播放；也可按下一個任務。';$('next').hidden=false};speechSynthesis.speak(u)}else{$('feedback').textContent='此瀏覽器不支援語音朗讀。'}}
function words(){let q=$('search').value.toLowerCase();$('wordList').replaceChildren();WORDS.filter(w=>(w.en+w.zh).toLowerCase().includes(q)).forEach(w=>{let d=document.createElement('div');d.className='word';let a=document.createElement('div');a.textContent=`${w.id}. ${w.en}`;let b=document.createElement('span');b.textContent=w.zh;let btn=document.createElement('button');btn.textContent='🔊';btn.setAttribute('aria-label',`朗讀 ${w.en}`);btn.onclick=()=>speak(w.en);d.append(a,b,btn);$('wordList').append(d)})}
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.tab').forEach(t=>t.hidden=t.id!==b.dataset.tab)});
$('answers').onclick=e=>{if(e.target.dataset.answer)answer(+e.target.dataset.answer)};$('products').onclick=e=>{if(e.target.dataset.buy)buy(e.target.dataset.buy)};$('next').onclick=next;$('speak').onclick=()=>speak(current.en);$('search').oninput=words;$('category').onchange=render;$('spelling').onsubmit=e=>{e.preventDefault();answer($('spellInput').value)};$('collection').onclick=e=>{const id=e.target.closest('[data-display]')?.dataset.display;if(!id)return;if(state.roomDisplays[state.room].includes(id))state.roomDisplays[state.room]=state.roomDisplays[state.room].filter(x=>x!==id);else{for(const room of Object.keys(state.roomDisplays))state.roomDisplays[room]=state.roomDisplays[room].filter(x=>x!==id);state.roomDisplays[state.room].push(id);if(state.roomDisplays[state.room].length>4)state.roomDisplays[state.room].shift()}save();render()};$('reset').onclick=()=>{if(confirm('確定重新開始？這會清除本機的金幣與裝潢進度。')){state=fresh();for(const [id] of ROOMS)state.roomDisplays[id]=[];save();render();next()}};

const crops=[{id:'carrot',name:'胡蘿蔔',icon:'🥕',cost:3,turns:3,food:20},{id:'tomato',name:'番茄',icon:'🍅',cost:5,turns:4,food:30},{id:'corn',name:'玉米',icon:'🌽',cost:7,turns:5,food:40}];
function depreciate(){for(const id of state.owned){const old=state.durability[id]??100;state.durability[id]=Math.max(0,old-1)}for(const room of Object.keys(state.roomDisplays))state.roomDisplays[room]=state.roomDisplays[room].filter(has)}
function renderGarden(){
 const list=crops;
 $('gardenSlots').innerHTML=Array.from({length:3},(_,i)=>{const crop=state.garden[i];if(!crop)return `<div class="plot">🌱 空菜圃 ${i+1}<div>${list.map(c=>`<button data-plant="${c.id}" data-slot="${i}" ${state.coins<c.cost?'disabled':''}>${c.icon} ${c.name} 🪙${c.cost}</button>`).join('')}</div></div>`;const c=list.find(x=>x.id===crop.id);const left=Math.max(0,c.turns-(state.turn-crop.planted));return `<div class="plot">${c.icon} ${c.name} · ${left?`再作答 ${left} 題成熟`:'可以收成了！'}<button data-harvest="${i}" ${left?'disabled':''}>收成 · 飽足 +${c.food}</button></div>`}).join('');
}
function plant(id,slot){const c=crops.find(x=>x.id===id);if(!c||slot<0||slot>2||state.garden[slot]||state.coins<c.cost)return;state.coins-=c.cost;state.garden[slot]={id,planted:state.turn};save();render()}
function harvest(slot){const item=state.garden[slot];if(!item)return;const c=crops.find(x=>x.id===item.id);if(state.turn-item.planted<c.turns)return;state.food=clamp(state.food+c.food);state.garden[slot]=null;save();render()}
$('gardenSlots').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.plant)plant(b.dataset.plant,+b.dataset.slot);if(b.dataset.harvest!==undefined)harvest(+b.dataset.harvest)};
$('invite').onclick=async()=>{const snapshot={owned:state.owned.filter(has),display:state.roomDisplays[state.room].filter(has),room:state.room,solved:state.solved,pets:state.pets.map(p=>({species:p.species,name:p.name}))};const url=new URL(location.href);url.searchParams.set('visit',JSON.stringify(snapshot));$('inviteLink').hidden=false;$('inviteLink').value=url.href;try{await navigator.clipboard.writeText(url.href);$('inviteStatus').textContent='參觀連結已複製！傳給朋友就能參觀。'}catch{$('inviteStatus').textContent='請複製下方連結，傳給朋友參觀。'}};
try{const raw=new URL(location.href).searchParams.get('visit');if(raw){const host=JSON.parse(raw);if(Array.isArray(host.owned)){const dialog=document.createElement('dialog');const title=document.createElement('h2');title.textContent='🏡 歡迎來朋友家玩！';const text=document.createElement('p');text.textContent='這是朋友分享當下的小屋收藏。你的遊戲存檔不會改變。';const list=document.createElement('div');list.className='guest-items';products.filter(p=>host.owned.includes(p.id)).forEach(p=>{let item=document.createElement('div');item.textContent=`${p.icon} ${p.name}`;list.append(item)});if(Array.isArray(host.pets))host.pets.slice(0,3).forEach(p=>{const species=PET_SPECIES.find(s=>s.id===p.species);if(!species)return;const item=document.createElement('div');item.textContent=`${species.icon} ${String(p.name).slice(0,16)}`;list.append(item)});const close=document.createElement('button');close.textContent='參觀完畢，回到我的家';close.onclick=()=>{dialog.close();const u=new URL(location.href);u.searchParams.delete('visit');history.replaceState(null,'',u)};const scene=$('scene').cloneNode(true);scene.removeAttribute('id');scene.querySelectorAll('[id]').forEach(el=>{const id=el.id;if(['roof','window','floor'].includes(id))el.classList.toggle('fixed',host.owned.includes(id));if(id==='leak')el.hidden=host.owned.includes('roof');if(id==='room')el.dataset.space=ROOMS.some(r=>r[0]===host.room)?host.room:'living';if(id==='roomMarker')el.textContent=(ROOMS.find(r=>r[0]===host.room)||ROOMS[0])[2];if(id==='petScene'){el.replaceChildren();if(Array.isArray(host.pets))host.pets.slice(0,3).forEach(p=>{const species=PET_SPECIES.find(s=>s.id===p.species);if(!species)return;const item=document.createElement('span');item.textContent=species.icon;el.append(item)})}if(id==='room')el.classList.toggle('cozy',host.owned.includes('roof')&&host.owned.includes('window'));if(id==='speech')el.textContent='歡迎來我家玩！';if(id==='decor'){el.replaceChildren();products.filter(p=>host.owned.includes(p.id)).slice(0,4).forEach((p,i)=>{const item=document.createElement('div');item.className='display-item';item.style.left=(5+i*23)+'%';item.textContent=p.icon;el.append(item)})}el.removeAttribute('id')});dialog.append(title,text,scene,list,close);document.body.append(dialog);dialog.showModal()}}}catch{}

$('roomTabs').onclick=e=>{const b=e.target.closest('[data-room]');if(b)switchRoom(b.dataset.room)};
initPetControls();render();next();words();initCuteArt();
