/* Turf Tek Contractor Portal — clickable demo. Data lives in this browser only (localStorage). */
(function(){
const $ = (s, el=document) => el.querySelector(s), $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const money = n => '$' + (Math.round(n*100)/100).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
const CALC = 'https://thepatrickreardon-sys.github.io/sawmill-layout/turf-calculator/';
const SALES = 'quote@turftekusa.com';
const ROLL_W = 15;

/* ---------- SAMPLE catalog (placeholder prices until Rick supplies real numbers) ---------- */
const TURF = [
 {id:'natural', n:'Natural Turf', c:'Landscape', d:'Lush, realistic landscape turf for lawns and common areas.', p:2.89},
 {id:'versa', n:'Versa Turf', c:'Landscape', d:'Multi-use turf for moderate to high traffic.', p:3.19},
 {id:'petplay', n:'Pet & Play Turf', c:'Landscape', d:'Tough, easy-clean turf for pets and play.', p:3.49},
 {id:'proputt', n:'Pro Putt Turf', c:'Athletic', d:'True-rolling putting surface for greens and bocce.', p:4.25},
 {id:'shortgame', n:'Short Game Elite Turf', c:'Athletic', d:'Holds chips and pitches like a real green.', p:4.75},
 {id:'sportxt', n:'Sport XT Turf', c:'Athletic', d:'High-traffic athletic and play surface.', p:3.65},
 {id:'playx', n:'Playground Extreme Turf', c:'Athletic', d:'Playground safety surfacing turf.', p:3.95},
 {id:'tennis', n:'Tennis Turf', c:'Athletic', d:'Sand-filled turf for consistent tennis play.', p:3.30}
];
const ICON = {
 sand:'<svg viewBox="0 0 24 24"><path d="M3 19c3-8 6-11 9-11s6 3 9 11z" fill="#D6A461"/></svg>',
 tape:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.5" fill="none" stroke="#22372B" stroke-width="4"/></svg>',
 glue:'<svg viewBox="0 0 24 24"><path d="M7 8h10v12H7z" fill="#22372B"/><path d="M10 3h4v5h-4z" fill="#86C53F"/></svg>',
 staple:'<svg viewBox="0 0 24 24"><path d="M5 18V8h14v10" fill="none" stroke="#4E6357" stroke-width="2.6"/></svg>',
 nail:'<svg viewBox="0 0 24 24"><path d="M6 5h12M12 5v15l-1.5-2" fill="none" stroke="#4E6357" stroke-width="2.4" stroke-linecap="round"/></svg>',
 board:'<svg viewBox="0 0 24 24"><rect x="2" y="9" width="20" height="6" rx="1" fill="#8B5B29"/></svg>'
};
const MATS = [
 {id:'sand', n:'Sand Infill', u:'50 lb bag', d:'Infill at about 2 lb per sq ft.', p:9.50, i:'sand'},
 {id:'tape', n:'Seam Tape', u:'100 ft roll', d:'For every glued seam.', p:42.00, i:'tape'},
 {id:'glue', n:'Seam Glue', u:'1 gallon', d:'About 25 linear ft of seam per gallon.', p:38.00, i:'glue'},
 {id:'staples', n:'Turf Staples', u:'box of 1,000', d:'For 2×4 nailer borders.', p:28.00, i:'staple'},
 {id:'nails', n:'Turf Nails', u:'box of 50', d:'For buried-edge borders.', p:24.00, i:'nail'},
 {id:'board', n:'2×4 Nailer Board', u:'16 ft', d:'Pressure-treated border board.', p:11.50, i:'board'}
];
const TIERS = {Silver:{c:'#CFE4B1'}, Gold:{c:'#D6A461'}, Platinum:{c:'#E2E872'}};
const tierFor = pct => pct >= 20 ? 'Platinum' : pct >= 15 ? 'Gold' : 'Silver';

/* ---------- Demo data ---------- */
const SEED = () => ({
 contractors:[
  {id:'TT-1042', pin:'2468', co:'Green Acres Landscaping', name:'Mike', disc:15, rep:'Rick', phone:'(631) 555-0142', town:'Huntington, NY'},
  {id:'TT-2087', pin:'1357', co:'Shoreline Outdoor Living', name:'Dana', disc:10, rep:'Rick', phone:'(516) 555-0187', town:'Massapequa, NY'},
  {id:'TT-3150', pin:'8642', co:'Empire Play Systems', name:'Luis', disc:20, rep:'Rick', phone:'(914) 555-0150', town:'White Plains, NY'}
 ],
 orders:[
  {no:'TT-24811', cid:'TT-1042', date:'2026-11-03', job:'Hendricks backyard', status:'Delivered', total:3961.20, items:[['Natural Turf','15′ × 60′ × 2 rolls'],['Sand Infill','36 bags']]},
  {no:'TT-24857', cid:'TT-1042', date:'2026-11-12', job:'Oak St dog run', status:'Scheduled', total:2287.45, items:[['Pet & Play Turf','15′ × 40′ × 1 roll'],['Turf Staples','1 box']]},
  {no:'TT-24862', cid:'TT-2087', date:'2026-11-14', job:'Pool surround', status:'Confirmed', total:4410.00, items:[['Versa Turf','15′ × 50′ × 3 rolls']]},
  {no:'TT-24870', cid:'TT-3150', date:'2026-11-16', job:'St. Mary\'s playground', status:'Requested', total:9875.00, items:[['Playground Extreme Turf','15′ × 70′ × 3 rolls']]}
 ],
 carts:{}, session:null
});
let S;
try { S = JSON.parse(localStorage.getItem('tt-portal') || 'null'); } catch(e) {}
if (!S || !S.contractors) S = SEED();
const save = () => { try { localStorage.setItem('tt-portal', JSON.stringify(S)); } catch(e) {} };
const me = () => S.contractors.find(c => c.id === S.session);
const cart = () => (S.carts[S.session] ||= []);
const disc = () => (me() ? me().disc : 0) / 100;

/* ---------- UI helpers ---------- */
const toast = t => { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 2200); };
const modal = html => { const m = document.createElement('div'); m.className = 'modal'; m.innerHTML = `<div class="box">${html}</div>`; document.body.appendChild(m); requestAnimationFrame(() => m.classList.add('on'));
  const close = () => { m.classList.remove('on'); setTimeout(() => m.remove(), 350); }; m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-close]')) close(); }); return {m, close}; };
const grass = () => `<svg class="grass" aria-hidden="true"><rect x="-30" y="0" width="110%" height="70" fill="url(#grassV)" filter="url(#wind)"/></svg>`;
const IC = {
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/></svg>',
 shop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c2-6 4-9 5-14M9 20c1-5 3-9 7-13M14 20c1-4 3-7 6-9"/></svg>',
 cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11h11L21 8H6.2"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/></svg>',
 orders:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
 acct:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
 admin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
 calc:'<svg viewBox="0 0 24 24" fill="none" stroke="#22372B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M8 18h2M12 18h4"/></svg>'
};

/* ---------- Line items ---------- */
function turfLine(t, len, rolls){ const sf = ROLL_W * len * rolls; return {k:'t:'+t.id+':'+len, type:'turf', id:t.id, n:t.n, len, rolls, sf, list:sf * t.p, desc:`15′ × ${len}′ × ${rolls} roll${rolls>1?'s':''} · ${sf.toLocaleString()} sq ft`}; }
function matLine(m, q){ return {k:'m:'+m.id, type:'mat', id:m.id, n:m.n, q, list:q * m.p, desc:`${q} × ${m.u}`}; }
const totals = items => { const list = items.reduce((a,b) => a + b.list, 0), off = list * disc(); return {list, off, net:list - off}; };
function addToCart(line){ const c = cart(), ex = c.find(x => x.k === line.k);
  if (ex){ if (line.type === 'turf'){ ex.rolls += line.rolls; Object.assign(ex, turfLine(TURF.find(t=>t.id===ex.id), ex.len, ex.rolls)); } else { ex.q += line.q; Object.assign(ex, matLine(MATS.find(m=>m.id===ex.id), ex.q)); } }
  else c.push(line);
  save(); badge(); toast(`Added ${line.n} to your order`); }
function badge(){ const n = cart().length, b = $('#cartCnt'); if (b){ b.textContent = n; b.classList.toggle('on', n > 0); } }

/* ---------- Login ---------- */
function login(){
  document.title = 'Contractor Login | Turf Tek';
  $('#app').innerHTML = `<div class="login"><div class="l">
    <img src="assets/logo-white-fresh-blade.png" alt="Turf Tek">
    <div class="eye">Contractor Portal</div>
    <h1 style="margin-top:10px">Your pricing. <span>Your orders. One place.</span></h1>
    <p>Log in with your Turf Tek contractor ID to see your discount, order turf and install materials, and track every delivery.</p>
    <ul class="perks"><li>Your contractor discount applied automatically</li><li>Order turf by the roll and materials by the unit</li><li>Track orders from requested to delivered</li></ul>
  </div><div class="r"><form class="lcard" id="lf" autocomplete="off">
    <div><div class="eye">Sign in</div><h2>Welcome back.</h2></div>
    <div class="field"><label for="cid">Contractor ID</label><input class="inp" id="cid" placeholder="TT-0000" autocapitalize="characters"></div>
    <div class="field"><label for="pin">PIN</label><input class="inp" id="pin" type="password" inputmode="numeric" placeholder="••••"></div>
    <div class="err" id="lerr"></div>
    <button class="btn btn-v" type="submit">Log in →</button>
    <div class="hint"><b>Demo accounts</b> — tap to fill:<br>
      <button type="button" data-id="TT-1042" data-pin="2468">TT-1042</button> Green Acres (15%) ·
      <button type="button" data-id="TT-2087" data-pin="1357">TT-2087</button> Shoreline (10%) ·
      <button type="button" data-id="TT-3150" data-pin="8642">TT-3150</button> Empire Play (20%)<br>
      Turf Tek staff: <button type="button" data-id="STAFF" data-pin="0000">STAFF</button></div>
  </form></div>${grass()}</div>`;
  $$('.hint button').forEach(b => b.addEventListener('click', () => { $('#cid').value = b.dataset.id; $('#pin').value = b.dataset.pin; }));
  $('#lf').addEventListener('submit', e => { e.preventDefault();
    const id = $('#cid').value.trim().toUpperCase(), pin = $('#pin').value.trim();
    if (id === 'STAFF' && pin === '0000'){ S.session = 'STAFF'; save(); location.hash = '#admin'; return route(); }
    const c = S.contractors.find(x => x.id === id && x.pin === pin);
    if (!c){ $('#lerr').textContent = 'That ID and PIN don\'t match. Check with your Turf Tek rep.'; const f = $('#lf'); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); return; }
    S.session = c.id; save(); location.hash = '#dash'; route(); });
}

/* ---------- Shell ---------- */
function shell(active, inner){
  const staff = S.session === 'STAFF', c = me();
  const nav = staff ? [['admin','Contractors','admin'],['allorders','All orders','orders']] : [['dash','Home','home'],['shop','Order','shop'],['cart','Cart','cart'],['orders','My orders','orders'],['account','Account','acct']];
  $('#app').innerHTML = `<div class="topbar"><img src="assets/logo-white-fresh-blade.png" alt="Turf Tek"><button id="lo2">Log out</button></div>
  <div class="shell"><aside class="side"><a class="logo" href="#${staff?'admin':'dash'}"><img src="assets/logo-white-fresh-blade.png" alt="Turf Tek"></a>
    ${nav.map(n => `<a class="nl ${active===n[0]?'on':''}" href="#${n[0]}">${IC[n[2]]}${n[1]}${n[0]==='cart'?'<span class="cnt" id="cartCnt"></span>':''}</a>`).join('')}
    <div class="who"><b>${staff ? 'Turf Tek staff' : esc(c.co)}</b>${staff ? 'Back office' : c.id + ' · ' + c.disc + '% off'}<br><button id="lo">Log out</button></div>
  </aside><main class="main"><div class="view">${inner}</div></main></div>`;
  const out = () => { S.session = null; save(); location.hash = '#login'; route(); };
  $('#lo').addEventListener('click', out); $('#lo2').addEventListener('click', out);
  badge();
}

/* ---------- Contractor pages ---------- */
function dash(){
  const c = me(), t = tierFor(c.disc), my = S.orders.filter(o => o.cid === c.id), open = my.filter(o => o.status !== 'Delivered').length;
  const ytd = my.reduce((a,o) => a + o.total, 0), saved = ytd / (1 - c.disc/100) - ytd;
  shell('dash', `
  <div class="hello"><div><div class="eye">Contractor Portal</div><h2 style="margin-top:6px">Welcome back, ${esc(c.name)}.</h2><p>${esc(c.co)} · ${esc(c.town)}</p>
    <div class="tier"><i style="background:${TIERS[t].c}">${c.disc}%</i>${t} contractor pricing</div></div>
    <a class="btn btn-v" href="#shop">Start an order →</a>${grass()}</div>
  <div class="grid g4 stagger" style="margin-top:16px">
    <div class="card stat"><div class="big">${c.disc}%</div><span>Your discount on everything</span></div>
    <div class="card stat"><div class="big">${open}</div><span>Open orders</span></div>
    <div class="card stat"><div class="big">${money(ytd).replace('.00','')}</div><span>Ordered this year</span></div>
    <div class="card stat"><div class="big">${money(saved).split('.')[0]}</div><span>Saved with your discount</span></div>
  </div>
  <div class="grid g2" style="margin-top:16px">
    <div class="card"><div class="ph1" style="margin-bottom:8px"><h2 style="font-size:1.6rem">Recent orders</h2><a class="btn btn-l btn-sm" href="#orders">See all</a></div>${orderTable(my.slice().reverse().slice(0,4))}</div>
    <div class="grid stagger" style="align-content:start">
      <a class="qa" href="#shop"><span class="ic">${IC.shop.replace('currentColor','#22372B')}</span><div><b>Order turf</b><span>8 turf lines, by the roll</span></div></a>
      <a class="qa" href="#shop/materials"><span class="ic">${ICON.sand}</span><div><b>Order materials</b><span>Infill, seam tape, glue, staples and more</span></div></a>
      <a class="qa" href="${CALC}"><span class="ic">${IC.calc}</span><div><b>Measure a job first</b><span>Turf Calculator — get your roll and material counts</span></div></a>
      <div class="qa"><span class="ic">${IC.acct.replace('currentColor','#22372B')}</span><div><b>Your rep: ${esc(c.rep)}</b><span>(631) 651-5777 · ${SALES}</span></div></div>
    </div>
  </div>`);
}
function orderTable(list){
  if (!list.length) return `<div class="empty">${IC.orders.replace('currentColor','#CFE4B1')}<p>No orders yet.</p></div>`;
  return `<div class="tw"><table class="tbl"><thead><tr><th>Order</th><th>Job</th><th>Date</th><th>Status</th><th style="text-align:right">Total</th></tr></thead><tbody>
  ${list.map(o => `<tr class="click" data-o="${o.no}"><td><b>${o.no}</b></td><td>${esc(o.job)}</td><td>${new Date(o.date+'T12:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}</td><td><span class="chip s-${o.status}">${o.status}</span></td><td style="text-align:right">${money(o.total)}</td></tr>`).join('')}</tbody></table></div>`;
}
function wireOrders(){ $$('tr[data-o]').forEach(r => r.addEventListener('click', () => { const o = S.orders.find(x => x.no === r.dataset.o), c = S.contractors.find(x => x.id === o.cid);
  const steps = ['Requested','Confirmed','Scheduled','Delivered'], at = o.status === 'Paid' ? 1 : steps.indexOf(o.status);
  modal(`<div class="eye">${o.no} · ${esc(c ? c.co : '')}</div><h2>${esc(o.job)}</h2>
  <div style="display:flex;gap:6px;margin:14px 0 18px">${steps.map((s,i) => `<div style="flex:1"><div style="height:6px;border-radius:3px;background:${i<=at?'var(--vf)':'var(--line)'};transition:background .4s ${i*.12}s"></div><div class="note" style="margin-top:6px;${i<=at?'color:var(--ds);font-weight:700':''}">${s}</div></div>`).join('')}</div>
  ${o.items.map(i => `<div class="line" style="grid-template-columns:1fr auto"><div><b>${esc(i[0])}</b><span>${esc(i[1])}</span></div></div>`).join('')}
  ${o.pay ? `<p class="note" style="margin-top:8px">Payment: ${esc(o.pay)}</p>` : ''}
  <div class="sum" style="margin-top:10px"><div class="tot"><span>Total</span><span>${money(o.total)}</span></div></div>
  <button class="btn btn-d" data-close style="margin-top:18px;width:100%">Close</button>`); })); }

function shop(sub){
  const isMat = sub === 'materials', d = disc();
  shell('shop', `<div class="ph1"><div><div class="eye">Order</div><h1>${isMat ? 'Install materials' : 'Turf'}</h1><p class="mute">Prices shown with your ${me().disc}% contractor discount. <b>Sample pricing for this demo.</b></p></div>
  <a class="btn btn-l" href="${CALC}">Not sure how much? Turf Calculator →</a></div>
  <div class="tabs" id="tabs"><span class="pill"></span><button data-t="" class="${isMat?'':'on'}">Turf</button><button data-t="materials" class="${isMat?'on':''}">Materials</button></div>
  <div class="prods stagger">${isMat ? MATS.map(m => `<div class="prod" data-m="${m.id}"><div class="mi">${ICON[m.i]}</div><div class="b"><h3>${m.n}</h3><div class="d">${m.d} · ${m.u}</div>
      <div class="price"><b>${money(m.p*(1-d))}</b><s>${money(m.p)}</s><em>−${me().disc}%</em><span class="note">/ ${m.u.split(' ').slice(-1)[0]==='bag'?'bag':m.u}</span></div>
      <div class="qty" style="grid-template-columns:1fr"><div><label>Quantity</label><input class="inp q" type="number" min="1" value="1" inputmode="numeric"></div></div>
      <div class="sub"></div><button class="btn btn-v add">Add to order</button></div></div>`).join('')
    : TURF.map(t => `<div class="prod" data-t="${t.id}"><div class="sw"><span class="tag">${t.c}</span></div><div class="b"><h3>${t.n}</h3><div class="d">${t.d}</div>
      <div class="price"><b>${money(t.p*(1-d))}</b><s>${money(t.p)}</s><em>−${me().disc}%</em><span class="note">/ sq ft</span></div>
      <div class="qty"><div><label>Roll length (ft)</label><input class="inp len" type="number" min="5" max="100" value="50" inputmode="numeric"></div><div><label>Rolls (15′ wide)</label><input class="inp q" type="number" min="1" value="1" inputmode="numeric"></div></div>
      <div class="sub"></div><button class="btn btn-v add">Add to order</button></div></div>`).join('')}</div>`);
  const tabs = $('#tabs'), pill = $('.pill', tabs), mv = () => { const on = $('.on', tabs); pill.style.left = on.offsetLeft + 'px'; pill.style.width = on.offsetWidth + 'px'; };
  mv(); $$('button', tabs).forEach(b => b.addEventListener('click', () => { $$('button', tabs).forEach(x => x.classList.toggle('on', x === b)); mv(); setTimeout(() => { location.hash = '#shop' + (b.dataset.t ? '/' + b.dataset.t : ''); }, 260); }));
  $$('.prod').forEach(p => {
    const upd = () => { const q = Math.max(1, +$('.q', p).value || 1); let line;
      if (p.dataset.t){ const len = Math.min(100, Math.max(5, +$('.len', p).value || 50)); line = turfLine(TURF.find(t => t.id === p.dataset.t), len, q); }
      else line = matLine(MATS.find(m => m.id === p.dataset.m), q);
      $('.sub', p).innerHTML = `${line.type==='turf' ? line.sf.toLocaleString() + ' sq ft · ' : ''}<b>${money(line.list*(1-d))}</b> with your discount`; return line; };
    $$('input', p).forEach(i => i.addEventListener('input', upd)); upd();
    $('.add', p).addEventListener('click', () => { addToCart(upd()); const b = $('.add', p); b.classList.remove('added'); void b.offsetWidth; b.classList.add('added'); b.textContent = 'Added ✓'; setTimeout(() => b.textContent = 'Add more', 1400); });
  });
}

function cartPage(){
  const c = cart(), t = totals(c);
  if (!c.length) return shell('cart', `<div class="ph1"><div><div class="eye">Cart</div><h1>Your order</h1></div></div><div class="card empty">${IC.cart.replace('currentColor','#CFE4B1')}<p>Your order is empty.</p><a class="btn btn-v" href="#shop" style="margin-top:14px">Browse turf →</a></div>`);
  shell('cart', `<div class="ph1"><div><div class="eye">Cart</div><h1>Review your order</h1></div><a class="btn btn-l" href="#shop">+ Add more</a></div>
  <div class="grid g2"><div class="grid" style="align-content:start">
    <div class="card"><h2 style="font-size:1.5rem;margin-bottom:6px">Items</h2>${c.map((l,i) => `<div class="line"><div><b>${esc(l.n)}</b><span>${esc(l.desc)}</span></div><div style="text-align:right"><b>${money(l.list*(1-disc()))}</b><span><s>${money(l.list)}</s></span></div><button class="x" data-i="${i}" aria-label="Remove">×</button></div>`).join('')}</div>
    <div class="card grid"><h2 style="font-size:1.5rem">Job details</h2>
      <div class="grid" style="grid-template-columns:1fr 1fr"><div class="field"><label>Job name</label><input class="inp" id="job" placeholder="e.g. Smith backyard"></div><div class="field"><label>Your PO # (optional)</label><input class="inp" id="po"></div></div>
      <div class="opt"><label><input type="radio" name="dl" value="Delivery" checked><div><b>Deliver to job site</b><span>Truck delivery across the Tri-State</span></div></label><label><input type="radio" name="dl" value="Pickup"><div><b>Pick up in Commack</b><span>6137 Jericho Turnpike</span></div></label></div>
      <div class="grid" style="grid-template-columns:1fr 1fr"><div class="field"><label>Job site address</label><input class="inp" id="addr" placeholder="Street, town"></div><div class="field"><label>Needed by</label><input class="inp" id="when" type="date"></div></div>
      <div class="field"><label>Notes for the warehouse</label><textarea class="inp" id="notes" rows="2" placeholder="Gate code, site access, anything else"></textarea></div>
    </div></div>
    <div class="card" style="align-self:start;position:sticky;top:20px"><h2 style="font-size:1.5rem;margin-bottom:14px">Summary</h2>
      <div class="sum"><div><span>List price</span><span>${money(t.list)}</span></div><div class="disc"><span>Your ${me().disc}% discount</span><span>−${money(t.off)}</span></div><div class="tot"><span>Total</span><span>${money(t.net)}</span></div></div>
      <p class="note" style="margin:10px 0 18px">Tax and delivery are confirmed by your rep.</p>
      <div class="eye" style="margin-bottom:8px">How do you want to place it?</div>
      <div class="opt" style="grid-template-columns:1fr"><label><input type="radio" name="pay" value="sales" checked><div><b>Send to sales to confirm</b><span>Your rep confirms stock and delivery, then invoices you.</span></div></label>
      <label><input type="radio" name="pay" value="card"><div><b>Pay online now</b><span>Card or ACH through Turf Tek's payment processor. <i>Demo — not connected.</i></span></div></label></div>
      <button class="btn btn-v" id="place" style="width:100%;margin-top:16px">Place order →</button></div>
  </div>`);
  $$('.x').forEach(b => b.addEventListener('click', () => { const row = b.closest('.line'); row.style.transition = 'opacity .3s, transform .3s'; row.style.opacity = 0; row.style.transform = 'translateX(20px)'; setTimeout(() => { cart().splice(+b.dataset.i, 1); save(); cartPage(); }, 280); }));
  $('#place').addEventListener('click', placeOrder);
}
function placeOrder(){
  const c = me(), items = cart(), t = totals(items), job = $('#job').value.trim() || 'Untitled job', pay = $('input[name=pay]:checked').value, dl = $('input[name=dl]:checked').value;
  if (dl === 'Delivery' && !$('#addr').value.trim()){ $('#addr').focus(); $('#addr').style.borderColor = 'var(--red)'; return toast('Add the job site address for delivery'); }
  const no = 'TT-' + (24871 + S.orders.length);
  const o = {no, cid:c.id, date:new Date().toISOString().slice(0,10), job, status: pay === 'card' ? 'Paid' : 'Requested', total:Math.round(t.net*100)/100, items:items.map(l => [l.n, l.desc]), pay: pay === 'card' ? 'Paid online (demo)' : 'Invoice after confirmation'};
  const body = [`Contractor order ${no}`, `${c.co} (${c.id}) — ${c.disc}% contractor discount`, `Job: ${job}${$('#po').value ? ' · PO ' + $('#po').value : ''}`, `${dl}${dl==='Delivery' ? ': ' + $('#addr').value : ''}${$('#when').value ? ' · needed by ' + $('#when').value : ''}`, '', ...items.map(l => `• ${l.n} — ${l.desc} — ${money(l.list*(1-disc()))}`), '', `List ${money(t.list)} · Discount −${money(t.off)} · Total ${money(t.net)}`, $('#notes').value ? 'Notes: ' + $('#notes').value : ''].join('\n');
  S.orders.push(o); S.carts[c.id] = []; save();
  const go = () => {
    const mail = `mailto:${SALES}?subject=${encodeURIComponent('Contractor order ' + no + ' — ' + c.co)}&body=${encodeURIComponent(body)}`;
    const md = modal(`<div class="check"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#22372B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="eye">${no}</div><h2>${pay === 'card' ? 'Paid — thank you!' : 'Order sent to sales.'}</h2>
      <p class="mute">${pay === 'card' ? 'In the live portal your payment is processed and the warehouse is notified right away.' : 'Your rep will confirm stock and delivery, then invoice you. You can track it under My orders.'}</p>
      <div class="sum" style="margin:16px 0"><div><span>${items.length} item${items.length>1?'s':''}</span><span>${esc(job)}</span></div><div class="tot"><span>Total</span><span>${money(t.net)}</span></div></div>
      <p class="note">Demo: nothing was sent automatically. <a href="${mail}" style="text-decoration:underline">Open this order as an email</a> to see what sales would receive.</p>
      <div style="display:flex;gap:10px;margin-top:18px"><a class="btn btn-d" href="#orders" data-close style="flex:1">Track order</a><button class="btn btn-l" data-close style="flex:1">Done</button></div>`);
    location.hash = '#orders';
  };
  if (pay === 'card'){
    const md = modal(`<div class="eye">Pay online</div><h2>${money(t.net)}</h2><p class="mute">In the live portal this step opens Turf Tek's secure payment page (card or ACH). This demo doesn't collect any payment details.</p>
      <div style="display:flex;gap:10px;margin-top:20px"><button class="btn btn-v" id="fakepay" style="flex:1">Simulate payment →</button><button class="btn btn-l" data-close id="cancelpay">Cancel</button></div>`);
    $('#fakepay').addEventListener('click', () => { md.close(); setTimeout(go, 300); });
    $('#cancelpay').addEventListener('click', () => { S.orders.pop(); S.carts[c.id] = items; save(); });
  } else go();
}
function ordersPage(){
  const my = S.orders.filter(o => o.cid === S.session).slice().reverse();
  shell('orders', `<div class="ph1"><div><div class="eye">Orders</div><h1>My orders</h1><p class="mute">Tap an order to see its status and items.</p></div><a class="btn btn-v" href="#shop">New order →</a></div><div class="card">${orderTable(my)}</div>`);
  wireOrders();
}
function account(){
  const c = me(), t = tierFor(c.disc);
  shell('account', `<div class="ph1"><div><div class="eye">Account</div><h1>${esc(c.co)}</h1></div></div>
  <div class="grid g3 stagger">
    <div class="card"><div class="eye">Contractor ID</div><div class="big" style="margin-top:8px">${c.id}</div><p class="note" style="margin-top:6px">Use this ID with your PIN to log in.</p></div>
    <div class="card"><div class="eye">Pricing tier</div><div class="big" style="margin-top:8px">${t} · ${c.disc}%</div><p class="note" style="margin-top:6px">Applied automatically to turf and materials.</p></div>
    <div class="card"><div class="eye">Your rep</div><div class="big" style="margin-top:8px">${esc(c.rep)}</div><p class="note" style="margin-top:6px">(631) 651-5777 · ${SALES}</p></div>
  </div>
  <div class="card grid" style="margin-top:16px;max-width:640px"><h2 style="font-size:1.5rem">Company details</h2>
    <div class="field"><label>Contact</label><input class="inp" value="${esc(c.name)}" disabled></div><div class="field"><label>Phone</label><input class="inp" value="${esc(c.phone)}" disabled></div><div class="field"><label>Base town</label><input class="inp" value="${esc(c.town)}" disabled></div>
    <p class="note">To change your details or PIN, contact your rep. Tiers: Silver 10%, Gold 15%, Platinum 20% (sample).</p></div>`);
}

/* ---------- Staff back office ---------- */
function admin(){
  shell('admin', `<div class="ph1"><div><div class="eye">Back office</div><h1>Contractors</h1><p class="mute">Set each contractor's discount and PIN. Changes apply the next time they log in.</p></div><button class="btn btn-v" id="addc">+ Add contractor</button></div>
  <div class="card"><div class="tw"><table class="tbl"><thead><tr><th>ID</th><th>Company</th><th>PIN</th><th>Discount</th><th>Tier</th><th>Orders</th><th></th></tr></thead><tbody>
  ${S.contractors.map(c => `<tr data-c="${c.id}"><td><b>${c.id}</b></td><td>${esc(c.co)}<div class="note">${esc(c.name)} · ${esc(c.town)}</div></td><td><input class="inp pct pin" value="${esc(c.pin)}" maxlength="6"></td><td><input class="inp pct dsc" type="number" min="0" max="40" value="${c.disc}">%</td><td><span class="chip" style="background:${TIERS[tierFor(c.disc)].c}">${tierFor(c.disc)}</span></td><td>${S.orders.filter(o => o.cid === c.id).length}</td><td><button class="btn btn-l btn-sm sv">Save</button></td></tr>`).join('')}
  </tbody></table></div></div>
  <p class="note" style="margin-top:14px">Demo: changes are saved in this browser only. <button id="reset" style="text-decoration:underline">Reset demo data</button></p>`);
  $$('tr[data-c]').forEach(r => { $('.sv', r).addEventListener('click', () => { const c = S.contractors.find(x => x.id === r.dataset.c); c.disc = Math.max(0, Math.min(40, +$('.dsc', r).value || 0)); c.pin = $('.pin', r).value.trim() || c.pin; save(); toast(`${c.co}: ${c.disc}% saved`); admin(); }); });
  $('#reset').addEventListener('click', () => { S = SEED(); S.session = 'STAFF'; save(); toast('Demo data reset'); admin(); });
  $('#addc').addEventListener('click', () => { const md = modal(`<div class="eye">New contractor</div><h2>Add a contractor</h2><div class="grid" style="margin-top:12px">
    <div class="field"><label>Company</label><input class="inp" id="nco"></div><div class="field"><label>Contact name</label><input class="inp" id="nnm"></div><div class="field"><label>Town</label><input class="inp" id="ntw"></div>
    <div class="grid" style="grid-template-columns:1fr 1fr"><div class="field"><label>Discount %</label><input class="inp" id="nds" type="number" value="10"></div><div class="field"><label>PIN</label><input class="inp" id="npn" value="${Math.floor(1000+Math.random()*9000)}"></div></div>
    <button class="btn btn-v" id="nsave">Create contractor ID →</button></div>`);
    $('#nsave').addEventListener('click', () => { if (!$('#nco').value.trim()) return $('#nco').focus(); const id = 'TT-' + (4000 + S.contractors.length * 37);
      S.contractors.push({id, pin:$('#npn').value.trim(), co:$('#nco').value.trim(), name:$('#nnm').value.trim() || 'Contractor', disc:+$('#nds').value || 0, rep:'Rick', phone:'', town:$('#ntw').value.trim()}); save(); md.close(); toast(`Created ${id}`); setTimeout(admin, 300); }); });
}
function allOrders(){
  const list = S.orders.slice().reverse();
  shell('allorders', `<div class="ph1"><div><div class="eye">Back office</div><h1>All orders</h1><p class="mute">Move orders along as they're confirmed, scheduled and delivered.</p></div></div>
  <div class="card"><div class="tw"><table class="tbl"><thead><tr><th>Order</th><th>Contractor</th><th>Job</th><th>Total</th><th>Status</th></tr></thead><tbody>
  ${list.map(o => { const c = S.contractors.find(x => x.id === o.cid); return `<tr><td><b>${o.no}</b><div class="note">${o.date}</div></td><td>${esc(c ? c.co : o.cid)}</td><td>${esc(o.job)}</td><td>${money(o.total)}</td><td><select class="inp st" data-o="${o.no}" style="padding:.45em .6em;width:auto">${['Requested','Paid','Confirmed','Scheduled','Delivered'].map(s => `<option ${s===o.status?'selected':''}>${s}</option>`).join('')}</select></td></tr>`; }).join('')}
  </tbody></table></div></div>`);
  $$('.st').forEach(s => s.addEventListener('change', () => { S.orders.find(o => o.no === s.dataset.o).status = s.value; save(); toast(`${s.dataset.o} → ${s.value}`); }));
}

/* ---------- Router ---------- */
function route(){
  const [page, sub] = (location.hash.slice(1) || '').split('/');
  if (!S.session) return login();
  if (S.session === 'STAFF'){ document.title = 'Back office | Turf Tek'; return page === 'allorders' ? allOrders() : admin(); }
  if (!me()){ S.session = null; save(); return login(); }
  document.title = 'Contractor Portal | Turf Tek';
  ({shop:() => shop(sub), cart:cartPage, orders:ordersPage, account}[page] || dash)();
  window.scrollTo(0,0);
}
addEventListener('hashchange', route);
route();

/* opening animation */
(function(){ const el = $('#intro'); if (!el) return; if (matchMedia('(prefers-reduced-motion: reduce)').matches){ el.remove(); return; }
  let done = false; const leave = () => { if (done) return; done = true; el.classList.add('out'); setTimeout(() => el.remove(), 750); };
  setTimeout(leave, 2950); el.addEventListener('click', leave); })();
})();
