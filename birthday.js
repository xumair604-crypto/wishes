/* Wishora — birthday surprise page. The wish lives in the URL after "#b=" (base64url JSON), nothing is stored. */
(function(){
"use strict";
const $ = id => document.getElementById(id);
const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const THEMES = ["rose","lilac","peach","mint"];
const LIM = { t:40, f:40, m:400 };

/* ---------- encode / decode ---------- */
function toB64url(obj){
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let bin = ""; bytes.forEach(b => bin += String.fromCharCode(b));
  return btoa(bin).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function fromB64url(s){
  try{
    s = s.replace(/-/g,"+").replace(/_/g,"/"); while(s.length % 4) s += "=";
    const bin = atob(s), bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }catch(e){ return null; }
}
function clean(d){
  if(!d || typeof d !== "object") return null;
  const t = String(d.t ?? "").trim().slice(0, LIM.t);
  if(!t) return null;
  return {
    t, f: String(d.f ?? "").trim().slice(0, LIM.f), m: String(d.m ?? "").trim().slice(0, LIM.m),
    c: THEMES.includes(d.c) ? d.c : "rose"
  };
}
function readWish(){
  const m = location.hash.match(/^#b=([A-Za-z0-9_-]+)$/);
  return m ? clean(fromB64url(m[1])) : null;
}

/* ---------- floating hearts ---------- */
function startHearts(){
  if(reduced) return;
  const box = $("hearts");
  setInterval(() => {
    if(document.hidden) return;
    const h = document.createElement("span");
    h.className = "heart"; h.textContent = Math.random() < .8 ? "♥" : "♡";
    h.style.left = Math.random()*100 + "vw";
    h.style.fontSize = (12 + Math.random()*22) + "px";
    h.style.animationDuration = (7 + Math.random()*6) + "s";
    h.addEventListener("animationend", () => h.remove());
    box.appendChild(h);
  }, 420);
}

/* ---------- confetti ---------- */
const cv = $("confetti"), ctx = cv.getContext("2d");
let parts = [], raf = 0;
function sizeCv(){ cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; }
addEventListener("resize", sizeCv); sizeCv();
function burst(x, y, n = 90){
  if(reduced) return;
  const cols = ["#ff6f9f","#ffd166","#7ad7f0","#b79bff","#7ae0a8","#ffffff"];
  const dpr = devicePixelRatio;
  for(let i = 0; i < n; i++){
    const a = Math.random()*Math.PI*2, s = 4 + Math.random()*9;
    parts.push({ x:x*dpr, y:y*dpr, vx:Math.cos(a)*s*dpr, vy:(Math.sin(a)*s - 6)*dpr,
      w:(5+Math.random()*6)*dpr, h:(3+Math.random()*5)*dpr, r:Math.random()*6, vr:(Math.random()-.5)*.4,
      c:cols[i % cols.length], life:90 + Math.random()*50 });
  }
  if(!raf) raf = requestAnimationFrame(tick);
}
function tick(){
  ctx.clearRect(0, 0, cv.width, cv.height);
  parts = parts.filter(p => p.life > 0);
  for(const p of parts){
    p.vy += .32*devicePixelRatio; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.min(1, p.life/30);
    ctx.fillStyle = p.c; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h); ctx.restore();
  }
  raf = parts.length ? requestAnimationFrame(tick) : 0;
  if(!raf) ctx.clearRect(0, 0, cv.width, cv.height);
}

/* ---------- original characters: a bunny and a cat with a cake ---------- */
function pals(){
  return `<svg viewBox="0 0 300 235" role="img" aria-label="A bunny and a cat sharing a birthday cake">
  <g class="bob">
    <ellipse cx="54" cy="96" rx="12" ry="32" transform="rotate(-10 54 96)" fill="#fff" stroke="#eab6c8" stroke-width="2"/>
    <ellipse cx="54" cy="98" rx="5.5" ry="22" transform="rotate(-10 54 96)" fill="#ffc4d6"/>
    <ellipse cx="94" cy="96" rx="12" ry="32" transform="rotate(10 94 96)" fill="#fff" stroke="#eab6c8" stroke-width="2"/>
    <ellipse cx="94" cy="98" rx="5.5" ry="22" transform="rotate(10 94 96)" fill="#ffc4d6"/>
    <ellipse cx="70" cy="190" rx="34" ry="36" fill="#fff" stroke="#eab6c8" stroke-width="2"/>
    <circle cx="74" cy="136" r="36" fill="#fff" stroke="#eab6c8" stroke-width="2"/>
    <path d="M74 104 q-14-12-16 0 q2 10 16 0 q14 10 16 0 q-2-12-16 0z" fill="#ff8fb3" stroke="#d9487c" stroke-width="1.6" stroke-linejoin="round"/>
    <circle cx="74" cy="104" r="3.4" fill="#ffd166"/>
    <circle cx="62" cy="136" r="3.6" fill="#5a2b3d"/><circle cx="86" cy="136" r="3.6" fill="#5a2b3d"/>
    <ellipse cx="54" cy="146" rx="6" ry="4" fill="#ffb3c9"/><ellipse cx="94" cy="146" rx="6" ry="4" fill="#ffb3c9"/>
    <path d="M70 145 Q74 150 78 145" fill="none" stroke="#5a2b3d" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="74" cy="142" rx="3" ry="2" fill="#ff7aa5"/>
    <ellipse cx="108" cy="188" rx="11" ry="8" fill="#fff" stroke="#eab6c8" stroke-width="2"/>
  </g>
  <g class="bob b2">
    <path d="M200 124 L206 86 L230 108 Z" fill="#ffd9b8" stroke="#e7b48a" stroke-width="2" stroke-linejoin="round"/>
    <path d="M270 124 L264 86 L240 108 Z" fill="#ffd9b8" stroke="#e7b48a" stroke-width="2" stroke-linejoin="round"/>
    <path d="M207 114 L209 97 L221 108 Z" fill="#ffb3c9"/><path d="M263 114 L261 97 L249 108 Z" fill="#ffb3c9"/>
    <ellipse cx="232" cy="192" rx="34" ry="36" fill="#ffd9b8" stroke="#e7b48a" stroke-width="2"/>
    <circle cx="235" cy="138" r="36" fill="#ffd9b8" stroke="#e7b48a" stroke-width="2"/>
    <path d="M219 108 L235 74 L251 108 Z" fill="#8fd4ff" stroke="#4aa3d8" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="235" cy="73" r="6" fill="#ffd166"/>
    <circle cx="223" cy="138" r="3.6" fill="#5a2b3d"/><circle cx="247" cy="138" r="3.6" fill="#5a2b3d"/>
    <ellipse cx="215" cy="148" rx="6" ry="4" fill="#ffb3c9"/><ellipse cx="255" cy="148" rx="6" ry="4" fill="#ffb3c9"/>
    <path d="M231 148 Q235 153 239 148" fill="none" stroke="#5a2b3d" stroke-width="2" stroke-linecap="round"/>
    <path d="M232 144 L238 144 L235 148 Z" fill="#ff7aa5"/>
    <path d="M208 142 L192 138 M208 148 L192 150 M262 142 L278 138 M262 148 L278 150" stroke="#5a2b3d" stroke-width="1.6" stroke-linecap="round"/>
    <ellipse cx="196" cy="190" rx="11" ry="8" fill="#ffd9b8" stroke="#e7b48a" stroke-width="2"/>
  </g>
  <ellipse cx="150" cy="224" rx="74" ry="8" fill="#f3b9cc"/>
  <rect x="92" y="178" width="116" height="44" rx="10" fill="#ffb3c9" stroke="#e98aab" stroke-width="2"/>
  <path d="M92 190 q9 10 18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t10 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
  <rect x="110" y="146" width="80" height="34" rx="9" fill="#fff0f5" stroke="#e98aab" stroke-width="2"/>
  <path d="M110 158 q8 9 16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="#ffb3c9" stroke-width="5" stroke-linecap="round"/>
  <g>
    <rect x="127" y="120" width="6" height="26" rx="2" fill="#7ad7f0"/><rect x="147" y="120" width="6" height="26" rx="2" fill="#ffd166"/><rect x="167" y="120" width="6" height="26" rx="2" fill="#b79bff"/>
    <g class="flame"><path d="M130 118 q-6-9 0-16 q6 7 0 16z" fill="#ffb02e"/></g>
    <g class="flame" style="animation-delay:-.2s"><path d="M150 118 q-6-9 0-16 q6 7 0 16z" fill="#ffb02e"/></g>
    <g class="flame" style="animation-delay:-.35s"><path d="M170 118 q-6-9 0-16 q6 7 0 16z" fill="#ffb02e"/></g>
    <g class="smoke" fill="none" stroke="#b9a5b0" stroke-width="2" stroke-linecap="round"><path d="M130 112 q-5-6 0-12"/><path d="M150 112 q-5-6 0-12"/><path d="M170 112 q-5-6 0-12"/></g>
  </g>
  </svg>`;
}

/* ---------- bunting ---------- */
function drawBunting(){
  const cols = ["#ff8fb3","#ffd166","#7ad7f0","#b79bff","#7ae0a8"], g = $("flags");
  let out = "";
  for(let i = 0; i < 9; i++){
    const t = (i + .5)/9, x = 5 + 290*t, y = 8 + 4*(1-Math.pow(2*t-1,2))*10 - 0;
    out += `<path d="M${x-13} ${y-2} L${x+13} ${y-2} L${x} ${y+26} Z" fill="${cols[i%cols.length]}" opacity=".92"/>`;
  }
  g.innerHTML = out;
}

/* ---------- recipient experience ---------- */
function show(wish){
  document.body.dataset.theme = wish.c;
  document.title = `Happy Birthday, ${wish.t}! 🎂`;
  $("toName").textContent = wish.t;
  document.querySelectorAll("[data-name]").forEach(n => n.textContent = wish.t);
  $("msgOut").textContent = wish.m || "Wishing you a day full of happiness, laughter and cake. You deserve all of it!";
  $("fromOut").textContent = wish.f ? "— " + wish.f : "";
  $("pals1").innerHTML = pals(); $("pals2").innerHTML = pals();
  drawBunting();
  $("show").hidden = false;

  const steps = ["s1","s2","s3"];
  const go = n => { steps.forEach((id, i) => $(id).hidden = i !== n); window.scrollTo(0, 0); };

  const yes = $("yesBtn"), no = $("noBtn");
  let dodges = 0, ready = false;
  const reset = () => {
    dodges = 0; ready = false; no.className = "btn no"; no.textContent = "No"; no.style.left = no.style.top = "";
    $("cakeBtn").classList.remove("out"); $("hint").textContent = "Tap the cake 🎂";
  };
  const accept = () => {
    const r = yes.getBoundingClientRect();
    burst(r.left + r.width/2, r.top, 70); go(1);
  };
  yes.addEventListener("click", accept);
  const dodge = e => {
    if(dodges >= 4){ return; }            // after four dodges the button gives up and says yes
    e.preventDefault();
    dodges++;
    if(dodges === 4){ no.className = "btn no"; no.style.left = no.style.top = ""; no.textContent = "Okay, yes! 😄"; setTimeout(() => ready = true, 600); return; }
    const w = no.offsetWidth, h = no.offsetHeight, pad = 12;
    const x = pad + Math.random()*(innerWidth - w - pad*2), y = pad + Math.random()*(innerHeight - h - pad*2);
    no.classList.add("dodge"); no.style.left = x + "px"; no.style.top = y + "px";
  };
  no.addEventListener("pointerenter", e => { if(e.pointerType === "mouse") dodge(e); });
  no.addEventListener("pointerdown", dodge);
  no.addEventListener("click", e => { if(ready) accept(); else e.preventDefault(); });

  $("cakeBtn").addEventListener("click", () => {
    const b = $("cakeBtn"); if(b.classList.contains("out")) return;
    b.classList.add("out"); $("hint").textContent = "Your wish is on its way ✨";
    const r = b.getBoundingClientRect();
    burst(r.left + r.width/2, r.top + r.height*.4, 120);
    setTimeout(() => burst(innerWidth*.2, innerHeight*.3, 60), 250);
    setTimeout(() => burst(innerWidth*.8, innerHeight*.3, 60), 450);
    setTimeout(() => { go(2); burst(innerWidth/2, innerHeight*.25, 90); }, 1500);
  });
  $("replay").addEventListener("click", () => { reset(); go(0); });
}

/* ---------- maker ---------- */
function drawQR(canvas, text){
  const q = qrcode(0, "M"); q.addData(text); q.make();
  const n = q.getModuleCount(), size = canvas.width, cell = Math.floor(size / (n + 2)), off = Math.floor((size - cell*n)/2);
  const c = canvas.getContext("2d");
  c.fillStyle = "#fff"; c.fillRect(0, 0, size, size); c.fillStyle = "#4a1f35";
  for(let r = 0; r < n; r++) for(let k = 0; k < n; k++) if(q.isDark(r, k)) c.fillRect(off + k*cell, off + r*cell, cell, cell);
}
function maker(){
  $("maker").hidden = false;
  let theme = "rose";
  document.querySelectorAll(".sw").forEach(b => b.addEventListener("click", () => {
    theme = b.dataset.theme; document.body.dataset.theme = theme;
    document.querySelectorAll(".sw").forEach(x => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-checked", on); });
  }));
  $("makerForm").addEventListener("submit", e => {
    e.preventDefault();
    const wish = clean({ t:$("fTo").value, f:$("fFrom").value, m:$("fMsg").value, c:theme });
    if(!wish) return;
    const link = location.href.split("#")[0].split("?")[0] + "#b=" + toB64url(wish);
    $("linkOut").value = link; $("previewBtn").href = link;
    try{ drawQR($("qr"), link); $("qr").hidden = false; }catch(err){ $("qr").hidden = true; }
    $("result").hidden = false;
    $("shareBtn").hidden = !navigator.share;
    $("result").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    burst(innerWidth/2, innerHeight/3, 70);
  });
  $("copyBtn").addEventListener("click", async () => {
    const i = $("linkOut"); i.select();
    try{ await navigator.clipboard.writeText(i.value); }catch(e){ document.execCommand("copy"); }
    $("copyBtn").textContent = "Copied ✓"; setTimeout(() => $("copyBtn").textContent = "Copy", 1600);
  });
  $("shareBtn").addEventListener("click", () => {
    navigator.share({ title:"A birthday surprise for you 🎂", url:$("linkOut").value }).catch(() => {});
  });
  $("qrSave").addEventListener("click", () => {
    $("qr").toBlob(b => { const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "birthday-qr.png"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); });
  });
}

/* ---------- boot ---------- */
function boot(){
  const wish = readWish();
  if(wish) show(wish); else maker();
  startHearts();
}
addEventListener("hashchange", () => location.reload());
boot();
})();
