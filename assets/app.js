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
      text: "Audit ready controls. Board level confidence. SOX readiness, IT risk governance, and AI oversight."
    },
    {
  
  title: "Services – Risk Advisory",
  url: "services.html#sox",
  section: "Services",
  text: "Enterprise risk, operational risk, financial risk, technology risk, governance, regulatory risk."
},
{
  title: "Services – Internal Audit & Financial Reporting Advisory",
  url: "services.html#itrisk",
  section: "Services",
  text: "SOX, ICFR, internal audit, business process controls, financial reporting advisory."
},
{
  title: "Services – Cybersecurity",
  url: "services.html#itgc",
  section: "Services",
  text: "Cybersecurity, identity, access, cloud, application security, data security, third party risk."
},
    {
      title: "Approach – Primevant delivery model",
      url: "approach.html",
      section: "Approach",
      text: "Diagnose, Design, Remediate, Operationalize, Sustain. Board ready outputs and audit-defensible workpapers."
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
    "hero.lead1": "We help boards and C-suites strengthen enterprise risk, technology, and cybersecurity, building control environments that drive audit readiness, regulatory confidence, and operational resilience",

"hero.lead2": "Clear, defensible control frameworks across enterprise, IT, cyber, and operational processes Rationalized, risk-aligned controls that reduce complexity without sacrificing assurance",
"hero.lead3": "Evidence standards that stand up to audit, regulators, and stakeholder scrutiny Governance structures that enable confident decision-making, accountability, and scalable growth",

    "statement.headline": "Audit ready controls<br>Board level confidence",
"statement.subtext": "Big Four quality, without the overhead.<br><br>Strengthen enterprise, technology, and cybersecurity risk environments with practical, defensible outcomes.<br><br>Business led risk and control frameworks, technology governance, and AI oversight designed to stand up to auditors, regulators, and real-world scrutiny.<br><br>Simpler control design. Stronger evidence. Fewer surprises.",
"trust.item1": "Risk Advisory",
"trust.item2": "Internal Audit",
"trust.item3": "Cybersecurity",
"trust.item4": "Financial Reporting Advisory",

    "services.heading": "Our Core Advisory Services",
"services.card1.title": "Risk Advisory",
"services.card1.text": "Enterprise risk, technology risk, cybersecurity, and governance support that helps leadership align risk decisions to strategy, regulatory expectations, and operational resilience",

"services.card2.title": "Internal Audit & Financial Reporting Advisory",
"services.card2.text": "Audit ready support across internal controls, SOX, ICFR, business process controls, and financial reporting risks to improve assurance and reduce audit friction",

"services.card3.title": "Cybersecurity",
"services.card3.text": "Business aligned cybersecurity advisory focused on identity, access, cloud, application, data, and third-party risk controls that protect operations and support compliance",

    "common.learnMore": "Learn More",
    "band.leftTitle": "From Risk Exposure to",
    "band.big": '<span class="accent">Risk Confidence</span>',
    "band.link": "View Our Approach",
    "why.title": "Why Primevant",
    "why.reason1.title": "Big 4 quality standards.",
    "why.reason1.text": "Methodology backed.<br>Audit defensible.",
    "why.reason2.title": "Boutique Agility.",
    "why.reason2.text": "Direct partner involvement.<br>Faster decisions.",
    "why.reason3.title": "Executive Delivery.",
    "why.reason3.text": "Board ready insights.<br>Not operational noise.",
    "footer.privacy": "Privacy"

    /* Services */
    ,
"services.heroTitle": "Business led <br>Enterprise Risk &<br><span style='color:var(--blue2)'>Controls Advisory</span>.",
"services.heroLead": "We help organizations establish strong governance and translate risk into clear, actionable outcomes, enabling executive clarity and confident, defensible decision making.",
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
"services.sox.b8": "Enterprise & process level risk assessments",
"services.sox.b10": "SOC 2 Readiness, Assessment & Audit Support",
"services.sox.b12": "AI governance and controls advisory (policy + oversight)",
"services.sox.b13": "Third party risk management",

    "services.opt.title": "Internal Audit & Financial Reporting Advisory",
"services.opt.subtitle": "Design and sustain audit ready control environments across business processes and IT systems",
"services.opt.desc": "Core Focus",
"services.opt.offeringsTitle": "Signature Offerings",
"services.opt.b1": "SOX / ICFR (business + IT controls)",
"services.opt.b2": "Internal audit transformation & co-sourcing",
"services.opt.b3": "Business process controls (R2R, O2C, P2P, inventory, payroll)",
"services.opt.b4": "ITGC & application controls",
"services.opt.b5": "Audit readiness and remediation",
"services.opt.b7": "System implementation reviews (pre/post go-live)",
"services.opt.b8": "SOX program design and execution",
"services.opt.b9": "Business process walkthroughs & control design",
"services.opt.b10": "ERP control frameworks (SAP, Oracle, Workday) rationalization and optimization",

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
"services.itgc.b8": "Information Security & Risk Assessments (ISO 27001, NIST CSF, and other frameworks)",
"services.itgc.b9": "Data integrity and protection strategies",
"services.itgc.b13": "Security controls aligned to SOX / ICFR",

    "services.cta": "Want the regulatory lens per industry? <span>See Industries</span> →",

    "services.models.title": "Engagement Models",
    "services.models.m1": "Fixed fee sprint - best for defined outcomes and rapid execution. Includes milestones and a clear deliverable list.",
    "services.models.m2": "Capped T&M  - est for remediation where complexity varies. Includes an agreed cap and weekly burn visibility.",
    "services.models.m3": "Retainer  - ongoing advisory with bounded hours, response expectations, and quarterly planning.",

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
"industries.intro": "Primevant Advisory supports organizations across highly regulated and technology driven industries where strong governance, resilient systems, and audit ready controls are essential. Our experience spans across risk and controls, cybersecurity governance, privacy obligations, and regulatory compliance across complex enterprise environments.<br><br>We work with leadership teams to translate regulatory expectations into practical, sustainable control environments that strengthen risk oversight and operational resilience.",

    "industries.fs.title": "Financial Services",
"industries.fs.text": "Primevant Advisory helps financial institutions align risk and cybersecurity governance with supervisory expectations and frameworks such as SOX, GLBA, FFIEC guidance, and PCI DSS while strengthening the controls that support financial reporting integrity, operational resilience, and customer trust.",

    "industries.healthcare.title": "Healthcare",
"industries.healthcare.text": "Primevant Advisory supports healthcare organizations in strengthening governance and security practices aligned with HIPAA privacy and security expectations, helping protect sensitive patient information while ensuring the reliability and continuity of critical clinical systems.",

    "industries.saas.title": "Technology / SaaS",
    "industries.saas.text": "Primevant Advisory works with technology and SaaS organizations to align governance, risk management, and security practices with industry assurance frameworks such as SOC reporting and ISO aligned security programs, enabling scalable control environments that support privacy compliance, operational resilience, and customer trust.",

    "industries.manufacturing.title": "Manufacturing",
"industries.manufacturing.text": "Primevant Advisory helps manufacturing organizations strengthen governance and cybersecurity across enterprise IT and operational technology environments to improve the control environment, operational resilience, protect intellectual property, and support secure and reliable production systems.",

    "industries.retail.title": "Consumer / Retail",
"industries.retail.text": "Primevant Advisory supports consumer and retail organizations in strengthening risk governance, payment security, and data protection practices to support secure digital commerce, regulatory compliance, and sustained customer trust.",

    "industries.other.title": "Other regulated environments",
"industries.other.text": "Primevant Advisory helps organizations operating in regulated environments align governance and cybersecurity practices with sector specific regulatory expectations and federal security frameworks while building resilient, audit ready control programs.",
    /* Approach */

  
    "approach.heroTitle": "Execute fast<br><span style='color:var(--blue2)'>Secure delivery<br></span>Clear scope.",
    "approach.heroLead": "Big 4 rigor with boutique speed, board ready outputs, audit defensible documentation, and sustainable cadence.",

    "approach.sectionTitle": "Primevant delivery model",

    "approach.assess.title": "Assess",
    "approach.assess.text": "Confirm current state, key risks, and stakeholder expectations, and define the fastest path to defensible controls and evidence <br><br>Outputs: scope memo, timeline, deliverables, evidence expectations",

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
"insights.title": "Risk clarity<br><span style='color:var(--blue2)'>Control insight</span><br>Executive confidence","insights.lede": "Practical insights on enterprise risk, technology, and controls, designed for CFO, CIO, CISO, and Internal Audit leaders seeking clarity, control, and confidence.",
    "insights.p1.title": "SOX readiness in 30 days",
    "insights.p1.text": "A realistic sequence: scope, narratives, walkthroughs, evidence standards, and remediation tracking.",
    "insights.read": "Read post →",

 "insights.p2.title": "AI Governance & Control Readiness: What Boards Actually Need",
"insights.p2.text": "How organizations can establish practical AI governance, define accountability, and implement controls that balance innovation, risk, and regulatory expectations.",

"insights.p3.title": "Cyber Risk & Third-Party Exposure: Strengthening the Weakest Link in Enterprise Control Environments",
"insights.p3.text": "How to identify, assess, and manage cyber and vendor risk across the enterprise, moving beyond point-in-time assessments to continuous, risk-aligned oversight.",
    "insights.coming": "Coming soon →",

    "insights.featured": "Featured",

    "insights.f1.title": "SOX readiness in fast scaling organizations",
    "insights.f1.text": "Where audit friction comes from and what to standardize early (owners, cadence, evidence).",

    "insights.f2.title": "Board reporting for IT risk governance",
    "insights.f2.text": "Move from operational metrics to board level KRIs that support oversight decisions.",

    "insights.f3.title": "AI governance controls auditors will ask for",
    "insights.f3.text": "Control themes: inventory, approvals, monitoring, and lifecycle documentation.",

    "insights.readPost": "Read post",

    "aiGov.title": "AI Governance & Control Readiness: What Boards Actually Need",
"aiGov.subtitle": "A realistic sequence for scope, narratives, walkthroughs, evidence standards, and remediation tracking",

"aiGov.intro1": "Artificial intelligence is advancing faster than most governance structures were designed to accommodate. Organizations across industries are embedding AI into analytics, operations, customer engagement, software development, and decision-making processes at a pace that often exceeds the maturity of the surrounding control environment.",
"aiGov.intro2": "Boards are responding accordingly. Leadership teams are now being asked direct questions about accountability, oversight, regulatory exposure, and operational risk tied to AI adoption.",
"aiGov.intro3": "Most organizations do not have an AI governance problem because they lack policies or principles. They have a governance problem because they lack operational discipline.",

"aiGov.section1.title": "Governance Starts With Scope",
"aiGov.section1.p1": "One of the earliest failures in AI governance occurs during the identification phase. Organizations routinely underestimate how difficult it is to determine where AI is actually operating across the business.",
"aiGov.section1.p2": "AI adoption rarely enters the organization through one centralized initiative. It emerges incrementally across departments, platforms, vendor tools, and business-led experimentation.",
"aiGov.section1.p3": "If management cannot confidently identify where AI influences business activity, meaningful oversight becomes impossible.",
"aiGov.section1.li1": "Clear criteria for what constitutes AI “in scope”",
"aiGov.section1.li2": "A centralized inventory of AI-enabled systems and use cases",
"aiGov.section1.li3": "Defined ownership accountability",
"aiGov.section1.li4": "Risk-tiering standards aligned to operational and regulatory exposure",
"aiGov.section1.li5": "Escalation thresholds for higher-risk implementations",
"aiGov.section1.p4": "Governance scope must extend beyond internally developed models. Some of the most significant exposure today comes from third-party platforms with embedded AI functionality.",

"aiGov.section2.title": "Narratives Expose Weaknesses Faster Than Control Testing",
"aiGov.section2.p1": "Once scope is established, organizations often move directly into control assessments. In practice, one of the most valuable governance exercises is far less technical: developing operational narratives.",
"aiGov.section2.p2": "Well-developed narratives force alignment across business stakeholders, technology teams, compliance functions, and leadership.",
"aiGov.section2.li1": "The business purpose of the AI process",
"aiGov.section2.li2": "Systems, data sources, and dependencies involved",
"aiGov.section2.li3": "Decision points and human oversight activities",
"aiGov.section2.li4": "Risks introduced through automation or model usage",
"aiGov.section2.li5": "Control activities designed to mitigate those risks",
"aiGov.section2.li6": "Accountability and escalation responsibilities",
"aiGov.section2.li7": "Evidence generated through execution",
"aiGov.section2.p3": "Narratives create a common language between technical and non-technical stakeholders. Boards do not need machine learning architecture detail; they need visibility into how governance responsibilities are being executed.",

"aiGov.section3.title": "Walkthroughs Reveal Whether Governance Actually Exists",
"aiGov.section3.p1": "Policies describe intent. Walkthroughs reveal reality.",
"aiGov.section3.p2": "Organizations frequently discover during walkthroughs that their governance model exists more clearly in presentation materials than in operational execution.",
"aiGov.section3.li1": "How AI systems move into production",
"aiGov.section3.li2": "Approval and change management activities",
"aiGov.section3.li3": "Human review and override mechanisms",
"aiGov.section3.li4": "Data validation procedures",
"aiGov.section3.li5": "Monitoring and exception management",
"aiGov.section3.li6": "Access controls and segregation practices",
"aiGov.section3.li7": "Incident escalation processes",
"aiGov.section3.li8": "Documentation retention expectations",
"aiGov.section3.p3": "Boards should view walkthroughs as governance validation exercises rather than purely audit procedures.",

"aiGov.section4.title": "Evidence Standards Are Becoming a Defining Governance Issue",
"aiGov.section4.p1": "As AI oversight matures, governance conversations increasingly become evidence conversations.",
"aiGov.section4.p2": "Organizations may perform reviews, approvals, monitoring activities, and oversight procedures consistently, but if those activities cannot be demonstrated through reliable evidence, the control environment becomes difficult to defend.",
"aiGov.section4.li1": "What documentation must be retained",
"aiGov.section4.li2": "Where evidence is maintained",
"aiGov.section4.li3": "Ownership responsibilities for retention",
"aiGov.section4.li4": "Retention timeframes",
"aiGov.section4.li5": "Standards for evidencing control execution",
"aiGov.section4.li6": "Validation procedures for evidence integrity",
"aiGov.section4.p3": "Boards do not need visibility into every operational artifact. They need confidence that management has evidence practices capable of supporting governance assertions under scrutiny.",

"aiGov.section5.title": "Remediation Discipline Determines Governance Credibility",
"aiGov.section5.p1": "No governance environment is free from control gaps or operational inconsistencies. What separates mature organizations from unprepared ones is whether management can identify issues early, assign accountability clearly, and remediate deficiencies with discipline.",
"aiGov.section5.li1": "Undefined ownership structures",
"aiGov.section5.li2": "Inconsistent approvals",
"aiGov.section5.li3": "Incomplete documentation",
"aiGov.section5.li4": "Weak monitoring practices",
"aiGov.section5.li5": "Third-party oversight gaps",
"aiGov.section5.li6": "Data governance concerns",
"aiGov.section5.li7": "Misalignment between policy requirements and operational execution",
"aiGov.section5.p2": "Boards should pay close attention to repeated issues across business units. Recurring exceptions usually indicate broader weaknesses in governance design rather than isolated operational failures.",

"aiGov.final.title": "What Boards Actually Need",
"aiGov.final.p1": "Most boards are not trying to become experts in artificial intelligence. They are trying to determine whether management has established enough operational discipline to deploy AI responsibly and defend those practices under scrutiny.",
"aiGov.final.p2": "That requires visibility into where AI exists, clarity around accountability, evidence that controls operate consistently, and confidence that issues will surface before they become material events.",
"aiGov.final.li1": "Define scope",
"aiGov.final.li2": "Develop operational narratives",
"aiGov.final.li3": "Validate execution through walkthroughs",
"aiGov.final.li4": "Standardize evidence expectations",
"aiGov.final.li5": "Implement disciplined remediation tracking",
"aiGov.final.p3": "The organizations that adapt successfully will not necessarily be the ones moving fastest on AI adoption. More likely, they will be the ones capable of demonstrating that governance maturity evolved alongside deployment rather than after the fact."

/* about */

,
"about.tophero.title": "Our people. Your confidence. Exceptional precision.",

    "about.hero.title": "Board level risk advisory<br><span style='color:var(--blue2)'>with Big 4 discipline</span>.",
    "about.hero.lead": "Primevant Advisory helps leadership teams strengthen governance, manage risk effectively, and sustain resilient internal control environments.",

    "about.section.title": "About Primevant Advisory",
"about.section.lead": "Primevant Advisory is a boutique advisory firm focused on enterprise risk, technology, cybersecurity, and controls. We deliver clear scope, executive level communication, and defensible outcomes, without unnecessary overhead.",

    "about.mission.title": "Our mission",
"about.mission.text": "Help organizations strengthen enterprise risk and control environments in a practical, defensible way that aligns with business operations, reducing surprises and increasing confidence across governance, technology, and assurance programs.",

    "about.values.title": "Our values",
"about.values.text": "Clarity (clear scope, expectations, and outcomes), Discipline (consistent, defensible evidence and execution), Judgment (right sized, risk informed controls), and Trust (secure handling of client information and relationships).",

    "about.founder.name": "Uchechi Osuagwu",
    "about.founder.role": "Managing Partner",

    "about.founder.background.title": "Background Summary",
"about.founder.background.p1": "Uchechi Osuagwu is a former EY New York City partner and seasoned technology risk executive with over 15 years of experience leading enterprise audit, cybersecurity, AI strategy, and digital transformation initiatives for Fortune 500 organizations. Her career spans complex, highly regulated global environments where technology, risk, and business outcomes intersect.",
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
"about.narrative.p2": "We help organizations align business, risk, and controls, strengthening oversight, meeting regulatory expectations, and building resilient operating environments that support growth.",

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
"about.teamCredibility.p1": "Primevant Advisory combines senior leadership oversight with a high caliber network of professionals across governance, risk, cybersecurity, and regulatory disciplines. This model enables the firm to deliver practical, audit ready outcomes with the depth and discipline expected in complex enterprise environments.",
"about.teamCredibility.p2": "Our engagements are structured to bring the right expertise to the right challenge balancing executive judgment, specialized capability, and consistent delivery standards to support regulatory readiness, resilient operations, and business aligned risk management.",

"about.founder.less": "Less information"




/* contact */

,
    "contact.banner": "Contact us",
"contact.heroTitle": "Let’s align on your<br><span style='color:var(--blue2)'>control and risk objectives</span>.",
"contact.p1": "<b>Translate risk into executive action.</b> We bridge the gap between technical teams, internal audit, and executive leadership to ensure control frameworks support business and operational priorities.",
    "contact.p2": "<b>Reduce complexity and friction.</b> We streamline control design, documentation, and evidence practices so your teams spend less time managing controls and more time driving performance and value.",

"contact.p3": "<b>Engage with a proven advisor.</b> With deep experience supporting boards, C-suites, and audit committees, we deliver practical solutions that stand up to regulatory, audit, and stakeholder scrutiny.",


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

    /* Sox readiness Insight */

    ,
    "sox30.title": " ",

"sox30.intro1": "When SOX timelines compress, IT almost always becomes the pressure point.",
"sox30.intro2": "Finance owns the financial assertion, but IT determines whether auditors can actually rely on the systems producing those numbers. That relationship becomes very real once audit scrutiny begins in earnest.",
"sox30.intro3": "If access is loosely governed, if change activity is inconsistently executed, or if data flows are not well understood, financial controls become difficult to rely on regardless of how well they are documented. The gap between control design and control reliability is where most SOX readiness efforts begin to strain.",
"sox30.intro4": "In compressed timelines, the objective is not perfect compliance maturity. It is establishing enough structure and consistency that auditors can follow how systems are governed, how controls operate in practice, and who is accountable for execution.",
"sox30.intro5": "In most organizations, that clarity is not fully in place at the point SOX readiness begins.",

"sox30.section1.title": "Visibility is usually the first constraint, not controls",
"sox30.section1.p1": "The initial challenge is rarely the absence of controls. Most organizations already have access processes, change workflows, approval mechanisms, and operational reviews in some form.",
"sox30.section1.p2": "The issue is that these processes often evolved independently across teams and systems during periods of growth. What exists is typically a collection of practices rather than a unified control environment.",
"sox30.section1.p3": "This becomes most visible when trying to answer a basic question: which systems actually matter for financial reporting?",
"sox30.section1.p4": "ERP platforms are usually straightforward. Complexity emerges around adjacent applications, reporting layers, system integrations, and manual processes that support financial close activities.",
"sox30.section1.p5": "What often surprises leadership teams is how many non-financial systems still influence financial outcomes through data transformations, exports, and manual adjustments.",
"sox30.section1.p6": "Without a clear and agreed view of scope, everything that follows becomes harder to stabilize.",

"sox30.section2.title": "Control design is rarely the real issue",
"sox30.section2.p1": "Once scope is understood, attention naturally shifts to IT General Controls. On paper, this appears straightforward. In practice, inconsistency begins to surface.",
"sox30.section2.p2": "Access management may exist, but approval and review practices often vary across systems. Change management may be documented, but emergency changes or small production updates are sometimes handled outside formal workflows. Operational controls may function effectively, but evidence of execution is not always retained in a consistent manner.",
"sox30.section2.p3": "The issue is not whether controls exist. It is whether they operate in a repeatable and defensible way.",
"sox30.section2.p4": "In SOX environments, inconsistency is often more problematic than absence.",
"sox30.section2.p5": "Auditors are not assessing intent. They are assessing reliability.",
"sox30.section2.p6": "That is where friction begins to surface, particularly in organizations that scaled operationally before standardizing governance expectations.",

"sox30.section3.title": "Automation shifts the nature of control risk",
"sox30.section3.p1": "As systems mature, a growing portion of financial control execution becomes automated. Approvals are embedded in workflows, reports are system-generated, and calculations are performed directly within platforms rather than manually.",
"sox30.section3.p2": "This is generally positive from an efficiency perspective, but it changes the governance requirement significantly.",
"sox30.section3.p3": "The focus shifts from whether a control was performed manually to whether the system performing the control is appropriately configured, restricted, and governed over time.",
"sox30.section3.p4": "A recurring issue is over-reliance on system outputs without sufficient understanding of how those outputs are generated or modified. If report logic, configuration settings, or access parameters can change without governance oversight, downstream financial controls can be compromised even when the process appears stable.",
"sox30.section3.p5": "This is where alignment between IT and finance becomes essential. Finance tends to focus on outcomes. IT must focus on the integrity of the mechanisms producing those outcomes.",
"sox30.section3.p6": "Both perspectives are necessary, but SOX environments require them to operate in sync.",

"sox30.section4.title": "Evidence discipline determines audit efficiency",
"sox30.section4.p1": "One of the most underestimated aspects of SOX readiness is evidence management.",
"sox30.section4.p2": "Controls may be operating correctly, but if evidence is inconsistent, fragmented, or difficult to retrieve, the control becomes difficult to defend during audit testing.",
"sox30.section4.p3": "In many organizations, evidence exists across multiple systems and communication channels. Approvals may sit in ticketing tools, change records in spreadsheets, access reviews in email threads or platform exports, and operational logs in system interfaces without centralized retention standards.",
"sox30.section4.p4": "Individually, this is not unusual. Collectively, it creates avoidable audit friction.",
"sox30.section4.p5": "The core issue is not storage. It is predictability.",
"sox30.section4.p6": "Auditors need to understand not only that evidence exists, but that it can be produced consistently in a reliable format over time.",
"sox30.section4.p7": "Organizations that manage SOX environments effectively tend to standardize evidence expectations early, including what must be retained, where it resides, and how it is produced. That consistency materially reduces audit disruption.",

"sox30.section5.title": "Walkthroughs expose how the environment actually operates",
"sox30.section5.p1": "At some point, organizations move from documenting controls to validating how they operate in practice.",
"sox30.section5.p2": "This is typically where gaps become more visible.",
"sox30.section5.p3": "What often emerges is not the absence of controls, but variation in execution across teams, systems, or individuals. Some areas may be tightly governed, while others rely heavily on informal practices or institutional knowledge.",
"sox30.section5.p4": "Common issues tend to surface around access hygiene, change discipline, and privileged access governance. Emergency procedures may exist but are not consistently documented. Shared accounts or legacy access structures may persist longer than expected.",
"sox30.section5.p5": "These findings are rarely unexpected internally. What they highlight is the difference between operational functionality and audit-ready structure.",
"sox30.section5.p6": "The purpose of walkthroughs is not immediate remediation. It is clarity on where the environment is stable and where it depends on informal execution patterns.",

"sox30.section6.title": "Leadership alignment becomes the turning point",
"sox30.section6.p1": "As clarity improves, the conversation shifts from individual controls to overall readiness posture.",
"sox30.section6.p2": "At this stage, leadership needs a consolidated view of where the organization stands, what gaps exist, and what effort is required to proceed into formal testing without avoidable disruption.",
"sox30.section6.p3": "This is where alignment between CIO and CFO becomes critical. SOX readiness is not an IT initiative. It is a shared responsibility because financial reporting integrity depends on both financial processes and the systems that support them.",
"sox30.section6.p4": "What matters most is not perfection. It is shared understanding of exposure, control maturity, and readiness trajectory.",
"sox30.section6.p5": "Organizations that struggle at this stage typically do so not because controls are missing, but because there is no unified view of how those controls behave across the environment.",

"sox30.section7.title": "Where most organizations underestimate effort",
"sox30.section7.p1": "A few patterns consistently emerge across fast-scaling environments.",
"sox30.section7.p2": "Controls are often assumed to be more consistent than they actually are. Privileged access risk is frequently underestimated. Change discipline tends to weaken during periods of rapid growth. System-generated reports are not always governed with sufficient rigor. Evidence practices evolve organically rather than intentionally.",
"sox30.section7.p3": "Individually, these issues rarely create immediate failure points. The challenge is cumulative. Under audit scrutiny, small inconsistencies across multiple domains create disproportionate friction.",

"sox30.final.title": "Final perspective",
"sox30.final.p1": "IT SOX readiness is not achieved through documentation or by adding controls in isolation.",
"sox30.final.p2": "It is achieved when an organization can clearly explain how systems are governed, how controls operate in practice, and how evidence supports those controls consistently over time.",
"sox30.final.p3": "The organizations that transition most effectively into SOX environments are not necessarily those with the most mature control frameworks. They are the ones that have enough clarity, consistency, and operational discipline that auditors can understand the environment without interpretation.",
"sox30.final.p4": "That clarity is what ultimately turns SOX readiness from a point of friction into a manageable governance process."
  },

  es: {
    "nav.services": "Servicios",
    "nav.approach": "Enfoque",
    "nav.insights": "Perspectivas",
    "nav.about": "Nosotros",
    "nav.contact": "Contacto",
    "nav.cta": "Programar una consulta →",

    "hero.title": 'Claridad sobre<br><span class="accent">complejidad</span>',
   "hero.lead1": "Ayudamos a juntas directivas y equipos ejecutivos a fortalecer el riesgo empresarial, la tecnología y la ciberseguridad, construyendo entornos de control que impulsan la preparación para auditoría, la confianza regulatoria y la resiliencia operativa",

"hero.lead2": "Marcos de control claros y defendibles en procesos empresariales, de TI, ciberseguridad y operativos Controles racionalizados y alineados al riesgo que reducen la complejidad sin sacrificar la garantía",
"hero.lead3": "Estándares de evidencia que resisten auditorías, reguladores y el escrutinio de las partes interesadas Estructuras de gobernanza que permiten decisiones seguras, responsabilidad y crecimiento escalable",
    "statement.headline": "Controles listos para auditoría<br>Confianza a nivel directivo",
"statement.subtext": "Calidad Big Four, sin la sobrecarga.<br><br>Fortalecemos entornos de riesgo empresarial, tecnológico y de ciberseguridad con resultados prácticos y defendibles.<br><br>Marcos de riesgo y control orientados al negocio, gobernanza tecnológica y supervisión de IA diseñados para responder ante auditores, reguladores y el escrutinio del mundo real.<br><br>Diseño de controles más simple. Evidencia más sólida. Menos sorpresas.",

"trust.item1": "Asesoría de Riesgo",
"trust.item2": "Auditoría Interna",
"trust.item3": "Ciberseguridad",
"trust.item4": "Asesoría de Reporte Financiero",

    "services.heading": "Nuestros servicios principales de asesoría",
"services.card1.title": "Asesoría de Riesgo",
"services.card1.text": "Apoyo en riesgo empresarial, riesgo tecnológico, ciberseguridad y gobernanza para ayudar a la dirección a alinear las decisiones de riesgo con la estrategia, las expectativas regulatorias y la resiliencia operativa.",

"services.card2.title": "Asesoría de Auditoría Interna y Reporte Financiero",
"services.card2.text": "Apoyo listo para auditoría en controles internos, SOX, ICFR, controles de procesos de negocio y riesgos de reporte financiero para mejorar la garantía y reducir la fricción de auditoría.",

"services.card3.title": "Ciberseguridad",
"services.card3.text": "Asesoría de ciberseguridad alineada al negocio, enfocada en identidad, acceso, nube, aplicaciones, datos y controles de riesgo de terceros para proteger las operaciones y apoyar el cumplimiento.",
    "common.learnMore": "Más información",
    "band.leftTitle": "De la exposición al riesgo a",
    "band.big": '<span class="accent">confianza en el riesgo</span>',
    "band.link": "Ver nuestro enfoque",
    "why.title": "Por qué Primevant",
    "why.reason1.title": "Estándares de calidad Big 4.",
    "why.reason1.text": "Respaldado por metodología.<br>Defendible ante auditoría.",
    "why.reason2.title": "Agilidad boutique.",
    "why.reason2.text": "Participación directa de socios.<br>Decisiones más rápidas.",
    "why.reason3.title": "Entrega ejecutiva.",
    "why.reason3.text": "Perspectivas listas para la junta.<br>No ruido operativo.",
    "footer.privacy": "Privacidad"

    ,
"services.heroTitle": "Asesoría en Riesgo<br><span style='color:var(--blue2)'>Empresarial y Controles</span>.",
"services.heroLead": "Ayudamos a las organizaciones a establecer una gobernanza sólida y a traducir el riesgo en resultados claros y accionables, permitiendo claridad ejecutiva y una toma de decisiones segura y defendible.",

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
"services.sox.b10": "Preparación, evaluación y soporte de auditoría SOC 2",
"services.sox.b12": "Asesoría en gobernanza y controles de IA (política y supervisión)",
"services.sox.b13": "Gestión de riesgos de terceros",

    "services.opt.title": "Asesoría de Auditoría Interna y Reporte Financiero",
"services.opt.subtitle": "Diseñar y sostener entornos de control listos para auditoría en procesos de negocio y sistemas de TI",
"services.opt.desc": "Enfoque principal",
"services.opt.offeringsTitle": "Ofertas clave",
"services.opt.b1": "SOX / ICFR (controles de negocio + TI)",
"services.opt.b2": "Transformación de auditoría interna y co-sourcing",
"services.opt.b3": "Controles de procesos de negocio (R2R, O2C, P2P, inventario, nómina)",
"services.opt.b4": "ITGC y controles de aplicación",
"services.opt.b5": "Preparación para auditoría y remediación",
"services.opt.b7": "Revisiones de implementación de sistemas (pre y post go-live)",
"services.opt.b8": "Diseño y ejecución del programa SOX",
"services.opt.b9": "Walkthroughs de procesos de negocio y diseño de controles",
"services.opt.b10": "Racionalización y optimización de marcos de control ERP (SAP, Oracle, Workday)",

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
"services.itgc.b8": "Evaluaciones de seguridad de la información y riesgo (ISO 27001, NIST CSF y otros marcos)",
"services.itgc.b9": "Estrategias de integridad y protección de datos",
"services.itgc.b13": "Controles de seguridad alineados con SOX / ICFR",

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
    "approach.assess.text": "Confirmar el estado actual, los riesgos clave y las expectativas de las partes interesadas, y definir la ruta más rápida hacia controles y evidencia defendibles<br><br>Entregables: alcance, cronograma, entregables y requisitos de evidencia",

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
"insights.title": "Claridad de riesgo<br><span style='color:var(--blue2)'>visión de control</span><br>confianza ejecutiva",
    "insights.lede": "Perspectivas prácticas sobre riesgo empresarial, tecnología y controles, diseñadas para CFO, CIO, CISO y líderes de Auditoría Interna que buscan claridad, control y confianza.",

    "insights.p1.title": "Preparación SOX en 30 días",
    "insights.p1.text": "Una secuencia realista: alcance, narrativas, walkthroughs, estándares de evidencia y seguimiento de remediación.",
    "insights.read": "Leer artículo →",

    "insights.p2.title": "Gobernanza de IA y preparación de controles: lo que realmente necesitan los directorios",
"insights.p2.text": "Cómo las organizaciones pueden establecer una gobernanza práctica de IA, definir responsabilidades e implementar controles que equilibren innovación, riesgo y expectativas regulatorias.",

"insights.p3.title": "Riesgo cibernético y exposición a terceros: fortaleciendo el eslabón más débil en los entornos de control empresarial",
"insights.p3.text": "Cómo identificar, evaluar y gestionar el riesgo cibernético y de proveedores en toda la empresa, avanzando más allá de evaluaciones puntuales hacia una supervisión continua y alineada al riesgo.",
    "insights.coming": "Próximamente →",

    "insights.featured": "Destacados",

    "insights.f1.title": "Preparación SOX en organizaciones en crecimiento",
    "insights.f1.text": "Dónde surge la fricción en auditoría y qué estandarizar desde el inicio.",

    "insights.f2.title": "Reportes para la junta sobre riesgo de TI",
    "insights.f2.text": "Pasar de métricas operativas a indicadores clave de riesgo para la supervisión.",

    "insights.f3.title": "Controles de gobernanza de IA que pedirán los auditores",
    "insights.f3.text": "Temas clave: inventario, aprobaciones, monitoreo y documentación del ciclo de vida."



,
"about.tophero.title": "Nuestra gente. Su confianza. Precisión excepcional.",

    "about.hero.title": "Asesoría de riesgos a nivel directivo<br><span style='color:var(--blue2)'>con disciplina Big 4</span>.",
    "about.hero.lead": "Primevant Advisory ayuda a los equipos directivos a fortalecer la gobernanza, gestionar el riesgo de forma eficaz y mantener entornos de control interno resilientes.",

    "about.section.title": "Sobre Primevant Advisory",
"about.section.lead": "Primevant Advisory es una firma boutique de asesoría enfocada en riesgo empresarial, tecnología, ciberseguridad y controles. Ofrecemos alcance claro, comunicación a nivel ejecutivo y resultados defendibles, sin sobrecarga innecesaria.",

    "about.mission.title": "Nuestra misión",
"about.mission.text": "Ayudar a las organizaciones a fortalecer los entornos de riesgo y control empresarial de manera práctica y defendible, alineada con las operaciones del negocio, reduciendo sorpresas y aumentando la confianza en la gobernanza, la tecnología y los programas de aseguramiento.",
    "about.values.title": "Nuestros valores",
"about.values.text": "Claridad (alcance, expectativas y resultados claros), Disciplina (evidencia y ejecución consistentes y defendibles), Criterio (controles adecuados y alineados al riesgo), y Confianza (manejo seguro de la información y las relaciones con clientes).",

    "about.founder.name": "Uchechi Osuagwu",
    "about.founder.role": "Socia Directora",

    "about.founder.background.title": "Resumen profesional",
"about.founder.background.p1": "Uchechi Osuagwu es ex socia de EY en Nueva York y una ejecutiva experimentada en riesgo tecnológico con más de 15 años de experiencia liderando iniciativas de auditoría empresarial, ciberseguridad, estrategia de IA y transformación digital para organizaciones Fortune 500. Su trayectoria abarca entornos globales complejos y altamente regulados donde la tecnología, el riesgo y los resultados del negocio convergen.",
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
"about.narrative.p2": "Ayudamos a las organizaciones a alinear el negocio, el riesgo y los controles, fortaleciendo la supervisión, cumpliendo con las expectativas regulatorias y construyendo entornos operativos resilientes que respaldan el crecimiento.",

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
"contact.heroTitle": "Alineemos sus<br><span style='color:var(--blue2)'>objetivos de control y riesgo</span>.",
"contact.p1": "<b>Traducir el riesgo en acción ejecutiva.</b> Cerramos la brecha entre equipos técnicos, auditoría interna y liderazgo ejecutivo para asegurar que los marcos de control respalden las prioridades operativas y del negocio.",
"contact.p2": "<b>Reducir complejidad y fricción.</b> Optimizamos el diseño de controles, la documentación y las prácticas de evidencia para que sus equipos dediquen menos tiempo a gestionar controles y más tiempo a impulsar el rendimiento y el valor.",
"contact.p3": "<b>Trabaje con un asesor de confianza.</b> Con amplia experiencia apoyando a juntas directivas, equipos C-suite y comités de auditoría, ofrecemos soluciones prácticas que resisten el escrutinio regulatorio, de auditoría y de las partes interesadas.",
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
    "hero.lead1": "我们帮助董事会和高管团队强化企业风险、技术和网络安全，构建能够实现审计就绪、增强监管信心并提升运营韧性的控制环境",

"hero.lead2": "覆盖企业、IT、网络安全及运营流程的清晰且可审计的控制框架 与风险对齐的精简控制，在不降低保障的前提下降低复杂性",
"hero.lead3": "能够经受审计、监管机构及利益相关方审查的证据标准 支持决策信心、责任落实和可扩展增长的治理结构",

    "statement.headline": "审计就绪的控制体系<br>董事会层面的信心",
"statement.subtext": "四大 级质量，无需高昂开销。<br><br>强化企业、技术和网络安全风险环境，提供务实且可辩护的成果。<br><br>以业务为导向的风险与控制框架、技术治理和 AI 监督，能够经受审计、监管机构和现实环境的检验。<br><br>更简洁的控制设计。更有力的证据。更少的意外。",
"trust.item1": "风险咨询",
"trust.item2": "内部审计",
"trust.item3": "网络安全",
"trust.item4": "财务报告咨询",

    "services.heading": "我们的核心咨询服务",
    "services.card1.title": "风险咨询",
"services.card1.text": "围绕企业风险、技术风险、网络安全和治理提供支持，帮助管理层将风险决策与战略、监管要求和运营韧性保持一致。",

"services.card2.title": "内部审计与财务报告咨询",
"services.card2.text": "在内部控制、SOX、ICFR、业务流程控制和财务报告风险方面提供审计就绪支持，以提升保障水平并降低审计摩擦。",

"services.card3.title": "网络安全",
"services.card3.text": "提供与业务对齐的网络安全咨询，聚焦身份、访问、云、应用、数据和第三方风险控制，以保护运营并支持合规。",

    "common.learnMore": "了解更多",
    "band.leftTitle": "从风险暴露走向",
    "band.big": '<span class="accent">风险信心</span>',
    "band.link": "查看我们的方法",
    "why.title": "为什么选择 Primevant",
    "why.reason1.title": "四大级质量标准。",
    "why.reason1.text": "方法论支撑。<br>可经受审计检验。",
    "why.reason2.title": "精品咨询的敏捷性。",
    "why.reason2.text": "合伙人直接参与。<br>决策更快速。",
    "why.reason3.title": "高管级交付。",
    "why.reason3.text": "面向董事会的洞察。<br>不是运营噪音。",
    "footer.privacy": "隐私政策"

    ,
"services.heroTitle": "以业务为导向的企业风险与<br><span style='color:var(--blue2)'>控制咨询</span>。",
"services.heroLead": "我们帮助组织建立稳健的治理体系，将风险转化为清晰、可执行的成果，从而实现高管层的清晰决策以及自信且可辩护的决策能力。",
    "services.sectionTitle": "服务领域",
    "services.sox.title": "风险咨询",
"services.sox.subtitle": "将企业、运营、财务及技术风险与业务战略对齐",
"services.sox.desc": "核心重点",
"services.sox.offeringsTitle": "核心服务",
"services.sox.b1": "企业风险管理（ERM）",
"services.sox.b2": "运营及财务风险评估",
"services.sox.b4": "转型风险（ERP、并购、新产品）",
"services.sox.b5": "监管与合规风险",
"services.sox.b7": "企业级 SOX 准备与整改冲刺",
"services.sox.b8": "企业级与流程级风险评估",
"services.sox.b10": "SOC 2 准备、评估与审计支持",
"services.sox.b12": "AI 治理与控制咨询（政策与监督）",
"services.sox.b13": "第三方风险管理",

    "services.opt.title": "内部审计与财务报告咨询",
"services.opt.subtitle": "在业务流程与IT系统中设计并持续维护审计就绪的控制环境",
"services.opt.desc": "核心重点",
"services.opt.offeringsTitle": "核心服务",
"services.opt.b1": "SOX / ICFR（业务 + IT控制）",
"services.opt.b2": "内部审计转型与联合外包",
"services.opt.b3": "业务流程控制（R2R、O2C、P2P、库存、薪酬）",
"services.opt.b4": "ITGC与应用控制",
"services.opt.b5": "审计准备与整改",
"services.opt.b7": "系统实施评审（上线前/上线后）",
"services.opt.b8": "SOX项目设计与执行",
"services.opt.b9": "业务流程穿行测试与控制设计",
"services.opt.b10": "ERP 控制框架（SAP、Oracle、Workday）的优化与精简",

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
"services.itgc.b8": "信息安全与风险评估（ISO 27001、NIST CSF 等框架）",
"services.itgc.b9": "数据完整性与保护策略",
"services.itgc.b13": "与SOX / ICFR对齐的安全控制",


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
    "approach.assess.text": "确认当前状态、关键风险以及利益相关方的期望，并定义实现可辩护控制和证据的最快路径<br><br>输出：范围说明、时间表、交付物、证据要求",

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
"insights.title": "风险清晰<br><span style='color:var(--blue2)'>控制洞察</span><br>高管信心",
    "insights.lede": "围绕企业风险、技术与控制的实用洞察，专为 CFO、CIO、CISO 及内部审计领导者设计，帮助实现清晰、掌控与信心",

    "insights.p1.title": "30天 SOX 准备",
    "insights.p1.text": "一个现实的步骤流程：范围、控制说明、走查、证据标准与整改跟踪。",
    "insights.read": "阅读文章 →",

   "insights.p2.title": "AI 治理与控制准备：董事会真正需要的内容",
"insights.p2.text": "组织如何建立务实的 AI 治理，明确责任，并实施在创新、风险与监管要求之间取得平衡的控制措施。",

"insights.p3.title": "网络风险与第三方暴露：强化企业控制环境中最薄弱的一环",
"insights.p3.text": "如何在整个企业范围内识别、评估和管理网络与供应商风险，从一次性评估转向持续且与风险对齐的监督。",
    "insights.coming": "即将推出 →",

    "insights.featured": "精选内容",

    "insights.f1.title": "快速成长企业的 SOX 准备",
    "insights.f1.text": "审计摩擦来源以及应尽早标准化的关键要素。",

    "insights.f2.title": "面向董事会的 IT 风险报告",
    "insights.f2.text": "从运营指标转向支持决策的关键风险指标。",

    "insights.f3.title": "审计师会关注的 AI 治理控制",
    "insights.f3.text": "关键领域：清单、审批、监控和生命周期管理。"



    ,
"about.tophero.title": "我们的团队。您的信心。卓越的精准度。",

    "about.hero.title": "董事会级风险咨询<br><span style='color:var(--blue2)'>具备四大标准</span>。",
    "about.hero.lead": "Primevant Advisory 帮助管理团队强化治理、有效管理风险，并维持具韧性的内部控制环境。",

    "about.section.title": "关于 Primevant Advisory",
"about.section.lead": "Primevant Advisory 是一家专注于企业风险、技术、网络安全与控制的精品咨询公司。我们提供清晰的范围、管理层级沟通以及可辩护的成果，同时避免不必要的复杂性。",

    "about.mission.title": "我们的使命",
"about.mission.text": "帮助组织以务实且可辩护的方式强化企业风险与控制环境，使其与业务运营保持一致，从而减少不确定性，并提升治理、技术与保障体系的整体信心。",

    "about.values.title": "我们的价值观",
"about.values.text": "清晰（明确的范围、预期与成果），纪律（持续且可辩护的证据与执行），判断（与风险匹配、适度的控制），以及信任（安全处理客户信息与关系）。",

    "about.founder.name": "Uchechi Osuagwu",
    "about.founder.role": "管理合伙人",

    "about.founder.background.title": "背景简介",
"about.founder.background.p1": "Uchechi Osuagwu 曾任安永纽约办公室合伙人，是一位资深技术风险高管，拥有超过15年的经验，曾为财富500强企业领导企业审计、网络安全、人工智能战略及数字化转型项目。她的职业生涯涵盖复杂且高度受监管的全球环境，在这些环境中，技术、风险与业务成果相互交织。",
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
    "about.founder.credibility.p2": "她的方法严谨、结果导向，并扎根于审计、监管和企业执行的现实需求。通过 Primevant Advisory，Uchechi 与组织合作，将监管压力和技术变革转化为战略优势。",

"about.narrative.title": "强化治理能力。<br><span style='color:var(--blue2)'>助力自信决策。</span>",
"about.narrative.p1": "Primevant Advisory 与管理层合作，建立稳健的治理框架，并将风险转化为清晰、可执行的成果。",
"about.narrative.p2": "我们帮助组织对齐业务、风险与控制，加强监督，满足监管要求，并构建支持增长的稳健运营环境。",

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
"contact.heroTitle": "让我们对齐您的<br><span style='color:var(--blue2)'>控制与风险目标</span>。",
"contact.p1": "<b>将风险转化为高管层行动。</b> 我们在技术团队、内部审计与管理层之间架起桥梁，确保控制框架支持业务与运营重点。",
"contact.p2": "<b>降低复杂性与摩擦。</b> 我们优化控制设计、文档与证据实践，使团队减少控制管理负担，将更多精力用于提升绩效与创造价值。",
"contact.p3": "<b>与值得信赖的顾问合作。</b> 凭借支持董事会、高管团队及审计委员会的丰富经验，我们提供能够经受监管、审计及利益相关方审视的务实解决方案。",

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
