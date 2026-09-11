function el(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstElementChild;}
function textVal(id){return document.getElementById(id)?.value?.trim()||"";}
function numVal(id){const n=parseInt(textVal(id),10);return Number.isFinite(n)?n:0;}
function clampNonNegative(n){return Number.isFinite(n)?Math.max(0,n):0;}
function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

const SIZE_TABLE={
  Tiny:{crew:5,hp:80,armor:0,traits:0,weaponSets:0},
  Small:{crew:10,hp:160,armor:0,traits:0,weaponSets:2},
  Medium:{crew:20,hp:240,armor:0,traits:1,weaponSets:4},
  Large:{crew:40,hp:320,armor:4,traits:2,weaponSets:8},
  Huge:{crew:80,hp:400,armor:8,traits:3,weaponSets:12},
  Gargantuan:{crew:120,hp:480,armor:16,traits:4,weaponSets:16}
};

function updateFromSize(){
  const size=document.getElementById('vs_size').value||"";
  const info=SIZE_TABLE[size];
  const hpAdded=clampNonNegative(numVal('vs_hpAdded'));
  const armorAdded=clampNonNegative(numVal('vs_armorAdded'));
  document.getElementById('vs_hpAdded').value=hpAdded;
  document.getElementById('vs_armorAdded').value=armorAdded;
  document.getElementById('vs_crew').value=info?info.crew:"";
  document.getElementById('vs_traitsAvail').value=info?info.traits:"";
  document.getElementById('vs_weaponSets').value=info?info.weaponSets:"";
  document.getElementById('vs_hp').value=info?(info.hp+hpAdded):"";
  document.getElementById('vs_armorSlots').value=info?(info.armor+armorAdded):"";
}

function baseChecksForTier(tier){
  const t=String(tier||"").trim();
  if(t==="1")return"1d8+4d6";if(t==="2")return"2d8+3d6";
  if(t==="3")return"3d8+2d6";if(t==="4")return"4d8+1d6";
  return"";
}
function parseDiceExpr(expr){
  const out={d8:0,d6:0};
  if(!expr)return out;
  expr.split('+').map(s=>s.trim()).forEach(part=>{
    const m=part.match(/^(\d+)\s*d\s*(8|6)$/i);
    if(!m)return;
    const n=parseInt(m[1],10);const die=m[2];
    if(die==="8")out.d8+=n;if(die==="6")out.d6+=n;
  });
  return out;
}
function formatDiceExpr(d){
  const parts=[];
  if(d.d8>0)parts.push(`${d.d8}d8`);if(d.d6>0)parts.push(`${d.d6}d6`);
  return parts.join('+');
}
function computeChecks(tier,elite){
  const base=baseChecksForTier(tier);if(!base)return"";
  const d=parseDiceExpr(base);if(elite)d.d8+=2;return formatDiceExpr(d);
}
function updateShipChecks(){
  const tier=document.getElementById('vs_tier').value;
  document.getElementById('vs_checks').value=baseChecksForTier(tier)||"";
}
function toggleEliteNote(){
  const show=document.getElementById('vs_elite').checked;
  document.getElementById('eliteNote').style.display=show?"block":"none";
}

function addTraitLine(containerId,name="",text=""){
  const row=el(`
    <div class="vs-trait-entry" style="border:1px solid rgba(100,160,255,0.12);border-radius:5px;padding:8px;margin-top:8px;">
      <div class="row">
        <label style="flex:0 0 180px">Trait Name<input type="text" class="traitName" value="${escapeHtml(name)}"></label>
        <label style="flex:1">Description<textarea class="traitText">${escapeHtml(text)}</textarea></label>
        <button type="button" onclick="this.closest('.vs-trait-entry').remove()">Delete</button>
      </div>
      <div class="row" style="margin-top:6px">
        <button type="button" class="addTraitBulletBtn" onclick="addTraitBullet(this)">+ Add Bullet</button>
      </div>
      <div class="traitBullets"></div>
    </div>`);
  document.getElementById(containerId).appendChild(row);
}
function addTraitBullet(btn,text=""){
  const holder=btn.closest('.vs-trait-entry').querySelector('.traitBullets');
  const bullet=el(`
    <div class="row" style="margin-top:6px">
      <label style="flex:1">Bullet<textarea class="traitBullet">${escapeHtml(text)}</textarea></label>
      <button type="button" onclick="this.parentElement.remove()">X</button>
    </div>`);
  holder.appendChild(bullet);
}

function addTaskSection(title="New Task Section",desc=""){
  const sec=el(`<div class="vs-task-entry" style="border:1px solid rgba(100,160,255,0.12);border-radius:5px;padding:8px;margin-top:8px;">
    <div class="row" style="align-items:center">
      <label style="flex:1">Section Title<input type="text" class="taskTitle" value="${escapeHtml(title)}"></label>
      <button type="button" onclick="addTaskRow(this)">+ Add Bullet</button>
      <button type="button" onclick="this.closest('.vs-task-entry').remove()">Delete</button>
    </div>
    <label>Description<textarea class="taskDesc">${escapeHtml(desc)}</textarea></label>
    <div class="rows"></div>
  </div>`);
  document.getElementById('taskSections').appendChild(sec);
  return sec;
}
function addTaskRow(btnOrSec,bullet=""){
  const rows=(btnOrSec.classList?btnOrSec.closest('.vs-task-entry').querySelector('.rows'):btnOrSec.querySelector('.rows'));
  const row=el(`<div class="row" style="margin-top:6px">
    <label style="flex:1">Bullet/Text<textarea class="taskBullet">${escapeHtml(bullet)}</textarea></label>
    <button type="button" onclick="this.parentElement.remove()">X</button>
  </div>`);
  rows.appendChild(row);
}

function render(){
  const elite=document.getElementById('vs_elite').checked;
  const tasks=elite?"4":"3";
  const rawName=textVal('vs_name')||'Veilstrider';
  const name=elite?`Elite ${rawName}`:rawName;
  const tier=document.getElementById('vs_tier').value||"";
  const size=document.getElementById('vs_size').value||"";
  const hp=textVal('vs_hp'),maxCrew=textVal('vs_crew'),armor=textVal('vs_armorSlots');
  const shipChecks=computeChecks(tier,elite);
  const weaponsInstalled=textVal('vs_weaponsInstalled');

  let traitRows=[...document.querySelectorAll('#traitsList > .vs-trait-entry')].map(g=>{
    const n=g.querySelector('.traitName')?.value?.trim();
    const t=g.querySelector('.traitText')?.value?.trim();
    const bullets=[...g.querySelectorAll('.traitBullet')].map(b=>b.value.trim()).filter(Boolean);
    if(!n&&!t&&bullets.length===0)return null;
    return{n,t,bullets};
  }).filter(Boolean);

  if(elite){
    traitRows.unshift({
      n:"Elite Veilstrider",
      t:"Adjust Boost and Shake Off suffer a −3 modifier against this veilstrider.",
      bullets:[]
    });
  }

  const hasTraits=traitRows.length>0;

  const sections=[...document.querySelectorAll('#taskSections > .vs-task-entry')].map(g=>{
    const title=g.querySelector('.taskTitle')?.value||'';
    const desc=g.querySelector('.taskDesc')?.value?.trim()||'';
    const bullets=[...g.querySelectorAll('.taskBullet')].map(b=>b.value.trim()).filter(Boolean);
    return{title,desc,bullets};
  }).filter(s=>s.title||s.desc||(s.bullets&&s.bullets.length));

  const props=[
    hp?`<span class="prop"><b>HP</b><span>${escapeHtml(hp)}</span></span>`:"",
    maxCrew?`<span class="prop"><b>Crew</b><span>${escapeHtml(maxCrew)}</span></span>`:"",
    `<span class="prop"><b>Tasks</b><span>${tasks}</span></span>`,
    shipChecks?`<span class="prop"><b>Checks</b><span>${escapeHtml(shipChecks)}</span></span>`:"",
    armor?`<span class="prop"><b>Armor</b><span>${escapeHtml(armor)}</span></span>`:"",
    size?`<span class="prop"><b>Size</b><span>${escapeHtml(size)}</span></span>`:""
  ].filter(Boolean).join("");

  const weaponsLine=weaponsInstalled
    ?`<div class="weapons-line"><b>Weapons Installed:</b> ${escapeHtml(weaponsInstalled)}</div>`:"";

  const traitsHtml=traitRows.map(({n,t,bullets})=>{
    let line="";
    if(n&&t)line=`<div class="trait-line"><b>${escapeHtml(n)}:</b> ${escapeHtml(t)}</div>`;
    else if(n)line=`<div class="trait-line"><b>${escapeHtml(n)}.</b></div>`;
    else if(t)line=`<div class="trait-line">${escapeHtml(t)}</div>`;
    const bl=bullets?.length?`<ul class="trait-bullets">${bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join("")}</ul>`:"";
    return`<div class="col-item">${line}${bl}</div>`;
  }).join("");

  const tasksHtml=sections.map(sec=>{
    const desc=sec.desc?`<div class="task-desc">${escapeHtml(sec.desc)}</div>`:"";
    const bullets=sec.bullets?.length?`<ul class="bullets">${sec.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join("")}</ul>`:"";
    return`<div class="col-item"><div class="task-subtitle">${escapeHtml(sec.title)}</div>${desc}${bullets}</div>`;
  }).join('');

  // Build one continuous flow of blocks (section titles + items), then
  // balance them across two columns by measured height so neither column
  // ends with a large run of empty space.
  const flowHtml=(hasTraits?`<div class="section-title">Traits</div>${traitsHtml}`:"")
    +`<div class="section-title">Veilstrider Tasks</div>${tasksHtml}`;

  const html=`<div id="statcard" class="statcard"><div class="statpad">
    <div class="hdr">
      <div class="hdr-top">
        <div class="name">${escapeHtml(name)}</div>
        <div class="tier">${tier?`Tier ${escapeHtml(tier)}`:""}</div>
      </div>
      <div class="props-row">${props}</div>
      ${weaponsLine}
    </div>
    <div class="twocol">
      <div class="col" id="vsColA">${flowHtml}</div>
      <div class="col" id="vsColB"></div>
    </div>
  </div></div>`;

  document.getElementById('out').innerHTML=html;
  balanceStatColumns();
}

function blockOuterHeight(el){
  const cs=getComputedStyle(el);
  return el.getBoundingClientRect().height
    +(parseFloat(cs.marginTop)||0)
    +(parseFloat(cs.marginBottom)||0);
}

function balanceStatColumns(){
  const colA=document.getElementById('vsColA');
  const colB=document.getElementById('vsColB');
  if(!colA||!colB)return;
  const blocks=[...colA.children];
  if(blocks.length<3){colB.remove();colA.classList.add('col-span-2');return;}

  const heights=blocks.map(blockOuterHeight);
  const total=heights.reduce((a,b)=>a+b,0);

  // Find the split index that makes the two column heights as equal as possible.
  let best=blocks.length,bestDiff=Infinity,run=0;
  for(let i=1;i<blocks.length;i++){
    run+=heights[i-1];
    const diff=Math.abs(run-(total-run));
    if(diff<bestDiff){bestDiff=diff;best=i;}
  }

  // Never strand a section title at the bottom of column A —
  // push it to the top of column B instead.
  while(best>1&&blocks[best-1].classList.contains('section-title'))best--;

  // If the balanced split puts everything in one column, don't split at all.
  if(best>=blocks.length){colB.remove();colA.classList.add('col-span-2');return;}

  for(let i=best;i<blocks.length;i++)colB.appendChild(blocks[i]);
}

function collectState(){
  return{
    fields:{
      name:textVal('vs_name'),
      elite:document.getElementById('vs_elite').checked,
      tier:document.getElementById('vs_tier').value||"",
      size:document.getElementById('vs_size').value||"",
      hpAdded:String(clampNonNegative(numVal('vs_hpAdded'))),
      armorAdded:String(clampNonNegative(numVal('vs_armorAdded'))),
      weaponsInstalled:textVal('vs_weaponsInstalled')
    },
    traits:[...document.querySelectorAll('#traitsList > .vs-trait-entry')].map(g=>({
      name:g.querySelector('.traitName')?.value||'',
      text:g.querySelector('.traitText')?.value||'',
      bullets:[...g.querySelectorAll('.traitBullet')].map(b=>b.value||'')
    })),
    tasks:[...document.querySelectorAll('#taskSections > .vs-task-entry')].map(g=>({
      title:g.querySelector('.taskTitle')?.value||'',
      desc:g.querySelector('.taskDesc')?.value||'',
      bullets:[...g.querySelectorAll('.taskBullet')].map(t=>t.value||'')
    }))
  };
}
function restoreState(data){
  if(!data)return;
  const f=data.fields||{};
  document.getElementById('vs_name').value=f.name||'';
  document.getElementById('vs_elite').checked=!!f.elite;
  document.getElementById('vs_tier').value=f.tier||'';
  document.getElementById('vs_size').value=f.size||'';
  document.getElementById('vs_hpAdded').value=clampNonNegative(parseInt(f.hpAdded,10)||0);
  document.getElementById('vs_armorAdded').value=clampNonNegative(parseInt(f.armorAdded,10)||0);
  document.getElementById('vs_weaponsInstalled').value=f.weaponsInstalled||"";
  toggleEliteNote(); updateShipChecks(); updateFromSize();
  document.getElementById('traitsList').innerHTML='';
  (data.traits||[]).forEach(t=>{
    addTraitLine('traitsList',t.name||'',t.text||'');
    const last=document.querySelector('#traitsList > div:last-child');
    (t.bullets||[]).forEach(b=>{
      const btn=last.querySelector('.addTraitBulletBtn');
      addTraitBullet(btn,b);
    });
  });
  document.getElementById('taskSections').innerHTML='';
  (data.tasks||[]).forEach(s=>{
    const sec=addTaskSection(s.title||'',s.desc||'');
    (s.bullets||[]).forEach(b=>addTaskRow(sec,b));
  });
}
function saveJson(){
  const blob=new Blob([JSON.stringify(collectState(),null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  const base=textVal('vs_name')||'Veilstrider';
  a.download=`${base}-veilstrider.json`;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},0);
}
function loadJson(file){
  if(!file)return;
  const r=new FileReader();
  r.onload=()=>{try{restoreState(JSON.parse(r.result));}catch(e){alert('Invalid .json');}};
  r.readAsText(file);
}
function downloadJPEG(){
  const node=document.getElementById('statcard');
  if(!node){alert('Generate the stat block first.');return;}
  html2canvas(node,{backgroundColor:'#ffffff',scale:2}).then(canvas=>{
    const a=document.createElement('a');
    const elite=document.getElementById('vs_elite').checked;
    const base=textVal('vs_name')||'Veilstrider';
    a.download=elite?`Elite ${base} Stat Block.jpg`:`${base} Stat Block.jpg`;
    a.href=canvas.toDataURL('image/jpeg',0.95);
    a.click();
  });
}
function clearOutput(){document.getElementById('out').innerHTML='';}

toggleEliteNote(); updateShipChecks(); updateFromSize();

    // ─── Online Tools dropdown ───
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
      }
    });
