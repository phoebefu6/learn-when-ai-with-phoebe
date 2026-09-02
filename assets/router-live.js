/* router-live.js - the When AI, When Not routing simulator.
   Real computation where the subject computes: every DASH-routed workload runs a
   genuine JS aggregation over the embedded Cadence dataset below, and the cost
   math uses real published prices (cited on the page). The LLM answers are a
   deterministic teaching model carrying each workload's characteristic failure -
   the page says so. Two-number headline: monthly cost AND answers you can trust,
   plus a third counter for silently-wrong answers (confident, unverified, wrong).
*/
(function () {
  "use strict";

  /* ---------- embedded data: Cadence, an AI note-taker startup ---------- */
  /* 24 weeks of daily ops metrics, seeded deterministic (mulberry32). */
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var R = rng(20260902);
  var DAYS = 168;
  var data = [];
  var dau = 4200;
  for (var d = 0; d < DAYS; d++) {
    var wk = Math.floor(d / 7);
    var weekend = (d % 7 === 5 || d % 7 === 6);
    dau += Math.round((R() - 0.44) * 90) + (wk > 14 ? 6 : 2);
    var day = {
      day: d,
      dau: Math.max(3000, dau - (weekend ? 900 : 0)),
      newSignups: Math.round(40 + R() * 55 + (wk > 18 ? 25 : 0)),
      churned: Math.round(8 + R() * 14 + (wk === 16 ? 22 : 0)),
      revenueUSD: 0,
      failedPayments: Math.round(R() * 6),
      apiCalls: Math.round(90000 + R() * 30000 + (d === 130 ? 240000 : 0)),
      tickets: Math.round(35 + R() * 30 + (wk === 16 ? 40 : 0))
    };
    day.revenueUSD = Math.round(day.dau * 0.62 + day.newSignups * 9);
    data.push(day);
  }

  /* ---------- real price constants (verified, cited on the page) ---------- */
  var PRICE = {
    bqPerTB: 6.25,          // BigQuery on-demand, USD per TB scanned
    llmInPerM: 2.00,        // Claude Sonnet 5 input, USD per 1M tokens (Sept 2026 official pricing)
    llmOutPerM: 10.00,      // Claude Sonnet 5 output, USD per 1M tokens (Sept 2026 official pricing)
    mlServerMo: 62,         // one small inference box, month
    analystHour: 55,
    cleanupPerWrong: 330,   // 6 analyst-hours unwinding one silently-wrong number
    verifyLabor: 220,       // monthly labor to hand-check LLM answers you know are checkable
    evalUpkeep: 40          // eval set + monitoring per probabilistic workload, month
  };
  function llmCost(inTok, outTok, runsPerMonth) {
    return (inTok / 1e6 * PRICE.llmInPerM + outTok / 1e6 * PRICE.llmOutPerM) * runsPerMonth;
  }
  function dashCost(gbScanned, runsPerMonth) {
    return Math.max(0.01, gbScanned / 1024 * PRICE.bqPerTB * runsPerMonth);
  }

  /* ---------- the ten workloads ---------- */
  /* kind: det = deterministic (verified logic, aligned definition),
           pat = pattern (structured prediction), jud = judgment/language. */
  var WORK = [
    { id: "dau", name: "Yesterday's DAU for standup", kind: "det", best: "DASH",
      runs: 22, gb: 0.4, inTok: 6000, outTok: 300,
      real: function () { return "DAU " + data[DAYS - 1].dau.toLocaleString(); },
      llmFail: "reports a plausible DAU that is 4-8% off - it estimated from a stale sample instead of counting",
      note: "definition aligned, logic verified once, then free forever" },
    { id: "rev", name: "Monthly revenue by plan", kind: "det", best: "DASH",
      runs: 4, gb: 1.2, inTok: 22000, outTok: 900,
      real: function () {
        var t = 0; for (var i = DAYS - 28; i < DAYS; i++) t += data[i].revenueUSD;
        return "$" + t.toLocaleString() + " last 28 days";
      },
      llmFail: "arithmetic drifts on the long column - the total is confidently wrong by $11k",
      note: "a finance number nobody should ever estimate" },
    { id: "fail3", name: "Flag cards that failed 3x", kind: "det", best: "DASH",
      runs: 30, gb: 0.1, inTok: 4000, outTok: 200,
      real: function () {
        var n = data.slice(-30).filter(function (x) { return x.failedPayments >= 3; }).length;
        return n + " flag-days in 30d";
      },
      llmFail: "misses two accounts and invents one - threshold rules are not a judgment call",
      note: "a WHERE clause, not intelligence" },
    { id: "churn", name: "Which accounts will churn next month", kind: "pat", best: "ML",
      runs: 4, gb: 2.0, inTok: 60000, outTok: 2500,
      llmFail: "produces fluent risk narratives with no calibration - precision collapses on the long tail",
      note: "structured prediction from history - a trained classifier's home game" },
    { id: "fcast", name: "Support ticket volume, next 4 weeks", kind: "pat", best: "ML",
      runs: 4, gb: 0.6, inTok: 30000, outTok: 1200,
      llmFail: "extrapolates the recent spike linearly - misses the seasonal fall-back",
      note: "classic time-series - cheap, testable, backtestable" },
    { id: "anom", name: "Catch weird API usage", kind: "pat", best: "ML",
      runs: 30, gb: 1.5, inTok: 45000, outTok: 1500,
      llmFail: "flags the day-130 burst but also 11 normal days - no learned baseline",
      note: "an anomaly detector scores every day for cents" },
    { id: "themes", name: "Theme 500 support tickets", kind: "jud", best: "LLM",
      runs: 4, gb: 0, inTok: 400000, outTok: 8000,
      dashFail: "keyword counts miss every paraphrase - 'app eats my notes' never matches 'data loss'",
      note: "unstructured language at volume - this is what LLMs are FOR" },
    { id: "email", name: "Draft personalized onboarding emails", kind: "jud", best: "LLM",
      runs: 30, gb: 0, inTok: 90000, outTok: 300000,
      dashFail: "one template for everyone - open rate stays flat",
      note: "generation with a human send-gate" },
    { id: "actions", name: "Action items from meeting transcripts", kind: "jud", best: "LLM",
      runs: 660, gb: 0, inTok: 9000, outTok: 500,
      dashFail: "regex finds 'TODO' and nothing else",
      note: "judgment over messy language - Cadence's own product, fittingly" },
    { id: "nps", name: "Why did NPS drop last quarter?", kind: "det", best: "DASH",
      runs: 1, gb: 3.0, inTok: 120000, outTok: 6000,
      real: function () {
        var w16 = data.slice(112, 119), pre = data.slice(105, 112);
        var s = function (a, k) { return a.reduce(function (t, x) { return t + x[k]; }, 0); };
        return "churn spike week 16: " + s(w16, "churned") + " vs " + s(pre, "churned") + " prior week - decompose there first";
      },
      llmFail: "writes a fluent essay naming three causes it cannot see in any table",
      note: "decompose the metric tree FIRST - narrative comes after the numbers" }
  ];

  /* ---------- routing rules (the levers) ---------- */
  /* Baseline with no levers: the 2026 default - send everything to the LLM. */
  function route(levers) {
    return WORK.map(function (w) {
      /* the 2026 default: metrics go to the model (hype), language goes to
         keyword tooling (legacy). Both directions wrong. */
      var r = (w.kind === "jud") ? "DASH" : "LLM";
      if (levers.freeTier && w.kind === "det") r = "DASH";
      if (levers.classicML && w.kind === "pat") r = "ML";
      if (levers.genaiFit && w.kind === "jud") r = "LLM";
      if (levers.aiEverything) r = "LLM";
      return { w: w, route: r };
    });
  }

  function score(assignments, levers) {
    var bill = 0, cleanup = 0, upkeep = 0, labor = 0;
    var trusted = 0, silentWrong = 0, mlBoxes = 0, probabilistic = 0;
    assignments.forEach(function (a) {
      var w = a.w;
      if (a.route === "DASH") {
        bill += dashCost(w.gb, w.runs);
        if (w.kind !== "jud") trusted++;
        /* jud on DASH = keyword tooling: visibly poor, not silently wrong */
      } else if (a.route === "ML") {
        mlBoxes = 1; probabilistic++;
        trusted++;
      } else { /* LLM */
        bill += llmCost(w.inTok, w.outTok, w.runs);
        probabilistic++;
        if (w.kind === "jud") trusted++;
        else if (levers.triage) { /* caught wrong: you knew it was checkable, you checked */ }
        else silentWrong++;
      }
    });
    bill += mlBoxes * PRICE.mlServerMo;
    if (levers.triage) {
      var checkable = assignments.filter(function (a) { return a.route === "LLM" && a.w.kind !== "jud"; }).length;
      if (checkable) labor = PRICE.verifyLabor;
    }
    cleanup = silentWrong * PRICE.cleanupPerWrong;
    upkeep = probabilistic * PRICE.evalUpkeep;
    var trueCost = bill + cleanup + labor + (levers.fullCost ? upkeep : 0);
    return { bill: Math.round(bill), trueCost: Math.round(trueCost),
      trusted: trusted, silentWrong: silentWrong,
      showTrue: !!(levers.fullCost || silentWrong || labor) };
  }

  /* expose for the page + headless tests */
  window.ROUTER = { data: data, WORK: WORK, PRICE: PRICE, route: route, score: score,
    llmCost: llmCost, dashCost: dashCost };

  /* ---------- UI ---------- */
  var mount = document.getElementById("router-live");
  if (!mount) return;

  var LEVERS = [
    { key: "triage",     s: 1, label: "Ask the triage question", sub: "is the logic verified and the definition aligned?" },
    { key: "freeTier",   s: 2, label: "Free tier first", sub: "verified + aligned goes to the dashboard, not the model" },
    { key: "classicML",  s: 3, label: "Classic ML check", sub: "structured prediction goes to a trained model" },
    { key: "genaiFit",   s: 4, label: "GenAI fit test", sub: "unstructured language and judgment stays with the LLM" },
    { key: "fullCost",   s: 5, label: "Count the full cost", sub: "evals + monitoring priced into every probabilistic route" }
  ];

  var state = { triage: false, freeTier: false, classicML: false, genaiFit: false, fullCost: false, aiEverything: false };

  function fmt(n) { return "$" + n.toLocaleString(); }

  function render() {
    var assignments = route(state);
    var s = score(assignments, state);
    var head = document.getElementById("rl-head");
    head.innerHTML =
      '<div class="rl-num"><b>' + fmt(s.bill) + '</b><span>API + query bill</span></div>' +
      '<div class="rl-num"><b>' + fmt(s.trueCost) + '</b><span>true monthly cost</span></div>' +
      '<div class="rl-num"><b>' + s.trusted + '/10</b><span>answers you can trust</span></div>' +
      '<div class="rl-num rl-bad"><b>' + s.silentWrong + '</b><span>silently wrong</span></div>';
    var rows = document.getElementById("rl-rows");
    rows.innerHTML = assignments.map(function (a) {
      var w = a.w, cls = a.route === "DASH" ? "rl-dash" : a.route === "ML" ? "rl-ml" : "rl-llm";
      var ok = (a.route === w.best) || (a.route === "ML" && w.kind === "det");
      var detail;
      if (a.route === "DASH" && w.real) detail = "computed live: " + w.real();
      else if (a.route === "DASH" && w.dashFail) detail = "wrong tool: " + w.dashFail;
      else if (a.route === "LLM" && w.kind !== "jud") detail = "model says (teaching model): " + w.llmFail;
      else detail = w.note;
      return '<div class="rl-row' + (ok ? "" : " rl-off") + '">' +
        '<span class="rl-route ' + cls + '">' + a.route + '</span>' +
        '<span class="rl-name">' + w.name + '</span>' +
        '<span class="rl-detail">' + detail + '</span></div>';
    }).join("");
  }

  var box = document.createElement("div");
  box.className = "rl-wrap";
  box.innerHTML =
    '<div class="rl-honesty">The routing and the dashboard numbers are computed live from the embedded dataset. ' +
    'The LLM answers are a deterministic teaching model of documented failure modes, priced with real published rates - it is not calling any API.</div>' +
    '<div id="rl-head" class="rl-head"></div>' +
    '<div class="rl-levers">' +
    LEVERS.map(function (l) {
      return '<label class="rl-lever" data-k="' + l.key + '"><input type="checkbox"> ' +
        '<span><b>S' + l.s + " · " + l.label + '</b><em>' + l.sub + '</em></span></label>';
    }).join("") +
    '<label class="rl-lever rl-anti" data-k="aiEverything"><input type="checkbox"> ' +
    '<span><b>⚠ AI-everything</b><em>route all ten to the model - the 2026 default</em></span></label>' +
    '</div><div id="rl-rows" class="rl-rows"></div>';
  mount.appendChild(box);

  box.addEventListener("change", function (e) {
    var lab = e.target.closest(".rl-lever"); if (!lab) return;
    state[lab.getAttribute("data-k")] = e.target.checked;
    render();
  });
  render();
})();
