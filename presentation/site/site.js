/* =====================================================================
   site.js — shared header, footer & page behaviours for Moores
   Each page sets <body data-page="home|story|range|own|consult">
   and includes:  <script src="site.js"></script>

   EDITING GUIDE (for non-developers):
   - Phone number: change PHONE and PHONE_HREF below (one place, whole site)
   - Nav links: edit the NAV list below
   - Footer address: edit the ADDR string below
   ===================================================================== */
(function () {
  /* ------------ EDIT THESE ------------- */
  var PHONE = '01342 310810';
  var PHONE_HREF = 'tel:+441342310810';
  var EMAIL = 'contact@mooreshomeandgarden.com';
  var ADDR = 'Meridian Court, Legsheath Lane,<br>East Grinstead, West Sussex, RH19 4JW';
  var HOME = 'index.html';
  var NAV = [
    ['story', 'Our Story', 'our-story.html'],
    ['range', 'The Range', 'the-range.html'],
    ['fragrances', 'Fragrances', 'fragrances.html'],
    ['own', 'Own Branding', 'own-branding.html'],
    ['consult', 'Contact', 'consultation.html']
  ];
  var CONSULT = 'consultation.html';
  /* ---- Newsletter (EmailOctopus) ---- */
  var NEWSLETTER_EO_SRC = 'https://eocampaign1.com/form/53a3148a-668e-11f1-a5ae-3b85e0858f90.js';
  var NEWSLETTER_EO_FORM = '53a3148a-668e-11f1-a5ae-3b85e0858f90';
  var NEWSLETTER_DELAY = 999999999; // presentation copy: auto-popup disabled
  var NEWSLETTER_SNOOZE_DAYS = 30;  // once seen, don't auto-show again for this long
  /* ------------------------------------- */

  var MARK = '<svg class="mark" viewBox="0 0 30 38" fill="none" aria-hidden="true">' +
    '<path d="M15 1.6 C9.2 10.4 6 14.8 6 21.8 a9 9 0 0 0 18 0 C24 14.8 20.8 10.4 15 1.6 Z" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>' +
    '<path d="M15 13.8 C12.1 17.6 11 19.6 11 22.6 a4 4 0 0 0 8 0 C19 19.6 17.9 17.6 15 13.8 Z" stroke-width="1.15" stroke-linejoin="round" stroke-linecap="round"/>' +
    '<path d="M15 30.8 L15 37" stroke-width="1.4" stroke-linecap="round"/></svg>';

  var TEL_ICON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:14px;height:14px;flex:none;">' +
    '<path d="M3 1.8 h2.4 l1.2 3 -1.5 1.2 a8.5 8.5 0 0 0 4.9 4.9 l1.2-1.5 3 1.2 v2.4 a1.2 1.2 0 0 1-1.3 1.2 A12.2 12.2 0 0 1 1.8 3.1 1.2 1.2 0 0 1 3 1.8 Z"/></svg>';

  var CSS = `
  .site-head{position:sticky;top:0;z-index:50;background:color-mix(in oklab,var(--paper) 88%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid transparent;transition:border-color .4s var(--ease),background .4s var(--ease);}
  .site-head.scrolled{border-color:var(--line);background:color-mix(in oklab,var(--paper) 95%,transparent);}
  .head-inner{display:flex;align-items:center;justify-content:space-between;gap:20px;height:84px;}
  .nav{display:flex;align-items:center;gap:clamp(20px,2.6vw,34px);}
  .nav a{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink);position:relative;padding:4px 0;white-space:nowrap;}
  .nav a::after{content:'';position:absolute;left:0;bottom:-2px;width:0;height:1px;background:var(--sienna);transition:width .35s var(--ease);}
  .nav a:hover{color:var(--sienna);} .nav a:hover::after{width:100%;}
  .nav a.active{color:var(--sienna);} .nav a.active::after{width:100%;}
  .head-cta{display:flex;align-items:center;gap:clamp(14px,1.8vw,24px);}
  .head-cta .btn{white-space:nowrap;}
  .head-tel{display:inline-flex;align-items:center;gap:8px;font-family:var(--sans);font-weight:500;font-size:15px;letter-spacing:.05em;color:var(--ink);white-space:nowrap;transition:color .3s var(--ease);}
  .head-tel:hover{color:var(--sienna);}
  .head-tel svg{color:var(--sienna);}
  /* burger */
  .burger{display:none;background:none;border:0;cursor:pointer;padding:10px;margin-right:-10px;}
  .burger span{display:block;width:22px;height:1.5px;background:var(--ink);margin:5px 0;transition:transform .3s var(--ease),opacity .3s var(--ease);}
  body.menu-open .burger span:nth-child(1){transform:translateY(6.5px) rotate(45deg);}
  body.menu-open .burger span:nth-child(2){opacity:0;}
  body.menu-open .burger span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg);}
  /* mobile menu panel */
  .mob-menu{display:none;position:fixed;inset:84px 0 0 0;z-index:49;background:var(--paper);padding:34px var(--gut) 40px;flex-direction:column;gap:4px;overflow:auto;}
  body.menu-open .mob-menu{display:flex;}
  .mob-menu a.mnav{font-family:var(--display);font-size:32px;color:var(--ink);padding:14px 0;border-bottom:1px solid var(--line);}
  .mob-menu a.mnav.active{color:var(--sienna);}
  .mob-menu .m-actions{margin-top:28px;display:flex;flex-direction:column;gap:14px;}
  .mob-menu .m-tel{display:flex;align-items:center;gap:12px;font-family:var(--sans);font-weight:500;font-size:20px;color:var(--ink);}
  .mob-menu .m-tel svg{color:var(--sienna);width:18px;height:18px;}
  .mob-menu .m-note{font-size:13.5px;color:var(--ink-soft);}
  /* staged collapse — keep the full nav visible as long as it genuinely fits */
  @media (max-width:1120px){ .head-tel{display:none;} }
  @media (max-width:1000px){ .head-cta .btn{display:none;} .nav{gap:clamp(15px,2vw,24px);} }
  @media (max-width:860px){
    .nav{display:none;}
    .burger{display:block;}
  }
  @media (min-width:861px){body.menu-open .mob-menu{display:none;}}
  .logo{display:flex;align-items:center;gap:13px;}
  .logo .mark{width:30px;height:38px;flex:none;} .logo .mark path{stroke:var(--sienna);fill:none;}
  .logo .wm{display:flex;flex-direction:column;line-height:1;}
  .logo .wm .name{font-family:var(--sans);font-weight:600;font-size:20px;letter-spacing:.22em;text-transform:uppercase;color:var(--ink);}
  .logo .wm .sub{font-family:var(--sans);font-weight:500;font-size:8.5px;letter-spacing:.34em;text-transform:uppercase;color:var(--ink-soft);margin-top:7px;}
  @media (max-width:420px){.logo .wm .name{font-size:17px;}.logo .wm .sub{font-size:7.5px;}}
  /* call band under CTAs (used by pages) */
  .call-line{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:22px;font-family:var(--sans);font-size:15px;color:var(--ink-soft);flex-wrap:wrap;}
  .call-line a{display:inline-flex;align-items:center;gap:8px;font-weight:500;color:var(--ink);border-bottom:1px solid var(--sienna);padding-bottom:1px;}
  .call-line a:hover{color:var(--sienna);}
  .call-line a svg{color:var(--sienna);}
  .cta-band .call-line{color:color-mix(in oklab,var(--paper) 65%,transparent);}
  .cta-band .call-line a{color:var(--paper);border-color:var(--brass);}
  .cta-band .call-line a svg{color:var(--brass);}
  .cta-band .call-line a:hover{color:var(--brass);}
  /* footer */
  .foot{background:var(--ink);color:var(--paper);padding-block:clamp(54px,8vh,96px) 34px;}
  .foot .logo .wm .name,.foot .logo .wm .sub{color:var(--paper);}
  .foot .logo .mark path{stroke:color-mix(in oklab,var(--brass) 90%,white);}
  .foot-grid{display:grid;grid-template-columns:1.4fr 1fr 1.3fr;gap:clamp(34px,5vw,72px);padding-bottom:48px;border-bottom:1px solid color-mix(in oklab,var(--paper) 18%,transparent);}
  .foot h4{font-family:var(--sans);font-weight:500;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:color-mix(in oklab,var(--paper) 60%,transparent);margin:0 0 18px;}
  .foot a{color:color-mix(in oklab,var(--paper) 82%,transparent);font-size:15px;display:block;padding:5px 0;}
  .foot a:hover{color:var(--paper);}
  .foot .addr{color:color-mix(in oklab,var(--paper) 70%,transparent);font-size:15px;line-height:1.8;max-width:30ch;margin-top:22px;}
  .foot-tel{display:inline-flex;align-items:center;gap:12px;font-family:var(--display);font-size:clamp(24px,2.6vw,30px);color:var(--paper) !important;padding:2px 0 !important;margin-top:4px;}
  .foot-tel svg{color:var(--brass);width:19px;height:19px;}
  .foot-tel:hover{color:color-mix(in oklab,var(--brass) 85%,white) !important;}
  .foot .tel-note{font-size:13px;color:color-mix(in oklab,var(--paper) 55%,transparent);margin-top:6px;line-height:1.6;}
  .foot-base{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;padding-top:28px;font-size:12.5px;color:color-mix(in oklab,var(--paper) 55%,transparent);letter-spacing:.04em;}
  @media (max-width:760px){.foot-grid{grid-template-columns:1fr;gap:40px;}}

  /* ---------- Newsletter modal ---------- */
  .mn-overlay{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;padding:20px;background:color-mix(in oklab,var(--ink) 60%,transparent);backdrop-filter:blur(4px);opacity:0;visibility:hidden;transition:opacity .4s var(--ease),visibility .4s var(--ease);}
  .mn-overlay.open{opacity:1;visibility:visible;}
  .mn-modal{position:relative;width:min(440px,100%);background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:clamp(30px,4vw,46px);box-shadow:0 30px 80px rgba(42,33,26,.32);transform:translateY(14px) scale(.98);transition:transform .45s var(--ease);text-align:center;}
  .mn-overlay.open .mn-modal{transform:none;}
  .mn-close{position:absolute;top:12px;right:12px;width:34px;height:34px;border:0;background:none;cursor:pointer;color:var(--ink-soft);font-size:22px;line-height:1;border-radius:50%;transition:color .3s var(--ease),background .3s var(--ease);}
  .mn-close:hover{color:var(--ink);background:var(--paper-deep);}
  .mn-modal .mn-mark{width:30px;height:38px;margin-bottom:14px;}
  .mn-modal .mn-mark path{stroke:var(--sienna);fill:none;}
  .mn-eyebrow{font-family:var(--sans);font-weight:400;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--sienna);margin:0 0 10px;}
  .mn-modal h2{font-family:var(--display);font-weight:500;font-size:clamp(30px,4vw,40px);margin:0 0 12px;line-height:1.05;}
  .mn-copy{font-size:15px;color:var(--ink-soft);margin:0 auto 22px;max-width:34ch;line-height:1.6;}
  .mn-fine{font-size:12px;color:var(--ink-soft);margin:14px 0 0;opacity:.85;}
  /* EmailOctopus embed, restyled to brand (scoped to .mn-eo) */
  .mn-eo{min-height:92px;}
  .mn-eo form{display:flex;flex-direction:column;gap:12px;margin:0;}
  .mn-eo h2,.mn-eo h3,.mn-eo .email-octopus-form-row-hp{display:none;}
  .mn-eo label{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-soft);text-align:left;display:block;margin:0 0 -4px;}
  .mn-eo input[type="email"],.mn-eo input[type="text"]{font-family:var(--sans) !important;font-size:16px !important;font-weight:300 !important;color:var(--ink) !important;background:var(--shell) !important;border:1px solid var(--line) !important;border-radius:3px !important;padding:13px 15px !important;width:100% !important;box-shadow:none !important;}
  .mn-eo input[type="email"]:focus,.mn-eo input[type="text"]:focus{outline:none !important;border-color:var(--sienna) !important;}
  .mn-eo button,.mn-eo input[type="submit"]{font-family:var(--sans) !important;font-weight:500 !important;font-size:14px !important;letter-spacing:.06em !important;text-transform:uppercase !important;color:var(--shell) !important;background:var(--sienna) !important;border:1px solid var(--sienna) !important;border-radius:3px !important;padding:14px 18px !important;width:100% !important;cursor:pointer;transition:background .3s var(--ease);box-shadow:none !important;}
  .mn-eo button:hover,.mn-eo input[type="submit"]:hover{background:var(--sienna-deep) !important;border-color:var(--sienna-deep) !important;}
  .mn-eo a{color:var(--sienna);}
  @media (max-width:480px){.mn-modal{padding:26px 20px 28px;}}
  `;

  var page = document.body.getAttribute('data-page') || '';

  function logo(href, label) {
    return '<a href="' + href + '" class="logo" aria-label="' + label + '">' + MARK +
      '<span class="wm"><span class="name">Moores</span><span class="sub">Home &amp; Garden</span></span></a>';
  }

  var navHtml = NAV.map(function (n) {
    return '<a href="' + n[2] + '"' + (n[0] === page ? ' class="active"' : '') + '>' + n[1] + '</a>';
  }).join('');

  var mobNavHtml = NAV.map(function (n) {
    return '<a class="mnav' + (n[0] === page ? ' active' : '') + '" href="' + n[2] + '">' + n[1] + '</a>';
  }).join('');

  var header = '<header class="site-head" id="head"><div class="wrap head-inner">' +
    logo(HOME, "Moores Home & Garden") +
    '<nav class="nav">' + navHtml + '</nav>' +
    '<div class="head-cta">' +
      '<a class="head-tel" href="' + PHONE_HREF + '">' + TEL_ICON + PHONE + '</a>' +
      '<a href="' + CONSULT + '" class="btn">Request a consultation <span class="arrow">\u2192</span></a>' +
      '<button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
    '</div>' +
    '</div></header>' +
    '<div class="mob-menu" id="mobMenu">' + mobNavHtml +
      '<div class="m-actions">' +
        '<a class="m-tel" href="' + PHONE_HREF + '">' + TEL_ICON + PHONE + '</a>' +
        '<p class="m-note">A call is the quickest way to talk through an order.</p>' +
        '<a href="' + CONSULT + '" class="btn" style="justify-content:center;">Request a consultation <span class="arrow">\u2192</span></a>' +
      '</div></div>';

  var footer = '<footer class="foot"><div class="wrap">' +
    '<div class="foot-grid">' +
      '<div>' + logo(HOME, "Moores") +
        '<p class="addr">' + ADDR + '</p></div>' +
      '<div><h4>Explore</h4>' +
        '<a href="our-story.html">Our Story</a><a href="the-range.html">The Range</a>' +
        '<a href="fragrances.html">Fragrances</a>' +
        '<a href="own-branding.html">Own Branding</a><a href="' + CONSULT + '">Consultation</a>' +
        '<a href="#" data-newsletter>Join the list</a></div>' +
      '<div><h4>Talk to the workshop</h4>' +
        '<a class="foot-tel" href="' + PHONE_HREF + '">' + TEL_ICON + PHONE + '</a>' +
        '<p class="tel-note">Mon\u2013Fri, 9am\u20135pm. A call is the quickest way to plan an order.</p>' +
        '<a href="mailto:' + EMAIL + '" style="margin-top:10px;">' + EMAIL + '</a></div>' +
    '</div>' +
    '<div class="foot-base"><span>\u00a9 Moores Home &amp; Garden 2026</span>' +
      '<span>Made by hand. Made to last. Made for your brand.</span></div>' +
    '</div></footer>';

  // inject styles
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  // inject header at top, footer at end
  var hWrap = document.getElementById('site-header'); if (hWrap) hWrap.outerHTML = header; else document.body.insertAdjacentHTML('afterbegin', header);
  var fWrap = document.getElementById('site-footer'); if (fWrap) fWrap.outerHTML = footer; else document.body.insertAdjacentHTML('beforeend', footer);

  // burger toggle
  var burger = document.getElementById('burger');
  if (burger) burger.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // header shadow on scroll
  var head = document.getElementById('head');
  function onScroll() { head.classList.toggle('scrolled', window.scrollY > 12); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // scroll reveal — reveal in-viewport elements immediately (layout check),
  // observe the rest; falls back to showing everything if IO is unavailable.
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }
  if (typeof IntersectionObserver === 'undefined') {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) {
      if (inView(el)) { el.classList.add('in'); }
      else { io.observe(el); }
    });
    // safety net: on scroll, reveal anything the observer missed
    var safety = function () {
      revealEls.forEach(function (el) { if (!el.classList.contains('in') && inView(el)) el.classList.add('in'); });
    };
    window.addEventListener('scroll', safety, { passive: true });
  }

  // ---------- Newsletter popup (EmailOctopus) ----------
  var newsletterHtml = '<div class="mn-overlay" id="mnOverlay" aria-hidden="true">' +
    '<div class="mn-modal" role="dialog" aria-modal="true" aria-labelledby="mnTitle">' +
      '<button class="mn-close" id="mnClose" aria-label="Close">\u00d7</button>' +
      MARK.replace('class="mark"', 'class="mn-mark"') +
      '<p class="mn-eyebrow">The Moores list</p>' +
      '<h2 id="mnTitle">First to know.</h2>' +
      '<p class="mn-copy">New fragrances, seasonal editions and trade news \u2014 a few times a year, never more.</p>' +
      '<div class="mn-eo" id="mnEo"></div>' +
      '<p class="mn-fine">No spam. Unsubscribe anytime.</p>' +
    '</div></div>';
  document.body.insertAdjacentHTML('beforeend', newsletterHtml);
  var mnOverlay = document.getElementById('mnOverlay');
  var mnEoLoaded = false;
  function mnLoadEo() {
    if (mnEoLoaded) return; mnEoLoaded = true;
    var s = document.createElement('script');
    s.async = true; s.src = NEWSLETTER_EO_SRC; s.setAttribute('data-form', NEWSLETTER_EO_FORM);
    document.getElementById('mnEo').appendChild(s);
  }
  function mnOpen() { mnOverlay.classList.add('open'); mnOverlay.setAttribute('aria-hidden', 'false'); mnLoadEo(); }
  function mnClose() {
    mnOverlay.classList.remove('open'); mnOverlay.setAttribute('aria-hidden', 'true');
    try { localStorage.setItem('mn_news', String(Date.now())); } catch (e) {}
  }
  document.getElementById('mnClose').addEventListener('click', mnClose);
  mnOverlay.addEventListener('click', function (e) { if (e.target === mnOverlay) mnClose(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mnOverlay.classList.contains('open')) mnClose(); });
  document.querySelectorAll('[data-newsletter]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); mnOpen(); });
  });
  // auto-open once per snooze window (skipped on utility pages with no data-page)
  if (page) {
    var mnLast = 0; try { mnLast = parseInt(localStorage.getItem('mn_news') || '0', 10); } catch (e) {}
    if (Date.now() - mnLast > NEWSLETTER_SNOOZE_DAYS * 864e5) {
      var mnFired = false;
      var mnTimer = setTimeout(function () { if (!mnFired) { mnFired = true; mnOpen(); } }, NEWSLETTER_DELAY);
      var mnScroll = function () {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        if (h > 0 && window.scrollY / h > 0.5 && !mnFired) { mnFired = true; clearTimeout(mnTimer); mnOpen(); window.removeEventListener('scroll', mnScroll); }
      };
      window.addEventListener('scroll', mnScroll, { passive: true });
    }
  }

  // smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (id.length > 1) { var t = document.querySelector(id); if (t) { ev.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); } }
    });
  });
})();
