function toggleSpellcasting() {
  document.getElementById("spellSection").style.display =
    document.getElementById("spellToggle").checked ? "block" : "none";
}

function addSpellCheck() {
  const container = document.getElementById("spellChecksList");
  const div = document.createElement("div");
  div.style.marginBottom = "6px";
  div.innerHTML = `
    <label>Spell Check:
      <select class="spellSource" onchange="toggleStudyInput(this)">
        <option value="Study of">Study of</option>
        <option value="Innate">Innate</option>
      </select>
    </label>
    <input type="text" class="studyOf" placeholder="Study of Sorcery" style="margin-top: 4px;">
    <input type="text" class="spellInset" placeholder="Dice Pool">
    <button onclick="this.parentElement.remove()">X</button>
  `;
  container.appendChild(div);
  toggleStudyInput(div.querySelector("select"));
}

function toggleStudyInput(select) {
  const container = select.closest("div");
  const studyInput = container.querySelector(".studyOf");
  studyInput.style.display = select.value === "Study of" ? "block" : "none";
}

function addSpell() {
  const container = document.getElementById("spellsList");
  const div = document.createElement("div");
  div.style.marginBottom = "8px";
  div.innerHTML = `
    <label>Rank: <input type="text" class="spellRank" style="width:50px;"></label>
    <label>Spells:<br>
      <textarea class="spellName" placeholder="Enter spells for this rank, separated by commas" style="width:300px; height:60px;"></textarea>
    </label>
    <button onclick="this.parentElement.remove()">X</button>
    <br>`;
  container.appendChild(div);
}

function addStandardAction() {
  const container = document.getElementById("standard");
  const wrapper = document.createElement("div");
  wrapper.style.marginBottom = "8px";
  const uniqueId = Date.now();
  wrapper.innerHTML = `
    <hr>
    <label><input type="radio" name="actionType${uniqueId}" value="attack" onchange="toggleStandardActionFields(this)"> Attack</label>
    <label><input type="radio" name="actionType${uniqueId}" value="ability" onchange="toggleStandardActionFields(this)"> Ability</label>
    <div class="standardFields"></div>
    <button onclick="this.closest('div').remove()">Delete Action</button>
  `;
  container.appendChild(wrapper);
}

function toggleStandardActionFields(radio) {
  const wrapper = radio.closest("div");
  const target = wrapper.querySelector(".standardFields");
  if (radio.value === "attack") {
    target.innerHTML = `
      <label><input type="text" class="atkName" placeholder="Attack Name"> <input type="text" class="atkFeat" placeholder="Feature(s)" style="width:60%; font-style:italic;"></label><br>
      <label>To Hit:<br><input type="text" class="atkHit"></label><br>
      <label>Damage:<br><input type="text" class="atkDmg"></label><br>
      <label>Effect:<br><textarea class="atkEff" rows="3" style="width:100%"></textarea></label><br>`;
  } else {
    target.innerHTML = `
      <label><input type="text" class="abilName" placeholder="Ability Name">
        <label>Effect:<br>
        <textarea class="abilEff" placeholder="Effect" style="width:90%; min-height:60px;"></textarea></label><br>

      <label class="toggle-label" style="margin-top:4px;">
        <input type="checkbox" class="hasSaveReq" onchange="toggleSaveReq(this)">
        Skill Save?
      </label>
      <div class="saveReqBox" style="display:none; margin-top:4px;">
        <label>Skill Save:<br>
          <input type="text" class="saveReqText" placeholder="Describe the save (e.g. Move save to reduce damage)" style="width:90%;">
        </label>
      </div>

      <label class="toggle-label" style="margin-top:4px;">
        <input type="checkbox" class="hasChargeReq" onchange="toggleChargeReq(this)">
        Does this need to meet a condition?
      </label>
      <div class="chargeReqBox" style="display:none; margin-top:4px;">
        <label>Charging Requirement:<br>
          <input type="text" class="chargeReqText" placeholder="Describe the condition" style="width:90%;">
        </label>
      </div>

      <div class="chargeText" style="font-style:italic; margin-top:4px;">
        This ability must be CHARGED to use.<br>
        Once this ability is used 3 times, it can no longer be used until this creature finishes an Intermission.
      </div>`;
  }
}

function toggleChargeReq(checkbox) {
  const box = checkbox.closest("div").querySelector(".chargeReqBox");
  if (box) box.style.display = checkbox.checked ? "block" : "none";
}

function toggleSaveReq(checkbox) {
  const box = checkbox.closest("div").querySelector(".saveReqBox");
  if (box) box.style.display = checkbox.checked ? "block" : "none";
}
function spellcastingHTML() {
  if (!document.getElementById("spellToggle").checked) return "";

  let checkLines = "";
  const checks = document.querySelectorAll("#spellChecksList > div");
  checks.forEach(div => {
    const source = div.querySelector(".spellSource")?.value || "";
    const inset = div.querySelector(".spellInset")?.value || "";
    const study = div.querySelector(".studyOf")?.value || "";
    if (source === "Study of") {
      checkLines += `<div class="no-break">Spell Check (Study of): ${study} ${inset}</div>`;
    } else {
      checkLines += `<div class="no-break">Spell Check (Innate): ${inset}</div>`;
    }
  });

  let spellLines = "";
  const spells = [...document.querySelectorAll("#spellsList > div")];
  spells.forEach(sp => {
    const rank = sp.querySelector(".spellRank")?.value || "";
    const name = sp.querySelector(".spellName")?.value || "";
    if (rank || name) spellLines += `<div class="no-break">Rank ${rank}: ${name}</div>`;
  });

  if (!checkLines && !spellLines) return "";
  return `<div class="section-title">Spells Prepared:</div>${checkLines}${spellLines}`;
}

function standardActionsHTML() {
  let inner = "";

  document.querySelectorAll("#standard > div").forEach(container => {
    let block = "";
    if (container.querySelector(".atkName")) {
      const name = container.querySelector(".atkName").value;
      const feat = container.querySelector(".atkFeat").value;
      const hit = container.querySelector(".atkHit").value;
      const dmg = container.querySelector(".atkDmg").value;
      const eff = container.querySelector(".atkEff").value;
      block += `<b>${name}</b>: <i>${feat}</i><br>`;
      if (hit) block += `To Hit: ${hit}<br>`;
      if (dmg) block += `Damage: ${dmg}<br>`;
      if (eff) block += `Effect: ${eff}<br>`;
    } else if (container.querySelector(".abilName")) {
      const name = container.querySelector(".abilName").value;
      const eff = container.querySelector(".abilEff").value;
      const saveReqBox = container.querySelector(".hasSaveReq");
      const saveText = container.querySelector(".saveReqText")?.value || "";
      const chargeReqBox = container.querySelector(".hasChargeReq");
      const chargeText = container.querySelector(".chargeReqText")?.value || "";
      block += `<b>${name}</b>: ${eff}<br>`;
      if (saveReqBox?.checked && saveText) {
        block += `<i>Skill Save:</i> ${saveText}<br>`;
      }
      if (chargeReqBox?.checked && chargeText) {
        block += `<i>Charging Requirement:</i> ${chargeText}<br>`;
      }
      block += `<i>This ability must be CHARGED to use.</i><br>`;
    }
    if (block) inner += `<div class="no-break">${block}</div>`;
  });

  if (!inner) return "";
  return `<div class="section-title">Standard Actions:</div>${inner}`;
}

function renderStatBlock() {
  const name = document.getElementById("name").value;
  const cl = document.getElementById("cl").value;
  const isMythic = document.getElementById("mythicToggle").checked;
  let typeSize = document.getElementById("typeSize").value;
  if (isMythic && !typeSize.toLowerCase().startsWith("mythic")) {
    typeSize = "Mythic " + typeSize;
  }
  const theme = document.getElementById("theme").value;
  let hp = parseInt(document.getElementById("hp").value) || 0;
  let dp = parseInt(document.getElementById("dp").value) || 0;
  let mp = parseInt(document.getElementById("mp").value) || 0;
  let sorce = document.getElementById("sorce").value;

  if (isMythic) {
    hp = Math.floor(hp * 1.5);
    dp = Math.floor(dp * 1.5);
    mp = Math.floor(mp * 1.5);
    sorce = mp;
    document.getElementById("passiveToggle").checked = true;
    document.getElementById("passives").style.display = "block";

    const mythicTraits = [
      {
        name: "Mythic Checks",
        text: "This creature can spend up to 6 Sorce when making a skill or spell check, gaining a +1 modifier for every 2 Sorce spent."
      },
      {
        name: "Mythic Oppose",
        text: "This creature can spend up to 18 Sorce when opposing a skill check, inflicting an additional -1 modifier for every 6 sorce spent."
      },
      {
        name: "Mythic Save",
        text: `When this creature fails a skill save, it can spend ${Math.floor(mp / 5)} Sorce to gain 1 success on that save.`
      }
    ];

    const passiveDiv = document.getElementById("passives");
    mythicTraits.forEach(trait => {
      const exists = [...passiveDiv.querySelectorAll("input")].some(input => input.value.trim() === trait.name);
      if (!exists) {
        const div = document.createElement("div");
        div.innerHTML = `
          <label>Name: <input type="text" class="entryName" value="${trait.name}" style="width:200px;"></label><br>
          <textarea rows="2" style="width:90%;">${trait.text}</textarea> <button onclick="this.parentElement.remove()">X</button>`;
        passiveDiv.appendChild(div);
      }
    });
  }

  let hasAbility = false;
  document.querySelectorAll(".abilName").forEach(a => {
    if (a.value || a.closest("div").querySelector(".abilEff")?.value) hasAbility = true;
  });

  const quickChecked = document.getElementById("quickToggle").checked;
  const quickEnabled = hasAbility || quickChecked;
  if (quickEnabled) {
    document.getElementById("quick").style.display = "block";
    document.getElementById("quickToggle").checked = true;
    if (hasAbility) document.getElementById("chargingAction").style.display = "block";
  }

  function getVal(id, label) {
    const v = document.getElementById(id)?.value;
    return v ? `<b>${label}</b> ${v}<br>` : "";
  }

  let traitsHTML = "";
  traitsHTML += getVal("hpRes", "HP Resistance:");
  traitsHTML += getVal("hpVul", "HP Vulnerability:");
  traitsHTML += getVal("hpImm", "HP Immunity:");
  traitsHTML += getVal("mpRes", "MP Resistance:");
  traitsHTML += getVal("mpVul", "MP Vulnerability:");
  traitsHTML += getVal("mpImm", "MP Immunity:");
  traitsHTML += getVal("dpRes", "DP Resistance:");
  traitsHTML += getVal("dpVul", "DP Vulnerability:");
  traitsHTML += getVal("dpImm", "DP Immunity:");
  traitsHTML += getVal("condImm", "Condition Immunity:");
  traitsHTML += getVal("speed", "Speed:");
  traitsHTML += getVal("langs", "Languages:");
  traitsHTML += getVal("senses", "Senses:");

  const quickActions = [];

  if (hasAbility) {
    quickActions.push(`<b>Charging:</b> This creature begins charging an ability. After one full round, that ability becomes CHARGED. Once used, it is no longer CHARGED. Each CHARGED ability can be used up to 3 times before requiring an Intermission.`);
  }

  document.querySelectorAll("#quick > div").forEach(div => {
    if (div.querySelector("textarea")) {
      const name = div.querySelector(".entryName")?.value || "";
      const text = div.querySelector("textarea")?.value || "";
      if (name || text) quickActions.push(`<b>${name}</b>: ${text}`);
    }
  });

  const quickHTML = quickActions.length
    ? `<div class="section-title">Quick Actions:</div>${quickActions.map(q => `<div class="no-break">${q}</div>`).join("")}`
    : "";

  // Identity block: name / type / CL / theme, the HP line, and the skills
  // table. Kept as ONE block so it never gets split, and placed first in the
  // flow so it always sits at the top of column 1 (block 0 is never moved).
  const headerHTML = `<div class="no-break">
      <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:20px; border-bottom:2px solid black; margin-bottom:10px;">
        <div><div>${name}</div><div style="font-size:14px;">${typeSize}</div></div>
        <div style="text-align:right;"><div>CL ${cl}</div><div style="font-size:14px;">${theme}</div></div>
      </div>
      <div style="font-size:14px;">
        <b>HP:</b> ${hp} | <b>DP:</b> ${dp} | <b>MP:</b> ${mp}
        ${sorce || isMythic ? `| <b>Sorce:</b> ${sorce}` : ""}
      </div>
      ${condensedSkillsTable()}
    </div>`;

  // One continuous flow of blocks. balanceStatColumns() splits it across two
  // columns by measured height so neither column ends in dead whitespace.
  const flowHTML = [
    headerHTML,
    traitsHTML ? `<div class="no-break">${traitsHTML}</div>` : "",
    sectionHTML("passives", "Traits"),
    spellcastingHTML(),
    standardActionsHTML(),
    quickHTML,
    sectionHTML("reaction", "Reactions")
  ].join("");

  const output = `
    <div style="font-family:'Literata', serif; font-size:16px; padding:8px; border:2px solid #000; background:#fff; color:#111;">
      <div class="sb-twocol">
        <div class="sb-col" id="sbColA">${flowHTML}</div>
        <div class="sb-col" id="sbColB"></div>
      </div>
    </div>
  `;

  document.getElementById("renderedOutput").innerHTML = output;
  document.getElementById("renderedOutput").style.display = "block";
  // Must run AFTER display:block — heights measure as 0 while hidden.
  balanceStatColumns();
}

function blockOuterHeight(el) {
  const cs = getComputedStyle(el);
  return el.getBoundingClientRect().height
    + (parseFloat(cs.marginTop) || 0)
    + (parseFloat(cs.marginBottom) || 0);
}

function balanceStatColumns() {
  const colA = document.getElementById("sbColA");
  const colB = document.getElementById("sbColB");
  if (!colA || !colB) return;
  const blocks = [...colA.children];
  // Nothing to split. Column B stays in the DOM (empty) so the grid keeps two
  // columns and the skills table stays at column width rather than stretching.
  if (blocks.length < 2) return;

  const heights = blocks.map(blockOuterHeight);
  const total = heights.reduce((a, b) => a + b, 0);

  // Find the split index that makes the two column heights as equal as possible.
  // i starts at 1, so the identity block (name/CL/HP/skills) always stays in
  // column 1.
  let best = blocks.length, bestDiff = Infinity, run = 0;
  for (let i = 1; i < blocks.length; i++) {
    run += heights[i - 1];
    const diff = Math.abs(run - (total - run));
    if (diff < bestDiff) { bestDiff = diff; best = i; }
  }

  // Never strand a section title at the bottom of column A —
  // push it to the top of column B instead.
  while (best > 1 && blocks[best - 1].classList.contains("section-title")) best--;

  if (best >= blocks.length) return;

  for (let i = best; i < blocks.length; i++) colB.appendChild(blocks[i]);
}

function downloadImage() {
  const node = document.querySelector("#renderedOutput");
  if (!node || node.style.display === "none" || node.innerHTML.trim() === "") {
    renderStatBlock();
  }
  const scale = 3;
  html2canvas(document.querySelector("#renderedOutput"), {
    backgroundColor: "#fff",
    scale: scale,
    useCORS: true,
    allowTaint: true
  }).then(canvas => {
    const link = document.createElement('a');
    const name = document.getElementById("name").value.trim() || "Creature";
    const filename = `${name} Stat Block`.replace(/[^a-z0-9_\- ]/gi, '');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  });
}

function calcMod(input) {
  const attr = input.dataset.attr;
  const attrVal = parseInt(document.getElementById(attr).value) || 0;
  const base = parseInt(input.value) || 0;
  const modifier = Math.floor((base + attrVal) / 3);
  const display = modifier === 0 ? "(0)" : `(-${modifier})`;
  input.parentElement.parentElement.querySelector(".mod").textContent = display;
}

function updateAllModifiers() {
  document.querySelectorAll(".skillBase").forEach(input => calcMod(input));
}

function toggleSection(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === "none" ? "block" : "none";
}

function addField(section) {
  const container = document.getElementById(section);
  const div = document.createElement("div");
  div.innerHTML = `<label>Name: <input type="text" class="entryName" style="width:200px;"></label><br>
    <textarea rows="2" style="width:90%;"></textarea> <button onclick="this.parentElement.remove()">X</button>`;
  container.appendChild(div);
}

function condensedSkillsTable() {
  const pairs = [
    { leftAttr: "STR", rightAttr: "AGI" },
    { leftAttr: "WIT", rightAttr: "EMP" }
  ];
  const attrNames = { STR: "STRENGTH", AGI: "AGILITY", WIT: "WITS", EMP: "EMPATHY" };
  let html = `<table border="1" cellpadding="4" style="border-collapse:collapse; width:100%; margin-bottom:10px;">`;
  pairs.forEach(pair => {
    const leftVal = parseInt(document.getElementById(pair.leftAttr).value) || 0;
    const rightVal = parseInt(document.getElementById(pair.rightAttr).value) || 0;
    html += `<tr style="background:#eee;">
      <th>${attrNames[pair.leftAttr]}</th>
      <th>${leftVal}</th>
      <th>${attrNames[pair.rightAttr]}</th>
      <th>${rightVal}</th>
    </tr>`;
    const leftSkills = skills[pair.leftAttr];
    const rightSkills = skills[pair.rightAttr];
    const maxLen = Math.max(leftSkills.length, rightSkills.length);
    for (let i = 0; i < maxLen; i++) {
      const lSkill = leftSkills[i];
      const rSkill = rightSkills[i];
      const lRow = [...document.querySelectorAll("#skillsTable tr")].find(r => r.children[0].textContent === lSkill);
      const rRow = [...document.querySelectorAll("#skillsTable tr")].find(r => r.children[0].textContent === rSkill);
      const lVal = lRow ? parseInt(lRow.querySelector("input").value) : "";
      const lMod = lRow ? lRow.querySelector(".mod").textContent : "";
      const rVal = rRow ? parseInt(rRow.querySelector("input").value) : "";
      const rMod = rRow ? rRow.querySelector(".mod").textContent : "";
      html += `<tr>
        <td>${lSkill || ""}</td><td>${lVal} ${lMod}</td>
        <td>${rSkill || ""}</td><td>${rVal} ${rMod}</td>
      </tr>`;
    }
  });
  html += "</table>";
  return html;
}

function sectionHTML(sectionId, title) {
  const toggle = document.getElementById(sectionId + "Toggle");
  const section = document.getElementById(sectionId);
  if (!section || (toggle && !toggle.checked)) return "";
  const entries = [...section.querySelectorAll("div")].filter(div => div.querySelector("textarea"));
  if (entries.length === 0) return "";
  let inner = "";
  entries.forEach(div => {
    const name = div.querySelector(".entryName")?.value || "";
    const text = div.querySelector("textarea")?.value || "";
    if (text || name) inner += `<div class="no-break"><b>${name}</b>: ${text}</div>`;
  });
  if (!inner) return "";
  return `<div class="section-title">${title}</div>${inner}`;
}

const skills = {
  STR: ["Brawl", "Might", "Endure", "Intimidate"],
  AGI: ["Shoot", "Move", "Finesse", "Hide"],
  WIT: ["Analyze", "Insight", "Scout", "Survival"],
  EMP: ["Manipulate", "Perform", "Medical", "Tame"]
};

function initSkills() {
  const tbody = document.getElementById("skillsTable");
  tbody.innerHTML = "";
  for (const [attr, skillList] of Object.entries(skills)) {
    skillList.forEach(skill => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${skill}</td>
        <td><input type="number" value="0" class="skillBase" data-attr="${attr}" style="width:50px;" onchange="calcMod(this)"></td>
        <td>${attr}</td>
        <td class="mod">(0)</td>
      `;
      tbody.appendChild(tr);
    });
  }
  updateAllModifiers();
}

// ─── SAVE ───
function saveStatJSON() {
  const data = {
    npcGenerator: true,
    version: 1,
    tracker: collectTrackerState(),
    generator: collectStructuredState()
  };
  const name = (document.getElementById('name')?.value || document.getElementById('npcName')?.value || 'Creature').trim() || 'Creature';
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}-npc.json`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

// ─── LOAD ───
// Accepts the merged Tracker+Generator format this tool now saves, and
// remains backwards compatible with .json files from the standalone
// Stat Block Generator that predated the merge (they have no "tracker" key).
function loadStatJSON(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data && data.generator && data.tracker) {
        restoreStructuredState(data.generator);
        restoreTrackerState(data.tracker);
      } else if (data && data.keyed) {
        restoreStructuredState(data);
      } else {
        alert("This doesn't look like an NPC Generator .json file.");
        return;
      }
    } catch (e) {
      alert("Could not read this file. Is it a valid NPC Generator .json?");
      console.error(e);
    }
  };
  reader.readAsText(file);
}

// ─── COLLECT ───
function collectStructuredState() {
  const ids = [
    "name","cl","typeSize","theme","hp","dp","mp","sorce",
    "STR","AGI","WIT","EMP",
    "hpRes","hpVul","hpImm","mpRes","mpVul","mpImm","dpRes","dpVul","dpImm",
    "condImm","speed","langs","senses",
    "mythicToggle","spellToggle","passiveToggle","quickToggle","reactionToggle"
  ];
  const keyed = {};
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    keyed[id] = (el.type === "checkbox") ? el.checked : el.value;
  });

  const skillsData = [];
  document.querySelectorAll("#skillsTable tr").forEach(tr => {
    const skill = tr.children[0]?.textContent?.trim();
    const base = tr.querySelector("input.skillBase")?.value;
    if (skill) skillsData.push({ skill, base: Number(base || 0) });
  });

  const passivesData = [];
  document.querySelectorAll("#passives > div").forEach(div => {
    const name = div.querySelector(".entryName")?.value || "";
    const text = div.querySelector("textarea")?.value || "";
    if (name || text) passivesData.push({ name, text });
  });

  const spellChecks = [];
  document.querySelectorAll("#spellChecksList > div").forEach(div => {
    spellChecks.push({
      source: div.querySelector(".spellSource")?.value || "Study of",
      study:  div.querySelector(".studyOf")?.value  || "",
      inset:  div.querySelector(".spellInset")?.value || ""
    });
  });

  const spells = [];
  document.querySelectorAll("#spellsList > div").forEach(div => {
    spells.push({
      rank:  div.querySelector(".spellRank")?.value || "",
      names: div.querySelector(".spellName")?.value || ""
    });
  });

  const standard = [];
  document.querySelectorAll("#standard > div").forEach(wrap => {
    const isAttack = !!wrap.querySelector(".atkName");
    const isAbility = !!wrap.querySelector(".abilName");
    if (isAttack) {
      standard.push({
        type: "attack",
        name: wrap.querySelector(".atkName")?.value || "",
        feat: wrap.querySelector(".atkFeat")?.value || "",
        hit: wrap.querySelector(".atkHit")?.value || "",
        dmg: wrap.querySelector(".atkDmg")?.value || "",
        eff: wrap.querySelector(".atkEff")?.value || ""
      });
    } else if (isAbility) {
      standard.push({
        type: "ability",
        name: wrap.querySelector(".abilName")?.value || "",
        eff:  wrap.querySelector(".abilEff")?.value || "",
        hasSave:  !!wrap.querySelector(".hasSaveReq")?.checked,
        saveTxt:   wrap.querySelector(".saveReqText")?.value || "",
        hasCharge: !!wrap.querySelector(".hasChargeReq")?.checked,
        chargeTxt: wrap.querySelector(".chargeReqText")?.value || ""
      });
    }
  });

  const quick = [];
  document.querySelectorAll("#quick > div").forEach(div => {
    const name = div.querySelector(".entryName")?.value || "";
    const text = div.querySelector("textarea")?.value || "";
    if (name || text) quick.push({ name, text });
  });

  const reactions = [];
  document.querySelectorAll("#reaction > div").forEach(div => {
    const name = div.querySelector(".entryName")?.value || "";
    const text = div.querySelector("textarea")?.value || "";
    if (name || text) reactions.push({ name, text });
  });

  return { version: 2, keyed, skillsData, passivesData, spellChecks, spells, standard, quick, reactions };
}

// ─── RESTORE ───
function restoreStructuredState(state) {
  if (!state) return;

  document.getElementById("passives").innerHTML = `<button onclick="addField('passives')">Add Trait</button>`;
  document.getElementById("spellChecksList").innerHTML = "";
  document.getElementById("spellsList").innerHTML = "";

  const std = document.getElementById("standard");
  [...std.querySelectorAll(":scope > div")].forEach(d => d.remove());

  document.getElementById("quick").innerHTML = `
    <b>Quick Actions:</b>
    <button onclick="addField('quick')">Add Quick Action</button>
    <div id="chargingAction" style="display:none;">
      <b>Charging:</b> This creature begins charging an ability. After one full round, that ability becomes CHARGED. Once used, it is no longer CHARGED.
    </div>`;

  document.getElementById("reaction").innerHTML = `
    <b>Reactions:</b>
    <button onclick="addField('reaction')">Add Reaction</button>`;

  Object.entries(state.keyed || {}).forEach(([id, v]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === "checkbox") el.checked = !!v;
    else el.value = v;
  });

  toggleSpellcasting();
  ["passives", "quick", "reaction"].forEach(id => {
    const t = document.getElementById(id + "Toggle");
    if (t) document.getElementById(id).style.display = t.checked ? "block" : "none";
  });

  state.skillsData?.forEach(({skill, base}) => {
    const row = [...document.querySelectorAll("#skillsTable tr")]
      .find(r => r.children[0]?.textContent?.trim() === skill);
    if (row) {
      const inp = row.querySelector("input.skillBase");
      if (inp) { inp.value = Number(base || 0); calcMod(inp); }
    }
  });
  updateAllModifiers();

  (state.passivesData || []).forEach(({name, text}) => {
    addField("passives");
    const last = document.querySelector("#passives > div:last-child");
    last.querySelector(".entryName").value = name || "";
    last.querySelector("textarea").value = text || "";
  });
  if ((state.passivesData || []).length > 0) {
    document.getElementById("passiveToggle").checked = true;
    document.getElementById("passives").style.display = "block";
  }

  (state.spellChecks || []).forEach(({source, study, inset}) => {
    addSpellCheck();
    const last = document.querySelector("#spellChecksList > div:last-child");
    last.querySelector(".spellSource").value = source || "Study of";
    toggleStudyInput(last.querySelector(".spellSource"));
    const s = last.querySelector(".studyOf");
    if (s) s.value = study || "";
    last.querySelector(".spellInset").value = inset || "";
  });

  (state.spells || []).forEach(({rank, names}) => {
    addSpell();
    const last = document.querySelector("#spellsList > div:last-child");
    last.querySelector(".spellRank").value = rank || "";
    last.querySelector(".spellName").value = names || "";
  });

  (state.standard || []).forEach(act => {
    addStandardAction();
    const wrap = document.querySelector("#standard > div:last-child");
    const radios = wrap.querySelectorAll(`input[type="radio"]`);
    const target = [...radios].find(r => r.value === (act.type === "attack" ? "attack" : "ability"));
    if (target) { target.checked = true; toggleStandardActionFields(target); }

    if (act.type === "attack") {
      wrap.querySelector(".atkName").value = act.name || "";
      wrap.querySelector(".atkFeat").value = act.feat || "";
      wrap.querySelector(".atkHit").value  = act.hit  || "";
      wrap.querySelector(".atkDmg").value  = act.dmg  || "";
      wrap.querySelector(".atkEff").value  = act.eff  || "";
    } else {
      wrap.querySelector(".abilName").value = act.name || "";
      wrap.querySelector(".abilEff").value  = act.eff  || "";
      const saveCb = wrap.querySelector(".hasSaveReq");
      if (saveCb) { saveCb.checked = !!act.hasSave; toggleSaveReq(saveCb); const st = wrap.querySelector(".saveReqText"); if (st) st.value = act.saveTxt || ""; }
      const chCb = wrap.querySelector(".hasChargeReq");
      if (chCb) { chCb.checked = !!act.hasCharge; toggleChargeReq(chCb); const ct = wrap.querySelector(".chargeReqText"); if (ct) ct.value = act.chargeTxt || ""; }
    }
  });

  (state.quick || []).forEach(({name, text}) => {
    addField("quick");
    const last = document.querySelector("#quick > div:last-child");
    last.querySelector(".entryName").value = name || "";
    last.querySelector("textarea").value = text || "";
  });

  (state.reactions || []).forEach(({name, text}) => {
    addField("reaction");
    const last = document.querySelector("#reaction > div:last-child");
    last.querySelector(".entryName").value = name || "";
    last.querySelector("textarea").value = text || "";
  });

  let hasAbility = false;
  document.querySelectorAll(".abilName").forEach(a => {
    if (a.value || a.closest("div").querySelector(".abilEff")?.value) hasAbility = true;
  });
  if (hasAbility) {
    document.getElementById("quickToggle").checked = true;
    document.getElementById("quick").style.display = "block";
    const charging = document.getElementById("chargingAction");
    if (charging) charging.style.display = "block";
  }
}

window.onload = function() {
  // A browser reload can restore stale values on static fields (especially
  // checkboxes), which desyncs toggles like "Traits?" from their hidden
  // section. Force every field back to its markup default before anything
  // else runs, so a refresh always starts from a clean slate.
  document.querySelectorAll('#panelGenerator input, #panelTracker input').forEach(el => {
    if (el.type === 'checkbox') el.checked = false;
    else if (el.type !== 'file') el.value = el.defaultValue;
  });
  ['passives', 'quick', 'reaction', 'spellSection'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });

  initSkills();
  initCLDropdown();
  document.getElementById('themeSelect').value = 'Brute';
  handleCLChange();
};
let summaryImageData = null;

  const themeConfigs = {
    Brute:      { hpPerCL: 5, dpPerCL: 1, mpPerCL: 1 },
    Marksman:   { hpPerCL: 1, dpPerCL: 3, mpPerCL: 3 },
    Skirmisher: { hpPerCL: 2, dpPerCL: 4, mpPerCL: 1 },
    Lurker:     { hpPerCL: 2, dpPerCL: 3, mpPerCL: 2 },
    Tactician:  { hpPerCL: 1, dpPerCL: 2, mpPerCL: 4 },
    Spellcaster:{ hpPerCL: 2, dpPerCL: 1, mpPerCL: 4 }
  };

  const attrPointsTable = [3,4,5,6,6,7,7,7,7,8,8,8,8,8,9,9,9,10,10,10,10,11,12,12,12,12,13,13,13,13,14,14,15];
  const maxAttrRankTable = [4,4,4,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,8,8,8,8,8,8,8,8,8,8];
  const skillPointsTable = [3,4,5,7,8,9,10,11,12,13,15,16,17,18,19,20,22,23,24,25,26,27,29,30,31,32,33,34,35,36,37,38,39];
  const maxSkillRankTable = [1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,7,8,8,8,8,8];

  const getAttrPoints = cl => attrPointsTable[cl+2] ?? 0;
  const getMaxAttrRank = cl => maxAttrRankTable[cl+2] ?? 0;
  const getSkillPoints = cl => skillPointsTable[cl+2] ?? 0;
  const getMaxSkillRank = cl => maxSkillRankTable[cl+2] ?? 0;

  function getBuildPointsForCL(cl) {
    if (cl >= -2 && cl <= 0)  return 10;
    if (cl >= 1  && cl <= 5)  return 20;
    if (cl >= 6  && cl <= 10) return 40;
    if (cl >= 11 && cl <= 15) return 70;
    if (cl >= 16 && cl <= 20) return 110;
    if (cl >= 21 && cl <= 25) return 160;
    if (cl >= 26 && cl <= 30) return 220;
    return 0;
  }

  function initCLDropdown() {
    const sel = document.getElementById('clSelect');
    for (let cl = -2; cl <= 30; cl++) {
      const opt = document.createElement('option');
      opt.value = cl; opt.textContent = cl;
      sel.appendChild(opt);
    }
    sel.value = "-2";
  }

  function addTalent() {
    const list = document.getElementById('talentList');
    const div = document.createElement('div');
    div.className = 'bp-entry';
    div.innerHTML = `
      <textarea placeholder="Describe feature..."></textarea>
      <input type="number" class="bp-cost" placeholder="BP" oninput="recalculateBP()" />
      <button class="bp-remove" onclick="this.parentElement.remove(); recalculateBP()">✕</button>
    `;
    list.appendChild(div);
  }

  function recalculateBP() {
    const bpMax = parseInt(document.getElementById('bpMax').value) || 0;
    let total = 0;
    document.querySelectorAll('#talentList .bp-cost').forEach(inp => {
      const v = parseInt(inp.value);
      if (!isNaN(v)) total += v;
    });
    document.getElementById('bpSpent').value = total;

    const pct = bpMax > 0 ? Math.min((total / bpMax) * 100, 100) : 0;
    const fill = document.getElementById('bpBarFill');
    fill.style.width = pct + '%';
    fill.classList.toggle('over', total > bpMax);
    document.getElementById('bpBarLabel').textContent = `${total} / ${bpMax}`;
  }

  function updateDamageMultipliers() {
    const bd = parseFloat(document.getElementById('baseDamage').value) || 0;
    ['bd25','bd50','bd150','bd200','bd250','bd300'].forEach((id, i) => {
      const mult = [0.25, 0.5, 1.5, 2, 2.5, 3][i];
      document.getElementById(id).textContent = Math.max(Math.floor(bd * mult), 0);
    });
  }

  function updatePowerRatingFromCLAndChange() {
    const cl = parseInt(document.getElementById('clSelect').value);
    if (isNaN(cl)) return;
    const change = parseInt(document.getElementById('baseDamageChange').value) || 0;
    const basePR = Math.max(cl + 7, 1);
    let finalPR = Math.max(basePR + change, 1);
    document.getElementById('baseDamage').value = finalPR;
    updateDamageMultipliers();
  }

  function handlePowerChangeChange() { updatePowerRatingFromCLAndChange(); }

  function updateBuildPointsFromCL() {
    const cl = parseInt(document.getElementById('clSelect').value);
    document.getElementById('bpMax').value = isNaN(cl) ? '' : getBuildPointsForCL(cl);
    recalculateBP();
  }

  function updateAttributePointsFromCLAndChange() {
    const cl = parseInt(document.getElementById('clSelect').value);
    if (isNaN(cl)) { document.getElementById('attrPoints').value = ''; return; }
    const change = parseInt(document.getElementById('attrPointChange').value) || 0;
    document.getElementById('attrPoints').value = Math.max(getAttrPoints(cl) + change, 0);
    document.getElementById('maxAttrRank').value = getMaxAttrRank(cl);
    validateAttributeAllocation();
  }

  function handleAttrPointChange() { updateAttributePointsFromCLAndChange(); }

  function validateAttributeAllocation() {
    const cap = parseInt(document.getElementById('attrPoints').value) || 0;
    const ids = ['attrStr','attrAgi','attrWit','attrEmp'];
    let total = 0;
    ids.forEach(id => {
      let v = parseInt(document.getElementById(id).value) || 0;
      if (v < 0) { v = 0; document.getElementById(id).value = 0; }
      total += v;
    });
    const msg = document.getElementById('attrValidMsg');
    ids.forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('over','under');
      if (total > cap) el.classList.add('over');
      else if (total < cap) el.classList.add('under');
    });
    if (total > cap) msg.textContent = `Over by ${total - cap} point(s)`;
    else if (total < cap) msg.textContent = `${cap - total} point(s) remaining`;
    else { msg.textContent = ''; }
  }

  function updateSkillsFromCLAndChange() {
    const cl = parseInt(document.getElementById('clSelect').value);
    if (isNaN(cl)) { document.getElementById('skillPoints').value = ''; return; }
    const change = parseInt(document.getElementById('skillPointChange').value) || 0;
    document.getElementById('skillPoints').value = Math.max(getSkillPoints(cl) + change, 0);
    document.getElementById('maxSkillRank').value = getMaxSkillRank(cl);
    validateSkills();
  }

  function handleSkillPointChange() { updateSkillsFromCLAndChange(); }

  function handleSkillInputChange(el) {
    let v = parseInt(el.value);
    if (isNaN(v) || v < 0) { el.value = 0; }
    validateSkills();
  }

  const trackerSkillIds = ['skillBrawl','skillMight','skillEndure','skillIntimidate','skillShoot','skillMove',
    'skillFinesse','skillHide','skillAnalyze','skillInsight','skillScout','skillSurvival',
    'skillManipulate','skillMedical','skillPerform','skillTame'];

  function validateSkills() {
    const maxRank = parseInt(document.getElementById('maxSkillRank').value) || 0;
    const cap = parseInt(document.getElementById('skillPoints').value) || 0;
    let total = 0;
    trackerSkillIds.forEach(id => { total += parseInt(document.getElementById(id).value) || 0; });
    const msg = document.getElementById('skillValidMsg');
    trackerSkillIds.forEach(id => {
      const el = document.getElementById(id);
      const v = parseInt(el.value) || 0;
      el.classList.remove('over','under');
      if (maxRank > 0 && v > maxRank) el.classList.add('over');
      else if (total > cap) el.classList.add('over');
      else if (total < cap) el.classList.add('under');
    });
    if (total > cap) msg.textContent = `Skill points over by ${total - cap}`;
    else if (total < cap) msg.textContent = `${cap - total} skill point(s) remaining`;
    else msg.textContent = '';
  }

  function handleCLChange() {
    updateBuildPointsFromCL();
    updateAttributePointsFromCLAndChange();
    updateSkillsFromCLAndChange();
    recalculateStatusFromTheme();
    updatePowerRatingFromCLAndChange();
  }

  function handleStatusIncreaseChange() {
    let v = parseInt(document.getElementById('statusIncrease').value) || 0;
    v = Math.max(0, Math.min(70, v));
    document.getElementById('statusIncrease').value = v;
    recalculateStatusFromTheme();
  }

  function recalculateStatusFromTheme() {
    const theme = document.getElementById('themeSelect').value;
    const cl = parseInt(document.getElementById('clSelect').value);
    const statusInc = parseInt(document.getElementById('statusIncrease').value) || 0;
    const cfg = themeConfigs[theme];
    if (!cfg || isNaN(cl)) {
      updateBuildPointsFromCL(); updateAttributePointsFromCLAndChange();
      updateSkillsFromCLAndChange(); updatePowerRatingFromCLAndChange();
      return;
    }
    const delta = Math.max(cl - (-2), 0);
    document.getElementById('totalHP').value = 3 + delta * cfg.hpPerCL + statusInc * cfg.hpPerCL;
    document.getElementById('totalDP').value = 3 + delta * cfg.dpPerCL + statusInc * cfg.dpPerCL;
    document.getElementById('totalMP').value = 3 + delta * cfg.mpPerCL + statusInc * cfg.mpPerCL;
    updateBuildPointsFromCL(); updateAttributePointsFromCLAndChange();
    updateSkillsFromCLAndChange(); updatePowerRatingFromCLAndChange();
  }

  function generateSummary() {
    const attrCap  = parseInt(document.getElementById('attrPoints').value) || 0;
    const attrSum  = ['attrStr','attrAgi','attrWit','attrEmp'].reduce((s,id) => s + (parseInt(document.getElementById(id).value)||0), 0);
    if (attrSum !== attrCap) alert('Warning: Attribute Points Allocated (' + attrSum + ') does not equal Attribute Points (' + attrCap + ').');

    const skillCap = parseInt(document.getElementById('skillPoints').value) || 0;
    const skillSum = trackerSkillIds.reduce((s,id) => s + (parseInt(document.getElementById(id).value)||0), 0);
    if (skillSum !== skillCap) alert('Warning: Skill Points Allocated (' + skillSum + ') does not equal Skill Points (' + skillCap + ').');

    const name  = document.getElementById('npcName').value.trim() || 'Unnamed Creature';
    const theme = document.getElementById('themeSelect').value || 'N/A';
    const cl    = document.getElementById('clSelect').value || 'N/A';

    const box = document.createElement('div');
    box.id = 'summaryBox';

    const h2 = document.createElement('h2'); h2.textContent = name; box.appendChild(h2);
    const h3 = document.createElement('h3'); h3.textContent = `Theme: ${theme} · CL ${cl}`; box.appendChild(h3);

    function h4(t) { const e = document.createElement('h4'); e.textContent = t; box.appendChild(e); }
    function line(lbl, val) {
      const v = String(val ?? '');
      if (v === '' || v === 'NaN') return;
      const p = document.createElement('p'); p.textContent = `${lbl}: ${v}`; box.appendChild(p);
    }

    h4('Core Stats');
    line('CL', cl); line('Theme', theme);
    line('Attribute Points', document.getElementById('attrPoints').value);
    line('Max Attribute Rank', document.getElementById('maxAttrRank').value);
    line('Skill Points', document.getElementById('skillPoints').value);
    line('Max Skill Rank', document.getElementById('maxSkillRank').value);
    line('Build Points', document.getElementById('bpMax').value);
    line('Build Points Spent', document.getElementById('bpSpent').value);

    h4('Attribute Allocation');
    line('Strength', document.getElementById('attrStr').value);
    line('Agility', document.getElementById('attrAgi').value);
    line('Wits', document.getElementById('attrWit').value);
    line('Empathy', document.getElementById('attrEmp').value);

    h4('Skills');
    const skillLabels = ['Brawl','Might','Endure','Intimidate','Shoot','Move','Finesse','Hide',
      'Analyze','Insight','Scout','Survival','Manipulate','Medical','Perform','Tame'];
    trackerSkillIds.forEach((id, i) => {
      const v = parseInt(document.getElementById(id).value) || 0;
      if (v > 0) line(skillLabels[i], v);
    });

    h4('Power Rating');
    line('Power Rating', document.getElementById('baseDamage').value);
    line('0.25x', document.getElementById('bd25').textContent);
    line('0.5x',  document.getElementById('bd50').textContent);
    line('1.5x',  document.getElementById('bd150').textContent);
    line('2x',    document.getElementById('bd200').textContent);
    line('2.5x',  document.getElementById('bd250').textContent);
    line('3x',    document.getElementById('bd300').textContent);

    h4('Status Points');
    line('Total HP', document.getElementById('totalHP').value);
    line('Total DP', document.getElementById('totalDP').value);
    line('Total MP', document.getElementById('totalMP').value);

    const entries = document.querySelectorAll('#talentList .bp-entry');
    if (entries.length > 0) {
      h4('BP Features');
      entries.forEach(div => {
        const txt = div.querySelector('textarea').value.trim();
        const bp  = div.querySelector('.bp-cost').value;
        if (txt || bp) { const p = document.createElement('p'); p.textContent = `• ${txt} (${bp || 0} BP)`; box.appendChild(p); }
      });
    }

    const preview = document.getElementById('summaryPreview');
    preview.innerHTML = '';

    // Wrap content in inner padded div so it sits inside the double border
    const inner = document.createElement('div');
    inner.style.cssText = 'padding: 14px 16px;';
    while (box.firstChild) inner.appendChild(box.firstChild);
    box.appendChild(inner);

    preview.appendChild(box);

    html2canvas(box, { backgroundColor: '#ffffff', scale: 2 }).then(canvas => {
      summaryImageData = canvas.toDataURL('image/png');
    });
  }

  function downloadSummaryImage() {
    if (!summaryImageData) { alert("Click 'View Summary' first."); return; }
    let name = (document.getElementById('npcName').value.trim() || 'NPC').replace(/[<>:"/\\|?*]+/g,'');
    const link = document.createElement('a');
    link.href = summaryImageData;
    link.download = name + ' Stat Summary.png';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  }

  function collectTrackerState() {
    return {
      version: 1,
      npcName:          document.getElementById('npcName').value,
      theme:            document.getElementById('themeSelect').value,
      cl:               document.getElementById('clSelect').value,
      statusIncrease:   document.getElementById('statusIncrease').value,
      attrPointChange:  document.getElementById('attrPointChange').value,
      skillPointChange: document.getElementById('skillPointChange').value,
      baseDamageChange: document.getElementById('baseDamageChange').value,
      attrStr: document.getElementById('attrStr').value,
      attrAgi: document.getElementById('attrAgi').value,
      attrWit: document.getElementById('attrWit').value,
      attrEmp: document.getElementById('attrEmp').value,
      skills: Object.fromEntries(trackerSkillIds.map(id => [id, document.getElementById(id).value])),
      talents: [...document.querySelectorAll('#talentList .bp-entry')].map(div => ({
        text: div.querySelector('textarea').value,
        bp:   div.querySelector('.bp-cost').value
      }))
    };
  }

  function restoreTrackerState(d) {
    if (!d) return;

    if (d.npcName !== undefined)        document.getElementById('npcName').value = d.npcName;
    if (d.theme !== undefined)          document.getElementById('themeSelect').value = d.theme;
    if (d.cl !== undefined)             document.getElementById('clSelect').value = d.cl;
    if (d.statusIncrease !== undefined) document.getElementById('statusIncrease').value = d.statusIncrease;
    if (d.attrPointChange !== undefined) document.getElementById('attrPointChange').value = d.attrPointChange;
    if (d.skillPointChange !== undefined) document.getElementById('skillPointChange').value = d.skillPointChange;
    if (d.baseDamageChange !== undefined) document.getElementById('baseDamageChange').value = d.baseDamageChange;
    if (d.attrStr !== undefined) document.getElementById('attrStr').value = d.attrStr;
    if (d.attrAgi !== undefined) document.getElementById('attrAgi').value = d.attrAgi;
    if (d.attrWit !== undefined) document.getElementById('attrWit').value = d.attrWit;
    if (d.attrEmp !== undefined) document.getElementById('attrEmp').value = d.attrEmp;

    if (d.skills) {
      Object.entries(d.skills).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
      });
    }

    // Restore BP features
    const list = document.getElementById('talentList');
    list.innerHTML = '';
    (d.talents || []).forEach(({ text, bp }) => {
      addTalent();
      const last = list.querySelector('.bp-entry:last-child');
      last.querySelector('textarea').value = text || '';
      last.querySelector('.bp-cost').value = bp || '';
    });

    // Re-run all calculations
    handleCLChange();
    validateAttributeAllocation();
    validateSkills();
    recalculateBP();
  }

  // ─── Tabs ───
  function switchTab(tab) {
    const isTracker = tab === 'tracker';
    document.getElementById('panelTracker').classList.toggle('active', isTracker);
    document.getElementById('panelGenerator').classList.toggle('active', !isTracker);
    document.getElementById('tabBtnTracker').classList.toggle('active', isTracker);
    document.getElementById('tabBtnGenerator').classList.toggle('active', !isTracker);
  }

  // ─── Summary drawer ───
  function viewSummary() {
    try {
      generateSummary();
    } catch (e) {
      console.error('generateSummary failed:', e);
    }
    openSummaryDrawer();
  }
  function openSummaryDrawer() {
    document.getElementById('summaryDrawer').classList.add('open');
    document.getElementById('summaryDrawer').setAttribute('aria-hidden', 'false');
  }
  function closeSummaryDrawer() {
    document.getElementById('summaryDrawer').classList.remove('open');
    document.getElementById('summaryDrawer').setAttribute('aria-hidden', 'true');
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSummaryDrawer();
  });

  // ─── Load tracked stats into the Stat Block Generator ───
  const trackerToGeneratorSkillMap = {
    skillBrawl:'Brawl', skillMight:'Might', skillEndure:'Endure', skillIntimidate:'Intimidate',
    skillShoot:'Shoot', skillMove:'Move', skillFinesse:'Finesse', skillHide:'Hide',
    skillAnalyze:'Analyze', skillInsight:'Insight', skillScout:'Scout', skillSurvival:'Survival',
    skillManipulate:'Manipulate', skillMedical:'Medical', skillPerform:'Perform', skillTame:'Tame'
  };

  function loadTrackerIntoGenerator() {
    const nameVal = document.getElementById('npcName').value.trim();
    if (nameVal) document.getElementById('name').value = nameVal;

    const cl = document.getElementById('clSelect').value;
    if (cl !== '') document.getElementById('cl').value = cl;

    const theme = document.getElementById('themeSelect').value;
    if (theme) document.getElementById('theme').value = theme;

    document.getElementById('STR').value = document.getElementById('attrStr').value || 0;
    document.getElementById('AGI').value = document.getElementById('attrAgi').value || 0;
    document.getElementById('WIT').value = document.getElementById('attrWit').value || 0;
    document.getElementById('EMP').value = document.getElementById('attrEmp').value || 0;

    document.getElementById('hp').value = document.getElementById('totalHP').value || 0;
    document.getElementById('dp').value = document.getElementById('totalDP').value || 0;
    document.getElementById('mp').value = document.getElementById('totalMP').value || 0;

    Object.entries(trackerToGeneratorSkillMap).forEach(([trackerId, skillName]) => {
      const val = parseInt(document.getElementById(trackerId).value) || 0;
      const row = [...document.querySelectorAll('#skillsTable tr')].find(r => r.children[0].textContent === skillName);
      if (row) {
        const inp = row.querySelector('input.skillBase');
        inp.value = val;
        calcMod(inp);
      }
    });
    updateAllModifiers();

    switchTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
(function() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  function init() {
    stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.2,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.012 + 0.003,
      phase: Math.random() * Math.PI * 2,
    }));
  }
  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); requestAnimationFrame(draw);
})();

    // ─── Online Tools dropdown ───
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
      }
    });
