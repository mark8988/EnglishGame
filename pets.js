const PET_SPECIES=[
{id:'kitten',name:'雪花小貓',icon:'🐱',cost:45,desc:'愛在壁爐旁打盹的小夥伴。'},
{id:'puppy',name:'雪球小狗',icon:'🐶',cost:45,desc:'總是興奮地迎接你回家。'},
{id:'bunny',name:'月光兔',icon:'🐰',cost:55,desc:'耳朵會在月光下發亮。'},
{id:'alien',name:'果凍外星人',icon:'👽',cost:90,desc:'搭飛碟來地球過冬的朋友。'},
{id:'dragon',name:'迷你暖爐龍',icon:'🐉',cost:110,desc:'打噴嚏會冒出小小火花。'},
{id:'cheetah',name:'獵豹',icon:'🐆',cost:75,desc:'跑得飛快、愛追玩具球的大貓夥伴。'},
{id:'ufo',name:'棉花糖飛碟',icon:'🛸',cost:95,desc:'會飄浮、還會發出咕嚕聲。'},
{id:'octopus',name:'星空章魚',icon:'🐙',cost:85,desc:'八隻小手一起幫忙擁抱你。'}];
PET_SPECIES.push(
{id:'fox',name:'極光狐狸',icon:'🦊',cost:65,desc:'尾巴會隨著心情閃出極光。'},
{id:'panda',name:'竹林熊貓',icon:'🐼',cost:70,desc:'最愛抱著抱枕滾來滾去。'},
{id:'penguin',name:'圍巾企鵝',icon:'🐧',cost:60,desc:'走路搖搖擺擺的雪國朋友。'},
{id:'owl',name:'星夜貓頭鷹',icon:'🦉',cost:70,desc:'晚上會陪你安靜地讀書。'},
{id:'hedgehog',name:'栗子刺蝟',icon:'🦔',cost:45,desc:'害羞時會捲成一顆小栗子。'},
{id:'hamster',name:'布丁倉鼠',icon:'🐹',cost:40,desc:'喜歡把小點心藏進頰囊。'},
{id:'otter',name:'泡泡水獺',icon:'🦦',cost:65,desc:'每天都想玩一場泡泡遊戲。'},
{id:'capybara',name:'溫泉水豚',icon:'🦫',cost:75,desc:'泡澡時最放鬆的溫柔大朋友。'},
{id:'raccoon',name:'手套浣熊',icon:'🦝',cost:60,desc:'總想幫忙整理小物。'},
{id:'squirrel',name:'松果松鼠',icon:'🐿️',cost:50,desc:'會把收藏品當成過冬寶藏。'},
{id:'turtle',name:'翡翠小龜',icon:'🐢',cost:45,desc:'慢慢走，也能陪你走很遠。'},
{id:'parrot',name:'彩虹鸚鵡',icon:'🦜',cost:65,desc:'喜歡在早晨唱歌打招呼。'},
{id:'unicorn',name:'棉花糖獨角獸',icon:'🦄',cost:130,desc:'鬃毛像雲朵一樣柔軟。'},
{id:'dino',name:'餅乾小恐龍',icon:'🦕',cost:100,desc:'看起來威風，其實很愛撒嬌。'},
{id:'robot',name:'齒輪機器人',icon:'🤖',cost:100,desc:'用嗶嗶聲表達開心的小夥伴。'},
{id:'ghost',name:'棉被小幽靈',icon:'👻',cost:85,desc:'最喜歡躲進暖暖的棉被。'},
{id:'slime',name:'果汁史萊姆',icon:'🟢',cost:80,desc:'會變成各種圓滾滾的形狀。'},
{id:'phoenix',name:'火花鳳凰',icon:'🐦‍🔥',cost:150,desc:'羽毛像冬夜的一小簇暖光。'},
{id:'cloud',name:'雷雨小雲',icon:'🌩️',cost:90,desc:'害羞時會滴下幾顆小雨珠。'},
{id:'mushroom',name:'蘑菇精靈',icon:'🍄',cost:80,desc:'戴著紅帽子在花盆旁散步。'}
);
const PET_PRODUCTS=[
{id:'pet-kibble',name:'通用寵物飼料',icon:'🥣',cost:5,kind:'food',amount:30},
{id:'pet-treat',name:'星星點心',icon:'⭐',cost:9,kind:'food',amount:50},
{id:'pet-cosmic',name:'宇宙能量果凍',icon:'🧃',cost:12,kind:'food',amount:65},
{id:'pet-soup',name:'魔法煲煲餐',icon:'🍲',cost:8,kind:'food',amount:45},
{id:'pet-shampoo',name:'寵物泡泡浴',icon:'🫧',cost:5,kind:'clean',amount:45},
{id:'pet-wipes',name:'柔軟清潔巾',icon:'🧻',cost:3,kind:'clean',amount:25},
{id:'pet-scarf',name:'寵物小圍巾',icon:'🧣',cost:20,kind:'clothes'},
{id:'pet-coat',name:'寵物保暖外套',icon:'🧥',cost:35,kind:'clothes'},
{id:'pet-space',name:'迷你太空衣',icon:'🧑‍🚀',cost:55,kind:'clothes'},
{id:'pet-bed',name:'寵物雲朵床',icon:'🛏️',cost:35,kind:'home'},
{id:'pet-toy',name:'彩虹逗逗球',icon:'🧶',cost:18,kind:'toy'},
{id:'pet-bowl',name:'自動餵食碗',icon:'🥣',cost:25,kind:'home'}
].map(p=>({...p,category:'寵物用品',en:'',petSupply:true,consumable:['food','clean'].includes(p.kind),desc:['food','clean'].includes(p.kind)?`購買後存入背包，每次使用消耗一份，${p.kind==='food'?'飽足':'清潔'} +${p.amount}。`:'購買後可替一隻寵物裝備；每作答一次耐久減 1%，損壞後需重購。'}));
function escapePetText(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function adoptPet(id){const species=PET_SPECIES.find(p=>p.id===id);if(!species||state.coins<species.cost||state.pets.length>=3||state.pets.some(p=>p.species===id))return;state.coins-=species.cost;state.pets.push({species:id,name:species.name,food:70,clean:80,happy:70,equipment:{}});save();render()}
function tickPets(){for(const pet of state.pets){pet.food=clamp(pet.food-(pet.equipment.home==='pet-bowl'&&has('pet-bowl')?1:2));pet.clean=clamp(pet.clean-(pet.equipment.home==='pet-bed'&&has('pet-bed')?state.turn%2:1));pet.happy=clamp(pet.happy-(pet.food<25||pet.clean<25?2:1));for(const [kind,id] of Object.entries(pet.equipment))if(!has(id))delete pet.equipment[kind]}}
function carePet(index,id){const pet=state.pets[index];if(!pet)return;
 if(id==='play'){const toy=has(pet.equipment.toy);pet.happy=clamp(pet.happy+(toy?20:5))}
 else{const p=PET_PRODUCTS.find(p=>p.id===id);if(!p)return;if(p.consumable){if((state.petInventory[id]||0)<1)return;state.petInventory[id]--;pet[p.kind==='food'?'food':'clean']=clamp(pet[p.kind==='food'?'food':'clean']+p.amount)}else{if(!has(id))return;for(const other of state.pets)if(other.equipment[p.kind]===id)delete other.equipment[p.kind];pet.equipment[p.kind]=id}}
 save();render();
}
function renderPets(){
 $('petAdoptions').innerHTML=PET_SPECIES.map(p=>`<div class="pet-choice"><b>${p.icon} ${p.name}</b><p>${p.desc}</p><button data-adopt="${p.id}" ${state.coins<p.cost||state.pets.length>=3||state.pets.some(x=>x.species===p.id)?'disabled':''}>${state.pets.some(x=>x.species===p.id)?'已領養':`領養 🪙${p.cost}`}</button></div>`).join('');
 $('petCards').innerHTML=state.pets.length?state.pets.map((pet,i)=>{const species=PET_SPECIES.find(x=>x.id===pet.species);return `<article class="pet-card"><h3>${species.icon} ${escapePetText(pet.name)}</h3><form data-rename="${i}"><input aria-label="寵物新名字" maxlength="16" value="${escapePetText(pet.name)}"><button>改名</button></form><p>🍽 飽足 ${pet.food}% · 🫧 清潔 ${pet.clean}% · 💗 心情 ${pet.happy}%</p>${pet.food<25||pet.clean<25?'<p class="pet-warning">夥伴需要照顧了！去商店補充飼料和清潔用品。</p>':''}<p>裝備：${Object.values(pet.equipment).filter(has).map(id=>products.find(p=>p.id===id).icon+products.find(p=>p.id===id).name).join('、')||'尚未裝備'}</p><button data-care="play" data-pet="${i}">陪玩${has(pet.equipment.toy)?' +20':' +5'} 心情</button><div class="pet-care">${PET_PRODUCTS.filter(p=>p.consumable?(state.petInventory[p.id]||0)>0:has(p.id)).map(p=>`<button data-care="${p.id}" data-pet="${i}">${p.icon} ${p.consumable?'使用':'裝備'} ${p.name}${p.consumable?` ×${state.petInventory[p.id]}`:''}</button>`).join('')}</div></article>`}).join(''):'<p class="muted">小屋還沒有寵物。領養之前，記得預留飼料與生活用品的金幣喔。</p>';
 $('petScene').replaceChildren();state.pets.forEach(pet=>{const species=PET_SPECIES.find(x=>x.id===pet.species);const el=document.createElement('div');el.className='pet-sprite';el.textContent=species.icon+(pet.equipment.clothes&&has(pet.equipment.clothes)?products.find(x=>x.id===pet.equipment.clothes).icon:'');const name=document.createElement('small');name.textContent=pet.name;el.append(name);$('petScene').append(el)});
}
function initPetControls(){
 $('petAdoptions').onclick=e=>{const b=e.target.closest('[data-adopt]');if(b)adoptPet(b.dataset.adopt)};
 $('petCards').onclick=e=>{const b=e.target.closest('[data-care]');if(b)carePet(+b.dataset.pet,b.dataset.care)};
 $('petCards').onsubmit=e=>{e.preventDefault();const form=e.target;const pet=state.pets[+form.dataset.rename];if(!pet)return;const name=form.querySelector('input').value.trim().slice(0,16);if(!name)return;pet.name=name;save();render()};
}
