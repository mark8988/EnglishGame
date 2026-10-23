// Coordinates are percentages of the room, so layouts survive screen size changes.
let selectedFurniture=null;
let furnitureDrag=null;
function placeable(p){return !!p&&!isWearable(p)&&!p.consumable&&!p.petSupply&&!['roof','window','floor'].includes(p.id)&&p.id!=='soup'}
function migratePlacements(){
 if(!state.placements||typeof state.placements!=='object')state.placements={};
 if(state.placementVersion===1)return;
 for(const [room,ids] of Object.entries(state.roomDisplays))for(const id of ids){const p=products.find(p=>p.id===id);if(placeable(p)&&state.owned.includes(id))state.placements[id]={room,x:25+(ids.indexOf(id)%4)*18,y:75}}
 const defaults={fire:'living',bed:'bedroom',rug:'living',book:'study',plant:'balcony'};
 for(const [id,room] of Object.entries(defaults))if(state.owned.includes(id)&&!state.placements[id])state.placements[id]={room,x:25,y:73};
 state.placementVersion=1;
}
function itemSize(p){return furnishingLayout(p).width}
function newPlacement(id,room=state.room){const p=products.find(p=>p.id===id),layout=furnishingLayout(p);const count=Object.values(state.placements).filter(p=>p.room===room).length;
 const defaults={wallpaper:{x:60,y:30},wall:{x:25,y:31},ceiling:{x:55,y:15},rug:{x:51,y:83},back:{x:75,y:52},floor:{x:24+(count%3)*23,y:71},small:{x:25+(count%4)*17,y:71}};
 state.placements[id]={room,...defaults[layout.plane]};
}
function renderPlacedItems(target,placements=state.placements,owned=state.owned,room=state.room,interactive=true){
 target.replaceChildren();
 for(const [id,pos] of Object.entries(placements)){
  const p=products.find(p=>p.id===id);if(!placeable(p)||pos.room!==room||!owned.includes(id)||(interactive&&!has(id)))continue;
  const item=document.createElement('button');item.type='button';item.className='placed-item display-item';item.dataset.item=id;item.style.width=itemSize(p)+'%';item.style.left=limitPosition(pos.x)+'%';item.style.top=limitPosition(pos.y)+'%';item.dataset.plane=furnishingLayout(p).plane;item.style.zIndex=String(furnishingDepth(p,pos.y));const art=typeof FURNITURE_ART!=='undefined'&&FURNITURE_ART[id];item.style.aspectRatio=art?art.ratio:1;item.innerHTML=artIcon(p.icon,id)+'<span class="item-name">'+p.name+'</span>';
  item.setAttribute('aria-label',p.name+'，拖曳移動，方向鍵微調');item.setAttribute('aria-pressed',String(selectedFurniture===id));if(!interactive){item.disabled=true;item.removeAttribute('data-item');item.setAttribute('aria-label',p.name)}target.append(item);if(interactive)fitRenderedItem(item,pos);
 }
}
function fitRenderedItem(el,pos){const bounds=$('room').getBoundingClientRect(),box=el.getBoundingClientRect();if(!bounds.width||!bounds.height)return;const mx=box.width/bounds.width*50,my=box.height/bounds.height*50;el.style.left=Math.max(mx,Math.min(100-mx,limitPosition(pos.x)))+'%';el.style.top=Math.max(my,Math.min(100-my,limitPosition(pos.y)))+'%'}
function limitPosition(n){return Number.isFinite(n)?Math.max(0,Math.min(100,n)):50}
function updatePlacement(id,x,y,el){const rect=$('room').getBoundingClientRect(),item=el.getBoundingClientRect();const mx=item.width/rect.width*50,my=item.height/rect.height*50;const p=state.placements[id];p.x=Math.max(mx,Math.min(100-mx,x));p.y=Math.max(my,Math.min(100-my,y));el.style.left=p.x+'%';el.style.top=p.y+'%';el.style.zIndex=String(furnishingDepth(products.find(item=>item.id===id),p.y))}
function selectFurniture(id){selectedFurniture=id;document.querySelectorAll('#decor [data-item]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.item===id)));const p=products.find(p=>p.id===id);$('placementStatus').textContent=p?`已選取 ${p.name} · 拖曳擺放，方向鍵微調`:'購買家具會放入目前房間，可拖曳自由布置。';$('storeFurniture').disabled=!id}
function togglePlacement(id){const p=products.find(p=>p.id===id);if(!placeable(p)||!has(id))return;if(state.placements[id]?.room===state.room){delete state.placements[id];selectedFurniture=null}else{newPlacement(id);selectedFurniture=id}save();render()}
function initPlacementControls(){
 $('decor').addEventListener('pointerdown',e=>{const el=e.target.closest('[data-item]');if(!el||e.button!==0||furnitureDrag)return;e.preventDefault();const id=el.dataset.item;const bounds=$('room').getBoundingClientRect();const p=state.placements[id];const box=el.getBoundingClientRect();p.x=(box.x+box.width/2-bounds.left)/bounds.width*100;p.y=(box.y+box.height/2-bounds.top)/bounds.height*100;selectFurniture(id);el.focus({preventScroll:true});furnitureDrag={id,pointer:e.pointerId,start:{...p},dx:e.clientX-bounds.left-p.x/100*bounds.width,dy:e.clientY-bounds.top-p.y/100*bounds.height};el.setPointerCapture(e.pointerId);el.classList.add('dragging')});
 $('decor').addEventListener('pointermove',e=>{if(!furnitureDrag||furnitureDrag.pointer!==e.pointerId)return;const el=e.target.closest('[data-item]');if(!el)return;const r=$('room').getBoundingClientRect();updatePlacement(furnitureDrag.id,(e.clientX-r.left-furnitureDrag.dx)/r.width*100,(e.clientY-r.top-furnitureDrag.dy)/r.height*100,el)});
 function end(e,cancel){if(!furnitureDrag||furnitureDrag.pointer!==e.pointerId)return;const el=e.target.closest('[data-item]');if(cancel)state.placements[furnitureDrag.id]=furnitureDrag.start;if(el){el.classList.remove('dragging');if(el.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId)}furnitureDrag=null;save();if(cancel)renderPlacedItems($('decor'))}
 $('decor').addEventListener('pointerup',e=>end(e,false));$('decor').addEventListener('pointercancel',e=>end(e,true));
 $('decor').addEventListener('keydown',e=>{const el=e.target.closest('[data-item]');if(!el)return;const deltas={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(!deltas[e.key])return;e.preventDefault();selectFurniture(el.dataset.item);const p=state.placements[el.dataset.item],d=deltas[e.key],step=e.shiftKey?5:1;updatePlacement(el.dataset.item,p.x+d[0]*step,p.y+d[1]*step,el);save()});
 $('storeFurniture').onclick=()=>{if(!selectedFurniture)return;delete state.placements[selectedFurniture];selectedFurniture=null;save();render()};
}
