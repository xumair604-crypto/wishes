/* Wishora v3 — front-end wish designer. Content data lives in data.js. */
const $ = id => document.getElementById(id);
const clone = o => JSON.parse(JSON.stringify(o));
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const reducedMotion = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

const FIELDS = ["occasion","recipient","sender","headline","message","signoff","background","font","align","headingSize","textSize","dir","music","videoLink","voiceNote","animation","reveal","eventDate"];
const CHECKS = ["countdown","sparkles","border"];
const ENUMS = {
  occasion:Object.keys(OCCASIONS), theme:THEMES, layout:["classic","minimal","scrapbook"],
  background:["glow","gradient","solid","stars"], font:["playfair","sans","script","vibes","urdu"],
  align:["center","left"], headingSize:["small","medium","large"], textSize:["small","medium","large"],
  dir:["auto","ltr","rtl"], music:["none","soft","celebrate","romantic","festive"],
  animation:["float","confetti","hearts","lanterns","none"], reveal:["none","gift","envelope","tap"]
};
const LIMITS = { recipient:40, sender:40, headline:65, message:500, signoff:55, voiceNote:120, videoLink:300 };
const DRAFT_KEY = "wishora-draft-v3";

let state = clone(DEFAULTS);
let photos = [];

/* ---------- state helpers ---------- */
function sanitize(input){
  const s = clone(DEFAULTS);
  if(!input || typeof input !== "object") return s;
  for(const k of Object.keys(DEFAULTS)){
    if(!(k in input)) continue;
    const v = input[k];
    if(ENUMS[k]){ if(ENUMS[k].includes(v)) s[k] = v; }
    else if(k in LIMITS){ s[k] = String(v ?? "").slice(0, LIMITS[k]); }
    else if(typeof DEFAULTS[k] === "boolean"){ s[k] = !!v; }
    else if(k === "stickers"){ if(Array.isArray(v)) s.stickers = v.filter(x => STICKERS.includes(x)).slice(0,5); }
    else if(k === "eventDate"){ s.eventDate = /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : ""; }
  }
  if(s.videoLink && !/^https?:\/\//i.test(s.videoLink)) s.videoLink = "";
  return s;
}
function readForm(){
  FIELDS.forEach(k => { state[k] = $(k).value; });
  CHECKS.forEach(k => { state[k] = $(k).checked; });
  state = sanitize(state);
}
function writeForm(){
  FIELDS.forEach(k => { $(k).value = state[k]; });
  CHECKS.forEach(k => { $(k).checked = state[k]; });
  document.querySelectorAll(".swatch").forEach(b => b.classList.toggle("selected", b.dataset.theme === state.theme));
  document.querySelectorAll(".layout-choice").forEach(b => b.classList.toggle("selected", b.dataset.layout === state.layout));
  document.querySelectorAll("[data-sticker]").forEach(b => b.classList.toggle("selected", state.stickers.includes(b.dataset.sticker)));
  renderTemplateChips();
}

/* ---------- card rendering ---------- */
function youTubeId(url){ const m = String(url).match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/); return m ? m[1] : null; }

function countdownHTML(date){
  const target = new Date(date + "T00:00:00"), now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((target - today) / 864e5);
  if(days > 0){
    const ms = target - now;
    const d = Math.floor(ms/864e5), h = Math.floor(ms/36e5)%24, m = Math.floor(ms/6e4)%60, sec = Math.floor(ms/1e3)%60;
    const unit = (n,l) => `<span><b>${String(n).padStart(2,"0")}</b><small>${l}</small></span>`;
    return `<span class="cd-label">COUNTING DOWN TO THE BIG DAY</span><span class="cd-units">${unit(d,"days")}${unit(h,"hrs")}${unit(m,"min")}${unit(sec,"sec")}</span>`;
  }
  if(days === 0) return `<span class="cd-today">🎉 Today's the day!</span>`;
  return `<span class="cd-label">CELEBRATED ON ${target.toLocaleDateString(undefined,{day:"numeric",month:"long",year:"numeric"}).toUpperCase()}</span>`;
}

const PARTICLES = { float:["✦","✨","✧"], confetti:["✦","✧","▪","●","▲"], hearts:["♡","💗","♥"], lanterns:["✦","⭐","🌙","✧"] };
const CONFETTI_COLORS = ["#f7b9d3","#ffd88a","#9ee0c8","#a9c8ff","#d8b4ff"];
function fillParticles(layer, anim){
  if(layer.dataset.anim === anim) return;
  layer.dataset.anim = anim; layer.innerHTML = "";
  if(anim === "none") return;
  const chars = PARTICLES[anim] || PARTICLES.float;
  for(let i=0;i<14;i++){
    const s = document.createElement("span");
    s.className = "particle"; s.textContent = chars[i % chars.length];
    s.style.left = (4 + (i*37) % 92) + "%";
    s.style.animationDelay = (-i * .41) + "s";
    s.style.animationDuration = (4.5 + (i % 4) * .7) + "s";
    if(anim === "confetti") s.style.color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    layer.appendChild(s);
  }
}

/* mode: "preview" (editor), "viewer" (full screen / shared link), "mini" (gallery), "capture" (image download) */
function renderCard(el, s, mode="preview", pics=[]){
  const occ = OCCASIONS[s.occasion] || { emoji:"✨", label:"A LITTLE SURPRISE FOR" };
  el.className = `preview-card ${mode==="viewer"?"big":""} ${mode==="mini"?"mini":""} theme-${s.theme} layout-${s.layout} font-${s.font} heading-${s.headingSize} text-${s.textSize} align-${s.align} bg-${s.background}${s.border?"":" no-border"}`;
  if(s.dir === "rtl") el.setAttribute("dir","rtl"); else el.removeAttribute("dir");
  const d = s.dir === "rtl" ? "rtl" : s.dir === "ltr" ? "ltr" : "auto";

  if(!el.querySelector(":scope > .card-body")){
    el.innerHTML = `<div class="float-layer" aria-hidden="true"></div><div class="card-body"></div><div class="preview-brand">MADE WITH ♡ ON WISHORA</div>`;
  }
  let h = "";
  if(s.sparkles) h += `<div class="preview-decor" aria-hidden="true">✦　✧　✦</div>`;
  if(s.stickers.length) h += `<div class="preview-stickers" aria-hidden="true">${s.stickers.join(" ")}</div>`;
  h += `<div class="preview-emoji" aria-hidden="true">${occ.emoji}</div>`;
  h += `<div class="preview-overline">${occ.label}</div>`;
  h += `<h3 dir="${d}">${esc(s.headline || "A special wish")}</h3>`;
  h += `<h4 dir="${d}">${esc(s.recipient || "Someone special")}</h4>`;
  h += `<div class="preview-heart" aria-hidden="true">♡</div>`;
  if(s.countdown && s.eventDate) h += `<div class="countdown" data-date="${s.eventDate}">${countdownHTML(s.eventDate)}</div>`;
  h += `<p class="card-message" dir="${d}">${esc(s.message || "Sending you a little happiness today and always.")}</p>`;
  if(pics.length && mode !== "mini") h += `<div class="out-photos n${Math.min(pics.length,6)}">${pics.map(p => `<img src="${p}" alt="">`).join("")}</div>`;
  if(mode !== "mini"){
    let extras = "";
    if(s.videoLink){
      const yt = youTubeId(s.videoLink);
      if(yt && mode === "viewer") h += `<div class="card-video"><iframe src="https://www.youtube-nocookie.com/embed/${yt}" title="Video message" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`;
      else extras += `<a class="card-chip" href="${esc(s.videoLink)}" target="_blank" rel="noopener noreferrer">▶ Watch the video</a>`;
    }
    if(s.music !== "none" && mode !== "capture") extras += `<button type="button" class="card-chip music-chip" data-music="${s.music}">♪ Play music</button>`;
    if(extras) h += `<div class="card-chips">${extras}</div>`;
    if(s.voiceNote) h += `<div class="card-voice" dir="${d}">🎙 ${esc(s.voiceNote)}</div>`;
  }
  if(s.signoff) h += `<div class="preview-signoff" dir="${d}">${esc(s.signoff)}</div>`;
  h += `<div class="preview-sender">FROM <b dir="${d}">${esc((s.sender || "Someone special").toUpperCase())}</b></div>`;
  el.querySelector(".card-body").innerHTML = h;
  fillParticles(el.querySelector(".float-layer"), mode === "capture" ? "none" : s.animation);

  el.querySelector(".reveal-cover")?.remove();
  if(mode === "viewer" && s.reveal !== "none") el.appendChild(buildCover(s));
}

/* ---------- surprise reveal ---------- */
function buildCover(s){
  const who = esc(s.recipient || "you");
  const c = document.createElement("button");
  c.type = "button"; c.className = `reveal-cover reveal-${s.reveal} theme-${s.theme}`;
  const inner = {
    gift: `<div class="gift-box" aria-hidden="true"><span class="gift-lid"></span><span class="gift-base"></span><span class="gift-ribbon"></span><span class="gift-bow">🎀</span></div><b>A surprise for ${who}</b><small>Tap the gift to open it</small>`,
    envelope: `<div class="envelope" aria-hidden="true"><span class="env-back"></span><span class="env-letter">♡</span><span class="env-front"></span><span class="env-flap"></span><span class="env-seal">♡</span></div><b>A letter for ${who}</b><small>Tap to open the envelope</small>`,
    tap: `<div class="tap-orb" aria-hidden="true">✦</div><b>Someone has a message for ${who}</b><small>Tap anywhere to reveal it</small>`
  }[s.reveal];
  c.innerHTML = `<span class="cover-inner">${inner}</span>`;
  c.setAttribute("aria-label", "Open your surprise");
  c.addEventListener("click", () => {
    if(c.classList.contains("opening")) return;
    c.classList.add("opening");
    if(s.music !== "none"){ Player.play(s.music, true); syncMusicChips(); }
    setTimeout(() => { c.classList.add("gone"); burst(c.parentElement, s.animation); }, reducedMotion() ? 0 : 900);
    setTimeout(() => c.remove(), reducedMotion() ? 50 : 1500);
  });
  return c;
}
function burst(card, anim){
  if(!card || reducedMotion()) return;
  const chars = anim === "hearts" ? ["💖","♡","💗"] : anim === "lanterns" ? ["⭐","✦","🌙"] : ["✦","●","▲","■","✧"];
  const layer = document.createElement("div"); layer.className = "burst-layer"; layer.setAttribute("aria-hidden","true");
  for(let i=0;i<40;i++){
    const p = document.createElement("span");
    p.textContent = chars[i % chars.length];
    p.style.color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const ang = Math.random()*Math.PI*2, dist = 120 + Math.random()*220;
    p.style.setProperty("--x", Math.cos(ang)*dist + "px");
    p.style.setProperty("--y", Math.sin(ang)*dist - 80 + "px");
    p.style.setProperty("--r", (Math.random()*720-360) + "deg");
    p.style.animationDelay = Math.random()*.15 + "s";
    layer.appendChild(p);
  }
  card.appendChild(layer);
  setTimeout(() => layer.remove(), 2200);
}

/* ---------- music (original melodies, generated in the browser) ---------- */
const MELODIES = {
  soft:     { wave:"triangle", step:.42, notes:[523,659,784,659, 440,523,659,523, 349,440,523,440, 392,494,587,494] },
  celebrate:{ wave:"triangle", step:.19, notes:[523,659,784,1047,784,1047,0,0, 587,740,880,1175,880,1175,0,0, 659,784,988,1319,988,784,659,0, 523,659,784,1047,0,0,0,0] },
  romantic: { wave:"sine",     step:.55, notes:[392,494,587,494, 330,392,494,392, 262,330,392,330, 294,370,440,370] },
  festive:  { wave:"sine",     step:.24, bell:true, notes:[784,659,784,1047,988,784,659,0, 698,587,698,880,784,0,0,0, 659,784,880,1047,988,880,784,0, 587,659,784,659,523,0,0,0] }
};
const Player = {
  ctx:null, timer:null, voices:[], current:null,
  play(name, loop){
    this.stop();
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if(!Ctx){ toast("Music isn't supported in this browser."); return; }
    this.ctx = this.ctx || new Ctx(); this.ctx.resume?.();
    const mel = MELODIES[name]; if(!mel) return;
    this.current = name;
    const cycle = () => {
      const t0 = this.ctx.currentTime + .05;
      mel.notes.forEach((f,i) => { if(f) this.note(f, t0 + i*mel.step, mel); });
      const len = mel.notes.length * mel.step * 1000;
      this.timer = setTimeout(() => loop ? cycle() : (this.current = null, syncMusicChips()), len);
    };
    cycle();
  },
  note(freq, t, mel){
    const parts = mel.bell ? [[1,.06],[2,.018],[3,.008]] : [[1,.065]];
    parts.forEach(([mult,vol]) => {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = mel.wave; o.frequency.value = freq*mult;
      const len = Math.max(mel.step*1.6, .35);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t+.02); g.gain.exponentialRampToValueAtTime(.0001, t+len);
      o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t+len+.05);
      this.voices.push(o); o.onended = () => { this.voices = this.voices.filter(v => v !== o); };
    });
  },
  stop(){
    clearTimeout(this.timer); this.timer = null; this.current = null;
    this.voices.forEach(v => { try{ v.stop(); }catch(e){} }); this.voices = [];
  }
};
function syncMusicChips(){
  document.querySelectorAll(".music-chip").forEach(b => { b.textContent = Player.current === b.dataset.music ? "❚❚ Pause music" : "♪ Play music"; });
  $("musicBtn").textContent = Player.current && Player.current === state.music ? "■ Stop melody" : "▶ Preview melody";
}
document.addEventListener("click", e => {
  const chip = e.target.closest(".music-chip"); if(!chip) return;
  if(Player.current === chip.dataset.music) Player.stop(); else Player.play(chip.dataset.music, true);
  syncMusicChips();
});
$("musicBtn").addEventListener("click", () => {
  if(state.music === "none"){ toast("Choose a melody first."); return; }
  if(Player.current === state.music) Player.stop(); else Player.play(state.music, false);
  syncMusicChips();
});

/* ---------- live countdowns ---------- */
setInterval(() => {
  document.querySelectorAll(".countdown[data-date]").forEach(el => { el.innerHTML = countdownHTML(el.dataset.date); });
}, 1000);

/* ---------- editor ---------- */
function update(){
  renderCard($("previewCard"), state, "preview", photos);
  $("charCount").textContent = state.message.length;
  syncMusicChips();
  saveDraft();
}
function onFormInput(e){
  const prevOcc = state.occasion, prevMusic = state.music;
  readForm();
  if(state.occasion !== prevOcc) renderTemplateChips();
  if(state.music !== prevMusic && Player.current) { Player.stop(); }
  update();
}
FIELDS.concat(CHECKS).forEach(id => { $(id).addEventListener("input", onFormInput); $(id).addEventListener("change", onFormInput); });

// Build dynamic controls
$("occasion").innerHTML = Object.keys(OCCASIONS).map(o => `<option value="${o}">${OCCASIONS[o].emoji}  ${o}</option>`).join("");
$("swatches").innerHTML = THEMES.map(t => `<button type="button" class="swatch" data-theme="${t}" aria-label="${t[0].toUpperCase()+t.slice(1)} theme"></button>`).join("");
$("stickerChoices").innerHTML = STICKERS.map(s => `<button type="button" data-sticker="${s}" aria-label="Sticker ${s}">${s}</button>`).join("");

document.querySelectorAll(".tab").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected","false"); });
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  btn.classList.add("active"); btn.setAttribute("aria-selected","true");
  $("panel-" + btn.dataset.tab).classList.add("active");
}));
document.querySelectorAll(".swatch").forEach(b => b.addEventListener("click", () => { state.theme = b.dataset.theme; writeForm(); update(); }));
document.querySelectorAll(".layout-choice").forEach(b => b.addEventListener("click", () => { state.layout = b.dataset.layout; writeForm(); update(); }));
document.querySelectorAll("[data-sticker]").forEach(b => b.addEventListener("click", () => {
  const s = b.dataset.sticker;
  if(state.stickers.includes(s)) state.stickers = state.stickers.filter(x => x !== s);
  else if(state.stickers.length < 5) state.stickers.push(s);
  else { toast("You can add up to 5 stickers."); return; }
  writeForm(); update();
}));

/* templates */
function templatesFor(occ){
  const ids = TEMPLATE_GROUPS[occ];
  return ids ? ids.map(id => TEMPLATES.find(t => t.id === id)).filter(Boolean) : TEMPLATES.filter(t => t.occasion === occ);
}
function renderTemplateChips(){
  const list = templatesFor(state.occasion);
  $("templateChips").innerHTML = list.length
    ? list.map(t => `<button type="button" class="template-chip" data-template="${t.id}"><i class="dot-${t.theme}"></i>${esc(t.name)}</button>`).join("")
    : `<span class="subtle">No ready-made designs for this one yet — try ✨ Inspire me.</span>`;
  $("templateChips").querySelectorAll("[data-template]").forEach(b => b.addEventListener("click", () => applyTemplate(b.dataset.template)));
}
function applyTemplate(id, scroll){
  const t = TEMPLATES.find(x => x.id === id); if(!t) return;
  const keepSender = state.sender !== DEFAULTS.sender ? state.sender : null;
  const { id:_, name:__, ...fields } = t;
  state = sanitize({ ...clone(DEFAULTS), ...fields, eventDate: state.eventDate, countdown: state.countdown });
  if(keepSender) state.sender = keepSender;
  Player.stop(); writeForm(); update();
  if(scroll) $("designer").scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
  toast(`“${t.name}” loaded — make it yours ✨`);
}
document.querySelectorAll(".occasion").forEach(b => b.addEventListener("click", () => {
  const first = templatesFor(b.dataset.occ)[0];
  if(first) applyTemplate(first.id, true);
  else { state.occasion = b.dataset.occ; writeForm(); update(); $("designer").scrollIntoView({ behavior:"smooth" }); }
}));

/* inspire me */
$("inspireBtn").addEventListener("click", () => {
  const pool = INSPIRATIONS[state.occasion] || INSPIRATIONS["Just Because"];
  const options = pool.filter(m => m !== state.message);
  state.message = options[Math.floor(Math.random()*options.length)] || pool[0];
  $("message").value = state.message; update();
});

/* photos */
$("photos").addEventListener("change", e => {
  const all = [...e.target.files];
  if(all.length > 6) toast("Only the first 6 photos are used.");
  const files = all.slice(0,6);
  const valid = files.filter(f => f.type.startsWith("image/") && f.size <= 4*1024*1024);
  if(valid.length < files.length) toast("Some files were skipped. Images must be under 4 MB.");
  Promise.all(valid.map(f => new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => res(null); r.readAsDataURL(f); })))
    .then(list => {
      photos = list.filter(Boolean);
      $("photoThumbs").innerHTML = photos.map((p,i) => `<span class="thumb-wrap"><img class="photo-thumb" src="${p}" alt="Photo ${i+1}"><button type="button" class="thumb-x" data-i="${i}" aria-label="Remove photo ${i+1}">✕</button></span>`).join("");
      update();
    });
});
$("photoThumbs").addEventListener("click", e => {
  const x = e.target.closest(".thumb-x"); if(!x) return;
  photos.splice(+x.dataset.i, 1);
  x.parentElement.remove();
  $("photoThumbs").querySelectorAll(".thumb-x").forEach((b,i) => b.dataset.i = i);
  if(!photos.length) $("photos").value = "";
  update();
});

/* reset */
$("resetBtn").addEventListener("click", () => {
  state = clone(DEFAULTS); photos = []; $("photos").value = ""; $("photoThumbs").innerHTML = "";
  Player.stop(); writeForm(); update();
  try{ localStorage.removeItem(DRAFT_KEY); }catch(e){}
  toast("Started over with a fresh card.");
});

/* draft autosave */
let saveTimer;
function saveDraft(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { try{ localStorage.setItem(DRAFT_KEY, JSON.stringify(state)); }catch(e){} }, 300);
}
function loadDraft(){
  try{ const raw = localStorage.getItem(DRAFT_KEY); if(raw) return sanitize(JSON.parse(raw)); }catch(e){}
  return null;
}

/* ---------- viewer (full screen / shared link) ---------- */
let viewerFromLink = false;
function openViewer(s, pics, fromLink){
  viewerFromLink = fromLink;
  renderCard($("viewerCard"), s, "viewer", pics);
  $("viewer").hidden = false; document.body.classList.add("viewer-open");
  $("viewerClose").hidden = fromLink; $("viewerCta").hidden = !fromLink;
  $("viewer").scrollTop = 0;
  (s.reveal !== "none" ? $("viewerCard").querySelector(".reveal-cover") : $("viewerClose"))?.focus({ preventScroll:true });
  if(s.reveal === "none") burst($("viewerCard"), s.animation);
}
function closeViewer(){
  Player.stop(); syncMusicChips();
  $("viewer").hidden = true; document.body.classList.remove("viewer-open");
  if(viewerFromLink){ history.replaceState(null, "", location.pathname + location.search); viewerFromLink = false; }
  $("fullBtn").focus({ preventScroll:true });
}
$("playBtn").addEventListener("click", () => openViewer(state, photos, false));
$("fullBtn").addEventListener("click", () => openViewer(state, photos, false));
$("viewerClose").addEventListener("click", closeViewer);
document.addEventListener("keydown", e => { if(e.key === "Escape" && !$("viewer").hidden && !viewerFromLink) closeViewer(); });

function encodeState(s){
  const b = btoa(unescape(encodeURIComponent(JSON.stringify(s))));
  return b.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function decodeState(str){
  let b = str.replace(/-/g,"+").replace(/_/g,"/"); while(b.length % 4) b += "=";
  return sanitize(JSON.parse(decodeURIComponent(escape(atob(b)))));
}
let linkState = null;
function checkLink(){
  const m = location.hash.match(/^#w=([\w-]+)/);
  if(!m) return false;
  try{ linkState = decodeState(m[1]); openViewer(linkState, [], true); return true; }
  catch(e){ toast("This wish link looks incomplete. Ask the sender to copy it again."); return false; }
}
window.addEventListener("hashchange", checkLink);

/* ---------- download as image ---------- */
let h2cPromise;
function loadHtml2Canvas(){
  if(window.html2canvas) return Promise.resolve();
  h2cPromise = h2cPromise || new Promise((res, rej) => {
    const sc = document.createElement("script");
    sc.src = "vendor/html2canvas.min.js"; // bundled copy (MIT) so downloads work without a CDN
    sc.onload = res; sc.onerror = () => { h2cPromise = null; rej(new Error("load")); };
    document.head.appendChild(sc);
  });
  return h2cPromise;
}
async function cardBlob(s, pics){
  await loadHtml2Canvas();
  await document.fonts?.ready;
  const holder = document.createElement("div"); holder.className = "capture-holder";
  const card = document.createElement("div"); holder.appendChild(card); document.body.appendChild(holder);
  renderCard(card, s, "capture", pics);
  card.classList.add("capturing");
  await Promise.all([...card.querySelectorAll("img")].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; })));
  try{
    const canvas = await html2canvas(holder, { scale:2, backgroundColor:"#100d20", useCORS:true, logging:false });
    return await new Promise(r => canvas.toBlob(r, "image/png"));
  } finally { holder.remove(); }
}
function fileName(s){ return `wishora-${(s.recipient || "wish").replace(/[^\p{L}\p{N}]+/gu,"-").replace(/^-|-$/g,"").toLowerCase() || "wish"}.png`; }
function downloadBlob(blob, name){
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
async function downloadImage(s, pics, btn){
  const label = btn.textContent; btn.disabled = true; btn.textContent = "Creating image…";
  try{ const blob = await cardBlob(s, pics); downloadBlob(blob, fileName(s)); toast("Image saved 🎉 Share it to your Story, Status or a chat."); }
  catch(e){ console.error(e); toast("Couldn't create the image. Please try again."); }
  finally{ btn.disabled = false; btn.textContent = label; }
}
$("downloadBtn").addEventListener("click", e => downloadImage(state, photos, e.currentTarget));
$("viewerDownload").addEventListener("click", e => viewerFromLink ? downloadImage(linkState, [], e.currentTarget) : downloadImage(state, photos, e.currentTarget));

/* ---------- sharing ---------- */
function baseUrl(){ return location.href.split("#")[0]; }
function shareUrl(){ return baseUrl() + "#w=" + encodeState(state); }
function inviteText(){ return `🎁 ${state.recipient || "Hey"}, I made a little surprise for you! Open it here:`; }
function photoWarning(){ if(photos.length) toast("Heads up: photos aren't in links yet. Use Download image to share them."); }
function shareTo(url){ photoWarning(); window.open(url, "_blank", "noopener,noreferrer,width=700,height=650"); }
$("shareWhatsApp").addEventListener("click", () => shareTo("https://wa.me/?text=" + encodeURIComponent(inviteText() + "\n" + shareUrl())));
$("shareFacebook").addEventListener("click", () => shareTo("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(shareUrl())));
$("shareTelegram").addEventListener("click", () => shareTo("https://t.me/share/url?url=" + encodeURIComponent(shareUrl()) + "&text=" + encodeURIComponent(inviteText())));
$("shareEmail").addEventListener("click", () => {
  photoWarning();
  location.href = "mailto:?subject=" + encodeURIComponent(`A little surprise for you${state.recipient ? ", " + state.recipient : ""} ✨`) +
    "&body=" + encodeURIComponent(`${inviteText()}\n\n${shareUrl()}\n\nWith love,\n${state.sender}`);
});
async function copyText(t, msg){
  try{ await navigator.clipboard.writeText(t); }
  catch(e){ const ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
  toast(msg);
}
$("copyShare").addEventListener("click", () => { copyText(shareUrl(), "Wish link copied! Paste it in any chat."); setTimeout(photoWarning, 2900); });
$("shareInstagram").addEventListener("click", async e => {
  const btn = e.currentTarget; btn.disabled = true;
  try{
    const blob = await cardBlob(state, photos);
    const file = new File([blob], fileName(state), { type:"image/png" });
    if(navigator.canShare && navigator.canShare({ files:[file] })){
      try{ await navigator.share({ files:[file], title: state.headline }); }
      catch(err){ if(err.name !== "AbortError") throw err; }
    } else {
      downloadBlob(blob, file.name);
      await copyText(shareUrl(), "Image saved and link copied. Add the image to your Story, then paste the link as a link sticker.");
    }
  } catch(err){ toast("Couldn't prepare the image. Try Download image instead."); }
  finally{ btn.disabled = false; }
});
$("nativeShare").addEventListener("click", async () => {
  photoWarning();
  if(navigator.share){
    try{ await navigator.share({ title: state.headline, text: inviteText(), url: shareUrl() }); }
    catch(e){ if(e.name !== "AbortError") toast("Sharing is unavailable in this browser."); }
  } else copyText(inviteText() + " " + shareUrl(), "Copied. You can paste it into any app.");
});

/* ---------- gallery ---------- */
const GALLERY = ["bday-classic","love-letter","eid-urdu","diwali","holi","grad"];
$("galleryGrid").innerHTML = GALLERY.map(id => {
  const t = TEMPLATES.find(x => x.id === id);
  return `<button type="button" class="gallery-item" data-template="${id}" aria-label="Use the ${esc(t.name)} design"><div class="mini-wrap"><div class="g-card"></div></div><span class="g-name">${esc(t.name)}</span><span class="g-occ">${OCCASIONS[t.occasion].emoji} ${t.occasion}</span></button>`;
}).join("");
$("galleryGrid").querySelectorAll(".gallery-item").forEach(b => {
  const t = TEMPLATES.find(x => x.id === b.dataset.template); const { id:_, name:__, ...f } = t;
  renderCard(b.querySelector(".g-card"), sanitize({ ...clone(DEFAULTS), ...f, sender:"Your name" }), "mini");
  b.addEventListener("click", () => applyTemplate(t.id, true));
});

/* ---------- misc ---------- */
$("hamb").addEventListener("click", () => { const open = $("nav").classList.toggle("open"); $("hamb").setAttribute("aria-expanded", open); });
document.querySelectorAll("#nav a").forEach(a => a.addEventListener("click", () => { $("nav").classList.remove("open"); $("hamb").setAttribute("aria-expanded","false"); }));
function toast(msg){ const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(window._toastTimer); window._toastTimer = setTimeout(() => t.classList.remove("show"), 3200); }

/* ---------- start ---------- */
const draft = loadDraft();
if(draft) state = draft;
writeForm();
update();
checkLink();
