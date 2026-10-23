const KEY='english-cottage-v1';
const fresh=()=>({coins:30,warmth:35,food:50,solved:0,owned:[],seen:[]});
let state=fresh();try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Number.isFinite(s.coins)&&Array.isArray(s.owned)&&Array.isArray(s.seen))state={...state,...s}}catch{}
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
const $=id=>document.getElementById(id);const has=id=>state.owned.includes(id);const clamp=n=>Math.max(0,Math.min(100,n));
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{$('story').textContent='瀏覽器無法儲存進度，請保持本頁開啟。'}}
function render(){
 $('coins').textContent=`🪙 ${state.coins} 金幣`;$('progress').textContent=`已修繕 ${state.owned.length} / 10`;
 $('roof').classList.toggle('fixed',has('roof'));$('window').classList.toggle('fixed',has('window'));$('leak').hidden=has('roof');$('floor').classList.toggle('fixed',has('floor'));$('room').classList.toggle('cozy',has('roof')&&has('window'));
 $('decor').innerHTML=['fire','bed','rug','book','plant'].filter(has).map(id=>`<div class="furniture ${id}">${products.find(p=>p.id===id).icon}</div>`).join('');
 document.querySelector('.dress').style.background=has('coat')?'#66897d':'#b17776';
 $('speech').textContent=state.food<25?'肚子咕嚕咕嚕…想喝熱湯。':state.warmth<30?'風好冷…我們一起修好家吧。':has('bed')?'這裡越來越像夢想中的家了！':'謝謝你，今天又暖了一點！';
 $('vitals').innerHTML=[['🌡 溫暖',state.warmth],['🍲 飽足',state.food],['✦ 已完成',state.solved]].map(([label,n],i)=>`<div class="vital"><label>${label}<span>${n}${i<2?'%':' 題'}</span></label><div class="track"><i style="width:${i<2?n:Math.min(100,state.solved/224*100)}%"></i></div></div>`).join('');
 const all=state.owned.length===10;
 $('story').textContent=all?'✨ 暖屋完成！莉莉終於有一個安全又溫暖的家。你仍可繼續挑戰全部單字、照顧莉莉。':'「等雪停了，我想邀請朋友來家裡喝熱湯。」—— 莉莉';
 $('missionText').textContent=!has('roof')?'① 累積 60 金幣，先修好屋頂，讓房子不再漏水。':!has('window')?'② 花 50 金幣修好窗戶，擋住外面的暴風雪。':!has('fire')?'③ 添購壁爐，讓小屋持續回暖。':all?'完成全部修繕！繼續學習並維持飽足與溫暖。':'④ 挑選家具，完成 10 項永久修繕與裝飾。';
 $('products').innerHTML=products.map(p=>`<div class="product"><div class="icon">${p.icon}</div><div class="info"><b>${p.name}</b><p>${p.en} · ${p.desc}</p></div><button data-buy="${p.id}" ${has(p.id)||state.coins<p.cost?'disabled':''}>${has(p.id)?'✓ 已完成':`🪙 ${p.cost}`}</button></div>`).join('');
}
function buy(id){const p=products.find(p=>p.id===id);if(!p||state.coins<p.cost||has(id))return;state.coins-=p.cost;if(id==='soup'){state.food=clamp(state.food+40);state.warmth=clamp(state.warmth+10)}else{state.owned.push(id);state.warmth=clamp(state.warmth+({coat:20,blanket:20,fire:35,floor:10,bed:15}[id]||5))}save();render()}
let current,locked=false,reverse=false;
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function next(){locked=false;$('feedback').textContent='';$('next').hidden=true;let pool=WORDS.filter(w=>!state.seen.includes(w.id));if(!pool.length){state.seen=[];pool=WORDS}current=pool[Math.floor(Math.random()*pool.length)];reverse=Math.random()<.35;$('qtype').textContent=reverse?'選出正確英文':'選出正確中文';$('question').textContent=reverse?current.zh:current.en;$('taskTitle').textContent=['幫忙整理小鎮圖書館','替鄰居送一份冬日物資','完成修繕師傅的單字委託','幫市場老闆認識英文標籤'][state.solved%4];let choices=shuffle([current,...shuffle(WORDS.filter(w=>w.id!==current.id)).slice(0,3)]);$('answers').innerHTML=choices.map(w=>`<button data-answer="${w.id}">${reverse?w.en:w.zh}</button>`).join('')}
function answer(id){if(locked)return;locked=true;const ok=id===current.id;document.querySelectorAll('[data-answer]').forEach(b=>{b.disabled=true;if(+b.dataset.answer===current.id)b.classList.add('correct');else if(+b.dataset.answer===id)b.classList.add('wrong')});if(ok){state.coins+=20;state.solved++;state.seen.push(current.id)}state.food=clamp(state.food-3);state.warmth=clamp(state.warmth-(has('roof')?0:2)-(has('window')?0:2)+(has('fire')?3:0));if(state.food===0||state.warmth===0){state.food=Math.max(20,state.food);state.warmth=Math.max(15,state.warmth);$('feedback').textContent='鄰居送來緊急物資，莉莉暫時安全了。先買熱湯、修好房子吧！ '}
 $('feedback').textContent+=(ok?'✓ 答對了！獲得 20 金幣。':'再記一次，下次一定會！')+` ${current.en} → ${current.zh}`;$('next').hidden=false;save();render()}
function speak(text){if('speechSynthesis'in window){speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(text.split(' / ')[0]);u.lang='en-US';u.rate=.8;speechSynthesis.speak(u)}else{$('feedback').textContent='此瀏覽器不支援語音朗讀。'}}
function words(){let q=$('search').value.toLowerCase();$('wordList').replaceChildren();WORDS.filter(w=>(w.en+w.zh).toLowerCase().includes(q)).forEach(w=>{let d=document.createElement('div');d.className='word';let a=document.createElement('div');a.textContent=`${w.id}. ${w.en}`;let b=document.createElement('span');b.textContent=w.zh;let btn=document.createElement('button');btn.textContent='🔊';btn.setAttribute('aria-label',`朗讀 ${w.en}`);btn.onclick=()=>speak(w.en);d.append(a,b,btn);$('wordList').append(d)})}
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.tab').forEach(t=>t.hidden=t.id!==b.dataset.tab)});
$('answers').onclick=e=>{if(e.target.dataset.answer)answer(+e.target.dataset.answer)};$('products').onclick=e=>{if(e.target.dataset.buy)buy(e.target.dataset.buy)};$('next').onclick=next;$('speak').onclick=()=>speak(current.en);$('search').oninput=words;$('reset').onclick=()=>{if(confirm('確定重新開始？這會清除本機的金幣與裝潢進度。')){state=fresh();save();render();next()}};render();next();words();
