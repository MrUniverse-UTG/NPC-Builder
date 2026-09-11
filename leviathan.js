function el(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstElementChild;}
function textVal(id){return document.getElementById(id)?.value?.trim()||"";}
function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

const SIZE_TABLE={
  Small:     {hp:280,sorce:40, attackDamage:20,skill:"4d8+2d6",oppMod:"-2"},
  Medium:    {hp:400,sorce:60, attackDamage:30,skill:"5d8+1d6",oppMod:"-2"},
  Large:     {hp:500,sorce:80, attackDamage:40,skill:"6d8",    oppMod:"-3"},
  Huge:      {hp:660,sorce:100,attackDamage:50,skill:"7d8",    oppMod:"-3"},
  Gargantuan:{hp:880,sorce:120,attackDamage:60,skill:"8d8",    oppMod:"-4"}
};

function updateFromSize(){
  const size=document.getElementById('lv_size').value||"";
  const info=SIZE_TABLE[size];
  document.getElementById('lv_hp').value=info?info.hp:"";
  document.getElementById('lv_mpSorce').value=info?info.sorce:"";
  document.getElementById('lv_power').value=info?info.attackDamage:"";
  document.getElementById('lv_skillDice').value=info?info.skill:"";
  document.getElementById('lv_oppMod').value=info?info.oppMod:"";
}

function addTraitLine(containerId,name="",text=""){
  const row=el(`
    <div class="lv-trait-entry" style="border:1px solid rgba(100,160,255,0.12);border-radius:5px;padding:8px;margin-top:8px;">
      <div class="row">
        <label style="flex:0 0 180px">Trait Name<input type="text" class="traitName" value="${escapeHtml(name)}"></label>
        <label style="flex:1">Description<textarea class="traitText">${escapeHtml(text)}</textarea></label>
        <button type="button" onclick="this.closest('.lv-trait-entry').remove()">Delete Trait</button>
      </div>
      <div class="row" style="margin-top:6px">
        <button type="button" class="addTraitBulletBtn" onclick="addTraitBullet(this)">+ Add Bullet</button>
      </div>
      <div class="traitBullets"></div>
    </div>`);
  document.getElementById(containerId).appendChild(row);
}
function addTraitBullet(btn,text=""){
  const holder=btn.closest('.lv-trait-entry').querySelector('.traitBullets');
  const bullet=el(`
    <div class="row" style="margin-top:6px">
      <label style="flex:1">Bullet<textarea class="traitBullet">${escapeHtml(text)}</textarea></label>
      <button type="button" onclick="this.parentElement.remove()">X</button>
    </div>`);
  holder.appendChild(bullet);
}

function addActionSection(title="New Action Section",desc=""){
  const sec=el(`<div class="lv-action-entry" style="border:1px solid rgba(100,160,255,0.12);border-radius:5px;padding:8px;margin-top:8px;">
    <div class="row" style="align-items:center">
      <label style="flex:1">Section Title<input type="text" class="actionTitle" value="${escapeHtml(title)}"></label>
      <button type="button" onclick="addActionRow(this)">+ Add Bullet</button>
      <button type="button" onclick="this.closest('.lv-action-entry').remove()">Delete Section</button>
    </div>
    <label>Description<textarea class="actionDesc">${escapeHtml(desc)}</textarea></label>
    <div class="rows"></div>
  </div>`);
  document.getElementById('actionSections').appendChild(sec);
  return sec;
}
function addActionRow(btnOrSec,bullet=""){
  const rows=(btnOrSec.classList?btnOrSec.closest('.lv-action-entry').querySelector('.rows'):btnOrSec.querySelector('.rows'));
  const row=el(`<div class="row" style="margin-top:6px">
    <label style="flex:1">Bullet/Text<textarea class="actionBullet">${escapeHtml(bullet)}</textarea></label>
    <button type="button" onclick="this.parentElement.remove()">X</button>
  </div>`);
  rows.appendChild(row);
}

function render(){
  const name=textVal('lv_name')||"Leviathan";
  const size=document.getElementById('lv_size').value||"";
  const hp=textVal('lv_hp'),sorce=textVal('lv_mpSorce'),skill=textVal('lv_skillDice'),oppMod=textVal('lv_oppMod');
  const tasks="4";

  let traitRows=[...document.querySelectorAll('#traitsList > .lv-trait-entry')].map(g=>{
    const n=g.querySelector('.traitName')?.value?.trim();
    const t=g.querySelector('.traitText')?.value?.trim();
    const bullets=[...g.querySelectorAll('.traitBullet')].map(b=>b.value.trim()).filter(Boolean);
    if(!n&&!t&&bullets.length===0)return null;
    return{n,t,bullets};
  }).filter(Boolean);

  const autoTraits=[
    {n:"Leviathan Might",t:"This creature Opposes all checks made to Adjust Boost and Shake Off. It is immune to Spells that force movement or inflict conditions. It takes half damage from Spells of rank 5 or lower and is immune to damage from non-siege weapons.",bullets:[]},
    {n:"Mythic Creature",t:"When this creature takes damage, it may spend 10 Sorce Points to halve the damage taken. On its turn, this creature may spend 10 Sorce Points to gain a fifth task this round.",bullets:[]}
  ];
  const traitsAll=[...autoTraits,...traitRows];

  const actions=[...document.querySelectorAll('#actionSections > .lv-action-entry')].map(g=>{
    const title=g.querySelector('.actionTitle')?.value||'';
    const desc=g.querySelector('.actionDesc')?.value?.trim()||'';
    const bullets=[...g.querySelectorAll('.actionBullet')].map(b=>b.value.trim()).filter(Boolean);
    return{title,desc,bullets};
  }).filter(a=>a.title||a.desc||(a.bullets&&a.bullets.length));

  const props=[
    hp?`<div class="prop"><b>HP</b><span>${escapeHtml(hp)}</span></div>`:"",
    sorce?`<div class="prop"><b>Sorce</b><span>${escapeHtml(sorce)}</span></div>`:"",
    oppMod?`<div class="prop"><b>Oppose</b><span>${escapeHtml(oppMod)}</span></div>`:"",
    `<div class="prop"><b>Tasks</b><span>${tasks}</span></div>`,
    skill?`<div class="prop"><b>Dice</b><span>${escapeHtml(skill)}</span></div>`:"",
    size?`<div class="prop"><b>Size</b><span>${escapeHtml(size)}</span></div>`:""
  ].filter(Boolean).join("");

  const traitsHtml=traitsAll.map(({n,t,bullets})=>{
    let line="";
    if(n&&t)line=`<div class="trait-line"><b>${escapeHtml(n)}:</b> ${escapeHtml(t)}</div>`;
    else if(n)line=`<div class="trait-line"><b>${escapeHtml(n)}.</b></div>`;
    else if(t)line=`<div class="trait-line">${escapeHtml(t)}</div>`;
    const bl=bullets?.length?`<ul class="trait-bullets">${bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join("")}</ul>`:"";
    return`<div class="col-item">${line}${bl}</div>`;
  }).join("");

  const actionsHtml=actions.map(act=>{
    const desc=act.desc?`<div class="action-desc">${escapeHtml(act.desc)}</div>`:"";
    const bullets=act.bullets?.length?`<ul class="bullets">${act.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join("")}</ul>`:"";
    return`<div class="col-item"><div class="action-subtitle">${escapeHtml(act.title)}</div>${desc}${bullets}</div>`;
  }).join("");

  // One continuous flow of blocks: traits section then actions section.
  // balanceStatColumns() splits it across two columns by measured height.
  const flowHtml=(traitsHtml?`<div class="section-title">Leviathan Traits</div>${traitsHtml}`:"")
    +(actionsHtml?`<div class="section-title">Leviathan Actions</div>${actionsHtml}`:"");

  const html=`<div id="statcard" class="statcard"><div class="statpad">
    <div class="hdr">
      <div class="hdr-top"><div class="name">${escapeHtml(name)}</div><div class="right"></div></div>
      <div class="props-row">${props}</div>
    </div>
    <div class="twocol">
      <div class="col" id="lvColA">${flowHtml}</div>
      <div class="col" id="lvColB"></div>
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
  const colA=document.getElementById('lvColA');
  const colB=document.getElementById('lvColB');
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
    fields:{name:textVal('lv_name'),size:document.getElementById('lv_size').value||""},
    traits:[...document.querySelectorAll('#traitsList > .lv-trait-entry')].map(g=>({
      name:g.querySelector('.traitName')?.value||'',
      text:g.querySelector('.traitText')?.value||'',
      bullets:[...g.querySelectorAll('.traitBullet')].map(b=>b.value||'')
    })),
    actions:[...document.querySelectorAll('#actionSections > .lv-action-entry')].map(g=>({
      title:g.querySelector('.actionTitle')?.value||'',
      desc:g.querySelector('.actionDesc')?.value||'',
      bullets:[...g.querySelectorAll('.actionBullet')].map(t=>t.value||'')
    }))
  };
}

function restoreState(data){
  if(!data)return;
  const f=data.fields||{};
  document.getElementById('lv_name').value=f.name||'';
  document.getElementById('lv_size').value=f.size||'';
  updateFromSize();
  document.getElementById('traitsList').innerHTML='';
  (data.traits||[]).forEach(t=>{
    addTraitLine('traitsList',t.name||'',t.text||'');
    const last=document.querySelector('#traitsList > .lv-trait-entry:last-child');
    (t.bullets||[]).forEach(b=>{
      const btn=last.querySelector('.addTraitBulletBtn');
      addTraitBullet(btn,b);
    });
  });
  document.getElementById('actionSections').innerHTML='';
  (data.actions||[]).forEach(a=>{
    const sec=addActionSection(a.title||'',a.desc||'');
    (a.bullets||[]).forEach(b=>addActionRow(sec,b));
  });
}

function saveJson(){
  const blob=new Blob([JSON.stringify(collectState(),null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  const base=textVal('lv_name')||'Leviathan';
  a.download=`${base}-leviathan.json`;
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
    const base=textVal('lv_name')||'Leviathan';
    a.download=`${base} Leviathan Stat Block.jpg`;
    a.href=canvas.toDataURL('image/jpeg',0.95);
    a.click();
  });
}
function clearOutput(){document.getElementById('out').innerHTML='';}

updateFromSize();

    // ─── Online Tools dropdown ───
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
      }
    });
