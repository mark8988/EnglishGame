"""Generate original, matching pastel SVG illustrations for game items and pets."""
from pathlib import Path
import json, subprocess
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'assets/art';OUT.mkdir(parents=True,exist_ok=True)
data=json.loads(subprocess.check_output(['node','-e',"const vm=require('vm'),fs=require('fs');const c={};vm.createContext(c);vm.runInContext(fs.readFileSync('catalog.js','utf8')+fs.readFileSync('pets.js','utf8')+';this.data={extras:EXTRA_PRODUCTS,pets:PET_SPECIES,supplies:PET_PRODUCTS}',c);console.log(JSON.stringify(c.data))"],cwd=ROOT))
INK='#735a62';PINK='#f4a9b9';CREAM='#fff2cf';MINT='#b9dfcf';BLUE='#b6d6ef';LILAC='#d6c6ec'
def svg(body):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><g stroke="{INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">{body}</g></svg>'
def ellipse(x,y,rx,ry,c):return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{c}"/>'
def circle(x,y,r,c):return ellipse(x,y,r,r,c)
def rect(x,y,w,h,c,r=8):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{c}"/>'
def path(d,c='none'):return f'<path d="{d}" fill="{c}"/>'
def face(x=60,y=67,wide=15):return f'<g stroke="none">{ellipse(x-wide,y,3.2,4.5,INK)}{ellipse(x+wide,y,3.2,4.5,INK)}{ellipse(x-wide-7,y+8,6,3,PINK)}{ellipse(x+wide+7,y+8,6,3,PINK)}{circle(x-wide-1,y-2,1,"white")}{circle(x+wide-1,y-2,1,"white")}</g>'+path(f'M {x-4} {y+7} Q {x} {y+12} {x+4} {y+7}')
def sparkle():return '<g stroke="#e8be75" stroke-width="2">'+path('M 100 18 v 10 M 95 23 h 10 M 16 45 v 6 M 13 48 h 6')+'</g>'
def write(id,b): (OUT/(id+'.svg')).write_text(svg(b))
colors=[CREAM,MINT,PINK,BLUE,LILAC,'#f4c9a6']
for i,p in enumerate(data['pets']):
 id=p['id'];col={'cheetah':'#edc77f','alien':MINT,'dragon':MINT,'kitten':CREAM,'puppy':'#dfb69a','bunny':'#fff5eb','panda':'#fdf7e9','penguin':BLUE,'fox':'#edb18e','ghost':'#f5f0ff','robot':BLUE,'slime':MINT}.get(id,colors[i%6]);b=ellipse(60,106,34,5,'#eadde2')
 if id in ['ufo','cloud','slime','mushroom']:
  if id=='ufo':b+=ellipse(60,53,28,30,MINT)+ellipse(60,77,47,17,LILAC)+circle(29,78,4,CREAM)+circle(91,78,4,CREAM)+face(60,56)
  elif id=='cloud':b+=circle(36,65,23,CREAM)+circle(59,50,29,CREAM)+circle(83,66,24,CREAM)+rect(32,62,56,27,CREAM)+path('M 67 91 l -9 12 h 10 l -5 12','#f3d17c')+face(60,67)
  elif id=='slime':b+=path('M 20 88 Q 16 67 40 48 Q 54 38 60 17 Q 62 37 85 48 Q 106 66 100 88 Q 87 108 60 104 Q 33 108 20 88',col)+face(60,75)+ellipse(43,53,6,3,'#effff4')
  else:b+=rect(38,56,44,49,CREAM,18)+path('M 12 60 Q 18 14 60 14 Q 103 14 108 60 Z',PINK)+circle(42,35,8,CREAM)+circle(78,40,6,CREAM)+face(60,77)
 elif id in ['octopus','ghost','robot']:
  if id=='octopus':
   for x in [24,44,66,86]:b+=ellipse(x+5,94,12,15,LILAC)
   b+=ellipse(60,57,39,37,LILAC)+face(60,60)
  elif id=='ghost':b+=path('M 25 100 V 52 Q 25 15 60 15 Q 95 15 95 52 V 100 L 80 91 L 66 103 L 51 93 L 36 104 Z',col)+face(60,58)
  else:b+=rect(21,31,78,57,col,18)+path('M 60 31 V 16')+circle(60,14,6,PINK)+rect(35,88,50,18,MINT)+rect(13,47,8,25,LILAC)+rect(99,47,8,25,LILAC)+face(60,56)+circle(59,94,3,PINK)
 else:
  b+=ellipse(60,87,27,22,col)+ellipse(41,102,14,7,col)+ellipse(79,102,14,7,col)
  if id in ['bunny','kangaroo']:b+=ellipse(38,26,10,25,col)+ellipse(82,26,10,25,col)+ellipse(38,26,4,17,PINK)+ellipse(82,26,4,17,PINK)
  elif id=='alien':b+=path('M 38 35 L 27 13 M 82 35 L 93 13')+circle(27,13,6,PINK)+circle(93,13,6,PINK)
  elif id in ['kitten','cheetah','fox','unicorn']:b+=path('M 24 46 L 24 12 L 49 30',col)+path('M 72 30 L 96 12 L 96 47',col)
  elif id not in ['turtle','penguin','parrot','phoenix','owl','dino']:b+=circle(31,32,13,col)+circle(89,32,13,col)
  b+=ellipse(60,58,39,34,col)
  if id=='panda':b+=ellipse(43,55,11,14,INK)+ellipse(77,55,11,14,INK)
  if id=='cheetah':
   for x,y in [(35,42),(52,31),(70,32),(88,44),(26,66),(94,68),(45,89),(75,91)]:b+=circle(x,y,3,'#b78758')
  if id in ['unicorn','dragon']:b+=path('M 52 29 L 60 3 L 68 29',CREAM)
  if id=='dragon':b+=path('M 28 86 L 8 63 L 14 96 Z',PINK)+path('M 92 86 L 112 63 L 106 96 Z',PINK)
  if id in ['penguin','owl','parrot','phoenix']:b+=ellipse(60,79,22,21,CREAM)+path('M 54 63 L 60 71 L 66 63', '#edbd7a')
  b+=face(60,57)
  b+=path('M 36 87 Q 60 97 84 87',PINK)+rect(68,87,10,17,PINK,3)
 write('pet-'+id,b+sparkle())
# Item silhouettes retain recognizable shapes, with the same small smiling faces and pastel palette.
def item(name,cat,icon,index):
 c=colors[index%6];b=ellipse(60,107,37,5,'#eee1df');f=face(60,66,12)
 if any(w in name for w in ['桌','床','椅','沙發','櫃','架','閱讀角']):
  if '床' in name:b+=rect(14,50,92,43,c)+rect(17,39,30,22,CREAM)+rect(17,58,86,31,c)+path('M 18 92 v 12 M 102 92 v 12');f=face(68,71,12)
  elif '櫃' in name or '架' in name or '閱讀角' in name:b+=rect(25,17,70,86,c)+path('M 30 48 h 60 M 30 77 h 60')+rect(36,25,12,20,PINK,2)+rect(52,25,12,20,MINT,2);f=face(60,89,12)
  elif '沙發' in name or '椅' in name:b+=rect(25,32,70,51,c,17)+rect(17,60,86,34,c)+rect(10,54,16,37,CREAM)+rect(94,54,16,37,CREAM)+path('M 23 96 v 8 M 97 96 v 8');f=face(60,62,12)
  else:b+=rect(12,41,96,20,c)+path('M 22 61 v 43 M 98 61 v 43');f=face(60,49,12)
 elif cat=='食' or any(w in name for w in ['飼料','餐','點心','熱湯','能量']):
  if any(w in name for w in ['果','蕉','橘','莓','葡萄','玉米','瓜','地瓜']):b+=path('M 60 33 Q 29 20 25 54 Q 15 88 45 100 Q 60 108 75 100 Q 105 88 95 54 Q 91 20 60 33',c)+path('M 60 34 Q 60 14 76 12',MINT)+ellipse(71,22,13,6,MINT)
  elif any(w in name for w in ['奶','漿','優格','果凍']):b+=rect(30,26,60,77,c)+rect(35,15,50,15,CREAM)+path('M 34 44 h 52');f=face(60,68,12)
  else:b+=path('M 17 48 H 103 Q 99 100 60 101 Q 21 100 17 48',c)+ellipse(60,48,43,11,CREAM)+path('M 40 29 Q 33 19 41 11 M 62 29 Q 55 19 63 11 M 82 29 Q 75 19 83 11');f=face(60,73,12)
 elif cat=='衣' or any(w in name for w in ['衣','圍巾','毛毯','外套']):
  b+=path('M 39 23 L 20 32 L 7 62 L 27 72 L 34 58 V 103 H 86 V 58 L 93 72 L 113 62 L 100 32 L 81 23 Q 60 42 39 23',c)+path('M 50 28 Q 60 46 70 28');f=face(60,65,12)
 elif any(w in name for w in ['書','字典','電子書','筆記','畫冊','卡']):b+=path('M 12 29 Q 36 14 60 30 Q 84 14 108 29 V 98 Q 83 84 60 101 Q 36 84 12 98 Z',c)+path('M 60 30 V 101 M 23 40 h 24 M 74 40 h 24');f=face(35,65,8)
 elif any(w in name for w in ['腳踏車','滑板','車票','月票','溜冰','滑板車']):b+=circle(28,86,21,MINT)+circle(93,86,21,MINT)+path('M 28 86 L 49 49 L 73 86 H 28 L 80 49 L 93 86 M 80 49 L 77 34 H 90 M 41 45 h 20',PINK);f=face(60,26,9)
 elif any(w in name for w in ['盆','綠植','地板','木']):b+=path('M 36 68 H 84 L 78 105 H 42 Z',c)+path('M 60 67 V 24')+ellipse(46,42,16,9,MINT)+ellipse(74,30,16,9,MINT);f=face(60,84,10)
 elif any(w in name for w in ['燈','壁爐','安全帽','屋頂','窗戶','玻璃']):
  if '窗' in name or '玻璃' in name:b+=rect(20,15,80,88,CREAM)+rect(29,24,62,70,BLUE)+path('M 60 24 V 94 M 29 59 H 91');f=face(60,75,12)
  elif '屋頂' in name:b+=path('M 12 58 L 60 14 L 108 58 Z',PINK)+rect(27,58,66,45,CREAM);f=face(60,78,12)
  else:b+=rect(49,48,22,50,MINT)+path('M 25 56 L 38 16 H 82 L 95 56 Z',c)+rect(30,98,60,7,c);f=face(60,39,12)
 elif cat=='行':b+=rect(27,23,66,80,c,17)+path('M 44 23 V 13 H 76 V 23')+rect(34,63,52,27,CREAM);f=face(60,47,12)
 elif any(w in name for w in ['泡泡','清潔','浴缸','洗手']):b+=rect(30,37,60,67,c,15)+rect(43,22,34,16,CREAM)+path('M 60 22 V 12 H 80')+circle(22,30,9,BLUE)+circle(90,18,6,BLUE);f=face(60,70,12)
 elif cat=='樂' or '玩具' in name or '逗逗' in name:b+=circle(30,30,13,c)+circle(90,30,13,c)+ellipse(60,62,40,39,c)+ellipse(60,78,18,12,CREAM);f=face(60,58,15)
 else:b+=rect(22,25,76,78,c,17)+rect(31,16,58,18,CREAM)+path('M 33 87 H 87');f=face(60,62,14)
 return b+f+sparkle()
base=[('roof','修好屋頂','修繕',''),('window','完整窗戶','修繕',''),('soup','熱湯','食',''),('coat','大衣','衣',''),('blanket','毛毯','衣',''),('fire','壁爐','住',''),('floor','木地板','住',''),('bed','小床','住',''),('rug','地毯','住',''),('book','閱讀角','育',''),('plant','綠植','住','')]
allitems=[dict(id=id,name=n,category=cat,icon=ic) for id,n,cat,ic in base]+data['extras']+data['supplies']
for i,p in enumerate(allitems):write('item-'+p['id'],item(p['name'],p['category'],p['icon'],i))
# Distinct room illustrations for the map.
rooms=[('living','沙發'),('kitchen','熱湯'),('room1','床'),('room2','椅'),('room3','玩具'),('dressing','衣'),('study','書'),('bedroom','床'),('bathroom','浴缸'),('balcony','綠植'),('garage','腳踏車')]
for i,(id,name) in enumerate(rooms):write('room-'+id,item(name,'樂' if id=='room3' else '住','',i))
# A cute matching fallback badge for decorative UI symbols.
write('badge',circle(60,60,44,CREAM)+face(60,57)+sparkle())
print(f'Generated {len(list(OUT.glob("*.svg")))} original SVG assets')
write('ui-coin',circle(60,60,43,'#ffe0a2')+circle(60,60,33,'#ffedbd')+face(60,57,13)+sparkle())
write('ui-snow',circle(60,60,43,'#edf5fb')+'<g stroke="#a8c7de" stroke-width="5">'+path('M 60 25 V 95 M 29 42 L 91 78 M 29 78 L 91 42 M 49 33 L 60 43 L 71 33 M 49 87 L 60 77 L 71 87')+'</g>')
write('ui-drop',path('M 60 15 Q 52 35 32 57 Q 10 89 43 103 Q 77 119 92 86 Q 101 67 81 44 Z',BLUE)+face(60,74,11))
write('ui-bucket',path('M 25 47 H 95 L 87 104 H 33 Z',LILAC)+ellipse(60,47,35,9,BLUE)+path('M 25 49 Q 18 12 60 12 Q 102 12 95 49')+face(60,76,12))
write('ui-sound',path('M 18 46 H 38 L 64 25 V 95 L 38 74 H 18 Z',PINK)+path('M 79 40 Q 98 60 79 80 M 91 28 Q 119 60 91 92')+sparkle())
write('ui-pin',path('M 60 109 Q 18 68 26 39 Q 32 13 60 13 Q 88 13 94 39 Q 102 68 60 109 Z',PINK)+circle(60,48,21,CREAM)+face(60,47,8))
write('ui-seed',path('M 35 77 H 85 L 78 106 H 42 Z',PINK)+path('M 60 79 V 31')+ellipse(43,47,19,10,MINT)+ellipse(77,32,19,10,MINT)+face(60,88,9))
write('ui-heart',path('M 60 103 L 20 64 Q 0 40 22 23 Q 44 6 60 30 Q 76 6 98 23 Q 120 40 100 64 Z',PINK)+face(60,57,14))
write('ui-star',path('M 60 10 L 75 40 L 108 45 L 84 69 L 90 104 L 60 88 L 30 104 L 36 69 L 12 45 L 45 40 Z',CREAM)+face(60,60,12))
write('forest',path('M 20 105 L 20 85 M 60 105 L 60 83 M 100 105 L 100 85')+path('M 1 90 L 8 71 H 3 L 20 38 L 37 71 H 32 L 40 90 Z',MINT)+path('M 31 88 L 42 60 H 35 L 60 11 L 85 60 H 78 L 89 88 Z','#c3dcd2')+path('M 80 90 L 88 71 H 83 L 100 38 L 117 71 H 112 L 119 90 Z',MINT))
