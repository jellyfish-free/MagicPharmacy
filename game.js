// アステル教授の植物学実習帳：ゲームの動作（図鑑とレシピは game-data.js を編集）
const STORAGE='asterBotanicalJournal_v2';
const DAILY_LIMIT=3;
// TESTセーブは通常プレイと完全分離。オン/オフ設定だけを独立保存。
const TEST_SAVE=STORAGE+'_test';
const TEST_MODE_KEY=STORAGE+'_test_enabled';
let testMode=localStorage.getItem(TEST_MODE_KEY)==='true';
const activeSaveKey=()=>testMode?TEST_SAVE:STORAGE;
const lessonLimitReached=()=>!testMode&&getDailyCount()>=DAILY_LIMIT;

const dayKey=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};
const initial=()=>({schema:4,inventory:{},found:[],lessons:0,lessonCounts:{},history:[],completed:false,learnedRecipes:[],craftHistory:[]});
function loadState(){
 try {
  const prev=JSON.parse(localStorage.getItem(activeSaveKey())||'null');if(!prev)return initial();
  const next={...initial(),...prev};
  if((prev.schema||0)<4){
   // Old 046-060 had different names. Do not silently transfer unrelated drugs or research notes.
   next.found=next.found.filter(id=>+id<=45);
   for(let n=46;n<=60;n++)delete next.inventory[String(n).padStart(3,'0')];
   next.learnedRecipes=[];next.craftHistory=[];
  }
  next.schema=4;
  next.found=[...new Set(next.found.filter(id=>ITEMS.some(i=>i.id===id)))];
  next.learnedRecipes=Array.isArray(next.learnedRecipes)?next.learnedRecipes:[];
  next.craftHistory=Array.isArray(next.craftHistory)?next.craftHistory:[];
  return next;
 }catch(e){return initial()}
}
function getDailyCount(){try{const d=JSON.parse(localStorage.getItem(STORAGE+'_daily')||'{}');return d.date===dayKey()?Math.min(DAILY_LIMIT,Math.max(0,Number(d.count)||0)):0}catch{return 0}}
function setDailyCount(count){localStorage.setItem(STORAGE+'_daily',JSON.stringify({date:dayKey(),count}))}
let state=loadState(),selectedLesson='',selectedMethod='',mode='recipes',selected={};
const byId=id=>ITEMS.find(i=>i.id===id);
const recipeById=id=>POTIONS.find(p=>p.id===id);
const iconFor=item=>!item?'❔':(+item.id>=46?'⚗️':+item.id>=36?'🧪':'🌿');
const imagePath=item=>item?.image||`images/${item.id}.png`;
function specimenMarkup(item,locked=false){
 if(locked||!item)return `<div class="specimen specimen-photo"><span class="specimen-fallback specimen-fallback-visible">❔</span></div>`;
 const icon=iconFor(item);
 return `<div class="specimen specimen-photo"><img src="${imagePath(item)}" alt="${item.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="specimen-fallback">${icon}</span></div>`;
}
function save(){localStorage.setItem(activeSaveKey(),JSON.stringify(state));renderStats();renderDailyLimit()}
function record(text,meta={}){state.history.unshift({time:new Date().toLocaleString('ja-JP'),text,...meta});state.history=state.history.slice(0,120)}
function renderStats(){const n=state.found.length;document.getElementById('found').textContent=`${n} / ${ITEMS.length}`;document.getElementById('progress').style.width=`${n/ITEMS.length*100}%`;document.getElementById('possessed').textContent=Object.values(state.inventory).reduce((a,b)=>a+(Number(b)||0),0);document.getElementById('lessons').textContent=state.lessons}
function renderDailyLimit(){const n=getDailyCount(),end=lessonLimitReached();document.getElementById('dailyLimit').textContent=testMode?'🧪 TESTモード：授業回数は無制限（通常プレイの残り回数は消費しません）':end?`本日の授業：${n} / 3 回（本日の授業は終了しました）`:`本日の授業：${n} / 3 回（残り${3-n}回）`;document.querySelectorAll('[data-lesson],[data-method]').forEach(b=>b.disabled=end);const f=document.getElementById('craftFree');if(f)f.disabled=end;document.querySelectorAll('[data-craft]').forEach(b=>b.disabled=end||b.dataset.ready!=='true');const toggle=document.getElementById('testModeToggle');if(toggle){toggle.textContent=testMode?'🧪 TESTモード：ON':'🧪 TESTモード：OFF';toggle.setAttribute('aria-pressed',String(testMode));toggle.classList.toggle('test-active',testMode)}document.getElementById('testModeDescription').textContent=testMode?'テスト専用セーブでプレイ中。通常の図鑑・所持品には影響しません。':'通常プレイ：1日3回まで';document.body.classList.toggle('test-mode',testMode)}
function toggleTestMode(){
 // 初回TEST起動のみ通常データを複製。以降はテスト専用データを継続利用。
 if(!testMode&&!localStorage.getItem(TEST_SAVE))localStorage.setItem(TEST_SAVE,JSON.stringify(state));
 testMode=!testMode;
 localStorage.setItem(TEST_MODE_KEY,String(testMode));
 state=loadState();selected={};selectedLesson='';selectedMethod='';
 document.getElementById('methodBox').classList.add('hidden');document.getElementById('craftBox').classList.add('hidden');document.getElementById('result').classList.add('hidden');
 document.querySelectorAll('[data-lesson]').forEach(b=>b.classList.remove('active'));
 save();renderCraft();renderInventory();renderCatalog();renderRecords();showPage('class');renderDailyLimit();
}

function rank(item){return item.rarity.length}
function chooseItem(lesson,method){const allowed=(METHODS[lesson]||[]).find(m=>m.id===method)?.pool||[];let pool=allowed.map(byId).filter(Boolean).filter(i=>lesson==='野外調査'||(rank(i)<=3&&GREENHOUSE_IDS.includes(i.id)));if(!pool.length)return null;
 const chance=lesson==='温室実習'?{1:60,2:30,3:10}:{1:40,2:30,3:20,4:8,5:2};const ranks=[...new Set(pool.map(rank))];let total=ranks.reduce((a,r)=>a+chance[r],0),v=Math.random()*total;let chosenRank=ranks[ranks.length-1];for(const r of ranks){v-=chance[r];if(v<0){chosenRank=r;break}}pool=pool.filter(i=>rank(i)===chosenRank);return pool[Math.floor(Math.random()*pool.length)]}
function spendLesson(type){if(lessonLimitReached())return false;if(!testMode)setDailyCount(getDailyCount()+1);state.lessons++;state.lessonCounts[type]=(state.lessonCounts[type]||0)+1;return true}
function acquire(id){state.inventory[id]=(state.inventory[id]||0)+1;const first=!state.found.includes(id);if(first)state.found.push(id);return first}
function showResult(html){const el=document.getElementById('result');el.classList.remove('hidden');el.innerHTML=html;el.scrollIntoView({behavior:'smooth',block:'nearest'})}
function setLesson(lesson){if(lessonLimitReached())return;selectedLesson=lesson;document.querySelectorAll('[data-lesson]').forEach(b=>b.classList.toggle('active',b.dataset.lesson===lesson));document.getElementById('result').classList.add('hidden');document.getElementById('craftResult').classList.add('hidden');document.getElementById('methodBox').classList.toggle('hidden',lesson==='薬草調合');document.getElementById('craftBox').classList.toggle('hidden',lesson!=='薬草調合');if(lesson==='薬草調合'){renderCraft();return}document.getElementById('methodChoices').innerHTML=METHODS[lesson].map(m=>`<button class="choice" data-method="${m.id}"><strong>${m.title}</strong><small>${m.desc}</small></button>`).join('');document.querySelectorAll('[data-method]').forEach(b=>b.addEventListener('click',()=>gather(b.dataset.method)));renderDailyLimit()}
// 発見したアイテムのレア度に合うセリフを1つ選ぶ。
// 同じアイテムを再度採取したときも毎回抽選する。
function pickGatherQuote(item){
 const rarity=rank(item);
 const choices=PROFESSOR_GATHER_QUOTES[rarity] || PROFESSOR_GATHER_QUOTES[1];
 return choices[Math.floor(Math.random()*choices.length)];
}
function gather(methodId){if(lessonLimitReached()){renderDailyLimit();return}const item=chooseItem(selectedLesson,methodId);if(!item)return;if(!spendLesson(selectedLesson))return;const first=acquire(item.id);record(`${selectedLesson}で${item.name}を${first?'初発見':'採取'}した`,{item:item.id,lesson:selectedLesson,first});save();renderInventory();renderCatalog();renderRecords();showResult(`<div class="itemhead">${specimenMarkup(item)}<div><span class="tag gold">${item.rarity}</span><h2>${item.name}</h2><span class="muted">No. ${item.id} · ${first?'初発見':'再入手'}</span></div></div><div class="teacher"><strong>アステル教授</strong><br>「${pickGatherQuote(item)}」</div><p>${item.description}</p><p>所持数：${state.inventory[item.id]}</p><div class="actions"><button class="btn secondary" id="toCatalog">図鑑を見る</button></div>`);document.getElementById('toCatalog').addEventListener('click',()=>showPage('catalog'));renderDailyLimit()}
const recipeNames=r=>Object.entries(r).map(([id,n])=>`${byId(id).name} ×${n}`).join(' ＋ ');
const enough=r=>Object.entries(r).every(([id,n])=>(state.inventory[id]||0)>=n);
const unlocked=p=>p.level==='特殊薬'?state.found.includes(p.id):state.found.includes(p.unlock);
function renderCraft(){
 document.getElementById('tabRecipes').classList.toggle('active',mode==='recipes');document.getElementById('tabFree').classList.toggle('active',mode==='free');document.getElementById('recipePanel').classList.toggle('hidden',mode!=='recipes');document.getElementById('ingredientPanel').classList.toggle('hidden',mode!=='free');
 document.getElementById('recipePanel').innerHTML='<div class="grid" style="margin-top:14px">'+POTIONS.map(p=>{const open=unlocked(p),secret=p.level==='特殊薬';const ready=open&&enough(p.recipe)&&!lessonLimitReached();return `<article class="item"><div class="num">${p.id} · ${p.level}</div><h3>${secret&&!open?'？？？':p.name}</h3><p>${secret&&!open?p.hint:open?recipeNames(p.recipe):`🔒 解放条件：${byId(p.unlock).name}を初めて発見する`}</p><p class="muted">${secret&&!open?'レシピ未発見':open?'レシピ解放済み':'未解放'}</p>${open?`<button class="btn secondary" data-craft="${p.id}" data-ready="${ready}" ${ready?'':'disabled'}>調合する</button>`:''}</article>`}).join('')+'</div>';
 document.querySelectorAll('[data-craft]').forEach(b=>b.addEventListener('click',()=>craft(recipeById(b.dataset.craft).recipe)));
 document.getElementById('ingredientList').innerHTML=ITEMS.slice(0,45).map(i=>{const have=state.inventory[i.id]||0,n=Math.min(selected[i.id]||0,have);if(n)selected[i.id]=n;else delete selected[i.id];return `<div class="ingredient-row ${have?'':'unavailable'}"><span>${i.name}<small class="muted"> (所持${have})</small></span><span class="qtybuttons"><button data-add="${i.id}" data-step="-1" ${!n?'disabled':''} aria-label="${i.name}を減らす">−</button><span class="qtycount">${n}</span><button data-add="${i.id}" data-step="1" ${n>=have?'disabled':''} aria-label="${i.name}を増やす">＋</button></span></div>`}).join('');
 document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>{let id=b.dataset.add;selected[id]=Math.min(state.inventory[id]||0,Math.max(0,(selected[id]||0)+Number(b.dataset.step)));if(!selected[id])delete selected[id];renderCraft()}));
 document.getElementById('selectedSummary').textContent=Object.keys(selected).length?`選択中：${recipeNames(selected)}`:'素材を選択してください。所持数0の素材は選択できません。';renderDailyLimit();
}
// 調合専用の結果欄。レシピ選択より上に表示します。
function showCraftResult(html){
 const el=document.getElementById('craftResult');
 el.classList.remove('hidden');
 el.innerHTML=html;
 el.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function pickCraftQuote(success,firstSpecial=false){
 const type=firstSpecial?'discovery':success?'success':'failure';
 const quotes=PROFESSOR_CRAFT_QUOTES[type];
 return quotes[Math.floor(Math.random()*quotes.length)];
}
function craft(recipe){if(lessonLimitReached()){showCraftResult('本日の授業は終了しました。');renderDailyLimit();return}
 const chosen=Object.entries(recipe).filter(([,n])=>n>0);
 if(!chosen.length){showCraftResult('素材を選択してください。');return}
 if(chosen.some(([id,n])=>!Number.isSafeInteger(n)||n<1||!byId(id)||+id>45||(state.inventory[id]||0)<n)){showCraftResult('素材が足りません。所持数0の素材は選択できません。');renderCraft();return}
 // Materials are consumed for both success and failure, then one daily use is spent.
 if(!spendLesson('薬草調合'))return;
 for(const [id,n] of chosen)state.inventory[id]-=n;
 const potion=POTIONS.find(p=>Object.keys(p.recipe).length===chosen.length&&chosen.every(([id,n])=>p.recipe[id]===n));
 const first=potion?!state.found.includes(potion.id):false;
 if(potion){acquire(potion.id);record(`調合成功：${potion.name}${first?'（新レシピ発見）':''}`,{item:potion.id,lesson:'薬草調合',first,ingredients:{...recipe}});const potionItem=byId(potion.id)||{id:potion.id,name:potion.name,rarity:'',category:'調合薬・香油'};showCraftResult(`<div class="itemhead">${specimenMarkup(potionItem)}<div>${potionItem.rarity?`<span class="tag gold">${potionItem.rarity}</span>`:''}<h2>⚗️ ${first&&potion.level==='特殊薬'?'特殊薬のレシピを発見！':'調合成功！'}</h2><div class="muted">No. ${potion.id} · ${potion.name}</div></div></div><div class="teacher"><strong>アステル教授</strong><br>「${pickCraftQuote(true,first&&potion.level==='特殊薬')}」</div><p><strong>${potion.name}</strong>を1個獲得しました。</p><p>素材は消費されました。</p>`)}
 else{record('調合失敗：素材を消費した',{lesson:'薬草調合',first:false,ingredients:{...recipe}});showCraftResult(`<h2>調合失敗</h2><div class="teacher"><strong>アステル教授</strong><br>「${pickCraftQuote(false)}」</div><p>魔力の定着に失敗しました。使用した素材はすべて消費されました。</p>`)}
 selected={};save();renderCraft();renderInventory();renderCatalog();renderRecords();renderDailyLimit();
}
function itemCard(i,locked=false){let n=state.inventory[i.id]||0,secret=+i.id>=56,hide=locked&&secret;return `<article class="item ${locked?'locked':''}"><div class="itemhead">${specimenMarkup(i,locked)}<div><div class="num">NO. ${i.id}</div><h3>${locked?'？？？':i.name}</h3><span class="tag">${locked?'未発見':i.category}</span>${!locked?`<span class="tag gold">${i.rarity}</span>`:''}</div></div><p>${locked?(hide?'未知の特殊薬。自由調合で発見しましょう。':'まだ図鑑に登録されていません。'):i.description}</p>${!locked?`<div class="count">所持数：${n}</div>`:''}</article>`}
function renderInventory(){let cat=document.getElementById('invCategory').value,q=document.getElementById('invSearch').value.toLowerCase();let list=ITEMS.filter(i=>(state.inventory[i.id]||0)>0&&(!cat||cat===i.category)&&i.name.toLowerCase().includes(q));document.getElementById('inventoryGrid').innerHTML=list.length?list.map(i=>itemCard(i)).join(''):'<div class="empty">まだ所持しているアイテムがありません。</div>'}
function renderCatalog(){let cat=document.getElementById('catCategory').value,q=document.getElementById('catSearch').value.toLowerCase(),status=document.getElementById('catStatus').value;let list=ITEMS.filter(i=>(!cat||i.category===cat)&&(status==='all'||(status==='found')===state.found.includes(i.id))&&(i.name.toLowerCase().includes(q)||i.id.includes(q)));document.getElementById('catalogGrid').innerHTML=list.map(i=>itemCard(i,!state.found.includes(i.id))).join('')||'<div class="empty">該当するアイテムはありません。</div>'}
function renderRecords(){document.getElementById('recordSummary').innerHTML=`授業回数：${state.lessons}回<br>図鑑：${state.found.length} / 60 種類<br>調合薬の発見：${state.found.filter(id=>+id>=46).length} / 15 種類`;document.getElementById('recordList').innerHTML=state.history.length?state.history.map(h=>`<div class="item" style="margin-top:8px"><strong>${h.text||'過去の授業記録'}</strong><div class="muted">${h.time||''} · ${h.lesson||''}</div>${h.ingredients?`<p class="muted">使用した素材：${recipeNames(h.ingredients)}</p>`:''}</div>`).join(''):'<div class="empty">まだ研究記録はありません。</div>'}
function showPage(page){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('hidden',p.id!=='page-'+page));document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));if(page==='inventory')renderInventory();if(page==='catalog')renderCatalog();if(page==='records')renderRecords();window.scrollTo({top:0,behavior:'smooth'})}
function fillCategories(){const cats=[...new Set(ITEMS.map(i=>i.category))];for(const id of ['invCategory','catCategory'])for(const cat of cats){const option=document.createElement('option');option.value=cat;option.textContent=cat;document.getElementById(id).appendChild(option)}}
document.getElementById('testModeToggle').addEventListener('click',toggleTestMode);
document.querySelectorAll('[data-lesson]').forEach(b=>b.addEventListener('click',()=>setLesson(b.dataset.lesson)));
document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
for(const id of ['invCategory','invSearch'])document.getElementById(id).addEventListener('input',renderInventory);
for(const id of ['catCategory','catSearch','catStatus'])document.getElementById(id).addEventListener('input',renderCatalog);
document.getElementById('tabRecipes').addEventListener('click',()=>{mode='recipes';renderCraft()});document.getElementById('tabFree').addEventListener('click',()=>{mode='free';renderCraft()});document.getElementById('craftFree').addEventListener('click',()=>craft({...selected}));document.getElementById('clearSelection').addEventListener('click',()=>{selected={};renderCraft()});
document.getElementById('exportBtn').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({...state,daily:{date:dayKey(),count:getDailyCount()}},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='aster-botanical-save.json';a.click();URL.revokeObjectURL(a.href)});
document.getElementById('importBtn').addEventListener('click',()=>document.getElementById('importFile').click());
document.getElementById('importFile').addEventListener('change',async e=>{let f=e.target.files[0];if(!f)return;try{let incoming=JSON.parse(await f.text());if(!incoming.inventory||!Array.isArray(incoming.found))throw Error();state={...initial(),...incoming};if(state.schema!==4){state.found=state.found.filter(id=>+id<=45);for(let n=46;n<=60;n++)delete state.inventory[String(n).padStart(3,'0')];state.schema=4}state.found=[...new Set(state.found.filter(id=>byId(id)))];selected={};if(!testMode&&incoming.daily?.date===dayKey())setDailyCount(Math.max(getDailyCount(),Math.min(3,Number(incoming.daily.count)||0)));save();renderCraft();renderInventory();renderCatalog();renderRecords();alert('セーブデータを読み込みました。')}catch{alert('読み込めないセーブデータです。')}e.target.value=''});
document.getElementById('resetBtn').addEventListener('click',()=>{
 // 現在のモードの全進捗を消去。TESTから通常プレイの記録は変更しない。
 if(!confirm('全てリセットされますがいいですか？'))return;
 state=initial();
 selected={};selectedLesson='';selectedMethod='';mode='recipes';
 if(!testMode)setDailyCount(0); // 通常モードの当日授業回数も 0/3 に戻す
 document.querySelectorAll('[data-lesson]').forEach(b=>b.classList.remove('active'));
 document.getElementById('methodBox').classList.add('hidden');
 document.getElementById('craftBox').classList.add('hidden');
 document.getElementById('result').classList.add('hidden');
 save();renderCraft();renderInventory();renderCatalog();renderRecords();renderDailyLimit();
 showPage('class');
});
fillCategories();renderStats();renderDailyLimit();renderInventory();renderCatalog();renderRecords();
