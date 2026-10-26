// アステル教授の植物学実習帳 — ゲーム本体。図鑑60種、探索、所持品、セーブを管理します。
const ITEMS = [{"id": "001", "name": "ローズマリー", "category": "実在植物ベース", "rarity": "★", "lesson": "温室実習", "description": "ローズマリーの葉。香りの強い常緑性の植物で、学院では香油や調合薬の研究材料として扱われる。", "condition": "温室で葉を観察する"}, {"id": "002", "name": "カモミール", "category": "実在植物ベース", "rarity": "★", "lesson": "温室実習", "description": "白い花弁と黄色い中心を持つ花。乾燥させた花の香りや状態を観察する。", "condition": "花壇で花を採取する"}, {"id": "003", "name": "ラベンダー", "category": "実在植物ベース", "rarity": "★", "lesson": "温室実習", "description": "紫色の花穂と特徴的な香りを持つ植物。香りの成分を調べる実習に使われる。", "condition": "香りを調べる"}, {"id": "004", "name": "ミント", "category": "実在植物ベース", "rarity": "★", "lesson": "温室実習", "description": "清涼感のある香りを持つ葉。葉の形や香りの違いを比べる観察対象。", "condition": "葉の形を観察する"}, {"id": "005", "name": "セージ", "category": "実在植物ベース", "rarity": "★", "lesson": "温室実習", "description": "表面に細かな毛のある葉を持つ植物。葉の質感や乾燥後の変化を調べる。", "condition": "葉の表面を調べる"}, {"id": "006", "name": "タイム", "category": "実在植物ベース", "rarity": "★", "lesson": "温室実習", "description": "小さな葉を持つ芳香性の植物。調合の基礎素材として登場する。", "condition": "薬草調合の授業を受ける"}, {"id": "007", "name": "レモンバーム", "category": "実在植物ベース", "rarity": "★★", "lesson": "温室実習", "description": "レモンに似た香りの葉を持つ植物。温室の隅で群生していることがある。", "condition": "温室の隅を探索する"}, {"id": "008", "name": "カレンデュラ", "category": "実在植物ベース", "rarity": "★★", "lesson": "温室実習", "description": "明るい色の花を咲かせる植物。花弁の色や形を記録する。", "condition": "花弁を観察する"}, {"id": "009", "name": "エキナセア", "category": "実在植物ベース", "rarity": "★★", "lesson": "野外調査", "description": "中央が盛り上がった花姿が特徴。野外の花壇で観察できる。", "condition": "野外調査を行う"}, {"id": "010", "name": "ヤロウ", "category": "実在植物ベース", "rarity": "★★", "lesson": "野外調査", "description": "細かく裂けた葉を持つ植物。学院の森の小道沿いで見つかる。", "condition": "森の小道を調べる"}, {"id": "011", "name": "ジャーマンアイリス", "category": "実在植物ベース", "rarity": "★★", "lesson": "野外調査", "description": "大きな花と発達した根茎を持つ植物。根の形を学ぶ教材になる。", "condition": "根茎を調査する"}, {"id": "012", "name": "ジンジャー", "category": "実在植物ベース", "rarity": "★★", "lesson": "野外調査", "description": "香りのある地下茎を利用する植物。根茎の標本を作る実習に登場する。", "condition": "根の標本を作る"}, {"id": "013", "name": "バレリアン", "category": "実在植物ベース", "rarity": "★★★", "lesson": "野外調査", "description": "独特の香りを持つ植物。湿り気のある土壌で生育環境を調べる。", "condition": "湿った土壌を調べる"}, {"id": "014", "name": "マンドレイク模型標本", "category": "伝承・教材", "rarity": "★★★", "lesson": "温室実習", "description": "伝承上のマンドレイクを模した安全な教材標本。根の形態を学ぶための模型。", "condition": "根の形を研究する"}, {"id": "015", "name": "アロエ", "category": "実在植物ベース", "rarity": "★★", "lesson": "温室実習", "description": "厚みのある葉に水分を蓄える植物。乾燥区画で葉の構造を観察する。", "condition": "乾燥区画を探索する"}, {"id": "016", "name": "月光花", "category": "幻想植物", "rarity": "★★★", "lesson": "温室実習", "description": "月明かりのような青白い光を放つ花。花弁に微細な魔力の流れが見られる。", "condition": "夜の温室を観察する"}, {"id": "017", "name": "星露草", "category": "幻想植物", "rarity": "★★★★", "lesson": "野外調査", "description": "夜明け前に葉先へ星屑のような露をつける。日が昇ると露は消えてしまう。", "condition": "夜明け前に露を調べる"}, {"id": "018", "name": "琥珀灯花", "category": "幻想植物", "rarity": "★★", "lesson": "温室実習", "description": "花弁の内側に琥珀色の光を灯す植物。光の強さが周囲の魔力に反応する。", "condition": "花弁の発光を観察する"}, {"id": "019", "name": "眠り苔", "category": "幻想植物", "rarity": "★★", "lesson": "野外調査", "description": "湿った石壁に広がる苔。触れずに観察すると、光がゆっくり明滅する。", "condition": "湿った石壁を調べる"}, {"id": "020", "name": "風鈴蔓", "category": "幻想植物", "rarity": "★★", "lesson": "野外調査", "description": "風に揺れると小さな鈴のような音を奏でる蔓植物。音の発生源を追う。", "condition": "音の鳴る蔓を追う"}, {"id": "021", "name": "銀葉樹の若芽", "category": "幻想植物", "rarity": "★★", "lesson": "野外調査", "description": "銀色がかった葉を持つ樹木の若芽。根元の土に微弱な魔力反応がある。", "condition": "木の根元を調べる"}, {"id": "022", "name": "雨待ち草", "category": "幻想植物", "rarity": "★★", "lesson": "野外調査", "description": "雨が近づくと葉を閉じる水辺の植物。湿度と葉の動きを記録する。", "condition": "水辺の区画を探索する"}, {"id": "023", "name": "蒼火茸", "category": "幻想植物", "rarity": "★★★", "lesson": "野外調査", "description": "暗所で青い光を帯びる茸。胞子を採取する際は風向きに注意が必要。", "condition": "暗い温室の奥を探索する"}, {"id": "024", "name": "鏡花", "category": "幻想植物", "rarity": "★★★", "lesson": "温室実習", "description": "花弁が鏡のように周囲の色を映す植物。角度によって模様が変わる。", "condition": "花弁の反射を調べる"}, {"id": "025", "name": "夢紡ぎ草", "category": "幻想植物", "rarity": "★★★", "lesson": "温室実習", "description": "葉脈が糸のような模様を描く植物。葉の模様を記録すると研究が進む。", "condition": "葉の模様を記録する"}, {"id": "026", "name": "時計花", "category": "幻想植物", "rarity": "★★★", "lesson": "温室実習", "description": "決まった時刻にだけ花を開く。開花時刻の記録が発見の鍵となる。", "condition": "開花時刻を観察する"}, {"id": "027", "name": "浮遊種子草", "category": "幻想植物", "rarity": "★★", "lesson": "野外調査", "description": "成熟した種子がふわりと浮かぶ植物。種子の動きを追って採取する。", "condition": "空中の種子を追う"}, {"id": "028", "name": "霜結晶花", "category": "幻想植物", "rarity": "★★★", "lesson": "野外調査", "description": "花弁の縁に霜のような結晶が育つ。冷涼な場所を好む。", "condition": "冷涼な区画を探索する"}, {"id": "029", "name": "紅蓮樹の実", "category": "幻想植物", "rarity": "★★★", "lesson": "野外調査", "description": "赤い光を内側に宿す木の実。熟すと表面に細い光の筋が浮かぶ。", "condition": "樹木の実を観察する"}, {"id": "030", "name": "薄明のシダ", "category": "幻想植物", "rarity": "★★", "lesson": "野外調査", "description": "薄暗い場所で青緑色に見えるシダ。日陰の生育環境を調べる。", "condition": "日陰を探索する"}, {"id": "031", "name": "影縫い蔓", "category": "幻想植物", "rarity": "★★★★", "lesson": "野外調査", "description": "影の境目に沿って伸びる蔓。光源の位置を変えると成長方向が変わる。", "condition": "植物の影を追う"}, {"id": "032", "name": "星喰い蕾", "category": "幻想植物", "rarity": "★★★★", "lesson": "野外調査", "description": "星明かりを吸い込むように輝く蕾。星露草の研究後に発見の手がかりが得られる。", "condition": "星露草の研究後に探索する"}, {"id": "033", "name": "深根の白花", "category": "幻想植物", "rarity": "★★★★", "lesson": "野外調査", "description": "地表には小さな白花しか見えないが、地下深くまで根を伸ばす。根脈感知で探す。", "condition": "根脈感知で根を調べる"}, {"id": "034", "name": "幽光の胞子花", "category": "幻想植物", "rarity": "★★★★", "lesson": "野外調査", "description": "蒼火茸の近くに稀に咲く胞子花。胞子の光は標本瓶の中でも弱く続く。", "condition": "蒼火茸の標本を持って探索する"}, {"id": "035", "name": "未分類の銀青花", "category": "幻想植物", "rarity": "★★★★★", "lesson": "野外調査", "description": "既存の分類に当てはまらない銀青色の花。複数の植物標本を集めると手がかりが得られる。", "condition": "特定の植物標本を集めて探索する"}, {"id": "036", "name": "月光花の花弁標本", "category": "採取素材・標本", "rarity": "★★★", "lesson": "温室実習", "description": "月光花から採取した花弁。暗所で淡い青白い光を放ち、内部に微弱な魔力反応がある。", "condition": "月光花の花弁を詳しく観察する"}, {"id": "037", "name": "星露草の朝露", "category": "採取素材・標本", "rarity": "★★★★", "lesson": "野外調査", "description": "星露草の葉先に生じる露。魔力を含むが、日の出後は急速に消失する。", "condition": "星露草から露を採取する"}, {"id": "038", "name": "魔力を帯びた土壌", "category": "採取素材・標本", "rarity": "★★★", "lesson": "温室実習", "description": "光る花の根元から採取した土壌標本。青白い微粒子と強い魔力反応が確認された。植物が魔力を吸収した痕跡か、土壌自体の性質かは未解明。", "condition": "光る花の根元の土と魔力を調べる"}, {"id": "039", "name": "琥珀色の樹液", "category": "採取素材・標本", "rarity": "★★", "lesson": "野外調査", "description": "樹皮から自然に滲み出た樹液。琥珀色で、保存するとゆっくり固まる。", "condition": "樹液を傷つけず採取する"}, {"id": "040", "name": "蒼火茸の胞子袋", "category": "採取素材・標本", "rarity": "★★★", "lesson": "野外調査", "description": "蒼火茸から採取した胞子袋。強い風を避けて慎重に扱う必要がある。", "condition": "蒼火茸を慎重に観察する"}, {"id": "041", "name": "浮遊種子の小瓶", "category": "採取素材・標本", "rarity": "★★", "lesson": "野外調査", "description": "浮遊種子草の種子を収めた小瓶。瓶を傾けると種子がゆっくり浮き上がる。", "condition": "浮遊種子草を追跡する"}, {"id": "042", "name": "霜結晶の欠片", "category": "採取素材・標本", "rarity": "★★★", "lesson": "野外調査", "description": "霜結晶花の縁にできる透明な欠片。室温では少しずつ水滴に戻る。", "condition": "霜結晶花を採取する"}, {"id": "043", "name": "深根の繊維", "category": "採取素材・標本", "rarity": "★★★★", "lesson": "野外調査", "description": "深根の白花から採取した細い繊維。微弱な魔力の流れを伝える性質がある。", "condition": "根脈感知で根を発見する"}, {"id": "044", "name": "鏡花の透明片", "category": "採取素材・標本", "rarity": "★★★", "lesson": "温室実習", "description": "鏡花から自然に落ちた透明な花弁片。周囲の色を淡く映し込む。", "condition": "鏡花の落花を採取する"}, {"id": "045", "name": "未知の種子", "category": "採取素材・標本", "rarity": "★★★★★", "lesson": "野外調査", "description": "正体不明の銀青花の近くで見つかった種子。既存の図鑑には一致する記録がない。", "condition": "未分類の銀青花の調査後に発見する"}, {"id": "046", "name": "薬草の芳香油", "category": "調合薬・香油", "rarity": "★", "lesson": "薬草調合", "description": "芳香性の薬草を用いた香油。植物ごとの香りの違いを比較する教材。", "condition": "授業用のローズマリーで調合（自分で発見した素材も使用可能）"}, {"id": "047", "name": "カモミールの香油", "category": "調合薬・香油", "rarity": "★", "lesson": "薬草調合", "description": "カモミールの香りを閉じ込めた香油。調合後も淡い花の香りが残る。", "condition": "授業用のカモミールで調合（自分で発見した素材も使用可能）"}, {"id": "048", "name": "清涼ミント液", "category": "調合薬・香油", "rarity": "★★", "lesson": "薬草調合", "description": "ミントの清涼感を抽出した学院内の実習用調合液。", "condition": "授業用のミントで調合（自分で発見した素材も使用可能）"}, {"id": "049", "name": "琥珀色の保存液", "category": "調合薬・香油", "rarity": "★★", "lesson": "薬草調合", "description": "採取した標本の状態を保つための架空の保存液。琥珀色に透き通る。", "condition": "琥珀色の樹液を採取して調合"}, {"id": "050", "name": "微光の観察液", "category": "調合薬・香油", "rarity": "★★★", "lesson": "薬草調合", "description": "魔力植物の発光反応を観察しやすくする研究用の液体。", "condition": "琥珀灯花を研究して調合"}, {"id": "051", "name": "星露の魔力溶液", "category": "調合薬・香油", "rarity": "★★★★", "lesson": "薬草調合", "description": "星露草の朝露を用いた研究用溶液。淡い星形の光が瓶の中に浮かぶ。", "condition": "星露草の朝露を採取して調合"}, {"id": "052", "name": "霜結晶の冷却薬", "category": "調合薬・香油", "rarity": "★★★", "lesson": "薬草調合", "description": "霜結晶の欠片を用いた架空の冷却用調合品。瓶の表面に薄い霜がつく。", "condition": "霜結晶の欠片を採取して調合"}, {"id": "053", "name": "夢紡ぎの芳香瓶", "category": "調合薬・香油", "rarity": "★★★", "lesson": "薬草調合", "description": "夢紡ぎ草の香りを封じた小瓶。開封すると草花のような穏やかな香りが広がる。", "condition": "夢紡ぎ草を発見して調合"}, {"id": "054", "name": "根脈の反応液", "category": "調合薬・香油", "rarity": "★★★★", "lesson": "薬草調合", "description": "根の周囲にある魔力反応を記録するための研究用試薬。", "condition": "深根の繊維を採取して調合"}, {"id": "055", "name": "未知植物の抽出液", "category": "調合薬・香油", "rarity": "★★★★★", "lesson": "薬草調合", "description": "未知の銀青花から得られた抽出液。性質は未解明で、慎重な観察が必要。", "condition": "未分類植物の研究を進めて調合"}, {"id": "056", "name": "教授の温室観察ノート", "category": "研究記録・特別な発見", "rarity": "★", "lesson": "研究記録", "description": "温室での観察を記したノート。植物の葉や花の細かな違いがスケッチされている。", "condition": "温室実習を3回受ける"}, {"id": "057", "name": "薬草調合の初級記録", "category": "研究記録・特別な発見", "rarity": "★★", "lesson": "研究記録", "description": "薬草を組み合わせたときの香りや色の変化を記録した初級研究資料。", "condition": "調合品を3種類発見する"}, {"id": "058", "name": "根脈の研究記録", "category": "研究記録・特別な発見", "rarity": "★★★★", "lesson": "研究記録", "description": "地下の根と魔力の流れについて記した研究資料。複数の根素材の比較が必要。", "condition": "根に関する素材を3種類発見する"}, {"id": "059", "name": "未分類植物の研究日誌", "category": "研究記録・特別な発見", "rarity": "★★★★★", "lesson": "研究記録", "description": "未分類の銀青花を中心に、既存の分類では説明できない特徴をまとめた日誌。", "condition": "未分類の銀青花を発見する"}, {"id": "060", "name": "アステル教授の特別講義録", "category": "研究記録・特別な発見", "rarity": "★★★★★", "lesson": "研究記録", "description": "植物学実習図鑑を完成させた者に贈られる特別講義録。教授の手書きの祝辞が添えられている。", "condition": "図鑑を100％完成させる"}];
const METHODS = {
 "温室実習":[
  {id:"observe",title:"花や葉を詳しく観察する",desc:"花弁・葉・香りなど、目の前の特徴を記録する。",cats:["実在植物ベース","幻想植物","採取素材・標本"]},
  {id:"soil",title:"根元の土と魔力を調べる",desc:"土壌や根の周囲にある魔力の流れを探す。",cats:["幻想植物","採取素材・標本"]},
  {id:"environment",title:"植物の生育環境を比較する",desc:"日当たりや湿度の違いが植物に与える影響を調べる。",cats:["実在植物ベース","幻想植物"]},
  {id:"measure",title:"魔力の反応を測定する",desc:"専用の観測器具で植物が示す魔力反応を記録する。",cats:["幻想植物","採取素材・標本"]}
 ],
  "薬草調合":[
   {id:"compare",title:"薬草の香りを抽出する",desc:"支給された薬草から香りを抽出し、香油を仕上げる。",cats:["調合薬・香油"]},
   {id:"mix",title:"薬草を組み合わせて調合する",desc:"薬草を配合し、研究用の調合液を完成させる。",cats:["調合薬・香油"]},
   {id:"preserve",title:"標本用の保存液を作る",desc:"植物素材を安定させるための保存・冷却液を調合する。",cats:["調合薬・香油"]},
   {id:"analyze",title:"魔力を利用した調合を行う",desc:"希少素材を使い、魔力を帯びた試薬や溶液を作る。",cats:["調合薬・香油"]}
  ],
 "野外調査":[
  {id:"track",title:"地面や根の痕跡をたどる",desc:"土の盛り上がりや根の伸び方から植物の存在を探る。",cats:["実在植物ベース","幻想植物","採取素材・標本"]},
  {id:"water",title:"水辺や木陰を調査する",desc:"植物が生育しやすい場所を探して観察する。",cats:["実在植物ベース","幻想植物"]},
  {id:"root",title:"周囲の魔力の流れを調べる",desc:"地面や植物の周囲にある魔力反応を測定する。",cats:["幻想植物","採取素材・標本"]},
  {id:"rare",title:"珍しい植物の特徴を記録する",desc:"植物の形状や色、生育場所を記録して分類する。",cats:["幻想植物","採取素材・標本","研究記録・特別な発見"]}
 ]
};
const STORAGE="asterBotanicalJournal_v2";
const DAILY_LIMIT=3;
const dayKey=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};
function getDailyCount(){try{const d=JSON.parse(localStorage.getItem(STORAGE+"_daily")||"{}");return d.date===dayKey()?d.count||0:0}catch(e){return 0}}
function setDailyCount(count){localStorage.setItem(STORAGE+"_daily",JSON.stringify({date:dayKey(),count}))}
const initial=()=>({inventory:{},found:[],lessons:0,lessonCounts:{},history:[],completed:false});
let state=loadState(), selectedLesson="", selectedMethod="";
function loadState(){try{return {...initial(),...JSON.parse(localStorage.getItem(STORAGE)||"{}")}}catch(e){return initial()}}
function save(){localStorage.setItem(STORAGE,JSON.stringify(state));renderStats();renderDailyLimit()}
function renderStats(){const found=state.found.length;document.getElementById("found").textContent=`${found} / ${ITEMS.length}`;document.getElementById("progress").style.width=`${found/ITEMS.length*100}%`;document.getElementById("possessed").textContent=Object.values(state.inventory).reduce((a,b)=>a+b,0);document.getElementById("lessons").textContent=state.lessons}
function renderDailyLimit(){
 const count=getDailyCount(), exhausted=count>=DAILY_LIMIT;
 const el=document.getElementById("dailyLimit");
 if(el)el.textContent=exhausted?`本日の授業：${count} / ${DAILY_LIMIT} 回（本日は終了。次の授業は明日から）`:`本日の授業：${count} / ${DAILY_LIMIT} 回（残り${DAILY_LIMIT-count}回）`;
 document.querySelectorAll("[data-lesson], [data-method]").forEach(btn=>btn.disabled=exhausted);
 const again=document.getElementById("againBtn");
 if(again){again.disabled=exhausted;again.textContent=exhausted?"本日の授業は終了":"もう一度実習する";}
}
function rarityScore(r){return (r.match(/★/g)||[]).length}
function hasItem(id){return (state.inventory[id]||0)>0}
function eligible(item,method){
 const n=+item.id;
 if(n===60)return state.found.length>=59;
 if(n===59)return hasItem("035");
 if(n===58)return [38,43,36].filter(x=>hasItem(String(x).padStart(3,"0"))).length>=3;
 if(n===57)return state.found.filter(id=>+id>=46&&+id<=55).length>=3;
 if(n===56)return (state.lessonCounts["温室実習"]||0)>=2;
 if(n===55)return hasItem("035")&&hasItem("045");
 if(n===54)return hasItem("043");
 if(n===53)return hasItem("025");
 if(n===52)return hasItem("042");
 if(n===51)return hasItem("037");
 if(n===50)return hasItem("018");
 if(n===49)return hasItem("039");
 if(n===48||n===47||n===46)return true; // 初級調合は授業用の支給素材で製作できる
 if(n===45)return hasItem("035");
 if(n===44)return hasItem("024");
 if(n===43)return hasItem("033");
 if(n===42)return hasItem("028");
 if(n===41)return hasItem("027");
 if(n===40)return hasItem("023");
 if(n===39)return hasItem("029")||method.id==="soil";
 if(n===38)return method.id==="soil"||method.id==="root";
 if(n===37)return method.id==="rare"||method.id==="track";
 if(n===36)return hasItem("016")&&method.id==="observe";
 if(n===35)return [16,17,24,32,33].filter(x=>hasItem(String(x).padStart(3,"0"))).length>=3;
 if(n===34)return hasItem("023");
 if(n===33)return method.id==="root";
 if(n===32)return hasItem("017")&&method.id==="rare";
 if(n===31)return method.id==="track"||method.id==="rare";
 if(n===30)return method.id==="track";
 if(n===29)return method.id==="track"||method.id==="rare";
 if(n===28)return method.id==="track"||method.id==="rare";
 if(n===27)return method.id==="track";
 if(n===26)return method.id==="observe";
 if(n===25)return method.id==="observe";
 if(n===24)return method.id==="observe";
 if(n===23)return method.id==="track"||method.id==="rare";
 if(n===22)return method.id==="track";
 if(n===21)return method.id==="soil"||method.id==="root";
 if(n===20)return method.id==="track";
 if(n===19)return method.id==="track";
 if(n===18)return method.id==="observe";
 if(n===17)return method.id==="rare"||method.id==="track";
 if(n===16)return method.id==="observe";
 return true;
}
function poolFor(lesson,method){
 // 実習ごとの成果物を厳密に分離。薬草調合では植物そのものを発見しない。
 let pool=ITEMS.filter(i=>method.cats.includes(i.category)&&eligible(i,method));
 if(lesson==="薬草調合"){
  pool=pool.filter(i=>i.category==="調合薬・香油");
  const recipes={
   compare:[46,47,48,53],
   mix:[46,47,48,50,51,53,55],
   preserve:[46,47,48,49,52],
   analyze:[46,47,48,50,51,54,55]
  };
  pool=pool.filter(i=>recipes[method.id].includes(+i.id));
 } else if(lesson==="温室実習"){
  const greenhouse=[1,2,3,4,5,6,7,8,14,15,16,18,24,25,26,36,38,44,56];
  pool=pool.filter(i=>greenhouse.includes(+i.id));
  if(method.id==="observe")pool=pool.filter(i=>+i.id!==38);
  if(method.id==="environment")pool=pool.filter(i=>i.category==="実在植物ベース"||i.category==="幻想植物");
  if(method.id==="measure")pool=pool.filter(i=>i.category==="幻想植物"||i.category==="採取素材・標本");
 } else if(lesson==="野外調査"){
  const outside=[9,10,11,12,13,17,19,20,21,22,23,27,28,29,30,31,32,33,34,35,37,39,40,41,42,43,45,58,59];
  pool=pool.filter(i=>outside.includes(+i.id));
  if(method.id==="root")pool=pool.filter(i=>[21,33,43,58].includes(+i.id));
  if(method.id==="rare")pool=pool.filter(i=>[17,31,32,33,34,35,37,43,45,58,59].includes(+i.id));
 }
 // 図鑑完成の報酬だけは、最後の1種になった場合に実習の種類を問わず獲得可能。
 // 特別な研究記録は到達条件を満たした授業でのみ候補に加える。
 const bonusIds=lesson==="温室実習"?[56]:lesson==="薬草調合"?[57]:[58,59];
 for(const id of bonusIds){const bonus=ITEMS.find(i=>+i.id===id);if(eligible(bonus,method)&&!pool.includes(bonus))pool.push(bonus)}
 const completion=ITEMS.find(i=>i.id==="060");
 if(eligible(completion,method))pool.push(completion);
 return pool;
}

function weightedPick(pool){
 if(!pool.length)return null;
 const unseen=pool.filter(i=>!state.found.includes(i.id));
 let choices=unseen.length?unseen:pool;
 let weights=choices.map(i=>{let r=rarityScore(i.rarity);let w=Math.max(1,7-r);if(!state.found.includes(i.id))w*=1.45;if(+i.id>=56)w*=.18;return w});
 let total=weights.reduce((a,b)=>a+b,0),x=Math.random()*total;
 for(let i=0;i<choices.length;i++){x-=weights[i];if(x<=0)return choices[i]}
 return choices[choices.length-1];
}
function setLesson(lesson){if(getDailyCount()>=DAILY_LIMIT){renderDailyLimit();return;}selectedLesson=lesson;selectedMethod="";document.querySelectorAll("[data-lesson]").forEach(b=>b.classList.toggle("active",b.dataset.lesson===lesson));const box=document.getElementById("methodBox");box.classList.remove("hidden");document.getElementById("methodChoices").innerHTML=METHODS[lesson].map(m=>`<button class="choice" data-method="${m.id}"><strong>${m.title}</strong><small>${m.desc}</small></button>`).join("");document.querySelectorAll("[data-method]").forEach(b=>b.addEventListener("click",()=>runLesson(b.dataset.method)));document.getElementById("result").classList.add("hidden");renderDailyLimit()}
function runLesson(methodId){
 // 回数を消費する前にチェック。連打やボタンを再有効化しても4回目は実行しない。
 if(getDailyCount()>=DAILY_LIMIT){renderDailyLimit();return;}
 const method=METHODS[selectedLesson].find(m=>m.id===methodId);if(!method)return;selectedMethod=methodId;
 const specialSoilEvent = selectedLesson === "温室実習" && methodId === "soil";
 let pool=poolFor(selectedLesson,method);let item=specialSoilEvent ? ITEMS.find(i=>i.id==="038") : weightedPick(pool);
 if(!item){document.getElementById("result").classList.remove("hidden");document.getElementById("result").textContent="この方法で作れる調合品・発見はまだありません。別の方法を試してください。";return;}
 const first=!state.found.includes(item.id);state.inventory[item.id]=(state.inventory[item.id]||0)+1;
 if(first)state.found.push(item.id);
 state.lessons++;state.lessonCounts[selectedLesson]=(state.lessonCounts[selectedLesson]||0)+1;setDailyCount(getDailyCount()+1);
 const quotes={
  "温室実習":"「よく観察することが、発見への第一歩です。見慣れた葉にも、思いがけない特徴が隠れているものですよ」",
  "薬草調合":"「組み合わせる前に、素材の性質を確かめましょう。小さな違いが、調合の結果を大きく変えることもあります」",
  "野外調査":"「焦らず、周囲をよく見てください。植物は生えている場所にも、たくさんの手がかりを残しているんです」"
 };
 const methodText={"observe":"花弁や葉を詳しく観察した","soil":"根元の土と魔力の流れを調べた","environment":"植物の生育環境を比較した","measure":"魔力の反応を測定した","compare":"薬草の香りと性質を比較した","water":"水辺や木陰を調査した","mix":"素材の特徴を確かめながら調合した","preserve":"標本の保存方法を試した","analyze":"素材の魔力反応を分析した","track":"地面や根の痕跡をたどった","water":"水辺や木陰を調査した","root":"周囲の魔力の流れを調べた","rare":"珍しい植物の特徴を記録した","environment":"植物の生育環境を比較した","measure":"魔力の反応を測定した","compare":"薬草の香りと性質を比較した"};
 const eventLine=first?`初めての発見です。${item.name}が図鑑に登録されました。`:`${item.name}をもうひとつ入手しました。所持数が増えました。`;
 const specialScene = "温室の奥、淡い光を放つ花の前で足を止め、花弁ではなく根元へ視線を落とした。土を少し掘り起こすと、根の周囲を縫うように青白い光が走り、地中に細い川が流れているかのようにゆっくり明滅した。\n\n花そのものが光を生み出しているのではなく、根を通して土壌から魔力を吸い上げ、花弁へ送り込んでいるのかもしれない。採取した土にも、通常の温室土壌より強い魔力反応が残っていた。";
 const specialQuote = "「なるほど……花弁が光っているからといって、光の発生源が花そのものとは限らないわけですね。根が土壌中の魔力を吸収し、花へと運んでいる可能性があります」\n\n「この土にも、魔力の痕跡がかなり濃く残っています。ふふ、これは面白い。花だけを観察していたら、きっと見落としていたでしょうね。持ち帰って、反応の変化を調べてみましょう」";
 const specialNote = "植物と土壌は、私たちが考える以上に密接につながっているのかもしれません。次は、花がなくなった後にも魔力が残るのかを確かめてみたいですね。";
 const icon=item.category==="実在植物ベース"?"🌿":item.category==="幻想植物"?"✨":item.category==="採取素材・標本"?"🧪":item.category==="調合薬・香油"?"⚗️":"📜";
 const result=document.getElementById("result");result.classList.remove("hidden");
 result.innerHTML=`<div class="itemhead"><div class="specimen">${icon}</div><div><span class="tag">${item.category}</span><span class="tag gold">${item.rarity}</span><h2>${item.name}</h2><div class="muted">No. ${item.id} · ${first?"初発見":"重複入手"}</div></div></div>${specialSoilEvent?`<p class="event-scene">${specialScene.replaceAll("\n","<br>")}</p>`:""}<div class="teacher"><strong>アステル教授</strong><br>${specialSoilEvent?specialQuote.replaceAll("\n","<br>"):quotes[selectedLesson]}</div><p>あなたは${methodText[methodId]}。${specialSoilEvent?"調査の結果、根の周囲に魔力の流れが残る土壌を採取した。":"調査の結果、"}<strong>${item.name}</strong>${specialSoilEvent?"":selectedLesson==="薬草調合"?"を完成させた。":"を発見した。"}</p><p>${eventLine}</p><div class="detail"><strong>図鑑の説明</strong><p>${item.description}</p><strong>入手条件</strong><p>${item.condition}</p><strong>教授の研究メモ</strong><p>${specialSoilEvent?`「${specialNote}」`:first?`「いい発見ですね。${item.name}について、もう少し詳しく調べてみたいものです」`:`「同じものでも、何度観察しても新しいことに気づくものですよ」`}</p><div class="count">所持数：${state.inventory[item.id]}</div></div><div class="actions"><button class="btn" id="againBtn">もう一度実習する</button><button class="btn secondary" id="toCatalog">図鑑を見る</button></div>`;
 state.history.unshift({item:item.id,lesson:selectedLesson,method:methodText[methodId],first,time:new Date().toLocaleString("ja-JP")});state.history=state.history.slice(0,80);
 if(state.found.length===ITEMS.length&&!state.completed){state.completed=true;result.innerHTML+=`<div class="teacher"><strong>図鑑完成！</strong><br>「すばらしい！　これほどの発見を積み重ねるとは。ぜひ、この特別講義録を受け取ってください」</div>`}
 save();renderInventory();renderCatalog();renderRecords();
 document.getElementById("againBtn").addEventListener("click",()=>{result.classList.add("hidden");document.getElementById("methodBox").scrollIntoView({behavior:"smooth",block:"start"})});
 document.getElementById("toCatalog").addEventListener("click",()=>showPage("catalog"));
 result.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function itemCard(i,locked=false){const count=state.inventory[i.id]||0;const icon=locked?"❔":i.category==="実在植物ベース"?"🌿":i.category==="幻想植物"?"✨":i.category==="採取素材・標本"?"🧪":i.category==="調合薬・香油"?"⚗️":"📜";return `<article class="item ${locked?"locked":""}"><div class="itemhead"><div class="specimen">${icon}</div><div><div class="num">NO. ${i.id}</div><h3>${locked?"？？？":i.name}</h3><span class="tag">${locked?"未発見":i.category}</span>${!locked?`<span class="tag gold">${i.rarity}</span>`:""}</div></div><p>${locked?"まだ記録されていない発見です。授業や探索を続けましょう。":i.description}</p>${!locked?`<div class="count">所持数：${count}</div><p class="muted">入手方法：${i.condition}</p>`:""}</article>`}
function renderInventory(){const cat=document.getElementById("invCategory").value||"",q=(document.getElementById("invSearch").value||"").toLowerCase();const list=ITEMS.filter(i=>(state.inventory[i.id]||0)>0&&(!cat||i.category===cat)&&i.name.toLowerCase().includes(q));document.getElementById("inventoryGrid").innerHTML=list.length?list.map(i=>itemCard(i)).join(""):`<div class="empty">まだアイテムを持っていません。授業に参加して、最初の発見をしましょう。</div>`}
function renderCatalog(){const cat=document.getElementById("catCategory").value||"",status=document.getElementById("catStatus").value,q=(document.getElementById("catSearch").value||"").toLowerCase();const list=ITEMS.filter(i=>(!cat||i.category===cat)&&(status==="all"||(status==="found"?state.found.includes(i.id):!state.found.includes(i.id)))&&(i.name.toLowerCase().includes(q)||i.id.includes(q)));document.getElementById("catalogGrid").innerHTML=list.map(i=>itemCard(i,!state.found.includes(i.id))).join("")||`<div class="empty">該当するアイテムはありません。</div>`}
function renderRecords(){document.getElementById("recordSummary").innerHTML=`授業回数：<strong>${state.lessons}</strong>回<br>発見済み：<strong>${state.found.length} / ${ITEMS.length}</strong>種類<br>完成率：<strong>${Math.floor(state.found.length/ITEMS.length*100)}%</strong><br>温室実習：${state.lessonCounts["温室実習"]||0}回／薬草調合：${state.lessonCounts["薬草調合"]||0}回／野外調査：${state.lessonCounts["野外調査"]||0}回${state.completed?"<br><strong>植物学実習図鑑 完成済み</strong>":""}`;document.getElementById("recordList").innerHTML=state.history.length?state.history.map(h=>{let i=ITEMS.find(x=>x.id===h.item);return `<div class="item" style="margin-top:8px"><strong>${h.first?"★ 初発見":"重複入手"}：${i?i.name:h.item}</strong><div class="muted">${h.time} · ${h.lesson} · ${h.method}</div></div>`}).join(""):`<div class="empty">まだ研究記録はありません。</div>`}
function showPage(page){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("hidden",p.id!=="page-"+page));document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.page===page));if(page==="inventory")renderInventory();if(page==="catalog")renderCatalog();if(page==="records")renderRecords();window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll("nav button").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
document.querySelectorAll("[data-lesson]").forEach(b=>b.addEventListener("click",()=>setLesson(b.dataset.lesson)));
function fillCategories(){const cats=[...new Set(ITEMS.map(i=>i.category))];["invCategory","catCategory"].forEach(id=>{const el=document.getElementById(id);cats.forEach(c=>{const o=document.createElement("option");o.value=c;o.textContent=c;el.appendChild(o)})})}
["invCategory","invSearch"].forEach(id=>document.getElementById(id).addEventListener("input",renderInventory));
["catCategory","catStatus","catSearch"].forEach(id=>document.getElementById(id).addEventListener("input",renderCatalog));
document.getElementById("exportBtn").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="aster-botanical-save.json";a.click();URL.revokeObjectURL(a.href)});
document.getElementById("importBtn").addEventListener("click",()=>document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{const obj=JSON.parse(await f.text());if(!obj.inventory||!Array.isArray(obj.found))throw Error();state={...initial(),...obj};save();renderInventory();renderCatalog();renderRecords();alert("セーブデータを読み込みました。")}catch(err){alert("このセーブデータは読み込めませんでした。")}e.target.value=""});
document.getElementById("resetBtn").addEventListener("click",()=>{if(confirm("所持品と図鑑の進捗をすべて消して最初から始めますか？")){state=initial();save();renderInventory();renderCatalog();renderRecords();document.getElementById("result").classList.add("hidden")}});
fillCategories();renderStats();renderDailyLimit();renderInventory();renderCatalog();renderRecords();
