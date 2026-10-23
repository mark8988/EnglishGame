const WORDS = `above|在……上方
address|地址
afraid|害怕的
after|在……之後
age|年齡
all|全部
all right|還好；沒問題
along|沿著
always|總是
another|另一個
any|任何的
app|應用程式
around|圍繞；在附近
asleep|睡著的
at|在
 aunt|姑姑；阿姨
awake|醒著的
back|背部；後面
bad|壞的
badly|嚴重地
balcony|陽台
band|樂團
basement|地下室
bat|球棒；蝙蝠
be called|被稱為
beard|鬍鬚
because|因為
before|在……之前
below|在……下方
best|最好的
better|更好的
blanket|毛毯
blond(e)|金髮的
boring|無聊的
both|兩者都
bottle|瓶子
bottom|底部
bowl|碗
brave|勇敢的
break|休息；打破
brilliant|非常棒的；聰穎的
bring|帶來
build|建造
building|建築物
bus station|公車總站
bus stop|公車站牌
busy|忙碌的
buy|購買
by|在旁邊；藉由
café|咖啡廳
cage|籠子
call|打電話；呼叫
car park|停車場
careful|小心的
carefully|小心地
carry|搬運；攜帶
catch|接住；趕上
CD|音樂光碟
centre / center|中心
change|改變；交換
Charlie|查理（人名）
cheese|起司
cinema|電影院
circle|圓形
circus|馬戲團
city|城市
city centre / city center|市中心
Clare|克萊兒（人名）
clever|聰明的
climb|攀爬
cloud|雲
cloudy|多雲的
clown|小丑
coat|大衣
coffee|咖啡
cold|冷的；感冒
come on|加油；快點
comic|漫畫
comic book|漫畫書
cook|烹煮；廚師
cough|咳嗽
could|能夠；可以
country|國家
countryside|鄉村
cry|哭泣
cup|杯子
curly|捲曲的
Daisy|黛西（人名）
dance|跳舞
dangerous|危險的
daughter|女兒
dentist|牙醫
difference|差異
different|不同的
difficult|困難的
doctor|醫生
dolphin|海豚
down|向下
downstairs|在樓下
dream|夢；夢想
dress up|裝扮
drive|開車
driver|司機
drop|掉落；滴落
dry|乾的；弄乾
DVD|影音光碟
earache|耳朵痛
easy|簡單的
e-book|電子書
eighteenth|第十八
eighth|第八
eighty|八十
elevator|電梯
eleventh|第十一
email|電子郵件
every|每一個
everyone|每個人
everything|每件事物
exciting|令人興奮的
excuse me|不好意思；請問
fair|公平的
fall|落下；跌倒
famous|有名的
farm|農場
farmer|農夫
fat|胖的
feed|餵食
field|田野
fifteenth|第十五
fifth|第五
fifty|五十
film|電影；拍攝
film star|電影明星
fine|好的
first|第一
fish|魚；釣魚
fix|修理
floor|地板；樓層
fly|蒼蠅；飛翔
forest|森林
forty|四十
fourteenth|第十四
fourth|第四
Fred|弗雷德（人名）
Friday|星期五
frightened|受驚的
funfair|遊樂園；園遊會
get dressed|穿衣服
get off|下車
get on|上車
get undressed|脫衣服
get up|起床
glass|玻璃；玻璃杯
go shopping|去購物
goal|目標；球門
granddaughter|孫女；外孫女
grandparent|祖父或祖母
grandson|孫子；外孫子
grass|草
ground|地面
grow|生長；種植
grown-up|成年人
have (got) to|必須
headache|頭痛
helmet|安全帽
help|幫助
hide|躲藏
holiday|假日
homework|家庭作業
hop|單腳跳
hospital|醫院
hot|熱的
how|如何
how much|多少（價格或不可數量）
how often|多久一次
huge|巨大的
hundred|一百
hungry|飢餓的
hurt|受傷；疼痛
ice|冰
ice skates|溜冰鞋
ice skating|溜冰
idea|主意
ill|生病的
inside|在……裡面
internet|網際網路
into|進入
invite|邀請
island|島嶼
Jack|傑克（人名）
Jane|珍（人名）
Jim|吉姆（人名）
Julia|茱莉亞（人名）
jungle|叢林
kangaroo|袋鼠
kick|踢
kind|種類；友善的
kitten|小貓
lake|湖泊
laptop|筆記型電腦
last|最後的
laugh|笑
leaf / leaves|葉子（單數／複數）
library|圖書館
lift|電梯；舉起
Lily|莉莉（人名）
lion|獅子
little|小的；少量的
look for|尋找
lose|輸；遺失
loud|大聲的
loudly|大聲地
machine|機器
map|地圖
market|市場
Mary|瑪麗（人名）
matter|事情；問題
mean|意思是
message|訊息
milkshake|奶昔
mistake|錯誤
model|模型；模特兒
Monday|星期一
moon|月亮`.split('\n').map((row,i)=>{const [en,zh]=row.trim().split('|');return {id:i+1,en,zh}});
if(typeof module !== 'undefined') module.exports=WORDS;
