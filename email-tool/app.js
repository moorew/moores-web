/* ============================================================
   Moores Home & Garden — Email Builder app
   ============================================================ */
(function () {
  "use strict";

  // Where the email images live on the live site. New photos you add must be
  // committed into the website's /email/ folder on GitHub (see the setup guide).
  var ASSET_BASE = "https://mooreshomeandgarden.com/email/";
  // SHA-256 of the tool password. Change the password by replacing this hash
  // (generate a new one at any "sha256 online" tool). Default password: moores2026
  var PW_HASH = "407cb9ab4cd84b8bd48e5b65055511b220c722af844d8aa0d519be8cb0eee075";

  var DEFAULTS = {
    subject: "Introducing the new Moores Home & Garden",
    preheader: "Bespoke pieces, tailored to how you live — and made by hand in Sussex.",
    eyebrow: "Something new",
    headline: "The new Moores\nHome & Garden",
    lead: "A more personal way to shop with us — bespoke pieces, tailored to how you live.",
    bodyParagraphs: [
      "We've been busy. Moores Home & Garden has grown into something we've wanted to build for a long time — a place where what you take home is shaped around you, rather than simply pulled off a shelf.",
      "Choose a scent, a finish, a label and a size — or tell us what you have in mind and we'll make it for you. Everything is still blended in-house and finished by hand, right here in Sussex."
    ],
    ctaLabel: "Explore the new website",
    ctaUrl: "https://mooreshomeandgarden.com",
    featureHeading: "Made around you",
    featureBody: "Whether it's a single bespoke piece or a full collection under your own name, the work starts with a conversation. Tell us what you're after and we'll tailor it — scent, vessel, label and all.",
    secondaryLabel: "Contact us to find out more",
    secondaryUrl: "mailto:contact@mooreshomeandgarden.com",
    signoff: "— Terence Moore & the Moores team"
  };

  var TEXT_IDS = ["subject","preheader","eyebrow","headline","lead","ctaLabel","ctaUrl",
                  "featureHeading","featureBody","secondaryLabel","secondaryUrl","signoff"];

  // image state
  var IMG = {
    hero:    { changed:false, blob:null, url:null, filename:null, exportUrl:ASSET_BASE+"hero.jpg",    previewUrl:ASSET_BASE+"hero.jpg" },
    feature: { changed:false, blob:null, url:null, filename:null, exportUrl:ASSET_BASE+"feature.jpg", previewUrl:ASSET_BASE+"feature.jpg" }
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- password gate ---------------- */
  function sha256hex(str) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)).then(function (buf) {
      return [].map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    });
  }
  function reveal() {
    $("#gate").style.display = "none";
    $("#app").hidden = false;
    init();
  }
  (function gate() {
    if (sessionStorage.getItem("mhg_ok") === "1") { reveal(); return; }
    $("#gateForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var v = $("#gatePw").value;
      sha256hex(v).then(function (h) {
        if (h === PW_HASH) { sessionStorage.setItem("mhg_ok", "1"); reveal(); }
        else { $("#gateErr").textContent = "That password isn't right — try again."; $("#gatePw").select(); }
      });
    });
    $("#gatePw").focus();
  })();

  /* ---------------- helpers ---------------- */
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("on");
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove("on"); }, 2200);
  }
  function isLink(v) { return /^https?:\/\//i.test(v) || /^mailto:/i.test(v); }
  function normLink(v) {
    v = (v || "").trim();
    if (!v) return v;
    if (isLink(v)) return v;
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return "mailto:" + v;  // bare email
    if (/^www\./i.test(v) || /\.[a-z]{2,}/i.test(v)) return "https://" + v; // bare domain
    return v;
  }
  var stamp = function () {
    var d = new Date(), p = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
  };

  /* ---------------- gather data ---------------- */
  function paragraphs() {
    return $$("#paras textarea").map(function (t) { return t.value; }).filter(function (t) { return t.trim() !== ""; });
  }
  function getData() {
    var d = {};
    TEXT_IDS.forEach(function (id) { d[id] = $("#f_" + id) ? $("#f_" + id).value : ""; });
    d.ctaUrl = normLink(d.ctaUrl);
    d.secondaryUrl = normLink(d.secondaryUrl);
    d.bodyParagraphs = paragraphs();
    d.heroSrc = IMG.hero.exportUrl;
    d.featureSrc = IMG.feature.exportUrl;
    d.heroAlt = d.headline ? d.headline.replace(/\n/g, " ") : "Moores Home & Garden";
    d.featureAlt = d.featureHeading || "Moores Home & Garden";
    return d;
  }

  /* ---------------- live preview ---------------- */
  var pvTimer = null;
  function schedulePreview() { clearTimeout(pvTimer); pvTimer = setTimeout(renderPreview, 120); }
  function renderPreview() {
    var data = getData();
    var html = window.buildEmailHTML(data, { hero: IMG.hero.previewUrl, feature: IMG.feature.previewUrl });
    var f = $("#preview");
    f.onload = function () { sizePreview(); setTimeout(sizePreview, 650); };
    f.srcdoc = html;
    saveDraft();
  }
  function sizePreview() {
    var f = $("#preview"), scaler = $(".scaler"), stage = $(".stage");
    var doc = f.contentDocument; if (!doc || !doc.body) return;
    var avail = stage.clientWidth - 44;
    if (avail < 120) return;                       // pane hidden / not laid out yet — don't apply a bad scale
    var h = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
    if (h < 50) return;
    f.style.height = h + "px";
    var s = Math.min(1, Math.max(0.25, avail / 600));
    f.style.transformOrigin = "top left";
    f.style.transform = "scale(" + s + ")";
    scaler.style.width = (600 * s) + "px";
    scaler.style.height = (h * s) + "px";
    scaler.style.overflow = "hidden";
  }
  window.addEventListener("resize", sizePreview);

  /* ---------------- field meters / brand-safety ---------------- */
  function meter(el) {
    var soft = parseInt(el.getAttribute("data-soft") || "0", 10);
    var req = el.getAttribute("data-req") === "1";
    var link = el.getAttribute("data-link") === "1";
    var v = el.value.trim();
    var msg = document.querySelector('[data-for="' + el.id + '"]');
    var cnt = document.querySelector('[data-count="' + el.id + '"]');
    if (cnt && soft) {
      cnt.textContent = el.value.length + " / " + soft;
      cnt.className = "count" + (el.value.length > soft * 1.25 ? " bad" : el.value.length > soft ? " warn" : "");
    }
    if (!msg) return;
    msg.textContent = ""; msg.className = "msg";
    if (link && v && !isLink(normLink(v))) { msg.textContent = "Add a full web address (https://…) or an email"; msg.className = "msg bad"; return; }
    if (req && !v) { msg.textContent = "Please fill this in"; msg.className = "msg warn"; return; }
    if (soft && el.value.length > soft * 1.25) { msg.textContent = "A bit long — it may wrap awkwardly"; msg.className = "msg warn"; }
    else if (soft && el.value.length > soft) { msg.textContent = "Getting long — shorter usually looks better"; msg.className = "msg warn"; }
  }
  function wireField(el) {
    el.addEventListener("input", function () { meter(el); schedulePreview(); });
    meter(el);
  }

  /* ---------------- paragraphs ---------------- */
  function addParagraph(text) {
    var wrap = document.createElement("div");
    wrap.className = "para";
    var ta = document.createElement("textarea");
    ta.rows = 3; ta.value = text || "";
    ta.addEventListener("input", schedulePreview);
    var del = document.createElement("button");
    del.className = "del"; del.type = "button"; del.title = "Remove paragraph"; del.innerHTML = "&times;";
    del.addEventListener("click", function () {
      if ($$("#paras .para").length <= 1) { ta.value = ""; schedulePreview(); return; }
      wrap.remove(); schedulePreview();
    });
    wrap.appendChild(ta); wrap.appendChild(del);
    $("#paras").appendChild(wrap);
  }

  /* ---------------- image pipeline ---------------- */
  function setupImageCard(card) {
    var name = card.getAttribute("data-img");
    var exportW = parseInt(card.getAttribute("data-w"), 10);
    var exportH = parseInt(card.getAttribute("data-h"), 10);
    var ratio = exportW / exportH;
    var dz = $(".dropzone", card), input = $("input[type=file]", card);
    var editor = $(".editor", card), wrap = $(".stage-wrap", card), canvas = $("canvas", card);
    var zoom = $(".zoom", card), restext = $(".restext", card), resnote = $(".resnote", card);
    var chip = $(".savedchip", card);
    var ctx = canvas.getContext("2d");

    function downloadPhoto() {
      var s = IMG[name]; if (!s.blob) return;
      var a = document.createElement("a");
      a.href = s.url; a.download = s.filename;
      document.body.appendChild(a); a.click(); a.remove();
    }
    function refreshChip() {
      var s = IMG[name];
      chip.className = "savedchip" + (s.changed ? " on" : "");
      if (!s.changed) { chip.innerHTML = ""; return; }
      chip.innerHTML = '<span>\u2713 Framed &mdash;</span><code>' + s.filename + '</code><button class="btn btn-primary dl" type="button">Download photo</button>';
      var d = $(".dl", chip);
      if (d) d.onclick = downloadPhoto;
    }
    IMG[name]._refresh = refreshChip;

    // working box
    var boxW = 460, boxH = Math.round(boxW / ratio);
    canvas.width = boxW; canvas.height = boxH;
    wrap.style.maxWidth = boxW + "px";

    var st = { img: null, zoom: 1, fx: 0.5, fy: 0.5 };

    function geom() {
      var s0 = Math.max(boxW / st.img.width, boxH / st.img.height);
      var sc = s0 * st.zoom;
      var dw = st.img.width * sc, dh = st.img.height * sc;
      var px = (boxW - dw) * st.fx, py = (boxH - dh) * st.fy;
      return { sc: sc, dw: dw, dh: dh, px: px, py: py };
    }
    function draw() {
      if (!st.img) return;
      var g = geom();
      ctx.clearRect(0, 0, boxW, boxH);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(st.img, g.px, g.py, g.dw, g.dh);
      // resolution check: how much source width feeds the export width
      var cropSrcW = boxW / g.sc;            // source px sampled across the box
      var rr = cropSrcW / exportW;
      if (rr >= 0.98) { resnote.className = "resnote good"; restext.textContent = "Great resolution — this photo will look crisp."; }
      else if (rr >= 0.72) { resnote.className = "resnote warn"; restext.textContent = "A little soft at this zoom. Zoom out a touch or use a larger photo for best results."; }
      else { resnote.className = "resnote bad"; restext.textContent = "This photo is too small / zoomed in — it will look blurry when sent. Try a larger photo."; }
    }

    // drag to reposition
    var drag = null;
    wrap.addEventListener("pointerdown", function (e) {
      if (!st.img) return;
      drag = { x: e.clientX, y: e.clientY, fx: st.fx, fy: st.fy };
      wrap.classList.add("grabbing"); wrap.setPointerCapture(e.pointerId);
    });
    wrap.addEventListener("pointermove", function (e) {
      if (!drag || !st.img) return;
      var g = geom();
      var spanX = (g.dw - boxW), spanY = (g.dh - boxH);
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      // scale screen px -> canvas px
      var k = boxW / wrap.clientWidth;
      if (spanX > 0) st.fx = Math.min(1, Math.max(0, drag.fx - (dx * k) / spanX));
      if (spanY > 0) st.fy = Math.min(1, Math.max(0, drag.fy - (dy * k) / spanY));
      draw();
    });
    function endDrag() { drag = null; wrap.classList.remove("grabbing"); }
    wrap.addEventListener("pointerup", endDrag);
    wrap.addEventListener("pointercancel", endDrag);

    zoom.addEventListener("input", function () { st.zoom = parseFloat(zoom.value); draw(); });

    function loadFile(file) {
      if (!file || !/^image\//.test(file.type)) { toast("Please choose an image file (JPG or PNG)."); return; }
      var url = URL.createObjectURL(file);
      var im = new Image();
      im.onload = function () {
        st.img = im; st.zoom = 1; st.fx = 0.5; st.fy = 0.5;
        zoom.value = 1;
        dz.style.display = "none"; editor.classList.add("on");
        draw();
      };
      im.onerror = function () { toast("Sorry — that image couldn't be opened."); };
      im.src = url;
    }
    dz.addEventListener("click", function () { input.click(); });
    input.addEventListener("change", function () { if (input.files[0]) loadFile(input.files[0]); });
    ["dragenter", "dragover"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove("drag"); }); });
    dz.addEventListener("drop", function (e) { if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); });

    $(".change", card).addEventListener("click", function () { editor.classList.remove("on"); dz.style.display = "block"; input.value = ""; });

    $(".use", card).addEventListener("click", function () {
      if (!st.img) return;
      var g = geom();
      var sx = -g.px / g.sc, sy = -g.py / g.sc, sw = boxW / g.sc, sh = boxH / g.sc;
      var out = document.createElement("canvas");
      out.width = exportW; out.height = exportH;
      var octx = out.getContext("2d");
      octx.imageSmoothingQuality = "high";
      octx.drawImage(st.img, sx, sy, sw, sh, 0, 0, exportW, exportH);
      compress(out, function (blob) {
        if (IMG[name].url) URL.revokeObjectURL(IMG[name].url);
        var filename = name + "-" + stamp() + ".jpg";
        IMG[name].changed = true;
        IMG[name].blob = blob;
        IMG[name].url = URL.createObjectURL(blob);
        IMG[name].filename = filename;
        IMG[name].exportUrl = ASSET_BASE + filename;
        IMG[name].previewUrl = IMG[name].url;
        IMG[name]._state = "ready";
        editor.classList.remove("on"); dz.style.display = "block";
        input.value = "";
        refreshChip();
        renderPreview();
      });
    });

    refreshChip();
  }

  function updateModalPhotos() {
    var msg = $("#photoMsg"), list = $("#photoList");
    if (!msg || !list) return;
    var changed = ["hero", "feature"].filter(function (n) { return IMG[n].changed; });
    if (!changed.length) {
      msg.textContent = "You didn't change the photos, so there's nothing to do here — skip to the next step.";
      list.innerHTML = ""; return;
    }
    msg.innerHTML = "Download " + (changed.length > 1 ? "these photos" : "this photo") + " and add " + (changed.length > 1 ? "them" : "it") + " to the website's <code>email</code> folder on GitHub \u2014 see the one-page \u201cAdding a photo\u201d guide. Until the photo is in that folder it won\u2019t show in the sent email.";
    list.innerHTML = "";
    changed.forEach(function (n) {
      var row = document.createElement("div"); row.className = "subjline";
      row.innerHTML = '<span><code>' + IMG[n].filename + '</code></span>';
      var b = document.createElement("button"); b.textContent = "Download";
      b.addEventListener("click", function () {
        var a = document.createElement("a"); a.href = IMG[n].url; a.download = IMG[n].filename;
        document.body.appendChild(a); a.click(); a.remove();
      });
      row.appendChild(b);
      list.appendChild(row);
    });
  }

  function compress(canvas, cb) {
    var target = 240 * 1024, q = 0.86;
    function attempt() {
      canvas.toBlob(function (blob) {
        if (!blob) { cb(null); return; }
        if (blob.size <= target || q <= 0.42) { cb(blob); }
        else { q -= 0.08; attempt(); }
      }, "image/jpeg", q);
    }
    attempt();
  }

  /* ---------------- draft persistence (text only) ---------------- */
  function saveDraft() {
    try {
      var d = {}; TEXT_IDS.forEach(function (id) { d[id] = $("#f_" + id).value; });
      d.paras = paragraphs();
      localStorage.setItem("mhg_email_draft", JSON.stringify(d));
    } catch (e) {}
  }
  function loadDraft() {
    try { return JSON.parse(localStorage.getItem("mhg_email_draft") || "null"); } catch (e) { return null; }
  }

  /* ---------------- send modal ---------------- */
  function validate() {
    var problems = [];
    $$("[data-req]").forEach(function (el) {
      if (!el.value.trim()) problems.push("Add the " + labelOf(el) + ".");
    });
    $$("[data-link]").forEach(function (el) {
      var v = el.value.trim();
      if (v && !isLink(normLink(v))) problems.push("The " + labelOf(el) + " needs a full web address or email.");
    });
    if (paragraphs().length === 0) problems.push("Add at least one paragraph to your message.");
    return problems;
  }
  function labelOf(el) {
    var l = document.querySelector('label[for="' + el.id + '"]');
    if (!l) return "field";
    return l.textContent.replace(/\s+/g, " ").split(" ").slice(0, 2).join(" ").toLowerCase();
  }

  function openModal() {
    renderPreview();
    var probs = validate();
    var nf = $("#needfix");
    if (probs.length) {
      nf.classList.add("on");
      nf.innerHTML = "<b>Just a couple of things to finish first:</b><ul>" + probs.map(function (p) { return "<li>" + p + "</li>"; }).join("") + "</ul>";
      $("#copyCode").disabled = true; $("#dlCode").disabled = true;
    } else {
      nf.classList.remove("on"); nf.innerHTML = "";
      $("#copyCode").disabled = false; $("#dlCode").disabled = false;
    }
    updateModalPhotos();
    $("#subjPreview").textContent = $("#f_subject").value || "(add a subject line)";
    $("#sendModal").classList.add("on");
  }

  function finalHTML() {
    var data = getData();
    return window.buildEmailHTML(data, { hero: IMG.hero.exportUrl, feature: IMG.feature.exportUrl });
  }

  /* ---------------- init ---------------- */
  function init() {
    // prefill
    var draft = loadDraft();
    TEXT_IDS.forEach(function (id) {
      $("#f_" + id).value = (draft && draft[id] != null) ? draft[id] : DEFAULTS[id];
    });
    var paras = (draft && draft.paras && draft.paras.length) ? draft.paras : DEFAULTS.bodyParagraphs;
    paras.forEach(function (p) { addParagraph(p); });

    // wire fields
    TEXT_IDS.forEach(function (id) { wireField($("#f_" + id)); });
    $("#addPara").addEventListener("click", function () { addParagraph(""); schedulePreview(); });

    // images
    $$(".imgcard").forEach(setupImageCard);

    // modal
    $("#sendBtn").addEventListener("click", openModal);
    $("#sendBtn2").addEventListener("click", openModal);
    $("#modalX").addEventListener("click", function () { $("#sendModal").classList.remove("on"); });
    $("#sendModal").addEventListener("click", function (e) { if (e.target === $("#sendModal")) $("#sendModal").classList.remove("on"); });

    $("#copyCode").addEventListener("click", function () {
      var html = finalHTML();
      navigator.clipboard.writeText(html).then(function () { toast("Email code copied — paste it into EmailOctopus."); },
        function () { fallbackCopy(html); });
    });
    $("#dlCode").addEventListener("click", function () {
      var blob = new Blob([finalHTML()], { type: "text/html" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = "moores-email-" + stamp() + ".html";
      document.body.appendChild(a); a.click(); a.remove();
    });
    $("#copySubj").addEventListener("click", function () {
      navigator.clipboard.writeText($("#f_subject").value).then(function () { toast("Subject copied."); });
    });

    // reset
    $("#resetBtn").addEventListener("click", function () {
      if (!confirm("Start fresh? This clears your words back to the example copy. (Photos you added stay.)")) return;
      localStorage.removeItem("mhg_email_draft");
      TEXT_IDS.forEach(function (id) { $("#f_" + id).value = DEFAULTS[id]; meter($("#f_" + id)); });
      $("#paras").innerHTML = ""; DEFAULTS.bodyParagraphs.forEach(function (p) { addParagraph(p); });
      renderPreview(); toast("Reset to the example copy.");
    });

    // mobile tabs
    $$(".mobile-tabs button").forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".mobile-tabs button").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        document.body.classList.toggle("show-preview", b.getAttribute("data-tab") === "preview");
        if (b.getAttribute("data-tab") === "preview") setTimeout(sizePreview, 60);
      });
    });

    renderPreview();
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea"); ta.value = text;
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("Email code copied."); } catch (e) { toast("Press Ctrl/Cmd+C to copy."); }
    ta.remove();
  }
})();
