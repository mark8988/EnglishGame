// Each clothing purchase unlocks a complete illustrated look, not a room sticker.
const OUTFITS=[
{id:'coat',sheet:0,tile:0,label:'珊瑚紅大衣'},
{id:'extra21',sheet:0,tile:1,label:'薰衣草圍巾'},
{id:'extra22',sheet:0,tile:2,label:'毛球帽暖冬造型'},
{id:'extra23',sheet:0,tile:3,label:'粉紅手套造型'},
{id:'extra24',sheet:0,tile:4,label:'薄荷雪靴造型'},
{id:'extra25',sheet:0,tile:5,label:'紫色長襪造型'},
{id:'extra26',sheet:1,tile:0,label:'星星毛衣造型'},
{id:'extra27',sheet:1,tile:1,label:'小雨衣造型'},
{id:'extra28',sheet:1,tile:2,label:'星星睡衣造型'},
{id:'extra29',sheet:1,tile:3,label:'藍色洋裝造型'},
{id:'extra30',sheet:1,tile:4,label:'薄荷長褲造型'},
{id:'extra31',sheet:1,tile:5,label:'蜜桃背心造型'},
{id:'extra32',sheet:2,tile:0,label:'毛茸茸耳罩造型'},
{id:'extra33',sheet:2,tile:1,label:'紫色披肩造型'},
{id:'extra34',sheet:2,tile:2,label:'草莓圍裙造型'},
{id:'extra35',sheet:2,tile:3,label:'薄荷運動服造型'},
{id:'extra36',sheet:2,tile:4,label:'紫色羽絨衣造型'}
];
function isWearable(p){return !!p&&!p.petSupply&&(p.id==='coat'||p.category==='衣')}
function validOutfit(id){return OUTFITS.some(o=>o.id===id)&&has(id)}
function migrateWardrobe(){
 if(!validOutfit(state.outfit))state.outfit=null;
 for(const id of Object.keys(state.placements))if(isWearable(products.find(p=>p.id===id)))delete state.placements[id];
 for(const room of Object.keys(state.roomDisplays))state.roomDisplays[room]=state.roomDisplays[room].filter(id=>!isWearable(products.find(p=>p.id===id)));
}
const OUTFIT_RATIOS=[0.6340072576464489, 0.6370485840478046, 1.0];
function outfitStyle(id){const look=OUTFITS.find(o=>o.id===id);if(!look)return '';return `--outfit-ratio:${OUTFIT_RATIOS[look.sheet]};background-image:url('assets/outfits/looks-${look.sheet}.png');background-position:${look.tile%3*50}% ${Math.floor(look.tile/3)*100}%`}
function outfitPreview(id){if(!id)return '<img class="default-look" src="assets/art/lily.png" alt="原本的暖冬造型">';const look=OUTFITS.find(o=>o.id===id);return `<span class="outfit-portrait" role="img" aria-label="${look.label}" style="${outfitStyle(id)}"></span>`}
function wearOutfit(id){if(id!=='default'&&!validOutfit(id))return;state.outfit=id==='default'?null:id;save();render()}
function renderWardrobe(){
 if(!validOutfit(state.outfit))state.outfit=null;
 const look=OUTFITS.find(o=>o.id===state.outfit);const sprite=document.querySelector('.lily-outfit');document.querySelector('.lily-art').hidden=!!look;sprite.hidden=!look;sprite.style.cssText=outfitStyle(state.outfit);sprite.setAttribute('aria-label',look?'莉莉穿著'+look.label:'莉莉的原本造型');
 $('wearingName').textContent=look?look.label:'原本的暖冬造型';$('wardrobePreview').innerHTML=outfitPreview(state.outfit);
 const owned=OUTFITS.filter(o=>state.owned.includes(o.id));
 $('wardrobeCount').textContent=`已收藏 ${owned.length} / ${OUTFITS.length} 款穿搭`;
 $('wardrobeLooks').innerHTML=`<button class="look-card" data-wear="default" aria-pressed="${!look}">${outfitPreview(null)}<b>原本造型</b><small>${!look?'✓ 穿著中':'換回原本造型'}</small></button>`+owned.map(o=>{const usable=has(o.id);return `<button class="look-card" data-wear="${o.id}" aria-pressed="${state.outfit===o.id}" ${usable?'':'disabled'}>${outfitPreview(o.id)}<b>${o.label}</b><small>${usable?state.outfit===o.id?'✓ 穿著中':`穿上 · 耐久 ${state.durability[o.id]??100}%`:'已損壞，請至商店重新購買'}</small></button>`}).join('');
}
function clothingAction(p){if(isWearable(p)&&has(p.id))return `<button data-wear="${p.id}" ${state.outfit===p.id?'disabled':''}>${state.outfit===p.id?'✓ 穿著中':'穿上'}</button>`;return `<button data-buy="${p.id}" ${has(p.id)||state.coins<p.cost?'disabled':''}>${has(p.id)?'✓ 已擁有':`${state.owned.includes(p.id)?'重新購買 ':''}🪙 ${p.cost}`}</button>`}
function initWardrobeControls(){
 $('wardrobeLooks').onclick=e=>{const b=e.target.closest('[data-wear]');if(b)wearOutfit(b.dataset.wear)};
 $('goClothesShop').onclick=()=>{document.querySelector('[data-tab="shop"]').click();$('category').value='衣';render()};
}
