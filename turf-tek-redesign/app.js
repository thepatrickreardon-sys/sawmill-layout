/* Turf Tek USA redesign concept — router, menus and animations */
(function(){
const $ = (s, el=document) => el.querySelector(s), $$ = (s, el=document) => [...el.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const P = k => PAGES[k];
const label = k => P(k) ? P(k).nav : k;
const img = id => IMG(id);
const bg = id => `style="background-image:url('${img(id)}')"`;
const caret = '<svg class="caret" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const grass = (pat='grassV', cls='') => `<svg class="grass ${cls}" aria-hidden="true"><rect x="-30" y="0" width="110%" height="64" fill="url(#${pat})" filter="url(#wind)"/></svg>`;
const arrow = '<span class="ar">→</span>';
$('#calcTop').href = CALC; $('#calcFoot').href = CALC;

/* ---------- Desktop menu with smooth, forgiving dropdowns ---------- */
const menu = $('#menu');
menu.innerHTML = MENU.map((m, mi) => {
  if (!m.cols) return `<li><a class="top" href="#${m.k}" data-k="${m.k}">${m.label}</a></li>`;
  let i = 0;
  const cols = m.cols.map(c => `<div>${c.hub ? `<h4><a href="#${c.hub}">${c.title} →</a></h4>` : `<h4>${c.title}</h4>`}${c.items.map(k => `<a class="it stag" style="--i:${i++}" href="#${k}">${esc(label(k))}</a>`).join('')}</div>`).join('');
  return `<li class="dd"><a class="top" href="#${m.k}" data-k="${m.k}" aria-haspopup="true" aria-expanded="false">${m.label}${caret}</a><div class="panel" role="menu">${cols}</div></li>`;
}).join('') ;
$$('.menu .dd').forEach(li => {
  let t;
  const open = () => { clearTimeout(t); $$('.menu .dd.open').forEach(o => o !== li && close(o)); li.classList.add('open'); li.firstElementChild.setAttribute('aria-expanded','true'); };
  const close = (el=li) => { el.classList.remove('open'); el.firstElementChild.setAttribute('aria-expanded','false'); };
  li.addEventListener('mouseenter', () => { clearTimeout(t); t = setTimeout(open, 70); });
  li.addEventListener('mouseleave', () => { clearTimeout(t); t = setTimeout(() => close(), 220); });
  li.addEventListener('focusin', open);
  li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) close(); });
  li.addEventListener('keydown', e => { if (e.key === 'Escape'){ close(); li.firstElementChild.focus(); } });
  li.querySelector('.top').addEventListener('click', e => { if (matchMedia('(hover:none)').matches && !li.classList.contains('open')){ e.preventDefault(); open(); } });
});
document.addEventListener('click', e => { if (!e.target.closest('.menu')) $$('.menu .dd.open').forEach(o => o.classList.remove('open')); });

/* ---------- Mobile drawer with smooth accordions ---------- */
const drawer = $('#drawer');
drawer.innerHTML = `<a class="solo" href="#home">Home</a>` + MENU.map(m => !m.cols ? `<a class="solo" href="#${m.k}">${m.label}</a>` :
  `<div class="grp"><button class="gh" aria-expanded="false">${m.label}${caret}</button><div class="gb"><div>${m.k!=='about'?`<a href="#${m.k}"><b>All ${m.label}</b></a>`:''}${m.cols.map(c => `<h5>${c.title}</h5>${c.hub?`<a href="#${c.hub}">All ${c.title}</a>`:''}${c.items.map(k => `<a href="#${k}">${esc(label(k))}</a>`).join('')}`).join('')}</div></div></div>`).join('') +
  `<a class="solo" href="#contact">Contact Us</a><a class="btn btn-v" href="#contact">Free Estimate ${arrow}</a><a class="btn btn-o" href="tel:6316515777">Call (631) 651-5777</a>`;
$$('.gh', drawer).forEach(b => b.addEventListener('click', () => { const g = b.parentElement, o = !g.classList.contains('open'); $$('.grp', drawer).forEach(x => x.classList.remove('open')); g.classList.toggle('open', o); b.setAttribute('aria-expanded', o); }));
const setDrawer = o => document.body.classList.toggle('mopen', o);
$('#burger').addEventListener('click', () => setDrawer(!document.body.classList.contains('mopen')));
$('#drawerBg').addEventListener('click', () => setDrawer(false));

/* footer links */
$('#fCom').innerHTML = ['commercial-landscape','commercial-playgrounds','sport-fields','putting-greens','rooftops','nextgen'].map(k => `<li><a href="#${k}">${label(k)}</a></li>`).join('');
$('#fRes').innerHTML = ['residential-landscape','residential-pet-areas','residential-playgrounds','residential-putting','products','faqs'].map(k => `<li><a href="#${k}">${label(k)}</a></li>`).join('');

/* ---------- Shared blocks ---------- */
const crumbs = k => { const path = []; let c = P(k); while (c && c.parent && c.parent !== k && !path.includes(c.parent)){ path.unshift(c.parent); if (c.parent === 'about') break; c = P(c.parent); }
  return `<nav class="crumbs in" aria-label="Breadcrumb"><a href="#home">Home</a>${path.map(p => `<span>/</span><a href="#${p}">${label(p)}</a>`).join('')}<span>/</span><b>${esc(label(k))}</b></nav>`; };
const hero = (k, d) => `<header class="hero ${d.home ? '' : 'sub'}"><div class="bg ph" ${bg(d.hero.img)}></div><div class="wrap">
  ${d.home ? '' : crumbs(k)}<div class="eye in">${esc(d.hero.eye)}</div>
  <h1 class="in" style="margin-top:12px">${esc(d.hero.h)} <span class="acc">${esc(d.hero.acc)}</span></h1>
  <p class="lead in">${esc(d.hero.p)}</p>
  <div class="ctas in"><a class="btn btn-v" href="#contact">Get a free estimate ${arrow}</a>${d.home ? `<a class="btn btn-o" href="#our-work">See our work</a>` : `<a class="btn btn-o" href="tel:6316515777">Call (631) 651-5777</a>`}</div>
</div>${d.home ? '<div class="scroll-cue" aria-hidden="true"></div>' : ''}${grass('grassV')}</header>`;
const kidImg = k => (P(k).hero || {}).img || I.a;
const tile = (k, i) => { const d = P(k); return `<a class="tile rv" style="--d:${i%3}" href="#${k}"><div class="ph" ${bg(kidImg(k))}></div><span class="go">→</span><div class="tx">${d.icon ? `<img class="ic" src="assets/icons/${d.icon}" alt="">` : ''}<h3>${esc(d.nav)}</h3><p>${esc(d.hero.p)}</p></div></a>`; };
const quote = q => q ? `<section style="padding-top:0"><div class="wrap"><div class="quote rv"><div class="stars">★★★★★</div><blockquote>“${esc(q[0])}”</blockquote><cite>— ${esc(q[1])}</cite></div></div></section>` : '';
const related = ks => ks && ks.length ? `<section class="tint"><div class="wrap"><div class="shead"><div><div class="eye">Keep exploring</div><h2>Related services</h2></div></div><div class="rel">${ks.filter(P).map((k,i) => `<a class="relc rv" style="--d:${i}" href="#${k}"><div class="ph" ${bg(kidImg(k))}></div><div><b>${esc(label(k))}</b><span>${esc(P(k).hero.eye)}</span></div></a>`).join('')}</div></div></section>` : '';
const why = () => `<div class="rv" style="--d:1"><div class="eye">Why choose Turf Tek USA?</div><ul class="checks">${WHY.map(w => `<li>${esc(w)}</li>`).join('')}</ul></div>`;
const cta = () => `<section><div class="wrap"><div class="band ds rv"><div><div class="eye">Free estimate</div><h2 style="margin-top:8px">Ready for a lawn that's <span style="color:var(--fb)">always green?</span></h2><p class="mute" style="color:var(--mist)">Talk to a Turf Tek specialist — we'll measure, design and install it with our own crews.</p></div><div class="act"><a class="btn btn-v" href="#contact">Get started ${arrow}</a><a class="btn btn-o" href="tel:6316515777">(631) 651-5777</a></div></div></div></section>`;
const badges = () => `<div class="badges">${[['made-in-usa-icon.png','Made in the USA'],['lead-and-pfas-free-icon.png','Lead & PFAS free'],['uv-defender-icon.png','UV Defender'],['pet-friendly-icon.png','Pet friendly'],['health-protector-icon.png','Health Protector']].map((b,i) => `<div class="rv" style="--d:${i}"><img src="assets/icons/${b[0]}" alt="${b[1]}"><span>${b[1]}</span></div>`).join('')}</div>`;

/* ---------- Page templates ---------- */
function home(){
  const d = P('home');
  return hero('home', d) + `
  <section><div class="wrap">
    <div class="shead"><div class="rv"><div class="eye">What we install</div><h2>Turf for every space.</h2></div><p class="mute rv" style="--d:1">Our products come in plenty of styles and colors designed to look like real grass — without the mowing or seasonal discoloration.</p></div>
    <div class="tiles">${['residential-landscape','commercial-playgrounds','sport-fields','residential-pet-areas','putting-greens','rooftops'].map(tile).join('')}</div>
  </div></section>
  <section class="dark"><div class="wrap">
    <div class="stats rv">${[['2010','installing artificial grass since',2010],['400"','per hour drainage rate',400],['100%','American-made products',100],['15+','year playground surface lifespan',15]].map(s => `<div><b data-to="${s[2]}" data-sfx="${s[0].replace(/[0-9]/g,'')}">${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>
  </div></section>
  <section><div class="wrap">
    <div class="split"><div class="media rv-img"><div class="ph" ${bg(I.d)}></div></div>
    <div><div class="eye rv">Installers, engineers & all-around experts</div><h2 class="rv" style="--d:1">We don't hand your yard to a subcontractor.</h2><p class="mute rv" style="--d:2">We directly employ all of our estimators and installers and train every one on our proprietary engineered installation system. Our custom-engineered turf is built for the Northeast's climate — and it looks like it belongs here.</p>${why()}<p class="rv" style="margin-top:26px"><a class="link" href="#about">More about Turf Tek</a></p></div></div>
    ${badges()}
  </div></section>
  <section class="tint"><div class="wrap">
    <div class="shead"><div class="rv"><div class="eye">Our work</div><h2>From concept to completion.</h2></div><div class="strip-nav rv"><button data-s="-1" aria-label="Previous">←</button><button data-s="1" aria-label="Next">→</button></div></div>
    <div class="strip" id="strip">${WORK.map(w => `<a class="shot" href="#our-work"><div class="ph" ${bg(w[2])}></div><div class="tx"><h3>${esc(w[0])}</h3><p>${esc(w[1])}</p></div></a>`).join('')}</div>
  </div></section>
  <section class="dark"><div class="wrap">
    <div class="eye rv">Reviews</div>
    <div class="slider rv" style="margin-top:22px"><div class="slides" id="slides">${REVIEWS.map(r => `<div class="slide"><div class="stars">★★★★★</div><blockquote>“${esc(r[0])}”</blockquote><cite>${esc(r[1])}</cite></div>`).join('')}</div><div class="dots" id="dots"></div></div>
    <p class="rv" style="margin-top:30px"><a class="link" style="color:var(--fb);background-image:linear-gradient(var(--fb),var(--fb))" href="#testimonials">Read all testimonials</a></p>
  </div></section>
  <section><div class="wrap"><div class="band fb rv"><div><div class="eye" style="color:var(--ds)">Special financing</div><h2 style="margin-top:8px">0% financing for 12 months.</h2><p>No interest if paid in full within 12 months.</p></div><div class="act"><a class="btn btn-d" href="#financing">See financing ${arrow}</a></div></div></div></section>
  <section class="dark" style="padding-top:80px"><div class="wrap">
    <div class="shead"><div class="rv"><div class="eye">Serving the Tri-State area</div><h2>Local crews. Our own crews.</h2></div><p class="mute rv">Showroom in Commack, NY. Installing across Long Island, Westchester and Fairfield County.</p></div>
    <div class="areas">${['long-island','westchester','fairfield'].map((k,i) => `<a class="area rv" style="--d:${i}" href="#${k}"><h3>${label(k)}</h3><p>${esc(P(k).hero.p)}</p><span class="link">Learn more</span></a>`).join('')}</div>
  </div></section>
  <section class="tint"><div class="wrap"><div class="split rev"><div class="media rv-img"><div class="ph" ${bg('693438316.jpg')}></div></div>
    <div><div class="eye rv">For contractors & DIY</div><h2 class="rv" style="--d:1">Estimate your turf job in minutes.</h2><p class="mute rv" style="--d:2">Lay out your area, get a roll cut list and full material takeoff — then send it to our sales team for pricing.</p><p class="rv" style="--d:3;margin-top:24px"><a class="btn btn-v" href="${CALC}">Open the Turf Calculator ${arrow}</a></p></div></div></div></section>`
  + cta();
}

function service(k){
  const d = P(k);
  let h = hero(k, d);
  h += `<section><div class="wrap"><div class="split"><div><div class="eye rv">${esc(d.hero.eye)}</div><h2 class="rv" style="--d:1">${(d.parent && d.parent!=='about') ? esc(d.nav)+', done right.' : 'The Turf Tek difference.'}</h2><p class="mute rv" style="--d:2;font-size:1.08rem">${esc(d.intro || '')}</p><p class="rv" style="--d:3;margin-top:26px"><a class="btn btn-v" href="#contact">Get a free estimate ${arrow}</a></p></div>
    <div class="card rv" style="--d:2;padding:32px">${why()}</div></div></div></section>`;
  if (d.list) h += `<section class="tint"><div class="wrap"><div class="shead"><div class="rv"><div class="eye">Benefits</div><h2>Why it works.</h2></div></div><div class="cards">${d.list.map((l,i) => `<div class="card rv" style="--d:${i%4}"><div class="ck"></div><p>${esc(l)}</p></div>`).join('')}</div></div></section>`;
  if (d.gal) h += `<section style="padding-top:${d.list?'0':'0'};${d.list?'background:var(--tint)':''}"><div class="wrap"><div class="gal">${d.gal.map((g,i) => `<button class="gi rv-img" style="--d:${i}" data-img="${img(g)}" aria-label="View photo"><div class="ph" ${bg(g)}></div></button>`).join('')}</div></div></section>`;
  (d.feat || []).forEach((f,i) => { h += `<section><div class="wrap"><div class="split ${i%2?'':'rev'}"><div class="media rv-img"><div class="ph" ${bg(f[2])}></div></div><div><div class="eye rv">Turf Tek USA</div><h2 class="rv" style="--d:1">${esc(f[0])}</h2><p class="mute rv" style="--d:2;font-size:1.08rem">${esc(f[1])}</p><p class="rv" style="--d:3;margin-top:22px"><a class="link" href="#our-work">See finished projects</a></p></div></div></div></section>`; });
  if (d.area) h += `<section style="padding-top:0"><div class="wrap"><div class="shead"><div class="rv"><div class="eye">What we install here</div><h2>Popular in ${esc(label(k))}.</h2></div></div><div class="tiles">${['residential-landscape','residential-pet-areas','residential-putting','commercial-landscape','commercial-playgrounds','sport-fields'].map(tile).join('')}</div></div></section>`;
  if (d.fine) h += `<section style="padding-top:0"><div class="wrap"><div class="band fb rv"><div><h2>12 months special financing.</h2><p>No interest if paid in full within 12 months.</p></div><div class="act"><a class="btn btn-d" href="https://www.turftekusa.com/financing" target="_blank" rel="noopener">Apply now ↗</a></div></div><p class="mute rv" style="font-size:.8rem;margin-top:18px;max-width:860px">${esc(d.fine)}</p></div></section>`;
  return h + quote(d.quote) + related(d.rel) + cta();
}

function hub(k){
  const d = P(k);
  return hero(k, d) + `<section><div class="wrap"><div class="shead"><div class="rv"><div class="eye">${esc(d.hero.eye)}</div><h2>Our ${esc(d.nav.toLowerCase())} services.</h2></div><p class="mute rv" style="--d:1">${esc(d.intro)}</p></div><div class="tiles">${d.kids.map(tile).join('')}</div></div></section>` + quote(d.quote) + cta();
}

function products(){
  const d = P('products');
  return hero('products', d) + `<section><div class="wrap"><div class="shead"><div class="rv"><div class="eye">Our turf lineup</div><h2>Find the right turf.</h2></div><p class="mute rv">Styles for residential, commercial, DIY, pets, golf, city landscapes and all sports.</p></div>
  <div class="chips rv" id="chips"><button class="chip on" data-f="all">All</button><button class="chip" data-f="Landscape">Landscape</button><button class="chip" data-f="Athletic">Athletic</button></div>
  <div class="prods">${PRODUCTS.map((p,i) => `<div class="prod rv" style="--d:${i%4}" data-c="${p[1]}"><div class="sw"></div><div class="tx"><span class="t">${p[1]}</span><h3>${esc(p[0])}</h3><p>${esc(p[2])}</p></div></div>`).join('')}</div>
  </div></section><section class="tint"><div class="wrap">${badges()}</div></section>` + cta();
}

function work(){
  const d = P('our-work');
  return hero('our-work', d) + `<section><div class="wrap"><div class="posts">${WORK.map((w,i) => `<div class="post rv" style="--d:${i%3}"><div class="ph" ${bg(w[2])}></div><div class="tx"><div class="eye">Long Island, NY</div><h3>${esc(w[0])}</h3><p class="mute">${esc(w[1])}</p></div></div>`).join('')}</div></div></section>` + cta();
}

function reviews(){
  const d = P('testimonials');
  return hero('testimonials', d) + `<section><div class="wrap"><div class="revs">${REVIEWS.map((r,i) => `<div class="review rv" style="--d:${i%3}"><div class="stars" style="color:var(--gold)">★★★★★</div><p>“${esc(r[0])}”</p><cite>${esc(r[1])}</cite></div>`).join('')}</div></div></section>` + cta();
}

function faq(){
  const d = P('faqs');
  return hero('faqs', d) + `<section><div class="wrap"><div class="faq">${FAQ.map((q,i) => `<div class="qa rv" style="--d:${i%4}"><button aria-expanded="false"><span>${esc(q[0])}</span><span class="pm" aria-hidden="true"></span></button><div class="a"><div><p>${esc(q[1])}</p></div></div></div>`).join('')}</div></div></section>` + cta();
}

function blog(){
  const d = P('blog'), ims = BLOG_IMG;
  return hero('blog', d) + `<section><div class="wrap"><div class="posts">${BLOG.map((t,i) => `<a class="post rv" style="--d:${i%3}" href="https://www.turftekusa.com/about/blog" target="_blank" rel="noopener"><div class="ph" ${bg(ims[i%ims.length])}></div><div class="tx"><div class="eye">Article</div><h3>${esc(t)}</h3><span class="link" style="align-self:flex-start;margin-top:auto">Read article</span></div></a>`).join('')}</div></div></section>` + cta();
}

function contact(){
  const d = P('contact');
  return hero('contact', d) + `<div class="wrap"><a class="calc-bubble" href="${CALC}"><span class="cb-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#22372B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M8 15h2M12 15h2M8 18h2M12 18h4" stroke="#86C53F"/></svg></span><span><b>Do you know your dimensions?</b>Try our Turf Calculator — lay out your area, get a full material list, and send it straight to us.</span><span class="btn btn-v">Try it ${arrow}</span></a></div><section style="padding-top:60px"><div class="wrap"><div class="split">
    <div><div class="eye rv">Talk to a specialist</div><h2 class="rv" style="--d:1">Tell us about your project.</h2><p class="mute rv" style="--d:2">To learn more about our premium synthetic grass systems and get a free estimate, contact us today.</p>
      <ul class="checks rv" style="--d:3"><li><b>Call</b>&nbsp;<a class="link" href="tel:6316515777">(631) 651-5777</a></li><li><b>Visit</b>&nbsp;6137 Jericho Turnpike, Commack, NY 11725</li><li>Serving Long Island, Westchester and Fairfield County</li></ul></div>
    <form class="form rv" id="estForm" style="--d:2"><div class="row"><input required placeholder="First name"><input required placeholder="Last name"></div><div class="row"><input required type="tel" placeholder="Phone"><input type="email" placeholder="Email"></div><input placeholder="Project address or town"><select><option>Residential lawn</option><option>Pet area</option><option>Playground</option><option>Putting green</option><option>Sports field / court</option><option>Commercial landscape</option><option>Rooftop</option><option>Something else</option></select><textarea rows="4" placeholder="Tell us about your space"></textarea><button class="btn btn-v" type="submit">Request my free estimate ${arrow}</button><div class="ok">Thanks! In the live site this sends to the Turf Tek sales team. (Concept only — nothing was sent.)</div></form>
  </div></div></section>`;
}

/* ---------- Router with page transitions ---------- */
const view = $('#view');
function render(k){
  const d = P(k) || P('home'); if (!P(k)) k = 'home';
  let html;
  if (k === 'home') html = home();
  else if (d.hub) html = hub(k);
  else if (d.products) html = products();
  else if (d.work) html = work();
  else if (d.reviews) html = reviews();
  else if (d.faq) html = faq();
  else if (d.blog) html = blog();
  else if (d.contact) html = contact();
  else html = service(k);
  view.innerHTML = html;
  document.title = (k === 'home' ? 'Premium Artificial Grass Provider and Installation in New York' : label(k)) + ' | Turf Tek USA';
  $$('.menu .top').forEach(a => { const top = a.dataset.k; let c = k, on = false; for (let n=0; n<4 && c; n++){ if (c === top){ on = true; break; } c = (P(c)||{}).parent; } if (top==='about' && P(k) && (P(k).parent==='about' || k==='about')) on = true; a.classList.toggle('cur', on); });
  wire();
}
let cur = null;
function go(){
  const k = (location.hash || '#home').slice(1) || 'home';
  if (k === cur) return;
  $$('.menu .dd.open').forEach(o => o.classList.remove('open')); setDrawer(false);
  if (cur === null || RM){ cur = k; render(k); window.scrollTo(0,0); return; }
  cur = k;
  view.classList.add('leaving');
  setTimeout(() => { render(k); window.scrollTo({top:0, behavior:'instant'}); view.classList.remove('leaving'); view.classList.add('entering'); requestAnimationFrame(() => requestAnimationFrame(() => view.classList.remove('entering'))); }, 320);
}
addEventListener('hashchange', go);

/* ---------- Per-page interactions ---------- */
let io;
function wire(){
  io && io.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('on'); if (e.target.matches('.stats')) count(e.target); io.unobserve(e.target); } }), {threshold:.12, rootMargin:'0px 0px -6% 0px'});
  $$('.rv,.rv-img', view).forEach(el => io.observe(el));
  // stats count-up
  function count(box){ $$('b[data-to]', box).forEach(b => { const to = +b.dataset.to, sfx = b.dataset.sfx, from = to > 1000 ? to - 40 : 0, t0 = performance.now(), dur = 1600;
    const step = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); b.textContent = Math.round(from + (to - from) * e) + sfx; if (p < 1) requestAnimationFrame(step); }; if (!RM) requestAnimationFrame(step); }); }
  // gallery strip arrows
  const strip = $('#strip', view); $$('.strip-nav button', view).forEach(b => b.addEventListener('click', () => strip.scrollBy({left: +b.dataset.s * (strip.clientWidth * .8), behavior:'smooth'})));
  // reviews slider
  const slides = $('#slides', view);
  if (slides){ const n = slides.children.length, dots = $('#dots', view); let i = 0, timer;
    dots.innerHTML = Array.from({length:n}, (_, j) => `<button aria-label="Review ${j+1}"></button>`).join('');
    const show = j => { i = (j + n) % n; slides.style.transform = `translateX(-${i*100}%)`; $$('button', dots).forEach((b,x) => b.classList.toggle('on', x === i)); };
    const auto = () => { clearInterval(timer); if (!RM) timer = setInterval(() => { if (!document.contains(slides)) return clearInterval(timer); show(i+1); }, 6500); };
    $$('button', dots).forEach((b,x) => b.addEventListener('click', () => { show(x); auto(); })); show(0); auto();
    let sx = null; slides.addEventListener('touchstart', e => sx = e.touches[0].clientX, {passive:true}); slides.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40){ show(i + (dx < 0 ? 1 : -1)); auto(); } sx = null; });
  }
  // FAQ accordion
  $$('.qa button', view).forEach(b => b.addEventListener('click', () => { const q = b.parentElement, o = !q.classList.contains('open'); q.classList.toggle('open', o); b.setAttribute('aria-expanded', o); }));
  // product filter
  $$('#chips .chip', view).forEach(c => c.addEventListener('click', () => { $$('#chips .chip', view).forEach(x => x.classList.toggle('on', x === c)); const f = c.dataset.f;
    $$('.prod', view).forEach(p => { const show = f === 'all' || p.dataset.c === f; if (show){ p.classList.remove('hide'); p.animate && !RM && p.animate([{opacity:0, transform:'translateY(14px) scale(.98)'},{opacity:1, transform:'none'}], {duration:450, easing:'cubic-bezier(.22,.8,.24,1)'}); } else p.classList.add('hide'); }); }));
  // photo lightbox
  $$('.gi', view).forEach(b => b.addEventListener('click', () => { const lb = document.createElement('div'); lb.className = 'lb'; lb.innerHTML = `<img src="${b.dataset.img}" alt=""><button aria-label="Close">×</button>`; document.body.appendChild(lb); requestAnimationFrame(() => lb.classList.add('on')); const close = () => { lb.classList.remove('on'); setTimeout(() => lb.remove(), 400); }; lb.addEventListener('click', close); addEventListener('keydown', function k(e){ if (e.key==='Escape'){ close(); removeEventListener('keydown', k); } }); }));
  // contact form (concept)
  const f = $('#estForm', view); f && f.addEventListener('submit', e => { e.preventDefault(); f.classList.add('sent'); });
}

/* ---------- Scroll state ---------- */
let tick = false;
addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(() => { document.body.classList.toggle('scrolled', scrollY > 40); tick = false; }); }, {passive:true});
$('#totop').addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

go();
})();
