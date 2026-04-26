// Primevant Advisory (Scratch) - app.js
// Mobile drawer, active nav, accordion, insights search/filter, contact toast

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

/* Year */
(() => {
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* Mobile drawer */
(() => {
  const drawer = $("#drawer");
  const openBtn = $("#hamburger");
  const closeBtn = $("#drawerClose");

  const open = () => {
    if (!drawer) return;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    if (!drawer) return;
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  drawer?.addEventListener("click", (e) => { if (e.target === drawer) close(); });

  // Close drawer when any drawer link is tapped (prevents overlay covering anchors)
  $$(".drawer .panel a").forEach(a => {
    a.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

/* Active nav */
(() => {
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".navlinks a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === current) a.classList.add("active");
  });
})();

/* Smooth scroll for internal anchors */
(() => {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

/* Accordion (services page) */
(() => {
  const items = $$(".acc-item");
  if (!items.length) return;

  items.forEach(item => {
    const btn = $(".acc-btn", item);
    btn?.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      items.forEach(i => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
})();

/* Insights filter/search */
(() => {
  const input = $("#insightSearch");
  const chips = $$("[data-chip]");
  const cards = $$("[data-insight]");
  if (!input && !chips.length) return;

  let activeChip = "All";

  const apply = () => {
    const term = (input?.value || "").trim().toLowerCase();
    cards.forEach(card => {
      const tags = (card.getAttribute("data-tags") || "").toLowerCase();
      const title = (card.getAttribute("data-title") || "").toLowerCase();
      const chipOK = activeChip === "All" || tags.includes(activeChip.toLowerCase());
      const termOK = !term || title.includes(term) || tags.includes(term);
      card.style.display = (chipOK && termOK) ? "" : "none";
    });
  };

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeChip = chip.getAttribute("data-chip") || "All";
      apply();
    });
  });

  input?.addEventListener("input", apply);
  apply();
})();

(() => {
  const toggle = document.getElementById("founderToggle");
  const more = document.getElementById("founderMore");
  if (!toggle || !more) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    toggle.setAttribute("aria-expanded", String(!isOpen));
    more.hidden = isOpen;

    toggle.textContent = isOpen
      ? (window.t?.("about.founder.more") || "More information")
      : (window.t?.("about.founder.less") || "Less information");
  });
})();


/* ===========================
   Site Search (client-side)
   =========================== */
(function () {
  const openBtn = document.getElementById("openSearch");
  const modal = document.getElementById("searchModal");
  const closeBtn = document.getElementById("closeSearch");
  const closeBg = document.getElementById("searchClose");
  const input = document.getElementById("searchInput");
  const resultsEl = document.getElementById("searchResults");

  // If some pages don't include the modal markup, just do nothing.
  if (!openBtn || !modal || !closeBtn || !closeBg || !input || !resultsEl) return;

  // 1) Define your searchable content here (add/edit anytime).
  // Tip: keep "text" short-ish. You can add more entries as you publish real posts.
  const SEARCH_INDEX = [
    {
      title: "Home – Clarity Over Complexity",
      url: "index.html",
      section: "Home",
      text: "Audit-ready controls. Board-level confidence. SOX readiness, IT risk governance, and AI oversight."
    },
    {
      title: "Services – SOX Readiness & Remediation",
      url: "services.html#sox",
      section: "Services",
      text: "Readiness assessment, gap analysis, remediation support, evidence standards, COSO alignment."
    },
    {
      title: "Services – IT Risk & Governance",
      url: "services.html#itrisk",
      section: "Services",
      text: "NIST/ISO alignment, governance model, board reporting, KRIs, policy and standards, assurance readiness."
    },
    {
      title: "Services – AI & Emerging Technology Risk",
      url: "services.html#ai",
      section: "Services",
      text: "AI governance model, lifecycle controls, approvals, monitoring, audit-ready documentation, NIST AI RMF alignment."
    },
    {
      title: "Approach – Primevant delivery model",
      url: "approach.html",
      section: "Approach",
      text: "Diagnose, Design, Remediate, Operationalize, Sustain. Board-ready outputs and audit-defensible workpapers."
    },
    {
      title: "Insights – SOX readiness in 30 days (Coming soon)",
      url: "insights.html",
      section: "Insights",
      text: "Scope, narratives, walkthroughs, evidence standards, remediation tracking."
    },
    {
      title: "Insights – ITGC evidence: what auditors actually need (Coming soon)",
      url: "insights.html",
      section: "Insights",
      text: "Common evidence mistakes, how to standardize tickets, approvals, access review proof."
    },
    {
      title: "Insights – Reducing SOX testing without increasing risk",
      url: "insights.html",
      section: "Insights",
      text: "Rationalize key controls, remove overlap, improve reliance with defensible logic."
    },
    {
      title: "About – Founder Bio",
      url: "about.html#founder",
      section: "About",
      text: "Former EY partner. 15+ years. Technology risk, enterprise audit, cybersecurity, AI governance. Board and regulator advisory."
    },

   
    
    {
      title: "Contact",
      url: "contact.html",
      section: "Contact",
      text: "Schedule a strategic consultation. Share your goals and timeline. Next steps and engagement approach."
    }

  ];

  function openModal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    input.value = "";
    renderResults([]);
    setTimeout(() => input.focus(), 50);
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  function scoreMatch(q, item) {
    const hay = (item.title + " " + item.section + " " + item.text).toLowerCase();
    if (!hay.includes(q)) return 0;

    // Lightweight scoring: prefer title hits, then section, then body.
    let score = 1;
    if (item.title.toLowerCase().includes(q)) score += 4;
    if (item.section.toLowerCase().includes(q)) score += 2;
    return score;
  }

  function snippet(text, q) {
    const t = text.trim();
    const idx = t.toLowerCase().indexOf(q);
    if (idx < 0) return t.slice(0, 140) + (t.length > 140 ? "…" : "");
    const start = Math.max(0, idx - 40);
    const end = Math.min(t.length, idx + 90);
    const s = (start > 0 ? "…" : "") + t.slice(start, end) + (end < t.length ? "…" : "");
    return s;
  }

  function renderResults(items, q = "") {
    if (!items.length) {
      resultsEl.innerHTML = q
        ? `<div class="searchhint">No matches. Try “SOX”, “ITGC”, “AI”, “governance”.</div>`
        : `<div class="searchhint">Start typing to search Primevant.</div>`;
      return;
    }

    resultsEl.innerHTML = items
      .map((it) => {
        const snip = q ? snippet(it.text, q) : it.text;
        return `
          <div class="searchitem">
            <a href="${it.url}">
              <div class="stitle">${it.title}</div>
              <div class="smeta">${it.section}</div>
              <div class="ssnippet">${snip}</div>
            </a>
          </div>
        `;
      })
      .join("");
  }

  function handleSearch() {
    const q = input.value.trim().toLowerCase();
    if (!q) return renderResults([], "");

    const scored = SEARCH_INDEX
      .map((item) => ({ item, score: scoreMatch(q, item) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.item);

    renderResults(scored, q);
  }

  // Events
  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  closeBg.addEventListener("click", closeModal);

  input.addEventListener("input", handleSearch);

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;

    if (e.key === "Escape") closeModal();

    if (e.key === "Enter") {
      // open first result
      const first = resultsEl.querySelector(".searchitem a");
      if (first) window.location.href = first.getAttribute("href");
    }
  });
})();

/* Contact helpers */
(() => {
  const form = $("#contactForm");
  const toast = $("#toast");

  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.style.opacity = "1";
    toast.style.transform = "translate(-50%,0)";
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translate(-50%,10px)";
    }, 2200);
  };

  $$("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const val = btn.getAttribute("data-copy");
      if (!val) return;
      try {
        await navigator.clipboard.writeText(val);
        showToast("Copied to clipboard.");
      } catch {
        showToast("Copy failed. Please copy manually.");
      }
    });
  });

  if (!form) return;
  form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = $("#name")?.value.trim();
  const email = $("#email")?.value.trim();
  const topic = $("#topic")?.value.trim();
  const msg = $("#message")?.value.trim();

  if (!name || !email || !msg) return showToast("Please complete required fields.");
  if (!email.includes("@")) return showToast("Please enter a valid email.");

  const fd = new FormData(form);
  // Optional: set reply-to so you can click "Reply" in your inbox
  fd.set("_replyto", email);

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: fd,
      headers: { "Accept": "application/json" }
    });

    if (res.ok) {
      showToast("Thanks — message sent. We’ll respond within 1 business day.");
      form.reset();
    } else {
      showToast("Sending failed. Please email info@primevantadvisory.com.");
    }
  } catch (err) {
    showToast("Network error. Please email info@primevantadvisory.com.");
  }
});
})();

/* ===========================
   Language switcher + translations
   =========================== */
(() => {
const langToggle = document.getElementById("langToggle");
const langMenu = document.getElementById("langMenu");
const langOptions = document.querySelectorAll(".lang-option");

const translations = {
  en: {
    /* Index */
    "nav.services": "Services",
    "nav.approach": "Approach",
    "nav.insights": "Insights",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.cta": "Schedule a Consultation →",

    "hero.title": 'Clarity Over<br><span class="accent">Complexity</span>',
    "hero.lead1": "We help boards and C-suites strengthen enterprise risk, technology, and cybersecurity, building control environments that drive audit readiness, regulatory confidence, and operational resilience.",

"hero.lead2": "Clear, defensible control frameworks across enterprise, IT, cyber, and operational processes Rationalized, risk-aligned controls that reduce complexity without sacrificing assurance",
"hero.lead3": "Evidence standards that stand up to audit, regulators, and stakeholder scrutiny Governance structures that enable confident decision-making, accountability, and scalable growth",

    "statement.headline": "Audit ready controls<br>Board level confidence",
    "statement.subtext": "Big Four service level without the overhead<br><br>Strengthen IT risk and SOX control environments with practical defensible outcomes<br><br>Business led SOX, technology risk governance, and AI oversight built to stand up to auditors and regulators<br><br>Cleaner control design, stronger evidence, fewer findings",

    "trust.item1": "SOX Readiness & Remediation",
    "trust.item2": "Controls Review",
    "trust.item3": "SOX Program Optimization",
    "trust.item4": "Board Level Delivery",

    "services.heading": "Our Core Advisory Services",
    "services.card1.title": "SOX Readiness & Remediation Sprint",
    "services.card1.text": "Design and remediation support to get you audit ready quickly ideal for new SOX programs, system changes, or recent findings",
    "services.card2.title": "Control Environment Optimization",
    "services.card2.text": "Right size controls and testing to reduce cost and friction while improving audit outcomes without sacrificing coverage",
    "services.card3.title": "ITGC & Application Controls Stabilization",
    "services.card3.text": "Strengthen the IT foundations auditors focus on most: identity, privileged access, change, incidents, and evidence practices",

    "common.learnMore": "Learn More",
    "band.leftTitle": "From Risk Exposure to",
    "band.big": '<span class="accent">Risk Confidence</span>',
    "band.link": "View Our Approach",
    "why.title": "Why Primevant",
    "why.reason1.title": "Big 4 Audit quality standards.",
    "why.reason1.text": "Methodology backed.<br>Audit defensible.",
    "why.reason2.title": "Boutique Agility.",
    "why.reason2.text": "Direct partner involvement.<br>Faster decisions.",
    "why.reason3.title": "Executive Delivery.",
    "why.reason3.text": "Board ready insights.<br>Not operational noise.",
    "footer.privacy": "Privacy"

    /* Services */
    ,
"services.heroTitle": "Business led Risk and<br><span style='color:var(--blue2)'>Controls Advisory</span>.",
"services.heroLead": "We help organizations establish strong governance and translate risk into clear, actionable outcomes, enabling executive clarity and audit-ready precision.",

    "services.sectionTitle": "Service lines",

    "services.sox.title": "Risk Advisory",
"services.sox.subtitle": "Align enterprise, operational, financial, and technology risk to business strategy",
"services.sox.desc": "Core Focus",
"services.sox.offeringsTitle": "Signature Offerings",
"services.sox.b1": "Enterprise risk management (ERM)",
"services.sox.b2": "Operational and financial risk assessments",
"services.sox.b4": "Transformation risk (ERP, M&A, new products)",
"services.sox.b5": "Regulatory and compliance risk",
"services.sox.b7": "Enterprise SOX Readiness & Remediation Sprint",
"services.sox.b8": "Enterprise & process-level risk assessments",
"services.sox.b10": "Business process risk mapping (order-to-cash, procure-to-pay, etc.)",
"services.sox.b12": "AI governance and controls advisory (policy + oversight)",
"services.sox.b13": "Third party risk management/SOC 2 assessment/ISO 27001 evaluation",

    "services.opt.title": "Internal Audit & Financial Reporting Advisory",
"services.opt.subtitle": "Design and sustain audit-ready control environments across business processes and IT systems",
"services.opt.desc": "Core Focus",
"services.opt.offeringsTitle": "Signature Offerings",
"services.opt.b1": "SOX / ICFR (business + IT controls)",
"services.opt.b2": "Internal audit transformation & co-sourcing",
"services.opt.b3": "Business process controls (R2R, O2C, P2P, inventory, payroll)",
"services.opt.b4": "ITGC & application controls (supporting layer, not the headline)",
"services.opt.b5": "Audit readiness and remediation",
"services.opt.b6": "Control Environment Optimization",
"services.opt.b7": "ITGC & Application Controls Stabilization",
"services.opt.b8": "SOX program design and execution",
"services.opt.b9": "Business process walkthroughs & control design",
"services.opt.b10": "ERP control frameworks (SAP, Oracle, Workday)",


    "services.itgc.title": "Cybersecurity",
"services.itgc.subtitle": "Protect business operations and financial integrity through secure and resilient technology environments",
"services.itgc.desc": "Core Focus",
"services.itgc.offeringsTitle": "Signature Offerings",
"services.itgc.b1": "Cyber risk aligned to business impact",
"services.itgc.b2": "Identity, access, and privileged controls",
"services.itgc.b3": "Cloud and SaaS risk (financial data, reporting systems)",
"services.itgc.b4": "Application and data security",
"services.itgc.b5": "Technology risk supporting SOX and regulatory compliance",
"services.itgc.b6": "Security architecture & risk assessments",
"services.itgc.b7": "IAM / privileged access governance",
"services.itgc.b8": "Secure system implementation reviews (pre/post go-live)",
"services.itgc.b9": "Data integrity and protection strategies",
"services.itgc.b13": "Security controls aligned to SOX / ICFR",
"services.itgc.b14": "Vendor and SaaS risk assessments",

    "services.cta": "Want the regulatory lens per industry? <span>See Industries</span> →",

    "services.models.title": "Engagement Models",
    "services.models.m1": "Fixed fee sprint Best for defined outcomes and rapid execution. Includes milestones and a clear deliverable list.",
    "services.models.m2": "Capped T&M  Best for remediation where complexity varies. Includes an agreed cap and weekly burn visibility.",
    "services.models.m3": "Retainer  Ongoing advisory with bounded hours, response expectations, and quarterly planning.",

    "services.addons.title": "Optional add ons (post-stabilization)",
    "services.addons.intro": "Once IT controls foundation is stable, Primevant Advisory can support adjacent risk priorities.",
    "services.addons.a1": "Cyber risk assessment & governance",
    "services.addons.a2": "Third party risk support (SOC report review, control mapping)",
    "services.addons.a3": "AI governance and controls advisory (policy + oversight)"

    /* Industries */

    ,
    "industries.kicker": "Industries",
    "industries.heroTitle": "A regulatory lens aligned to<br><span>how your industry actually operates</span>.",
    "industries.heading": "Industries we serve",
    "industries.intro": " Primevant Advisory supports organizations across highly regulated and technology driven industries where strong governance, resilient systems, and audit ready controls are essential. Our experience spans IT controls, cybersecurity governance, privacy obligations, and regulatory compliance across complex enterprise environments.<br><br>We work with leadership teams to translate regulatory expectations into practical, sustainable control environments that strengthen risk oversight and operational resilience.",

    "industries.fs.title": "Financial Services",
    "industries.fs.text": "Primevant Advisory helps financial institutions align technology risk and cybersecurity governance with supervisory expectations and frameworks such as SOX, GLBA, FFIEC guidance, and PCI DSS while strengthening the controls that support financial reporting integrity, operational resilience, and customer trust.",

    "industries.healthcare.title": "Healthcare",
    "industries.healthcare.text": "Primevant Advisory supports healthcare organizations in strengthening technology governance and security practices aligned with HIPAA privacy and security expectations, helping protect sensitive patient information while ensuring the reliability and continuity of critical clinical systems.",

    "industries.saas.title": "Technology / SaaS",
    "industries.saas.text": "Primevant Advisory works with technology and SaaS organizations to align governance, risk management, and security practices with industry assurance frameworks such as SOC reporting and ISO aligned security programs, enabling scalable control environments that support privacy compliance, operational resilience, and customer trust.",

    "industries.manufacturing.title": "Manufacturing",
    "industries.manufacturing.text": "Primevant Advisory helps manufacturing organizations strengthen governance and cybersecurity across enterprise IT and operational technology environments to improve operational resilience, protect intellectual property, and support secure and reliable production systems.",

    "industries.retail.title": "Consumer / Retail",
    "industries.retail.text": "Primevant Advisory supports consumer and retail organizations in strengthening technology risk governance, payment security, and data protection practices to support secure digital commerce, regulatory compliance, and sustained customer trust.",

    "industries.other.title": "Other regulated environments",
    "industries.other.text": "Primevant Advisory helps organizations operating in regulated environments align technology governance and cybersecurity practices with sector specific regulatory expectations and federal security frameworks while building resilient, audit ready technology control programs."

    /* Approach */

    ,
    "approach.heroTitle": "Execute fast<br><span style='color:var(--blue2)'>Secure delivery<br></span>Clear scope.",
    "approach.heroLead": "Big 4 rigor with boutique speed, board ready outputs, audit defensible documentation, and sustainable cadence.",

    "approach.sectionTitle": "Primevant delivery model",

    "approach.assess.title": "Assess",
    "approach.assess.text": "Confirm current state, key risks, auditor expectations, and the fastest path to defensible controls and evidence.<br><br>Outputs: scope memo, timeline, deliverables, evidence expectations",

    "approach.align.title": "Align",
    "approach.align.text": "Set clear in-scope/out of scope boundaries, stakeholder roles, and change control to prevent scope creep.<br><br>Outputs: kickoff plan, RAID log, weekly status cadence",

    "approach.deliver.title": "Deliver",
    "approach.deliver.text": "Execute against milestones with audit ready documentation and practical remediation support.<br><br>Outputs: updated RCM/narratives, evidence playbook, remediation tracker",

    "approach.sustain.title": "Sustain",
    "approach.sustain.text": "Leave client teams with templates, standards, and knowledge transfer so progress sticks beyond the engagement.<br><br>Outputs: operating rhythm, training notes, handoff checklist",

    "approach.security.title": "Security & confidentiality",
    "approach.security.text": "Primevant handles client information with care. Engagements use secure repositories, least-privilege access, and defined retention practices.<br><br>We can align to client security requirements and vendor onboarding process as needed.",

    "approach.communication.title": "Communication",
    "approach.communication.text": "Clients receive a clear weekly status update with progress, risks, decisions needed, and next steps.<br><br>Default cadence: weekly status + working sessions as needed."

    /* Insights */

  ,
    "insights.heroCta": "Primevant Insights",
    "insights.title": "Insights",
    "insights.lede": "Short, practical guidance on SOX, ITGC, and controls—written for CFO, CIO, CISO, and Internal Audit leaders who want fewer surprises and cleaner audits.",

    "insights.p1.title": "SOX readiness in 30 days",
    "insights.p1.text": "A realistic sequence: scope, narratives, walkthroughs, evidence standards, and remediation tracking.",
    "insights.read": "Read post →",

    "insights.p2.title": "ITGC evidence: what auditors actually need",
    "insights.p2.text": "Common evidence mistakes and how to standardize tickets, approvals, and access review proof.",

    "insights.p3.title": "Reducing SOX testing without increasing risk",
    "insights.p3.text": "How to rationalize key controls, remove overlap, and improve reliance with defensible logic.",
    "insights.coming": "Coming soon →",

    "insights.featured": "Featured",

    "insights.f1.title": "SOX readiness in fast scaling organizations",
    "insights.f1.text": "Where audit friction comes from and what to standardize early (owners, cadence, evidence).",

    "insights.f2.title": "Board reporting for IT risk governance",
    "insights.f2.text": "Move from operational metrics to board level KRIs that support oversight decisions.",

    "insights.f3.title": "AI governance controls auditors will ask for",
    "insights.f3.text": "Control themes: inventory, approvals, monitoring, and lifecycle documentation."

/* about */

,
    "about.tophero.title": "Our people. Your audit. Exceptional precision.",

    "about.hero.title": "Board level risk advisory<br><span style='color:var(--blue2)'>with Big 4 discipline</span>.",
    "about.hero.lead": "Primevant Advisory helps leadership teams strengthen governance, manage risk effectively, and sustain resilient internal control environments.",

    "about.section.title": "About Primevant Advisory",
    "about.section.lead": "Primevant Advisory is a boutique advisory focused on IT Risk, SOX, and Controls. We deliver clear scope, executive level communication, and audit ready outcomes without unnecessary overhead.",

    "about.mission.title": "Our mission",
    "about.mission.text": "Help organizations strengthen their control environments in a way that is practical, defensible, and aligned to business operations so SOX and IT risk programs reduce surprises and increase confidence.",

    "about.values.title": "Our values",
    "about.values.text": "Clarity (clear scope & deliverables), Discipline (audit grade evidence), Judgment (right sized controls), and Trust (secure handling of client information).",

    "about.founder.name": "Uchechi Osuagwu",
    "about.founder.role": "Managing Partner",

    "about.founder.background.title": "Background Summary",
    "about.founder.background.p1": "Uchechi Osuagwu is a former EY partner and seasoned technology risk executive with over 15 years of experience leading enterprise audit, cybersecurity, AI strategy, and digital transformation initiatives for Fortune 50 organizations. Her career spans complex, highly regulated global environments where technology, risk, and business outcomes intersect.",
    "about.founder.background.p2": "Uchechi has led large scale programs focused on strengthening technology controls, operationalizing AI governance, and modernizing enterprise risk and audit frameworks to support growth, regulatory readiness, and resilience. Throughout her career, she has worked closely with Boards, executive leadership teams, and regulators, advising on SOX readiness, cyber resilience, third party risk, and emerging technology risks.",
    "about.founder.background.p3": "She is recognized for her ability to bridge the gap between technical complexity and executive decision making translating intricate control, security, and AI challenges into practical, business aligned strategies.",

    "about.founder.credentials.title": "Credentials & Expertise",
    "about.founder.credentials.l1": "15+ years of leadership in technology risk, enterprise audit, cybersecurity, and AI governance",
    "about.founder.credentials.l2": "Deep expertise in SOX, ITGCs, access controls, change management, and evidence based control frameworks",
    "about.founder.credentials.l3": "Proven experience operationalizing AI governance and risk management across enterprise environments",
    "about.founder.credentials.l4": "Trusted advisor to Boards and C suite leaders on regulatory readiness, cyber risk, and emerging AI threats",
    "about.founder.credentials.l5": "Extensive background supporting global operations across financial services, healthcare, technology, and consumer industries",
    "about.founder.credentials.l6": "Known for unifying technology, risk, audit, and business stakeholders around a single, execution focused risk strategy",

    "about.founder.credibility.title": "Credibility Statement",
    "about.founder.credibility.p1": "Uchechi brings a rare combination of executive judgment, technical depth, and practical delivery experience. She is trusted by senior leaders not only to identify risk, but to solve it—designing control environments, governance models, and operating structures that work in the real world.",
    "about.founder.credibility.p2": "Her approach is disciplined, outcomes driven, and grounded in the realities of audit, regulation, and enterprise execution. Through Primevant Advisory, Uchechi partners with organizations to turn regulatory pressure and technological change into strategic advantage."
    
     
    ,
"about.narrative.title": "Strengthening governance.<br><span style='color:var(--blue2)'>Enabling confident decisions.</span>",
"about.narrative.p1": "Primevant Advisory partners with leadership teams to establish strong governance frameworks and translate risk into clear, actionable outcomes.",
"about.narrative.p2": "We operate at the intersection of business, risk, and controls, helping organizations navigate regulatory expectations, strengthen oversight, and build resilient operating environments that support growth.",

"about.team.title": "Capabilities & team",
"about.team.lead": "Primevant Advisory delivers through a focused, high caliber network of professionals across governance, risk, cybersecurity and regulatory disciplines structured to support complex, enterprise environments.",

"about.team.card1.title": "Enterprise governance & risk capability",
"about.team.card1.text": "Experience supporting governance, risk, and control programs across financial reporting, operational, cybersecurity and technology domains aligned to regulatory expectations and business priorities.",

"about.team.card2.title": "Big 4 and industry experience",
"about.team.card2.text": "Team members bring experience from leading advisory firms and complex enterprise environments, supporting organizations across financial services, healthcare, technology, and consumer industries.",

"about.team.card3.title": "Flexible delivery model",
"about.team.card3.text": "Engagements are structured with senior leadership oversight and scaled with specialized expertise to meet scope, timeline, and regulatory requirements with precision.",

"about.founder.more": "More information",
"about.teamCredibility.title": "Team credibility",
"about.teamCredibility.p1": "Primevant Advisory combines senior leadership oversight with a high-caliber network of professionals across governance, risk, cybersecurity, and regulatory disciplines. This model enables the firm to deliver practical, audit-ready outcomes with the depth and discipline expected in complex enterprise environments.",
"about.teamCredibility.p2": "Our engagements are structured to bring the right expertise to the right challenge—balancing executive judgment, specialized capability, and consistent delivery standards to support regulatory readiness, resilient operations, and business-aligned risk management.",

"about.founder.less": "Less information"




/* contact */

,
    "contact.banner": "Contact us",
    "contact.heroTitle": "Let’s align on your<br><span style='color:var(--blue2)'>audit ready objectives</span>.",
    "contact.p1": "<b> Translate risk into executive action.</b> We bridge the gap between technical teams, internal audit, and executive leadership to ensure control frameworks support business objectives.",
    "contact.p2": "<b> Reduce compliance friction.</b> We streamline control design, documentation, and evidence practices so your teams spend less time managing audits and more time delivering results.",
    "contact.p3": "<b> Engage with a proven advisor.</b> With deep experience supporting boards, C-suites, and audit committees, we deliver practical solutions that stand up to regulatory and external audit review.",

    "contact.formTitle": "Send a message",
    "contact.name": "Full name *",
    "contact.email": "Email *",
    "contact.topic": "Topic",
    "contact.message": "Message *",
    "contact.submit": "Submit",
    "contact.viewServices": "View services",

    "contact.details": "Contact details",
    "contact.response": "We typically respond within 1 business day. For urgent audit cycle needs, include “time sensitive” in your message."


    /* Privacy */

    ,
    "privacy.title": "Privacy notice",
    "privacy.lead": "Primevant Advisory respects your privacy and handles information with care and professionalism. This notice describes what we collect through this website and how we use it.",

    "privacy.updated": "Last updated:",

    "privacy.collect.title": "Information we collect",
    "privacy.collect.text": "When you contact us (for example via the contact page), we may collect information you provide such as your name, email address, company, and the content of your message.",

    "privacy.use.title": "How we use information",
    "privacy.use.text": "We use information you provide to respond to inquiries, schedule discussions, provide requested materials, and communicate about potential services. We do not sell personal information.",

    "privacy.security.title": "Data handling and safeguarding",
    "privacy.security.text": "Primevant Advisory applies reasonable administrative and technical safeguards designed to protect information from unauthorized access, use, or disclosure. For client engagements, data handling and retention terms are typically governed by contract (e.g., an MSA/SOW).",

    "privacy.thirdparty.title": "Third party services",
    "privacy.thirdparty.text": "If we introduce third party services in the future (such as analytics, form processing, or scheduling tools), we will update this notice to reflect those providers and the related data practices.",

    "privacy.contact.title": "Contact",
    "privacy.contact.text": "Questions about this notice? Contact <b>info@primevantadvisory.com</b>."
  },

  es: {
    "nav.services": "Servicios",
    "nav.approach": "Enfoque",
    "nav.insights": "Perspectivas",
    "nav.about": "Nosotros",
    "nav.contact": "Contacto",
    "nav.cta": "Programar una consulta →",

    "hero.title": 'Claridad sobre<br><span class="accent">complejidad</span>',
   "hero.lead1": "Ayudamos a juntas directivas y equipos ejecutivos a fortalecer el riesgo empresarial, la tecnología y la ciberseguridad, construyendo entornos de control que impulsan la preparación para auditoría, la confianza regulatoria y la resiliencia operativa.",

"hero.lead2": "Marcos de control claros y defendibles en procesos empresariales, de TI, ciberseguridad y operativos Controles racionalizados y alineados al riesgo que reducen la complejidad sin sacrificar la garantía",
"hero.lead3": "Estándares de evidencia que resisten auditorías, reguladores y el escrutinio de las partes interesadas Estructuras de gobernanza que permiten decisiones seguras, responsabilidad y crecimiento escalable",
    "statement.headline": "Controles listos para auditoría<br>Confianza a nivel directivo",
    "statement.subtext": "Nivel de servicio Big Four sin la sobrecarga<br><br>Fortalezca los entornos de riesgo de TI y controles SOX con resultados prácticos y defendibles<br><br>SOX orientado al negocio, gobernanza de riesgo tecnológico y supervisión de IA diseñados para responder ante auditores y reguladores<br><br>Diseño de controles más limpio, evidencia más sólida, menos hallazgos",

    "trust.item1": "Preparación y remediación SOX",
    "trust.item2": "Revisión de controles",
    "trust.item3": "Optimización del programa SOX",
    "trust.item4": "Entrega a nivel directivo",

    "services.heading": "Nuestros servicios principales de asesoría",
    "services.card1.title": "Sprint de preparación y remediación SOX",
    "services.card1.text": "Apoyo de diseño y remediación para que esté listo para auditoría rápidamente, ideal para nuevos programas SOX, cambios de sistemas o hallazgos recientes.",
    "services.card2.title": "Optimización del entorno de control",
    "services.card2.text": "Ajuste los controles y las pruebas para reducir costo y fricción mientras mejora los resultados de auditoría sin sacrificar cobertura.",
    "services.card3.title": "Estabilización de ITGC y controles de aplicación",
    "services.card3.text": "Fortalezca los fundamentos de TI que más revisan los auditores: identidad, acceso privilegiado, cambios, incidentes y prácticas de evidencia.",

    "common.learnMore": "Más información",
    "band.leftTitle": "De la exposición al riesgo a",
    "band.big": '<span class="accent">confianza en el riesgo</span>',
    "band.link": "Ver nuestro enfoque",
    "why.title": "Por qué Primevant",
    "why.reason1.title": "Estándares de calidad de auditoría Big 4.",
    "why.reason1.text": "Respaldado por metodología.<br>Defendible ante auditoría.",
    "why.reason2.title": "Agilidad boutique.",
    "why.reason2.text": "Participación directa de socios.<br>Decisiones más rápidas.",
    "why.reason3.title": "Entrega ejecutiva.",
    "why.reason3.text": "Perspectivas listas para la junta.<br>No ruido operativo.",
    "footer.privacy": "Privacidad"

    ,
"services.heroTitle": "Asesoría de riesgos y<br><span style='color:var(--blue2)'>controles orientada al negocio</span>.",
"services.heroLead": "Ayudamos a las organizaciones a establecer una gobernanza sólida y a traducir el riesgo en resultados claros y accionables, impulsando claridad ejecutiva y precisión lista para auditoría.",

    "services.sectionTitle": "Líneas de servicio",

    "services.sox.title": "Asesoría de Riesgo",
"services.sox.subtitle": "Alinear el riesgo empresarial, operativo, financiero y tecnológico con la estrategia del negocio",
"services.sox.desc": "Enfoque principal",
"services.sox.offeringsTitle": "Ofertas clave",
"services.sox.b1": "Gestión de riesgos empresariales (ERM)",
"services.sox.b2": "Evaluaciones de riesgo operativo y financiero",
"services.sox.b4": "Riesgo de transformación (ERP, fusiones y adquisiciones, nuevos productos)",
"services.sox.b5": "Riesgo regulatorio y de cumplimiento",
"services.sox.b7": "Sprint de preparación y remediación SOX a nivel empresarial",
"services.sox.b8": "Evaluaciones de riesgo a nivel empresarial y de procesos",
"services.sox.b10": "Mapeo de riesgos de procesos de negocio (order-to-cash, procure-to-pay, etc.)",
"services.sox.b12": "Asesoría en gobernanza y controles de IA (política y supervisión)",
"services.sox.b13": "Gestión de riesgos de terceros / evaluación SOC 2 / evaluación ISO 27001",

    "services.opt.title": "Asesoría de Auditoría Interna y Reporte Financiero",
"services.opt.subtitle": "Diseñar y sostener entornos de control listos para auditoría en procesos de negocio y sistemas de TI",
"services.opt.desc": "Enfoque principal",
"services.opt.offeringsTitle": "Ofertas clave",
"services.opt.b1": "SOX / ICFR (controles de negocio + TI)",
"services.opt.b2": "Transformación de auditoría interna y co-sourcing",
"services.opt.b3": "Controles de procesos de negocio (R2R, O2C, P2P, inventario, nómina)",
"services.opt.b4": "ITGC y controles de aplicación (capa de soporte, no el titular principal)",
"services.opt.b5": "Preparación para auditoría y remediación",
"services.opt.b6": "Optimización del entorno de control",
"services.opt.b7": "Estabilización de ITGC y controles de aplicación",
"services.opt.b8": "Diseño y ejecución del programa SOX",
"services.opt.b9": "Walkthroughs de procesos de negocio y diseño de controles",
"services.opt.b10": "Marcos de control ERP (SAP, Oracle, Workday)",


    "services.itgc.title": "Ciberseguridad",
"services.itgc.subtitle": "Proteja las operaciones del negocio y la integridad financiera mediante entornos tecnológicos seguros y resilientes",
"services.itgc.desc": "Enfoque principal",
"services.itgc.offeringsTitle": "Ofertas clave",
"services.itgc.b1": "Riesgo cibernético alineado con el impacto al negocio",
"services.itgc.b2": "Controles de identidad, acceso y privilegios",
"services.itgc.b3": "Riesgo de nube y SaaS (datos financieros, sistemas de reporte)",
"services.itgc.b4": "Seguridad de aplicaciones y datos",
"services.itgc.b5": "Riesgo tecnológico que respalda SOX y el cumplimiento regulatorio",
"services.itgc.b6": "Arquitectura de seguridad y evaluaciones de riesgo",
"services.itgc.b7": "Gobernanza de IAM / acceso privilegiado",
"services.itgc.b8": "Revisiones seguras de implementación de sistemas (antes/después del go-live)",
"services.itgc.b9": "Estrategias de integridad y protección de datos",
"services.itgc.b13": "Controles de seguridad alineados con SOX / ICFR",
"services.itgc.b14": "Evaluaciones de riesgo de proveedores y SaaS",

    "services.cta": "Quiere la visión regulatoria por industria? <span>Ver Industrias</span> →",

    "services.models.title": "Modelos de contratación",
    "services.models.m1": "Sprint de tarifa fija Ideal para resultados definidos y ejecución rápida. Incluye hitos y una lista clara de entregables.",
    "services.models.m2": "T&M con tope  Ideal para remediación cuando la complejidad varía. Incluye un tope acordado y visibilidad semanal del consumo.",
    "services.models.m3": "Retenedor  Asesoría continua con horas acotadas, expectativas de respuesta y planificación trimestral.",

    "services.addons.title": "Complementos opcionales (post-estabilización)",
    "services.addons.intro": "Una vez que la base de controles de TI esté estable, Primevant Advisory puede apoyar prioridades de riesgo adyacentes.",
    "services.addons.a1": "Evaluación y gobernanza de riesgo cibernético",
    "services.addons.a2": "Apoyo en riesgo de terceros (revisión de reportes SOC, mapeo de controles)",
    "services.addons.a3": "Asesoría en gobernanza y controles de IA (política + supervisión)"


    ,
    "industries.kicker": "Industrias",
    "industries.heroTitle": "Una visión regulatoria alineada con<br><span>cómo opera realmente su industria</span>.",
    "industries.heading": "Industrias a las que servimos",
    "industries.intro": " Primevant Advisory apoya a organizaciones en industrias altamente reguladas y orientadas a la tecnología, donde una gobernanza sólida, sistemas resilientes y controles listos para auditoría son esenciales. Nuestra experiencia abarca controles de TI, gobernanza de ciberseguridad, obligaciones de privacidad y cumplimiento regulatorio en entornos empresariales complejos.<br><br>Trabajamos con equipos directivos para traducir las expectativas regulatorias en entornos de control prácticos y sostenibles que fortalezcan la supervisión del riesgo y la resiliencia operativa.",

    "industries.fs.title": "Servicios Financieros",
    "industries.fs.text": "Primevant Advisory ayuda a las instituciones financieras a alinear la gobernanza de riesgo tecnológico y ciberseguridad con expectativas supervisoras y marcos como SOX, GLBA, FFIEC y PCI DSS, fortaleciendo los controles que respaldan la integridad del reporte financiero, la resiliencia operativa y la confianza del cliente.",

    "industries.healthcare.title": "Salud",
    "industries.healthcare.text": "Primevant Advisory apoya a organizaciones de salud en el fortalecimiento de la gobernanza tecnológica y prácticas de seguridad alineadas con las expectativas de privacidad y seguridad de HIPAA, ayudando a proteger información sensible de pacientes y asegurar la confiabilidad y continuidad de sistemas clínicos críticos.",

    "industries.saas.title": "Tecnología / SaaS",
    "industries.saas.text": "Primevant Advisory trabaja con organizaciones de tecnología y SaaS para alinear gobernanza, gestión de riesgos y prácticas de seguridad con marcos de aseguramiento como reportes SOC y programas de seguridad alineados con ISO, permitiendo entornos de control escalables que apoyen cumplimiento de privacidad, resiliencia operativa y confianza del cliente.",

    "industries.manufacturing.title": "Manufactura",
    "industries.manufacturing.text": "Primevant Advisory ayuda a organizaciones manufactureras a fortalecer la gobernanza y la ciberseguridad en entornos de TI empresarial y tecnología operativa para mejorar la resiliencia operativa, proteger propiedad intelectual y respaldar sistemas de producción seguros y confiables.",

    "industries.retail.title": "Consumo / Retail",
    "industries.retail.text": "Primevant Advisory apoya a organizaciones de consumo y retail en el fortalecimiento de la gobernanza de riesgo tecnológico, la seguridad de pagos y las prácticas de protección de datos para respaldar el comercio digital seguro, el cumplimiento regulatorio y la confianza sostenida del cliente.",

    "industries.other.title": "Otros entornos regulados",
    "industries.other.text": "Primevant Advisory ayuda a organizaciones que operan en entornos regulados a alinear prácticas de gobernanza tecnológica y ciberseguridad con expectativas regulatorias sectoriales y marcos federales de seguridad, mientras construyen programas de control tecnológico resilientes y listos para auditoría."


    ,
    "approach.heroTitle": "Ejecución rápida<br><span style='color:var(--blue2)'>Entrega segura<br></span>Alcance claro.",
    "approach.heroLead": "Rigor Big 4 con agilidad boutique: entregables listos para juntas, documentación defendible y cadencia sostenible.",

    "approach.sectionTitle": "Modelo de entrega Primevant",

    "approach.assess.title": "Evaluar",
    "approach.assess.text": "Confirmar el estado actual, riesgos clave, expectativas del auditor y el camino más rápido hacia controles y evidencia defendibles.<br><br>Entregables: alcance, cronograma, entregables y requisitos de evidencia",

    "approach.align.title": "Alinear",
    "approach.align.text": "Definir claramente lo que está dentro y fuera del alcance, roles y control de cambios para evitar desviaciones.<br><br>Entregables: plan inicial, registro RAID, seguimiento semanal",

    "approach.deliver.title": "Entregar",
    "approach.deliver.text": "Ejecutar con base en hitos con documentación lista para auditoría y soporte práctico de remediación.<br><br>Entregables: RCM actualizado, playbook de evidencia, seguimiento de remediación",

    "approach.sustain.title": "Sostener",
    "approach.sustain.text": "Dejar a los equipos del cliente con plantillas y estándares para mantener el progreso.<br><br>Entregables: ritmo operativo, documentación y transferencia de conocimiento",

    "approach.security.title": "Seguridad y confidencialidad",
    "approach.security.text": "Primevant gestiona la información del cliente con cuidado utilizando repositorios seguros y acceso de mínimo privilegio.",

    "approach.communication.title": "Comunicación",
    "approach.communication.text": "Los clientes reciben actualizaciones semanales claras con progreso, riesgos y próximos pasos."

    

,
    "insights.heroCta": "Perspectivas Primevant",
    "insights.title": "Perspectivas",
    "insights.lede": "Guías prácticas sobre SOX, ITGC y controles, escritas para CFO, CIO, CISO y líderes de auditoría interna que buscan menos sorpresas y auditorías más limpias.",

    "insights.p1.title": "Preparación SOX en 30 días",
    "insights.p1.text": "Una secuencia realista: alcance, narrativas, walkthroughs, estándares de evidencia y seguimiento de remediación.",
    "insights.read": "Leer artículo →",

    "insights.p2.title": "Evidencia ITGC: lo que realmente necesitan los auditores",
    "insights.p2.text": "Errores comunes de evidencia y cómo estandarizar tickets, aprobaciones y revisiones de acceso.",

    "insights.p3.title": "Reducir pruebas SOX sin aumentar el riesgo",
    "insights.p3.text": "Cómo racionalizar controles clave, eliminar duplicaciones y mejorar la dependencia con lógica defendible.",
    "insights.coming": "Próximamente →",

    "insights.featured": "Destacados",

    "insights.f1.title": "Preparación SOX en organizaciones en crecimiento",
    "insights.f1.text": "Dónde surge la fricción en auditoría y qué estandarizar desde el inicio.",

    "insights.f2.title": "Reportes para la junta sobre riesgo de TI",
    "insights.f2.text": "Pasar de métricas operativas a indicadores clave de riesgo para la supervisión.",

    "insights.f3.title": "Controles de gobernanza de IA que pedirán los auditores",
    "insights.f3.text": "Temas clave: inventario, aprobaciones, monitoreo y documentación del ciclo de vida."



,
    "about.tophero.title": "Nuestra gente. Su auditoría. Precisión excepcional.",

    "about.hero.title": "Asesoría de riesgos a nivel directivo<br><span style='color:var(--blue2)'>con disciplina Big 4</span>.",
    "about.hero.lead": "Primevant Advisory ayuda a los equipos directivos a fortalecer la gobernanza, gestionar el riesgo de forma eficaz y mantener entornos de control interno resilientes.",

    "about.section.title": "Sobre Primevant Advisory",
    "about.section.lead": "Primevant Advisory es una firma boutique de asesoría enfocada en Riesgo de TI, SOX y Controles. Ofrecemos alcance claro, comunicación ejecutiva y resultados listos para auditoría, sin sobrecarga innecesaria.",

    "about.mission.title": "Nuestra misión",
    "about.mission.text": "Ayudar a las organizaciones a fortalecer sus entornos de control de forma práctica, defendible y alineada con las operaciones del negocio, para que los programas de SOX y riesgo de TI reduzcan sorpresas y aumenten la confianza.",

    "about.values.title": "Nuestros valores",
    "about.values.text": "Claridad (alcance y entregables claros), Disciplina (evidencia de nivel auditoría), Criterio (controles proporcionados) y Confianza (manejo seguro de la información del cliente).",

    "about.founder.name": "Uchechi Osuagwu",
    "about.founder.role": "Socia Directora",

    "about.founder.background.title": "Resumen profesional",
    "about.founder.background.p1": "Uchechi Osuagwu es ex socia de EY y una experimentada ejecutiva de riesgo tecnológico con más de 15 años de experiencia liderando auditoría empresarial, ciberseguridad, estrategia de IA e iniciativas de transformación digital para organizaciones Fortune 50. Su trayectoria abarca entornos globales complejos y altamente regulados, donde convergen tecnología, riesgo y resultados de negocio.",
    "about.founder.background.p2": "Uchechi ha liderado programas de gran escala enfocados en fortalecer controles tecnológicos, operacionalizar la gobernanza de IA y modernizar marcos empresariales de riesgo y auditoría para respaldar crecimiento, preparación regulatoria y resiliencia. A lo largo de su carrera, ha trabajado estrechamente con juntas directivas, equipos ejecutivos y reguladores, asesorando sobre preparación SOX, resiliencia cibernética, riesgo de terceros y riesgos tecnológicos emergentes.",
    "about.founder.background.p3": "Es reconocida por su capacidad para cerrar la brecha entre la complejidad técnica y la toma de decisiones ejecutiva, traduciendo desafíos complejos de control, seguridad e IA en estrategias prácticas y alineadas al negocio.",

    "about.founder.credentials.title": "Credenciales y experiencia",
    "about.founder.credentials.l1": "Más de 15 años de liderazgo en riesgo tecnológico, auditoría empresarial, ciberseguridad y gobernanza de IA",
    "about.founder.credentials.l2": "Amplia experiencia en SOX, ITGC, controles de acceso, gestión de cambios y marcos de control basados en evidencia",
    "about.founder.credentials.l3": "Experiencia comprobada en la operacionalización de la gobernanza y gestión de riesgos de IA en entornos empresariales",
    "about.founder.credentials.l4": "Asesora de confianza para juntas directivas y líderes C suite en preparación regulatoria, riesgo cibernético y amenazas emergentes de IA",
    "about.founder.credentials.l5": "Amplia trayectoria apoyando operaciones globales en servicios financieros, salud, tecnología e industrias de consumo",
    "about.founder.credentials.l6": "Reconocida por alinear a los equipos de tecnología, riesgo, auditoría y negocio en una sola estrategia de riesgo orientada a la ejecución",

    "about.founder.credibility.title": "Declaración de credibilidad",
    "about.founder.credibility.p1": "Uchechi aporta una combinación poco común de criterio ejecutivo, profundidad técnica y experiencia práctica de ejecución. Los altos directivos confían en ella no solo para identificar riesgos, sino para resolverlos, diseñando entornos de control, modelos de gobernanza y estructuras operativas que funcionan en el mundo real.",
    "about.founder.credibility.p2": "Su enfoque es disciplinado, orientado a resultados y fundamentado en las realidades de la auditoría, la regulación y la ejecución empresarial. A través de Primevant Advisory, Uchechi se asocia con organizaciones para convertir la presión regulatoria y el cambio tecnológico en ventaja estratégica."
    
   
    
    ,
"about.narrative.title": "Fortaleciendo la gobernanza.<br><span style='color:var(--blue2)'>Impulsando decisiones con confianza.</span>",
"about.narrative.p1": "Primevant Advisory colabora con equipos directivos para establecer marcos sólidos de gobernanza y transformar el riesgo en resultados claros y accionables.",
"about.narrative.p2": "Operamos en la intersección entre negocio, riesgo y control, ayudando a las organizaciones a navegar expectativas regulatorias, fortalecer la supervisión y construir entornos operativos resilientes que apoyen el crecimiento.",

"about.team.title": "Capacidades y equipo",
"about.team.lead": "Primevant Advisory opera a través de una red enfocada y altamente calificada de profesionales en gobernanza, riesgo, ciberseguridad y cumplimiento regulatorio, estructurada para entornos empresariales complejos.",

"about.team.card1.title": "Capacidad en gobernanza y riesgo empresarial",
"about.team.card1.text": "Experiencia en programas de gobernanza, riesgo y control en entornos financieros, operativos, de ciberseguridad y tecnológicos, alineados con requisitos regulatorios y prioridades de negocio.",

"about.team.card2.title": "Experiencia Big 4 y sectorial",
"about.team.card2.text": "Los miembros del equipo aportan experiencia de firmas líderes y entornos empresariales complejos, apoyando organizaciones en servicios financieros, salud, tecnología y consumo.",

"about.team.card3.title": "Modelo de entrega flexible",
"about.team.card3.text": "Los proyectos se estructuran con supervisión senior y se escalan con capacidades especializadas para cumplir alcance, plazos y requisitos regulatorios con precisión.",

"about.founder.more": "Más información",
"about.teamCredibility.title": "Credibilidad del equipo",
"about.teamCredibility.p1": "Primevant Advisory combina supervisión de liderazgo senior con una red de profesionales de alto nivel en gobernanza, riesgo, ciberseguridad y regulación. Este modelo permite ofrecer resultados prácticos y listos para auditoría con la profundidad y disciplina esperadas en entornos empresariales complejos.",
"about.teamCredibility.p2": "Nuestros proyectos se estructuran para aportar la experiencia adecuada a cada desafío, equilibrando criterio ejecutivo, capacidad especializada y estándares consistentes de entrega para apoyar la preparación regulatoria, la resiliencia operativa y una gestión de riesgos alineada al negocio.",

"about.founder.less": "Menos información"


    ,
    "contact.banner": "Contáctenos",
    "contact.heroTitle": "Alineemos sus<br><span style='color:var(--blue2)'>objetivos listos para auditoría</span>.",
    "contact.p1": "<b> Convierta el riesgo en acción ejecutiva.</b> Cerramos la brecha entre equipos técnicos, auditoría interna y liderazgo ejecutivo para asegurar que los marcos de control respalden los objetivos del negocio.",
    "contact.p2": "<b> Reduzca la fricción de cumplimiento.</b> Optimizamos el diseño de controles, la documentación y las prácticas de evidencia para que sus equipos dediquen menos tiempo a gestionar auditorías y más tiempo a generar resultados.",
    "contact.p3": "<b> Trabaje con una asesora comprobada.</b> Con amplia experiencia apoyando a juntas directivas, equipos C-suite y comités de auditoría, ofrecemos soluciones prácticas que resisten el escrutinio regulatorio y de auditoría externa.",

    "contact.formTitle": "Enviar un mensaje",
    "contact.name": "Nombre completo *",
    "contact.email": "Correo electrónico *",
    "contact.topic": "Tema",
    "contact.message": "Mensaje *",
    "contact.submit": "Enviar",
    "contact.viewServices": "Ver servicios",

    "contact.details": "Datos de contacto",
    "contact.response": "Normalmente respondemos dentro de 1 día hábil. Para necesidades urgentes del ciclo de auditoría, incluya “time-sensitive” en su mensaje."


    ,
    "privacy.title": "Aviso de privacidad",
    "privacy.lead": "Primevant Advisory respeta su privacidad y maneja la información con cuidado y profesionalismo. Este aviso describe qué recopilamos a través de este sitio web y cómo utilizamos esa información.",

    "privacy.updated": "Última actualización:",

    "privacy.collect.title": "Información que recopilamos",
    "privacy.collect.text": "Cuando se comunica con nosotros (por ejemplo, a través de la página de contacto), podemos recopilar la información que proporciona, como su nombre, correo electrónico, empresa y el contenido de su mensaje.",

    "privacy.use.title": "Cómo usamos la información",
    "privacy.use.text": "Utilizamos la información que proporciona para responder consultas, programar reuniones, proporcionar materiales solicitados y comunicarnos sobre posibles servicios. No vendemos información personal.",

    "privacy.security.title": "Gestión y protección de datos",
    "privacy.security.text": "Primevant Advisory aplica medidas administrativas y técnicas razonables para proteger la información contra acceso, uso o divulgación no autorizados. En proyectos con clientes, el manejo y la retención de datos se rigen generalmente por contrato (por ejemplo, MSA/SOW).",

    "privacy.thirdparty.title": "Servicios de terceros",
    "privacy.thirdparty.text": "Si en el futuro incorporamos servicios de terceros (como análisis, procesamiento de formularios o herramientas de programación), actualizaremos este aviso para reflejar esos proveedores y sus prácticas de datos.",

    "privacy.contact.title": "Contacto",
    "privacy.contact.text": "Tiene preguntas sobre este aviso? Contacte a <b>info@primevantadvisory.com."

  },

  "zh-cn": {
    "nav.services": "服务",
    "nav.approach": "方法",
    "nav.insights": "洞察",
    "nav.about": "关于我们",
    "nav.contact": "联系",
    "nav.cta": "预约咨询 →",

    "hero.title": '以清晰驾驭<br><span class="accent">复杂性</span>',
    "hero.lead1": "我们帮助董事会和高管团队强化企业风险、技术和网络安全，构建能够实现审计就绪、增强监管信心并提升运营韧性的控制环境。",

"hero.lead2": "覆盖企业、IT、网络安全及运营流程的清晰且可审计的控制框架 与风险对齐的精简控制，在不降低保障的前提下降低复杂性",
"hero.lead3": "能够经受审计、监管机构及利益相关方审查的证据标准 支持决策信心、责任落实和可扩展增长的治理结构",

    "statement.headline": "审计就绪的控制体系<br>董事会层面的信心",
    "statement.subtext": "提供 Big Four 级别服务，而无需承担其高昂负担<br><br>通过务实且可辩护的成果，强化 IT 风险与 SOX 控制环境<br><br>以业务为导向的 SOX、技术风险治理和 AI 监督框架，可经受审计与监管审查<br><br>更清晰的控制设计、更有力的证据、更少的审计发现",

    "trust.item1": "SOX 准备与整改",
    "trust.item2": "控制评审",
    "trust.item3": "SOX 项目优化",
    "trust.item4": "董事会级交付",

    "services.heading": "我们的核心咨询服务",
    "services.card1.title": "SOX 准备与整改加速方案",
    "services.card1.text": "通过设计与整改支持，帮助您快速达到审计就绪状态，适用于新 SOX 项目、系统变更或近期审计发现。",
    "services.card2.title": "控制环境优化",
    "services.card2.text": "优化控制与测试方式，降低成本和执行摩擦，同时提升审计结果且不牺牲覆盖范围。",
    "services.card3.title": "ITGC 与应用控制稳定化",
    "services.card3.text": "强化审计重点关注的 IT 基础领域：身份、特权访问、变更、事件及证据管理实践。",

    "common.learnMore": "了解更多",
    "band.leftTitle": "从风险暴露走向",
    "band.big": '<span class="accent">风险信心</span>',
    "band.link": "查看我们的方法",
    "why.title": "为什么选择 Primevant",
    "why.reason1.title": "Big-4 级审计质量标准。",
    "why.reason1.text": "方法论支撑。<br>可经受审计检验。",
    "why.reason2.title": "精品咨询的敏捷性。",
    "why.reason2.text": "合伙人直接参与。<br>决策更快速。",
    "why.reason3.title": "高管级交付。",
    "why.reason3.text": "面向董事会的洞察。<br>不是运营噪音。",
    "footer.privacy": "隐私政策"

    ,
"services.heroTitle": "以业务为导向的风险与<br><span style='color:var(--blue2)'>控制咨询</span>.",
"services.heroLead": "我们帮助组织建立稳健的治理体系，并将风险转化为清晰、可执行的成果，从而实现高管层清晰决策与审计就绪的精准度。",

    "services.sectionTitle": "服务领域",

    "services.sox.title": "风险咨询",
"services.sox.subtitle": "将企业、运营、财务及技术风险与业务战略对齐",
"services.sox.desc": "核心重点",
"services.sox.offeringsTitle": "核心服务",
"services.sox.b1": "企业风险管理（ERM）",
"services.sox.b2": "运营及财务风险评估",
"services.sox.b4": "转型风险（ERP、并购、新产品）",
"services.sox.b5": "监管与合规风险",
"services.sox.b7": "企业级SOX准备与整改加速方案",
"services.sox.b8": "企业及流程级风险评估",
"services.sox.b10": "业务流程风险映射（如订单到收款、采购到付款等）",
"services.sox.b12": "AI治理与控制咨询（政策与监督）",
"services.sox.b13": "第三方风险管理 / SOC 2评估 / ISO 27001评估",

    "services.opt.title": "内部审计与财务报告咨询",
"services.opt.subtitle": "在业务流程与IT系统中设计并持续维护审计就绪的控制环境",
"services.opt.desc": "核心重点",
"services.opt.offeringsTitle": "核心服务",
"services.opt.b1": "SOX / ICFR（业务 + IT控制）",
"services.opt.b2": "内部审计转型与联合外包",
"services.opt.b3": "业务流程控制（R2R、O2C、P2P、库存、薪酬）",
"services.opt.b4": "ITGC与应用控制（支撑层，而非主标题）",
"services.opt.b5": "审计准备与整改",
"services.opt.b6": "控制环境优化",
"services.opt.b7": "ITGC与应用控制稳定化",
"services.opt.b8": "SOX项目设计与执行",
"services.opt.b9": "业务流程穿行测试与控制设计",
"services.opt.b10": "ERP控制框架（SAP、Oracle、Workday）",


    "services.itgc.title": "网络安全",
"services.itgc.subtitle": "通过安全且具韧性的技术环境保护业务运营和财务完整性",
"services.itgc.desc": "核心重点",
"services.itgc.offeringsTitle": "核心服务",
"services.itgc.b1": "与业务影响对齐的网络风险",
"services.itgc.b2": "身份、访问与特权控制",
"services.itgc.b3": "云与SaaS风险（财务数据、报告系统）",
"services.itgc.b4": "应用与数据安全",
"services.itgc.b5": "支持SOX和监管合规的技术风险",
"services.itgc.b6": "安全架构与风险评估",
"services.itgc.b7": "IAM / 特权访问治理",
"services.itgc.b8": "安全系统实施审查（上线前/上线后）",
"services.itgc.b9": "数据完整性与保护策略",
"services.itgc.b13": "与SOX / ICFR对齐的安全控制",
"services.itgc.b14": "供应商与SaaS风险评估",


    "services.cta": "想按行业了解监管视角？<span>查看行业</span> →",

    "services.models.title": "合作模式",
    "services.models.m1": "固定费用冲刺 适合目标明确且需要快速执行的项目。包含里程碑和清晰的交付清单。",
    "services.models.m2": "封顶 T&M  适合复杂度可变的整改工作。包含约定上限和每周工时消耗可视化。",
    "services.models.m3": "顾问保留服务 按约定工时持续提供咨询，明确响应预期和季度规划。",

    "services.addons.title": "可选附加服务（稳定化后）",
    "services.addons.intro": "一旦 IT 控制基础稳定，Primevant Advisory 可支持相关的其他风险重点。",
    "services.addons.a1": "网络风险评估与治理",
    "services.addons.a2": "第三方风险支持（SOC 报告审阅、控制映射）",
    "services.addons.a3": "AI 治理与控制咨询（政策 + 监督）"

    ,
    "industries.kicker": "行业",
    "industries.heroTitle": "与<br><span>您所在行业实际运作方式</span>相匹配的监管视角。",
    "industries.heading": "我们服务的行业",
    "industries.intro": " Primevant Advisory 为高度受监管和技术驱动型行业中的组织提供支持，在这些行业中，健全的治理、韧性系统和审计就绪控制至关重要。我们的经验涵盖复杂企业环境中的 IT 控制、网络安全治理、隐私义务和监管合规。<br><br>我们与管理团队合作，将监管要求转化为切实可行且可持续的控制环境，从而加强风险监督和运营韧性。",

    "industries.fs.title": "金融服务",
    "industries.fs.text": "Primevant Advisory 帮助金融机构将技术风险和网络安全治理与监管期望及 SOX、GLBA、FFIEC 指导和 PCI DSS 等框架保持一致，同时强化支撑财务报告完整性、运营韧性和客户信任的控制。",

    "industries.healthcare.title": "医疗健康",
    "industries.healthcare.text": "Primevant Advisory 支持医疗健康机构加强与 HIPAA 隐私和安全要求相一致的技术治理和安全实践，帮助保护敏感患者信息，并确保关键临床系统的可靠性和持续性。",

    "industries.saas.title": "科技 / SaaS",
    "industries.saas.text": "Primevant Advisory 与科技和 SaaS 组织合作，使治理、风险管理和安全实践与 SOC 报告和 ISO 对齐安全项目等行业保障框架保持一致，从而建立可扩展的控制环境，以支持隐私合规、运营韧性和客户信任。",

    "industries.manufacturing.title": "制造业",
    "industries.manufacturing.text": "Primevant Advisory 帮助制造业组织加强企业 IT 和运营技术环境中的治理与网络安全，以提升运营韧性、保护知识产权，并支持安全可靠的生产系统。",

    "industries.retail.title": "消费 / 零售",
    "industries.retail.text": "Primevant Advisory 支持消费与零售组织加强技术风险治理、支付安全和数据保护实践，以支持安全的数字商务、监管合规和持续的客户信任。",

    "industries.other.title": "其他受监管环境",
    "industries.other.text": "Primevant Advisory 帮助在受监管环境中运营的组织，使技术治理和网络安全实践与行业特定监管要求及联邦安全框架保持一致，同时建立具备韧性且审计就绪的技术控制项目。"
    

,
    "approach.heroTitle": "快速执行<br><span style='color:var(--blue2)'>安全交付<br></span>清晰范围。",
    "approach.heroLead": "结合四大事务所严谨性与精品咨询灵活性——提供董事会级输出、可审计文档和可持续执行节奏。",

    "approach.sectionTitle": "Primevant 交付模型",

    "approach.assess.title": "评估",
    "approach.assess.text": "确认当前状态、关键风险、审计预期以及实现可审计控制的最快路径。<br><br>输出：范围说明、时间表、交付物、证据要求",

    "approach.align.title": "对齐",
    "approach.align.text": "明确范围边界、角色和变更控制，防止范围蔓延。<br><br>输出：启动计划、风险日志、周报机制",

    "approach.deliver.title": "交付",
    "approach.deliver.text": "按里程碑执行，提供审计就绪文档和实际整改支持。<br><br>输出：更新的控制矩阵、证据手册、整改跟踪",

    "approach.sustain.title": "持续",
    "approach.sustain.text": "为客户团队提供模板和方法，确保成果持续。<br><br>输出：运营机制、培训资料、交接清单",

    "approach.security.title": "安全与保密",
    "approach.security.text": "Primevant 通过安全存储和最小权限原则保护客户数据。",

    "approach.communication.title": "沟通",
    "approach.communication.text": "客户每周收到清晰的状态更新，包括进展、风险和下一步。"


,
    "insights.heroCta": "Primevant 洞察",
    "insights.title": "洞察",
    "insights.lede": "关于 SOX、ITGC 和控制的简明实用指南，面向 CFO、CIO、CISO 及内部审计负责人，帮助减少意外并实现更顺畅的审计。",

    "insights.p1.title": "30天 SOX 准备",
    "insights.p1.text": "一个现实的步骤流程：范围、控制说明、走查、证据标准与整改跟踪。",
    "insights.read": "阅读文章 →",

    "insights.p2.title": "ITGC 证据：审计师真正需要的内容",
    "insights.p2.text": "常见证据错误，以及如何标准化工单、审批和访问审查。",

    "insights.p3.title": "在不增加风险的情况下减少 SOX 测试",
    "insights.p3.text": "如何优化关键控制、减少重复并提高审计依赖性。",
    "insights.coming": "即将推出 →",

    "insights.featured": "精选内容",

    "insights.f1.title": "快速成长企业的 SOX 准备",
    "insights.f1.text": "审计摩擦来源以及应尽早标准化的关键要素。",

    "insights.f2.title": "面向董事会的 IT 风险报告",
    "insights.f2.text": "从运营指标转向支持决策的关键风险指标。",

    "insights.f3.title": "审计师会关注的 AI 治理控制",
    "insights.f3.text": "关键领域：清单、审批、监控和生命周期管理。"



    ,
    "about.tophero.title": "我们的团队，您的审计，卓越精准。",

    "about.hero.title": "董事会级风险咨询<br><span style='color:var(--blue2)'>具备四大标准</span>。",
    "about.hero.lead": "Primevant Advisory 帮助管理团队强化治理、有效管理风险，并维持具韧性的内部控制环境。",

    "about.section.title": "关于 Primevant Advisory",
    "about.section.lead": "Primevant Advisory 是一家专注于 IT 风险、SOX 和控制的精品咨询公司。我们提供清晰范围、高管级沟通和审计就绪成果，而不增加不必要的负担。",

    "about.mission.title": "我们的使命",
    "about.mission.text": "帮助组织以务实、可辩护并与业务运营相一致的方式强化控制环境，从而让 SOX 和 IT 风险项目减少意外并提升信心。",

    "about.values.title": "我们的价值观",
    "about.values.text": "清晰（明确范围和交付物）、纪律（审计级证据）、判断（适度控制）和信任（安全处理客户信息）。",

    "about.founder.name": "Uchechi Osuagwu",
    "about.founder.role": "管理合伙人",

    "about.founder.background.title": "背景简介",
    "about.founder.background.p1": "Uchechi Osuagwu 曾任安永合伙人，是一位资深技术风险高管，拥有 15 年以上经验，曾为《财富》50 强企业领导企业审计、网络安全、AI 战略和数字化转型项目。她的职业经历覆盖复杂且高度受监管的全球环境，在这些环境中，技术、风险和业务成果紧密交汇。",
    "about.founder.background.p2": "Uchechi 曾领导大型项目，重点在于强化技术控制、推动 AI 治理落地，并现代化企业风险与审计框架，以支持增长、监管就绪和韧性建设。在她的职业生涯中，她与董事会、高管团队和监管机构密切合作，就 SOX 准备、网络韧性、第三方风险和新兴技术风险提供咨询。",
    "about.founder.background.p3": "她因能够弥合技术复杂性与高管决策之间的差距而广受认可，能够将复杂的控制、安全和 AI 挑战转化为务实且符合业务目标的战略。",

    "about.founder.credentials.title": "资历与专长",
    "about.founder.credentials.l1": "15年以上技术风险、企业审计、网络安全和 AI 治理领导经验",
    "about.founder.credentials.l2": "在 SOX、ITGC、访问控制、变更管理和基于证据的控制框架方面具备深厚专长",
    "about.founder.credentials.l3": "具备在企业环境中推动 AI 治理和风险管理落地的丰富经验",
    "about.founder.credentials.l4": "是董事会和 C-suite 领导层在监管准备、网络风险和新兴 AI 威胁方面值得信赖的顾问",
    "about.founder.credentials.l5": "拥有支持金融服务、医疗、科技和消费行业全球运营的广泛背景",
    "about.founder.credentials.l6": "擅长将技术、风险、审计和业务相关方整合到统一且以执行为导向的风险战略中",

    "about.founder.credibility.title": "专业说明",
    "about.founder.credibility.p1": "Uchechi 兼具高管判断力、技术深度和务实交付经验。这使她不仅能帮助高级领导识别风险，更能帮助他们解决风险，设计真正适用于现实环境的控制环境、治理模型和运营结构。",
    "about.founder.credibility.p2": "她的方法严谨、结果导向，并扎根于审计、监管和企业执行的现实需求。通过 Primevant Advisory，Uchechi 与组织合作，将监管压力和技术变革转化为战略优势。"

    ,
"about.narrative.title": "强化治理能力。<br><span style='color:var(--blue2)'>助力自信决策。</span>",
"about.narrative.p1": "Primevant Advisory 与管理层合作，建立稳健的治理框架，并将风险转化为清晰、可执行的成果。",
"about.narrative.p2": "我们立足于业务、风险与控制的交汇点，帮助组织应对监管要求、强化监督机制，并构建支持增长的韧性运营环境。",

"about.team.title": "能力与团队",
"about.team.lead": "Primevant Advisory 通过一支专注且高水平的专业网络提供服务，涵盖治理、风险、网络安全及监管领域，能够支持复杂的企业环境。",

"about.team.card1.title": "企业治理与风险能力",
"about.team.card1.text": "在财务报告、运营、网络安全及技术领域的治理、风险与控制项目方面具备丰富经验，交付符合监管要求和业务优先级。",

"about.team.card2.title": "四大及行业经验",
"about.team.card2.text": "团队成员拥有来自领先咨询机构和复杂企业环境的经验，服务于金融、医疗、科技及消费行业。",

"about.team.card3.title": "灵活交付模式",
"about.team.card3.text": "项目由高级领导监督，并根据需要引入专业能力，确保在范围、时间和监管要求下实现高质量交付。",

"about.founder.more": "更多信息",
"about.teamCredibility.title": "团队实力",
"about.teamCredibility.p1": "Primevant Advisory 结合高级领导层监督与高水平专业网络，覆盖治理、风险、网络安全和监管等领域。该模式使我们能够在复杂企业环境中，以应有的深度与严谨性提供务实且审计就绪的成果。",
"about.teamCredibility.p2": "我们的项目配置以问题为导向，确保为每项挑战匹配合适的专业能力，在高管判断、专业专长和一致的交付标准之间取得平衡，从而支持监管准备、运营韧性以及与业务目标一致的风险管理。",

"about.founder.less": "Menos información"


,
    "contact.banner": "联系我们",
    "contact.heroTitle": "让我们对齐您的<br><span style='color:var(--blue2)'>审计就绪目标</span>。",
    "contact.p1": "<b> 将风险转化为高管行动。</b> 我们帮助技术团队、内部审计和管理层之间建立桥梁，确保控制框架支持业务目标。",
    "contact.p2": "<b> 降低合规摩擦。</b> 我们优化控制设计、文档和证据实践，使您的团队减少审计管理负担并更专注于交付成果。",
    "contact.p3": "<b> 与值得信赖的顾问合作。</b> 凭借支持董事会、高管团队和审计委员会的丰富经验，我们提供能够经受监管和外部审计审查的务实解决方案。",

    "contact.formTitle": "发送消息",
    "contact.name": "姓名 *",
    "contact.email": "电子邮件 *",
    "contact.topic": "主题",
    "contact.message": "消息 *",
    "contact.submit": "提交",
    "contact.viewServices": "查看服务",

    "contact.details": "联系方式",
    "contact.response": "<b>我们通常会在 1 个工作日内回复。若您的审计周期需求较为紧急，请在消息中注明“time-sensitive”。</b>"

    
    ,
    "privacy.title": "隐私声明",
    "privacy.lead": "Primevant Advisory 尊重您的隐私，并以谨慎和专业的方式处理信息。本声明说明我们通过本网站收集的信息以及我们如何使用这些信息。",

    "privacy.updated": "最后更新：",

    "privacy.collect.title": "我们收集的信息",
    "privacy.collect.text": "当您联系我们（例如通过联系页面）时，我们可能会收集您提供的信息，例如您的姓名、电子邮件、公司以及您的留言内容。",

    "privacy.use.title": "我们如何使用信息",
    "privacy.use.text": "我们使用您提供的信息来回应咨询、安排沟通、提供所需资料，并就潜在服务进行沟通。我们不会出售个人信息。",

    "privacy.security.title": "数据处理与保护",
    "privacy.security.text": "Primevant Advisory 采取合理的管理和技术措施，以防止信息被未经授权访问、使用或披露。在客户项目中，数据处理和保留通常由合同（例如 MSA/SOW）进行规范。",

    "privacy.thirdparty.title": "第三方服务",
    "privacy.thirdparty.text": "如果我们将来引入第三方服务（例如分析、表单处理或日程安排工具），我们将更新本声明以反映这些服务提供商及其数据处理方式。",

    "privacy.contact.title": "联系方式",
    "privacy.contact.text": "如果您对本声明有任何疑问，请联系 <b>info@primevantadvisory.com</b>。"

  }
};

function applyTranslations(lang) {
  const dict = translations[lang] || translations.en;

  document.documentElement.setAttribute("lang", lang === "zh-cn" ? "zh-CN" : lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  langOptions.forEach((option) => {
    option.classList.toggle("active", option.dataset.lang === lang);
  });

  localStorage.setItem("primevant-language", lang);
}

function closeLangMenu() {
  if (!langMenu || !langToggle) return;
  langMenu.classList.remove("open");
  langMenu.setAttribute("aria-hidden", "true");
  langToggle.setAttribute("aria-expanded", "false");
}

function openLangMenu() {
  if (!langMenu || !langToggle) return;
  langMenu.classList.add("open");
  langMenu.setAttribute("aria-hidden", "false");
  langToggle.setAttribute("aria-expanded", "true");
}

if (langToggle && langMenu) {
  langToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = langMenu.classList.contains("open");
    if (isOpen) {
      closeLangMenu();
    } else {
      openLangMenu();
    }
  });

  langOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedLang = option.dataset.lang;
      applyTranslations(selectedLang);
      closeLangMenu();
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-switcher")) {
      closeLangMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLangMenu();
    }
  });

  const savedLang = localStorage.getItem("primevant-language") || "en";
  applyTranslations(savedLang);
}
})();
