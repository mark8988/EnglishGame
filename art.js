// Original local illustrations; no remote image service is needed at runtime.
function artIcon(symbol,id,kind='item'){
 if(kind==='item'&&typeof refinedArt==='function'){const art=refinedArt(symbol,id);if(art)return art}
 const src=id?`assets/art/${kind}-${id}.svg`:'assets/art/badge.svg';
 return `<img class="cute-icon" src="${src}" alt="${symbol}" draggable="false">`;
}
function decorateCuteIcons(root=document.body){
 // Turn remaining decorative emoji into the same locally illustrated visual language.
 const emoji=/\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}|\uFE0F\u200D\p{Extended_Pictographic})*/gu;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
 while(walker.nextNode()){const n=walker.currentNode;if(!n.parentElement.closest('script,style,textarea,option,.cute-icon,.girl,.trees,svg')&&/\p{Extended_Pictographic}/u.test(n.textContent))nodes.push(n)}
 const map=new Map();for(const p of PET_SPECIES)map.set(p.icon,`pet-${p.id}`);for(const p of products)if(!map.has(p.icon))map.set(p.icon,`item-${p.id}`);
 for(const [emoji,id] of Object.entries({'🪙':'ui-coin','❄':'ui-snow','🌨':'ui-snow','🌡':'ui-heart','💧':'ui-drop','🪣':'ui-bucket','🔊':'ui-sound','🎧':'ui-sound','📍':'ui-pin','🌱':'ui-seed','🥕':'ui-seed','🍅':'ui-seed','🌽':'ui-seed','💗':'ui-heart','💌':'ui-heart','⭐':'ui-star','🏡':'item-roof','🛒':'item-extra41','📖':'item-book'}))map.set(emoji,id);
 for(const n of nodes){const fragment=document.createDocumentFragment();let last=0;for(const m of n.textContent.matchAll(emoji)){fragment.append(document.createTextNode(n.textContent.slice(last,m.index)));const img=document.createElement('img');img.className='cute-icon';img.alt=m[0];img.src=`assets/art/${map.get(m[0])||'badge'}.svg`;img.draggable=false;fragment.append(img);last=m.index+m[0].length}fragment.append(document.createTextNode(n.textContent.slice(last)));n.replaceWith(fragment)}
}
function initCuteArt(){decorateCuteIcons();let scheduled=false;new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;decorateCuteIcons()})}).observe(document.body,{childList:true,subtree:true});}
