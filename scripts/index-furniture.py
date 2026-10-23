"""Index sprite outlines for web display, leaving original generated PNGs unchanged."""
from pathlib import Path
from PIL import Image
import numpy as np
from scipy import ndimage
from scipy.spatial import ConvexHull
import json
root=Path(__file__).resolve().parents[1]
sheets=[['bed','fire','rug','book','plant','blanket','extra37','extra38','extra39'],['extra'+str(i) for i in range(40,49)],['extra'+str(i) for i in range(49,57)]+['extra57'],['extra63','extra64','extra74','extra76','extra86','extra90','extra91','extra93','extra81']]
result={}
for sheet,ids in enumerate(sheets):
 im=Image.open(root/f'assets/furniture/sheet-{sheet}.png').convert('RGBA');w,h=im.size
 alpha=np.asarray(im.getchannel('A'));mask=alpha>70
 labels,n=ndimage.label(mask);areas=np.bincount(labels.ravel());boxes=ndimage.find_objects(labels)
 candidates=sorted(range(1,n+1),key=lambda i:areas[i],reverse=True)[:9]
 if len(candidates)!=9:raise ValueError('Expected 9 sprites')
 candidates.sort(key=lambda i:(boxes[i-1][0].start+boxes[i-1][0].stop)/2)
 ordered=[]
 for row in range(3):ordered.extend(sorted(candidates[row*3:row*3+3],key=lambda i:boxes[i-1][1].start))
 for id,label in zip(ids,ordered):
  component=ndimage.binary_dilation(labels==label,iterations=4);ys,xs=np.nonzero(component)
  points=np.column_stack((xs,ys));hull=ConvexHull(points);polygon=points[hull.vertices]
  x=int(xs.min());y=int(ys.min());bw=int(xs.max()-x+1);bh=int(ys.max()-y+1)
  result[id]={'sheet':sheet,'x':x,'y':y,'width':bw,'height':bh,'sheetWidth':w,'sheetHeight':h,'ratio':round(bw/bh,6),'clip':' '.join(f'{px},{py}' for px,py in polygon)}
  print(sheet,id,(x,y,bw,bh))
(root/'furniture-art.js').write_text('const FURNITURE_ART = '+json.dumps(result,indent=2)+';\n')
print('Indexed',len(result),'furniture illustrations')
