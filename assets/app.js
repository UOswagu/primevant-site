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
  text: "Enterprise risk, operational risk, operational risk, financial risk, technology risk, governance, regulatory risk."
},
{
  title: "Services – Internal Audit & Financial Management",
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
"trust.item4": "Financial Management",

    "services.heading": "Our Core Advisory Services",
"services.card1.title": "Risk Advisory",
"services.card1.text": "Enterprise risk, technology risk, operational risk, cybersecurity, and governance support that helps leadership align risk decisions to strategy, regulatory expectations, and operational resilience",

"services.card2.title": "Internal Audit & Financial Management",
"services.card2.text": "Internal Audit and financial management advisory focused on internal controls, SOX, ICFR, budgeting, financial operations, and reporting processes to strengthen governance, improve financial visibility, and reduce audit and operational risk.",

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

    "services.opt.title": "Internal Audit",
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

    "aiGov.title": "",
"aiGov.subtitle": " ",

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
"aiGov.final.p3": "The organizations that adapt successfully will not necessarily be the ones moving fastest on AI adoption. More likely, they will be the ones capable of demonstrating that governance maturity evolved alongside deployment rather than after the fact.",

"thirdParty.title": "",
"thirdParty.subtitle": "Practical approaches for establishing AI governance, accountability, and defensible controls in increasingly interconnected environments",

"thirdParty.intro1": "Most organizations no longer operate within clearly defined technology boundaries. Critical business operations now depend on an expanding network of cloud providers, software platforms, managed service providers, data processors, AI-enabled vendors, and external development partners.",
"thirdParty.intro2": "For many organizations, the most significant control weaknesses no longer originate internally. They emerge through third-party relationships that the business depends on operationally but does not fully govern with the same rigor applied to internal systems.",
"thirdParty.intro3": "Boards, regulators, customers, and external auditors are placing greater scrutiny on how organizations evaluate third-party cyber exposure, particularly as AI-enabled technologies accelerate the speed and complexity of vendor integration.",

"thirdParty.section1.title": "Third-Party Risk Has Become an Operational Governance Issue",
"thirdParty.section1.p1": "Many organizations still structure third-party cyber oversight around periodic risk assessments and vendor onboarding reviews. While those activities remain important, they are no longer sufficient on their own.",
"thirdParty.section1.p2": "Third-party exposure is now deeply embedded into day-to-day operations. Cloud providers host critical infrastructure. SaaS platforms support financial reporting and operational workflows. Managed service providers maintain privileged access into core environments.",
"thirdParty.section1.p3": "The assumption that “approved vendor” automatically means “approved AI usage” is becoming a meaningful governance blind spot.",
"thirdParty.section1.li1": "Which third parties introduce material cyber or AI-related exposure",
"thirdParty.section1.li2": "What systems and data those vendors can access",
"thirdParty.section1.li3": "Whether AI functionality is embedded within vendor platforms",
"thirdParty.section1.li4": "How accountability is assigned internally for vendor oversight",
"thirdParty.section1.li5": "What controls exist to monitor evolving risk over time",
"thirdParty.section1.p4": "This requires a governance approach that extends beyond procurement and compliance functions. Cyber and AI-related third-party exposure now sits squarely within enterprise risk management.",

"thirdParty.section2.title": "Accountability Breaks Down Faster Than Organizations Expect",
"thirdParty.section2.p1": "One of the most persistent weaknesses in third-party governance is unclear ownership.",
"thirdParty.section2.p2": "Vendor relationships often span procurement, legal, technology, security, compliance, operations, and business leadership simultaneously. While responsibilities may appear defined organizationally, accountability frequently becomes fragmented operationally.",
"thirdParty.section2.p3": "AI-enabled vendors are making this even more complicated. Organizations are increasingly adopting technologies where core processing logic, model behavior, or decision-making mechanisms remain partially opaque to the customer.",
"thirdParty.section2.li1": "Executive ownership for critical vendor relationships",
"thirdParty.section2.li2": "Risk accountability tied to operational usage",
"thirdParty.section2.li3": "Formal escalation pathways for emerging concerns",
"thirdParty.section2.li4": "Governance review triggers tied to AI functionality changes",
"thirdParty.section2.li5": "Cross-functional oversight structures involving security, legal, compliance, and operations",
"thirdParty.section2.p4": "Shared responsibility models only work when accountability remains explicit. In many organizations, they become a mechanism for diffusing responsibility instead.",

"thirdParty.section3.title": "Practical AI Governance Requires Operational Controls",
"thirdParty.section3.p1": "Many organizations are still approaching AI governance at a conceptual level. Policies exist. Principles have been drafted. Governance committees meet periodically. Yet operational controls underneath those structures often remain immature or inconsistently implemented.",
"thirdParty.section3.p2": "Practical AI governance requires organizations to establish controls capable of validating how AI-enabled technologies are being introduced, monitored, and governed operationally.",
"thirdParty.section3.li1": "AI inventory and classification processes",
"thirdParty.section3.li2": "Governance review requirements prior to deployment",
"thirdParty.section3.li3": "Defined approval workflows for higher-risk use cases",
"thirdParty.section3.li4": "Data handling and retention standards",
"thirdParty.section3.li5": "Human oversight requirements for material decisions",
"thirdParty.section3.li6": "Ongoing monitoring procedures for vendor changes",
"thirdParty.section3.li7": "Escalation protocols for incidents or control failures",
"thirdParty.section3.p3": "AI governance should not operate as a separate innovation framework disconnected from enterprise risk management. It should function as an extension of existing governance principles applied with greater operational rigor.",

"thirdParty.section4.title": "Third-Party Due Diligence Is Becoming Continuous",
"thirdParty.section4.p1": "Historically, many organizations approached vendor due diligence as a point-in-time exercise. Assessments were performed during onboarding, contracts were executed, and monitoring activities became progressively lighter over time unless a major incident occurred.",
"thirdParty.section4.p2": "Third-party environments now evolve continuously. Vendors introduce new AI capabilities, modify data processing practices, expand subcontractor usage, migrate infrastructure, or alter service models far more rapidly than traditional governance cycles were designed to monitor.",
"thirdParty.section4.li1": "Ongoing monitoring of critical vendors",
"thirdParty.section4.li2": "Risk-tiering based on operational dependency",
"thirdParty.section4.li3": "Trigger-based reassessments tied to technology changes",
"thirdParty.section4.li4": "Enhanced governance reviews for AI-enabled services",
"thirdParty.section4.li5": "More rigorous documentation and evidence standards",
"thirdParty.section4.li6": "Board-level visibility into material third-party exposure",
"thirdParty.section4.p3": "Cyber and AI-related risks are no longer static governance issues. They are dynamic operational risks that require ongoing visibility and reassessment.",

"thirdParty.section5.title": "Evidence and Documentation Will Matter More Under Scrutiny",
"thirdParty.section5.p1": "Organizations often underestimate how quickly governance discussions become evidence discussions once regulators, auditors, customers, or legal stakeholders become involved.",
"thirdParty.section5.li1": "Were assessments actually performed?",
"thirdParty.section5.li2": "Were concerns escalated appropriately?",
"thirdParty.section5.li3": "Were approvals documented?",
"thirdParty.section5.li4": "Were AI-related risks evaluated before deployment?",
"thirdParty.section5.li5": "Were monitoring activities conducted consistently?",
"thirdParty.section5.li6": "Were exceptions remediated effectively?",
"thirdParty.section5.p2": "Without defensible evidence, governance assertions weaken quickly.",
"thirdParty.section5.li7": "Evidence retention expectations",
"thirdParty.section5.li8": "Documentation standards",
"thirdParty.section5.li9": "Review procedures",
"thirdParty.section5.li10": "Escalation records",
"thirdParty.section5.li11": "Exception management tracking",
"thirdParty.section5.li12": "Governance committee reporting",
"thirdParty.section5.p3": "The organizations that respond effectively during audits or regulatory inquiries are rarely the ones with the most elaborate governance frameworks. More often, they are the organizations capable of producing clear evidence that operational governance activities were performed consistently over time.",

"thirdParty.final.title": "What Boards Should Be Asking",
"thirdParty.final.p1": "Boards do not need to evaluate every vendor relationship individually. They do, however, need confidence that management understands where material third-party cyber and AI-related exposure exists and whether governance practices are keeping pace with operational dependency.",
"thirdParty.final.li1": "Which third parties introduce our highest operational and regulatory exposure?",
"thirdParty.final.li2": "Where is AI functionality being introduced through vendor platforms?",
"thirdParty.final.li3": "How are governance responsibilities assigned internally?",
"thirdParty.final.li4": "What controls validate ongoing oversight?",
"thirdParty.final.li5": "How quickly would management identify emerging third-party risk issues?",
"thirdParty.final.li6": "Can governance activities be evidenced under external scrutiny?",
"thirdParty.final.p2": "Organizations that establish disciplined governance structures earlier will be in a far stronger position to balance innovation, operational resilience, and regulatory expectations simultaneously.",
"thirdParty.final.p3": "Over time, the strongest control environments will not necessarily belong to organizations with the fewest third-party dependencies. More likely, they will belong to organizations capable of demonstrating that external risk exposure is being governed with the same rigor expected internally.",

"soxScaling.title": " ",
"soxScaling.subtitle": " ",

"soxScaling.intro1": "Fast-scaling organizations rarely struggle because they lack capable people or strong business momentum. More commonly, pressure begins building when operational growth outpaces the maturity of the processes supporting financial reporting, technology governance, and control execution.",
"soxScaling.intro2": "Most organizations entering this phase are not starting from zero. Approval processes already exist. Reviews are happening. Finance and technology teams are exercising oversight in various forms across the business.",
"soxScaling.intro3": "The organizations that navigate this transition most effectively tend to recognize early that SOX readiness is less about adding layers of compliance and more about standardizing operational discipline before complexity expands further.",

"soxScaling.section1.title": "Audit Friction Usually Starts Before Formal Testing",
"soxScaling.section1.p1": "Many companies assume audit friction begins once testing activities start. In reality, the strain typically emerges much earlier when organizations begin documenting processes that have evolved organically over several years.",
"soxScaling.section1.p2": "Fast-growing businesses naturally optimize for speed. Teams adapt quickly, responsibilities shift frequently, and processes evolve continuously to support expansion.",
"soxScaling.section1.li1": "Similar controls performed differently across teams",
"soxScaling.section1.li2": "Approvals occurring through informal communication channels",
"soxScaling.section1.li3": "Key review activities dependent on individual personnel",
"soxScaling.section1.li4": "Inconsistent evidence retention practices",
"soxScaling.section1.li5": "Technology changes implemented without formal governance",
"soxScaling.section1.li6": "Limited clarity surrounding recurring control ownership",
"soxScaling.section1.p3": "External auditors evaluate consistency differently than operational teams do. A review control that functions adequately in practice may still become problematic during testing if execution varies by quarter, reviewer, or business unit.",

"soxScaling.section2.title": "Control Ownership Requires More Structure Than Most Scaling Companies Expect",
"soxScaling.section2.p1": "One of the earliest pressure points in SOX readiness involves accountability structures. In fast-growing organizations, responsibilities frequently expand alongside the business itself.",
"soxScaling.section2.p2": "Many organizations discover they have operational owners but not clearly defined control owners. Someone may understand how a process functions day to day, but accountability for execution, evidence retention, escalation management, and ongoing consistency may remain unclear.",
"soxScaling.section2.p3": "The companies that transition into mature SOX environments more effectively usually establish ownership structures earlier than initially anticipated.",

"soxScaling.section3.title": "Cadence Discipline Becomes Increasingly Important as Complexity Grows",
"soxScaling.section3.p1": "Another common source of audit friction involves inconsistent execution timing. In scaling organizations, operational priorities shift constantly, and recurring governance activities can gradually become reactive rather than disciplined.",
"soxScaling.section3.p2": "From an audit perspective, timing inconsistency usually signals larger concerns surrounding oversight discipline and control reliability.",
"soxScaling.section3.li1": "Defined execution timelines",
"soxScaling.section3.li2": "Standardized review schedules",
"soxScaling.section3.li3": "Calendar-driven certification activities",
"soxScaling.section3.li4": "Escalation procedures for delayed execution",
"soxScaling.section3.li5": "Periodic management oversight reviews",
"soxScaling.section3.p3": "These disciplines may appear administrative initially, but they create operational predictability that becomes extremely valuable as audit scrutiny increases.",

"soxScaling.section4.title": "Evidence Standards Usually Create More Friction Than Control Design",
"soxScaling.section4.p1": "Many organizations preparing for SOX readiness devote significant attention to control design while underestimating the operational importance of evidence discipline.",
"soxScaling.section4.p2": "Reviews occur, approvals are completed, reconciliations are prepared, and access decisions are made, yet supporting evidence may exist across email chains, spreadsheets, messaging platforms, ticketing systems, or undocumented workflows.",
"soxScaling.section4.li1": "What evidence must be retained",
"soxScaling.section4.li2": "Where documentation should reside",
"soxScaling.section4.li3": "Approval traceability expectations",
"soxScaling.section4.li4": "Naming conventions and retention periods",
"soxScaling.section4.li5": "Standards for demonstrating review completeness",
"soxScaling.section4.li6": "Procedures for documenting exceptions",
"soxScaling.section4.p3": "The companies that manage audits most effectively are often the organizations that introduced operational consistency early enough to prevent evidence management from becoming fragmented as the business expanded.",

"soxScaling.section5.title": "Technology Environments Usually Scale Faster Than Governance Processes",
"soxScaling.section5.p1": "Technology complexity tends to accelerate rapidly during periods of organizational growth. ERP implementations, cloud migrations, SaaS expansion, acquisitions, automation initiatives, and evolving reporting environments all introduce additional governance demands.",
"soxScaling.section5.p2": "In many companies, technology environments mature operationally faster than the surrounding control structure.",
"soxScaling.section5.li1": "Inconsistent access governance",
"soxScaling.section5.li2": "Excessive privileged access",
"soxScaling.section5.li3": "Weak change management traceability",
"soxScaling.section5.li4": "Limited system ownership clarity",
"soxScaling.section5.li5": "Incomplete interface monitoring",
"soxScaling.section5.li6": "Manual workarounds introduced during rapid implementation efforts",
"soxScaling.section5.p3": "Standardizing access management, change governance, documentation expectations, and system accountability early tends to reduce significant operational strain later.",

"soxScaling.final.title": "What Companies Should Standardize Early",
"soxScaling.final.p1": "Organizations frequently ask when formal SOX readiness efforts should begin. More useful conversations usually focus on which operational disciplines should be standardized before audit pressure intensifies.",

"soxScaling.final.ownership": "Ownership",
"soxScaling.final.ownership.li1": "Clear control accountability",
"soxScaling.final.ownership.li2": "Defined review responsibilities",
"soxScaling.final.ownership.li3": "Escalation and delegation procedures",
"soxScaling.final.ownership.li4": "Cross-functional governance alignment",

"soxScaling.final.cadence": "Cadence",
"soxScaling.final.cadence.li1": "Standardized execution schedules",
"soxScaling.final.cadence.li2": "Calendar-driven governance activities",
"soxScaling.final.cadence.li3": "Timely review expectations",
"soxScaling.final.cadence.li4": "Consistent monitoring routines",

"soxScaling.final.evidence": "Evidence",
"soxScaling.final.evidence.li1": "Defined documentation standards",
"soxScaling.final.evidence.li2": "Centralized retention practices",
"soxScaling.final.evidence.li3": "Clear approval traceability",
"soxScaling.final.evidence.li4": "Repeatable support for control execution",

"soxScaling.final.p2": "Companies that delay governance maturity frequently discover that SOX readiness becomes far more disruptive and resource-intensive than anticipated.",
"soxScaling.final.p3": "The organizations that adapt most effectively tend to view control standardization not as a compliance initiative, but as an operational scalability requirement that supports sustainable growth over time.",


"boardRisk.title": " ",
"boardRisk.subtitle": " ",

"boardRisk.intro1": "Many organizations have no shortage of IT risk reporting. Dashboards are generated regularly, operational metrics are tracked continuously, and executive leadership often receives extensive updates covering cybersecurity activity, technology incidents, compliance initiatives, audit findings, and remediation efforts.",
"boardRisk.intro2": "Yet despite the volume of reporting, boards frequently leave governance discussions without a clear understanding of the organization’s actual technology risk exposure.",
"boardRisk.intro3": "The issue is rarely a lack of data. More often, the problem is that reporting remains heavily operational in nature while boards require information that supports oversight judgment, strategic prioritization, and risk-informed decision-making.",
"boardRisk.intro4": "The organizations making the strongest progress are generally shifting away from reporting focused primarily on activity volume and toward reporting centered on key risk indicators that help boards evaluate exposure, trajectory, accountability, and decision readiness.",

"boardRisk.section1.title": "Operational Metrics Rarely Translate Into Oversight Insight",
"boardRisk.section1.p1": "One of the most common weaknesses in board reporting is the assumption that more operational detail automatically improves governance visibility.",
"boardRisk.section1.p2": "Boards may receive extensive reporting covering vulnerability counts, phishing simulations, patching statistics, ticket closure rates, audit activities, security tool deployment progress, or compliance percentages without gaining meaningful clarity around whether the organization’s overall risk posture is improving or deteriorating.",
"boardRisk.section1.li1": "Where is the organization becoming more exposed?",
"boardRisk.section1.li2": "Which risks exceed established tolerance levels?",
"boardRisk.section1.li3": "Are remediation activities reducing material exposure effectively?",
"boardRisk.section1.li4": "What dependencies create concentration risk?",
"boardRisk.section1.li5": "Where are governance gaps persisting despite operational activity?",
"boardRisk.section1.li6": "Which trends require strategic attention rather than tactical management?",
"boardRisk.section1.p3": "The strongest governance reporting environments recognize that board reporting is not simply a condensed version of operational reporting. It is a separate governance discipline requiring different framing, different escalation thresholds, and different measures of effectiveness.",

"boardRisk.section2.title": "Effective KRIs Focus on Exposure, Not Activity",
"boardRisk.section2.p1": "Organizations frequently refer to board reporting metrics as KRIs, but many are still reporting operational KPIs in practice.",
"boardRisk.section2.p2": "Key performance indicators generally measure execution efficiency, operational completion, or management activity. Key risk indicators are intended to help leadership evaluate changing exposure levels, emerging governance concerns, and whether risk is moving outside acceptable boundaries.",
"boardRisk.section2.li1": "Concentration of unresolved high-risk issues",
"boardRisk.section2.li2": "Aging of critical remediation activities",
"boardRisk.section2.li3": "Third-party dependencies supporting critical operations",
"boardRisk.section2.li4": "Growth in unsupported or end-of-life technologies",
"boardRisk.section2.li5": "Privileged access exposure trends",
"boardRisk.section2.li6": "Frequency of control exceptions in high-risk environments",
"boardRisk.section2.li7": "Recurring audit issues across business units",
"boardRisk.section2.li8": "Material cybersecurity incidents affecting critical operations",
"boardRisk.section2.li9": "Escalation trends tied to regulatory or resilience concerns",
"boardRisk.section2.p3": "These indicators provide boards with better visibility into risk trajectory rather than operational workload.",
"boardRisk.section2.p4": "Boards generally benefit more from transparent reporting surrounding persistent governance weaknesses than from highly polished dashboards emphasizing activity completion rates.",

"boardRisk.section3.title": "Board Reporting Should Clarify Accountability",
"boardRisk.section3.p1": "Another common weakness in IT risk reporting is the absence of clear accountability visibility.",
"boardRisk.section3.li1": "Which executives own remediation responsibility",
"boardRisk.section3.li2": "Whether remediation timelines remain realistic",
"boardRisk.section3.li3": "Where cross-functional coordination is failing",
"boardRisk.section3.li4": "Which risks continue escalating without sufficient resolution",
"boardRisk.section3.li5": "Whether management accepts specific exposures formally",
"boardRisk.section3.p2": "Without clear ownership visibility, reporting can create the appearance of governance activity while masking unresolved execution challenges underneath.",
"boardRisk.section3.li6": "Executive ownership for material risks",
"boardRisk.section3.li7": "Aging analysis tied to unresolved exposure",
"boardRisk.section3.li8": "Escalation thresholds for delayed remediation",
"boardRisk.section3.li9": "Visibility into repeat governance exceptions",
"boardRisk.section3.li10": "Trend analysis across business units or technology domains",
"boardRisk.section3.li11": "Distinction between tactical remediation and structural risk reduction",
"boardRisk.section3.p3": "Boards do not need visibility into every operational remediation activity. They do, however, need enough transparency to determine whether management accountability structures are functioning effectively under increasing operational complexity.",

"boardRisk.section4.title": "Reporting Maturity Depends on Context and Narrative",
"boardRisk.section4.p1": "One of the more overlooked aspects of board reporting involves narrative quality.",
"boardRisk.section4.li1": "Why risk exposure is changing",
"boardRisk.section4.li2": "Which trends matter most",
"boardRisk.section4.li3": "Whether issues are isolated or systemic",
"boardRisk.section4.li4": "How management is prioritizing response efforts",
"boardRisk.section4.li5": "What decisions may require board attention",
"boardRisk.section4.p2": "Strong board reporting environments supplement KRIs with concise interpretation that explains operational significance without overwhelming directors with technical detail.",
"boardRisk.section4.p3": "Effective narratives clarify what changed, why it matters, how management is responding, and whether exposure is improving, stabilizing, or deteriorating.",

"boardRisk.final.title": "Board Reporting Should Support Governance Decisions",
"boardRisk.final.p1": "Ultimately, effective IT risk reporting should help boards make better governance decisions rather than simply remain informed about operational activity.",
"boardRisk.final.li1": "Exposure trends rather than activity volume",
"boardRisk.final.li2": "Risk concentration rather than isolated incidents",
"boardRisk.final.li3": "Accountability clarity rather than generalized ownership",
"boardRisk.final.li4": "Remediation effectiveness rather than closure statistics",
"boardRisk.final.li5": "Forward-looking indicators rather than historical summaries",
"boardRisk.final.li6": "Governance decisions requiring escalation or investment",
"boardRisk.final.p2": "Organizations that adapt successfully will likely be the ones capable of translating complex operational risk environments into clear oversight intelligence that supports informed governance decisions without oversimplifying the underlying exposure.",

"aiAudit.title": "",
"aiAudit.subtitle": " ",

"aiAudit.intro1": "Many organizations are still treating AI governance as an emerging initiative. Auditors are increasingly treating it as an operational reality.",
"aiAudit.intro2": "Leadership teams that once viewed AI governance as a future-state concern are now being asked practical questions about accountability, oversight, documentation, and control execution.",
"aiAudit.intro3": "In many environments, management is discovering that AI adoption moved faster than governance maturity.",
"aiAudit.intro4": "Across industries, four governance themes are emerging consistently in audit discussions: inventory management, approval governance, ongoing monitoring, and lifecycle documentation.",

"aiAudit.section1.title": "Inventory Is Becoming the Starting Point for AI Governance",
"aiAudit.section1.p1": "One of the first questions auditors are increasingly asking is deceptively simple: where is AI being used across the organization?",
"aiAudit.section1.p2": "AI adoption rarely occurs through one centralized program. Business teams experiment with generative AI tools independently. Technology groups integrate machine learning capabilities into applications. Vendors introduce embedded AI functionality into existing platforms.",
"aiAudit.section1.p3": "Organizations cannot govern technologies effectively if they cannot identify them consistently.",
"aiAudit.section1.li1": "Centralized inventories of AI-enabled systems and use cases",
"aiAudit.section1.li2": "Criteria defining what constitutes AI “in scope”",
"aiAudit.section1.li3": "Risk classifications tied to operational or regulatory impact",
"aiAudit.section1.li4": "Ownership accountability for each implementation",
"aiAudit.section1.li5": "Periodic review processes to validate inventory completeness",
"aiAudit.section1.p4": "The organizations responding most effectively are generally those treating AI inventory management as a dynamic governance process rather than a one-time documentation exercise.",

"aiAudit.section2.title": "Approval Governance Requires More Than Informal Alignment",
"aiAudit.section2.p1": "Once organizations identify AI usage, the next area auditors tend to examine involves governance surrounding deployment and approval activities.",
"aiAudit.section2.p2": "What is frequently missing is structured governance around risk evaluation and approval traceability.",
"aiAudit.section2.li1": "Approval requirements based on risk exposure",
"aiAudit.section2.li2": "Governance review thresholds",
"aiAudit.section2.li3": "Accountability for risk acceptance decisions",
"aiAudit.section2.li4": "Escalation pathways for higher-risk implementations",
"aiAudit.section2.li5": "Documentation supporting deployment decisions",
"aiAudit.section2.p3": "Strong governance environments address this by establishing practical approval structures early, including clearly defined review expectations, risk-tiering standards, and accountability for implementation decisions.",

"aiAudit.section3.title": "Monitoring Controls Are Becoming Increasingly Important",
"aiAudit.section3.p1": "Inventory and approvals establish initial governance structure. Monitoring determines whether governance remains effective over time.",
"aiAudit.section3.p2": "AI-enabled environments evolve continuously. Models change, vendors introduce new functionality, data inputs shift, business usage expands, and operational dependencies increase over time.",
"aiAudit.section3.li1": "Changes to AI-enabled systems",
"aiAudit.section3.li2": "Ongoing user access and permissions",
"aiAudit.section3.li3": "Data usage and retention practices",
"aiAudit.section3.li4": "Exception handling activities",
"aiAudit.section3.li5": "Vendor updates introducing new AI capabilities",
"aiAudit.section3.li6": "Escalation of incidents or governance concerns",
"aiAudit.section3.li7": "Alignment between operational usage and approved scope",
"aiAudit.section3.p3": "Effective monitoring controls do not necessarily require highly sophisticated tooling. More often, they require operational discipline, defined review cadence, escalation procedures, and accountability for reassessing governance assumptions as environments evolve.",

"aiAudit.section4.title": "Lifecycle Documentation Is Becoming Critical Under Audit Scrutiny",
"aiAudit.section4.p1": "Organizations frequently underestimate how quickly AI governance discussions become documentation discussions once audits begin.",
"aiAudit.section4.li1": "Initial risk assessments",
"aiAudit.section4.li2": "Approval and deployment decisions",
"aiAudit.section4.li3": "Control expectations",
"aiAudit.section4.li4": "Monitoring activities",
"aiAudit.section4.li5": "Change management processes",
"aiAudit.section4.li6": "Exception handling",
"aiAudit.section4.li7": "Periodic governance reviews",
"aiAudit.section4.li8": "Retirement or decommissioning decisions",
"aiAudit.section4.p2": "Fragmented documentation creates significant difficulty demonstrating consistency, accountability, and oversight reliability.",
"aiAudit.section4.li9": "Defined evidence retention standards",
"aiAudit.section4.li10": "Centralized governance repositories",
"aiAudit.section4.li11": "Documentation ownership responsibilities",
"aiAudit.section4.li12": "Traceability expectations for approvals and reviews",
"aiAudit.section4.li13": "Standards for demonstrating control execution",
"aiAudit.section4.li14": "Periodic validation of documentation completeness",
"aiAudit.section4.p3": "Lifecycle documentation is likely to become one of the clearest indicators separating organizations with operational governance maturity from organizations still relying primarily on policy-level governance.",

"aiAudit.final.title": "What Auditors Are Ultimately Evaluating",
"aiAudit.final.p1": "Most auditors are not expecting organizations to eliminate all AI-related risk. They are evaluating whether management has established governance discipline proportionate to the organization’s operational exposure.",
"aiAudit.final.li1": "Does management know where AI exists?",
"aiAudit.final.li2": "Are deployments governed through structured approvals?",
"aiAudit.final.li3": "Are controls monitored consistently over time?",
"aiAudit.final.li4": "Can governance activities be evidenced throughout the system lifecycle?",
"aiAudit.final.li5": "Are accountability structures clear enough to support remediation when issues emerge?",
"aiAudit.final.p2": "Organizations that approach AI governance pragmatically tend to perform far better under scrutiny than organizations attempting to retrofit governance after deployment activity has already accelerated significantly.",
"aiAudit.final.p3": "Over time, the gap between policy-driven governance and operational governance will become increasingly visible."

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
"trust.item4": "Gestión Financiera",

    "services.heading": "Nuestros servicios principales de asesoría",
"services.card1.title": "Asesoría de Riesgo",
"services.card1.text": "Servicios de riesgo empresarial, riesgo tecnológico, riesgo operativo, ciberseguridad y gobernanza que ayudan al liderazgo a alinear las decisiones de riesgo con la estrategia, las expectativas regulatorias y la resiliencia operativa",

"services.card2.title": "Auditoría Interna y Gestión Financiera",
"services.card2.text": "Asesoría en auditoría interna y gestión financiera enfocada en controles internos, SOX, ICFR, presupuestación, operaciones financieras y procesos de reporte para fortalecer la gobernanza, mejorar la visibilidad financiera y reducir los riesgos operativos y de auditoría.",

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

"services.opt.title": "Auditoría Interna y Gestión Financiera",
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
    "insights.f3.text": "Temas clave: inventario, aprobaciones, monitoreo y documentación del ciclo de vida.",


"insights.readPost": "Leer artículo",

"aiGov.title": "",
"aiGov.subtitle": " ",

"aiGov.intro1": "La inteligencia artificial avanza más rápido de lo que la mayoría de las estructuras de gobernanza fueron diseñadas para soportar. Organizaciones de distintos sectores están incorporando IA en análisis, operaciones, interacción con clientes, desarrollo de software y procesos de toma de decisiones a un ritmo que con frecuencia supera la madurez del entorno de control que las rodea.",
"aiGov.intro2": "Las juntas directivas están respondiendo en consecuencia. Los equipos de liderazgo ahora reciben preguntas directas sobre responsabilidad, supervisión, exposición regulatoria y riesgo operativo vinculados con la adopción de IA.",
"aiGov.intro3": "La mayoría de las organizaciones no tienen un problema de gobernanza de IA porque carezcan de políticas o principios. Tienen un problema de gobernanza porque carecen de disciplina operativa.",

"aiGov.section1.title": "La gobernanza comienza con el alcance",
"aiGov.section1.p1": "Una de las primeras fallas en la gobernanza de IA ocurre durante la fase de identificación. Las organizaciones suelen subestimar lo difícil que es determinar dónde está operando realmente la IA dentro del negocio.",
"aiGov.section1.p2": "La adopción de IA rara vez entra en la organización a través de una sola iniciativa centralizada. Surge de forma incremental en departamentos, plataformas, herramientas de proveedores y experimentación impulsada por el negocio.",
"aiGov.section1.p3": "Si la administración no puede identificar con confianza dónde la IA influye en la actividad del negocio, una supervisión significativa se vuelve imposible.",
"aiGov.section1.li1": "Criterios claros para definir qué constituye IA “dentro del alcance”",
"aiGov.section1.li2": "Un inventario centralizado de sistemas y casos de uso habilitados por IA",
"aiGov.section1.li3": "Responsabilidad de propiedad claramente definida",
"aiGov.section1.li4": "Estándares de clasificación de riesgo alineados con la exposición operativa y regulatoria",
"aiGov.section1.li5": "Umbrales de escalamiento para implementaciones de mayor riesgo",
"aiGov.section1.p4": "El alcance de la gobernanza debe extenderse más allá de los modelos desarrollados internamente. Parte de la exposición más significativa hoy proviene de plataformas de terceros con funcionalidad de IA incorporada.",

"aiGov.section2.title": "Las narrativas revelan debilidades más rápido que las pruebas de control",
"aiGov.section2.p1": "Una vez establecido el alcance, las organizaciones suelen pasar directamente a evaluaciones de controles. En la práctica, uno de los ejercicios de gobernanza más valiosos es mucho menos técnico: desarrollar narrativas operativas.",
"aiGov.section2.p2": "Las narrativas bien desarrolladas obligan a la alineación entre las áreas de negocio, tecnología, cumplimiento y liderazgo.",
"aiGov.section2.li1": "El propósito de negocio del proceso de IA",
"aiGov.section2.li2": "Los sistemas, fuentes de datos y dependencias involucradas",
"aiGov.section2.li3": "Los puntos de decisión y actividades de supervisión humana",
"aiGov.section2.li4": "Los riesgos introducidos por la automatización o el uso de modelos",
"aiGov.section2.li5": "Las actividades de control diseñadas para mitigar esos riesgos",
"aiGov.section2.li6": "Las responsabilidades de rendición de cuentas y escalamiento",
"aiGov.section2.li7": "La evidencia generada mediante la ejecución",
"aiGov.section2.p3": "Las narrativas crean un lenguaje común entre partes interesadas técnicas y no técnicas. Las juntas no necesitan detalle de arquitectura de aprendizaje automático; necesitan visibilidad sobre cómo se ejecutan las responsabilidades de gobernanza.",

"aiGov.section3.title": "Los walkthroughs revelan si la gobernanza realmente existe",
"aiGov.section3.p1": "Las políticas describen la intención. Los walkthroughs revelan la realidad.",
"aiGov.section3.p2": "Durante los walkthroughs, las organizaciones descubren con frecuencia que su modelo de gobernanza existe con más claridad en presentaciones que en la ejecución operativa.",
"aiGov.section3.li1": "Cómo los sistemas de IA pasan a producción",
"aiGov.section3.li2": "Actividades de aprobación y gestión de cambios",
"aiGov.section3.li3": "Mecanismos de revisión humana y anulación",
"aiGov.section3.li4": "Procedimientos de validación de datos",
"aiGov.section3.li5": "Monitoreo y gestión de excepciones",
"aiGov.section3.li6": "Controles de acceso y prácticas de segregación",
"aiGov.section3.li7": "Procesos de escalamiento de incidentes",
"aiGov.section3.li8": "Expectativas de retención documental",
"aiGov.section3.p3": "Las juntas deben ver los walkthroughs como ejercicios de validación de gobernanza, no solo como procedimientos de auditoría.",

"aiGov.section4.title": "Los estándares de evidencia se están convirtiendo en un tema central de gobernanza",
"aiGov.section4.p1": "A medida que la supervisión de IA madura, las conversaciones de gobernanza se convierten cada vez más en conversaciones sobre evidencia.",
"aiGov.section4.p2": "Las organizaciones pueden realizar revisiones, aprobaciones, monitoreo y supervisión de manera consistente, pero si esas actividades no pueden demostrarse con evidencia confiable, el entorno de control se vuelve difícil de defender.",
"aiGov.section4.li1": "Qué documentación debe conservarse",
"aiGov.section4.li2": "Dónde se mantiene la evidencia",
"aiGov.section4.li3": "Responsabilidades de propiedad sobre la retención",
"aiGov.section4.li4": "Plazos de retención",
"aiGov.section4.li5": "Estándares para evidenciar la ejecución de controles",
"aiGov.section4.li6": "Procedimientos de validación de integridad de evidencia",
"aiGov.section4.p3": "Las juntas no necesitan visibilidad sobre cada artefacto operativo. Necesitan confianza en que la administración cuenta con prácticas de evidencia capaces de respaldar afirmaciones de gobernanza bajo escrutinio.",

"aiGov.section5.title": "La disciplina de remediación determina la credibilidad de la gobernanza",
"aiGov.section5.p1": "Ningún entorno de gobernanza está libre de brechas de control o inconsistencias operativas. Lo que separa a las organizaciones maduras de las no preparadas es si la administración puede identificar problemas temprano, asignar responsabilidad claramente y remediar deficiencias con disciplina.",
"aiGov.section5.li1": "Estructuras de propiedad no definidas",
"aiGov.section5.li2": "Aprobaciones inconsistentes",
"aiGov.section5.li3": "Documentación incompleta",
"aiGov.section5.li4": "Prácticas débiles de monitoreo",
"aiGov.section5.li5": "Brechas de supervisión de terceros",
"aiGov.section5.li6": "Preocupaciones de gobernanza de datos",
"aiGov.section5.li7": "Desalineación entre requisitos de política y ejecución operativa",
"aiGov.section5.p2": "Las juntas deben prestar atención a los problemas repetidos en distintas unidades de negocio. Las excepciones recurrentes suelen indicar debilidades más amplias en el diseño de gobernanza, no fallas operativas aisladas.",

"aiGov.final.title": "Lo que las juntas realmente necesitan",
"aiGov.final.p1": "La mayoría de las juntas no buscan convertirse en expertas en inteligencia artificial. Buscan determinar si la administración ha establecido suficiente disciplina operativa para implementar IA de manera responsable y defender esas prácticas bajo escrutinio.",
"aiGov.final.p2": "Eso requiere visibilidad sobre dónde existe la IA, claridad sobre responsabilidades, evidencia de que los controles operan de manera consistente y confianza en que los problemas saldrán a la luz antes de convertirse en eventos materiales.",
"aiGov.final.li1": "Definir el alcance",
"aiGov.final.li2": "Desarrollar narrativas operativas",
"aiGov.final.li3": "Validar la ejecución mediante walkthroughs",
"aiGov.final.li4": "Estandarizar expectativas de evidencia",
"aiGov.final.li5": "Implementar seguimiento disciplinado de remediación",
"aiGov.final.p3": "Las organizaciones que se adapten con éxito no serán necesariamente las que avancen más rápido en adopción de IA. Es más probable que sean aquellas capaces de demostrar que la madurez de gobernanza evolucionó junto con la implementación, no después.",

"thirdParty.title": "",
"thirdParty.subtitle": "Enfoques prácticos para establecer gobernanza de IA, responsabilidad y controles defendibles en entornos cada vez más interconectados",

"thirdParty.intro1": "La mayoría de las organizaciones ya no opera dentro de límites tecnológicos claramente definidos. Las operaciones críticas dependen de una red creciente de proveedores de nube, plataformas de software, servicios administrados, procesadores de datos, proveedores habilitados por IA y socios externos de desarrollo.",
"thirdParty.intro2": "Para muchas organizaciones, las debilidades de control más significativas ya no se originan internamente. Surgen a través de relaciones con terceros de las que el negocio depende operativamente, pero que no gobierna con el mismo rigor aplicado a los sistemas internos.",
"thirdParty.intro3": "Juntas, reguladores, clientes y auditores externos están aumentando el escrutinio sobre cómo las organizaciones evalúan la exposición cibernética de terceros, especialmente a medida que las tecnologías habilitadas por IA aceleran la velocidad y complejidad de la integración con proveedores.",

"thirdParty.section1.title": "El riesgo de terceros se ha convertido en un asunto de gobernanza operativa",
"thirdParty.section1.p1": "Muchas organizaciones aún estructuran la supervisión cibernética de terceros alrededor de evaluaciones periódicas de riesgo y revisiones de incorporación de proveedores. Aunque estas actividades siguen siendo importantes, ya no son suficientes por sí solas.",
"thirdParty.section1.p2": "La exposición de terceros ahora está profundamente integrada en las operaciones diarias. Los proveedores de nube alojan infraestructura crítica. Las plataformas SaaS respaldan flujos de trabajo operativos y de reporte financiero. Los proveedores de servicios administrados mantienen acceso privilegiado a entornos clave.",
"thirdParty.section1.p3": "La suposición de que “proveedor aprobado” significa automáticamente “uso de IA aprobado” se está convirtiendo en un punto ciego importante de gobernanza.",
"thirdParty.section1.li1": "Qué terceros introducen exposición material cibernética o relacionada con IA",
"thirdParty.section1.li2": "A qué sistemas y datos pueden acceder esos proveedores",
"thirdParty.section1.li3": "Si la funcionalidad de IA está incorporada en plataformas de proveedores",
"thirdParty.section1.li4": "Cómo se asigna internamente la responsabilidad por la supervisión de proveedores",
"thirdParty.section1.li5": "Qué controles existen para monitorear la evolución del riesgo en el tiempo",
"thirdParty.section1.p4": "Esto requiere un enfoque de gobernanza que vaya más allá de compras y cumplimiento. La exposición de terceros relacionada con ciberseguridad e IA ahora pertenece directamente a la gestión de riesgo empresarial.",

"thirdParty.section2.title": "La responsabilidad se rompe más rápido de lo que las organizaciones esperan",
"thirdParty.section2.p1": "Una de las debilidades más persistentes en la gobernanza de terceros es la propiedad poco clara.",
"thirdParty.section2.p2": "Las relaciones con proveedores suelen abarcar compras, legal, tecnología, seguridad, cumplimiento, operaciones y liderazgo del negocio simultáneamente. Aunque las responsabilidades pueden parecer definidas a nivel organizacional, la rendición de cuentas suele fragmentarse en la operación.",
"thirdParty.section2.p3": "Los proveedores habilitados por IA están complicando aún más esta situación. Las organizaciones adoptan cada vez más tecnologías donde la lógica de procesamiento, el comportamiento del modelo o los mecanismos de decisión permanecen parcialmente opacos para el cliente.",
"thirdParty.section2.li1": "Propiedad ejecutiva de relaciones críticas con proveedores",
"thirdParty.section2.li2": "Responsabilidad de riesgo vinculada al uso operativo",
"thirdParty.section2.li3": "Rutas formales de escalamiento para preocupaciones emergentes",
"thirdParty.section2.li4": "Disparadores de revisión de gobernanza vinculados a cambios en funcionalidad de IA",
"thirdParty.section2.li5": "Estructuras de supervisión multifuncionales con seguridad, legal, cumplimiento y operaciones",
"thirdParty.section2.p4": "Los modelos de responsabilidad compartida solo funcionan cuando la rendición de cuentas permanece explícita. En muchas organizaciones, se convierten en un mecanismo para diluir la responsabilidad.",

"thirdParty.section3.title": "La gobernanza práctica de IA requiere controles operativos",
"thirdParty.section3.p1": "Muchas organizaciones todavía abordan la gobernanza de IA a nivel conceptual. Existen políticas, se han redactado principios y los comités de gobernanza se reúnen periódicamente. Sin embargo, los controles operativos subyacentes suelen permanecer inmaduros o implementados de forma inconsistente.",
"thirdParty.section3.p2": "La gobernanza práctica de IA requiere que las organizaciones establezcan controles capaces de validar cómo se introducen, monitorean y gobiernan operativamente las tecnologías habilitadas por IA.",
"thirdParty.section3.li1": "Procesos de inventario y clasificación de IA",
"thirdParty.section3.li2": "Requisitos de revisión de gobernanza antes del despliegue",
"thirdParty.section3.li3": "Flujos de aprobación definidos para casos de uso de mayor riesgo",
"thirdParty.section3.li4": "Estándares de manejo y retención de datos",
"thirdParty.section3.li5": "Requisitos de supervisión humana para decisiones materiales",
"thirdParty.section3.li6": "Procedimientos de monitoreo continuo de cambios de proveedores",
"thirdParty.section3.li7": "Protocolos de escalamiento para incidentes o fallas de control",
"thirdParty.section3.p3": "La gobernanza de IA no debe operar como un marco de innovación separado de la gestión de riesgo empresarial. Debe funcionar como una extensión de los principios de gobernanza existentes aplicada con mayor rigor operativo.",

"thirdParty.section4.title": "La debida diligencia de terceros se está volviendo continua",
"thirdParty.section4.p1": "Históricamente, muchas organizaciones trataban la debida diligencia de proveedores como un ejercicio puntual. Se realizaban evaluaciones durante la incorporación, se firmaban contratos y el monitoreo se volvía progresivamente más ligero salvo que ocurriera un incidente importante.",
"thirdParty.section4.p2": "Los entornos de terceros ahora evolucionan continuamente. Los proveedores introducen nuevas capacidades de IA, modifican prácticas de procesamiento de datos, amplían subcontratistas, migran infraestructura o cambian modelos de servicio mucho más rápido de lo que los ciclos tradicionales de gobernanza fueron diseñados para monitorear.",
"thirdParty.section4.li1": "Monitoreo continuo de proveedores críticos",
"thirdParty.section4.li2": "Clasificación de riesgo basada en dependencia operativa",
"thirdParty.section4.li3": "Reevaluaciones basadas en disparadores vinculados a cambios tecnológicos",
"thirdParty.section4.li4": "Revisiones de gobernanza reforzadas para servicios habilitados por IA",
"thirdParty.section4.li5": "Estándares más rigurosos de documentación y evidencia",
"thirdParty.section4.li6": "Visibilidad a nivel de junta sobre exposición material de terceros",
"thirdParty.section4.p3": "Los riesgos cibernéticos y relacionados con IA ya no son temas estáticos de gobernanza. Son riesgos operativos dinámicos que requieren visibilidad y reevaluación continua.",

"thirdParty.section5.title": "La evidencia y documentación importarán más bajo escrutinio",
"thirdParty.section5.p1": "Las organizaciones suelen subestimar lo rápido que las conversaciones de gobernanza se convierten en conversaciones de evidencia cuando participan reguladores, auditores, clientes o partes legales.",
"thirdParty.section5.li1": "¿Se realizaron realmente las evaluaciones?",
"thirdParty.section5.li2": "¿Se escalaron adecuadamente las preocupaciones?",
"thirdParty.section5.li3": "¿Se documentaron las aprobaciones?",
"thirdParty.section5.li4": "¿Se evaluaron los riesgos de IA antes del despliegue?",
"thirdParty.section5.li5": "¿Se realizaron actividades de monitoreo de forma consistente?",
"thirdParty.section5.li6": "¿Se remediaron eficazmente las excepciones?",
"thirdParty.section5.p2": "Sin evidencia defendible, las afirmaciones de gobernanza se debilitan rápidamente.",
"thirdParty.section5.li7": "Expectativas de retención de evidencia",
"thirdParty.section5.li8": "Estándares de documentación",
"thirdParty.section5.li9": "Procedimientos de revisión",
"thirdParty.section5.li10": "Registros de escalamiento",
"thirdParty.section5.li11": "Seguimiento de gestión de excepciones",
"thirdParty.section5.li12": "Reportes al comité de gobernanza",
"thirdParty.section5.p3": "Las organizaciones que responden eficazmente durante auditorías o investigaciones regulatorias rara vez son las que tienen los marcos más elaborados. Con mayor frecuencia, son las que pueden producir evidencia clara de que las actividades de gobernanza operativa se realizaron de manera consistente en el tiempo.",

"thirdParty.final.title": "Lo que las juntas deberían preguntar",
"thirdParty.final.p1": "Las juntas no necesitan evaluar cada relación con proveedores individualmente. Sin embargo, sí necesitan confianza en que la administración comprende dónde existe exposición material de terceros relacionada con ciberseguridad e IA, y si las prácticas de gobernanza están evolucionando al ritmo de la dependencia operativa.",
"thirdParty.final.li1": "¿Qué terceros introducen nuestra mayor exposición operativa y regulatoria?",
"thirdParty.final.li2": "¿Dónde se está introduciendo funcionalidad de IA a través de plataformas de proveedores?",
"thirdParty.final.li3": "¿Cómo se asignan internamente las responsabilidades de gobernanza?",
"thirdParty.final.li4": "¿Qué controles validan la supervisión continua?",
"thirdParty.final.li5": "¿Con qué rapidez identificaría la administración nuevos problemas de riesgo de terceros?",
"thirdParty.final.li6": "¿Pueden evidenciarse las actividades de gobernanza bajo escrutinio externo?",
"thirdParty.final.p2": "Las organizaciones que establezcan estructuras disciplinadas de gobernanza más temprano estarán en una posición mucho más sólida para equilibrar innovación, resiliencia operativa y expectativas regulatorias simultáneamente.",
"thirdParty.final.p3": "Con el tiempo, los entornos de control más fuertes no necesariamente pertenecerán a las organizaciones con menos dependencias de terceros, sino a aquellas capaces de demostrar que la exposición externa se gobierna con el mismo rigor esperado internamente.",

"soxScaling.title": " ",
"soxScaling.subtitle": " ",

"soxScaling.intro1": "Las organizaciones de rápido crecimiento rara vez tienen dificultades por falta de personas capaces o impulso comercial. Más comúnmente, la presión surge cuando el crecimiento operativo supera la madurez de los procesos que respaldan el reporte financiero, la gobernanza tecnológica y la ejecución de controles.",
"soxScaling.intro2": "La mayoría de las organizaciones que entran en esta etapa no parten de cero. Ya existen procesos de aprobación. Se realizan revisiones. Los equipos de finanzas y tecnología ejercen supervisión de distintas formas en el negocio.",
"soxScaling.intro3": "Las organizaciones que transitan esta etapa con mayor eficacia suelen reconocer temprano que la preparación SOX no consiste en agregar capas de cumplimiento, sino en estandarizar la disciplina operativa antes de que la complejidad aumente.",

"soxScaling.section1.title": "La fricción de auditoría suele comenzar antes de las pruebas formales",
"soxScaling.section1.p1": "Muchas compañías asumen que la fricción de auditoría empieza cuando comienzan las pruebas. En realidad, la tensión suele aparecer mucho antes, cuando se empiezan a documentar procesos que evolucionaron orgánicamente durante varios años.",
"soxScaling.section1.p2": "Las empresas de rápido crecimiento optimizan naturalmente para la velocidad. Los equipos se adaptan rápido, las responsabilidades cambian con frecuencia y los procesos evolucionan continuamente para soportar la expansión.",
"soxScaling.section1.li1": "Controles similares ejecutados de forma distinta entre equipos",
"soxScaling.section1.li2": "Aprobaciones realizadas por canales informales de comunicación",
"soxScaling.section1.li3": "Actividades clave de revisión dependientes de personas específicas",
"soxScaling.section1.li4": "Prácticas inconsistentes de retención de evidencia",
"soxScaling.section1.li5": "Cambios tecnológicos implementados sin gobernanza formal",
"soxScaling.section1.li6": "Claridad limitada sobre la propiedad recurrente de controles",
"soxScaling.section1.p3": "Los auditores externos evalúan la consistencia de forma distinta a los equipos operativos. Un control de revisión que funciona adecuadamente en la práctica puede volverse problemático durante las pruebas si su ejecución varía por trimestre, revisor o unidad de negocio.",

"soxScaling.section2.title": "La propiedad de controles requiere más estructura de la que muchas empresas en crecimiento esperan",
"soxScaling.section2.p1": "Uno de los primeros puntos de presión en la preparación SOX involucra las estructuras de responsabilidad. En organizaciones de rápido crecimiento, las responsabilidades se expanden junto con el negocio.",
"soxScaling.section2.p2": "Muchas organizaciones descubren que tienen dueños operativos, pero no dueños de control claramente definidos. Alguien puede entender cómo funciona un proceso día a día, pero la responsabilidad por ejecución, retención de evidencia, escalamiento y consistencia puede seguir siendo poco clara.",
"soxScaling.section2.p3": "Las compañías que hacen la transición con mayor eficacia hacia entornos SOX maduros suelen establecer estructuras de propiedad antes de lo previsto.",

"soxScaling.section3.title": "La disciplina de cadencia se vuelve más importante a medida que crece la complejidad",
"soxScaling.section3.p1": "Otra fuente común de fricción de auditoría es la ejecución inconsistente en el tiempo. En organizaciones en crecimiento, las prioridades operativas cambian constantemente y las actividades recurrentes de gobernanza pueden volverse reactivas en lugar de disciplinadas.",
"soxScaling.section3.p2": "Desde una perspectiva de auditoría, la inconsistencia temporal suele indicar preocupaciones más amplias sobre disciplina de supervisión y confiabilidad de controles.",
"soxScaling.section3.li1": "Cronogramas de ejecución definidos",
"soxScaling.section3.li2": "Calendarios de revisión estandarizados",
"soxScaling.section3.li3": "Actividades de certificación impulsadas por calendario",
"soxScaling.section3.li4": "Procedimientos de escalamiento por ejecución tardía",
"soxScaling.section3.li5": "Revisiones periódicas de supervisión de la administración",
"soxScaling.section3.p3": "Estas disciplinas pueden parecer administrativas al inicio, pero crean previsibilidad operativa que se vuelve extremadamente valiosa a medida que aumenta el escrutinio de auditoría.",

"soxScaling.section4.title": "Los estándares de evidencia suelen crear más fricción que el diseño de controles",
"soxScaling.section4.p1": "Muchas organizaciones que se preparan para SOX dedican mucha atención al diseño de controles y subestiman la importancia operativa de la disciplina de evidencia.",
"soxScaling.section4.p2": "Las revisiones ocurren, las aprobaciones se completan, las conciliaciones se preparan y las decisiones de acceso se toman, pero la evidencia de soporte puede estar en correos, hojas de cálculo, plataformas de mensajería, sistemas de tickets o flujos no documentados.",
"soxScaling.section4.li1": "Qué evidencia debe conservarse",
"soxScaling.section4.li2": "Dónde debe residir la documentación",
"soxScaling.section4.li3": "Expectativas de trazabilidad de aprobaciones",
"soxScaling.section4.li4": "Convenciones de nombres y períodos de retención",
"soxScaling.section4.li5": "Estándares para demostrar integridad de la revisión",
"soxScaling.section4.li6": "Procedimientos para documentar excepciones",
"soxScaling.section4.p3": "Las compañías que gestionan auditorías con mayor eficacia suelen ser aquellas que introdujeron consistencia operativa temprano, antes de que la gestión de evidencia se fragmentara con la expansión del negocio.",

"soxScaling.section5.title": "Los entornos tecnológicos suelen escalar más rápido que los procesos de gobernanza",
"soxScaling.section5.p1": "La complejidad tecnológica tiende a acelerarse durante períodos de crecimiento. Implementaciones ERP, migraciones a la nube, expansión SaaS, adquisiciones, automatización y entornos de reporte cambiantes introducen nuevas exigencias de gobernanza.",
"soxScaling.section5.p2": "En muchas compañías, los entornos tecnológicos maduran operativamente más rápido que la estructura de control que los rodea.",
"soxScaling.section5.li1": "Gobernanza de acceso inconsistente",
"soxScaling.section5.li2": "Acceso privilegiado excesivo",
"soxScaling.section5.li3": "Trazabilidad débil de gestión de cambios",
"soxScaling.section5.li4": "Claridad limitada sobre propiedad de sistemas",
"soxScaling.section5.li5": "Monitoreo incompleto de interfaces",
"soxScaling.section5.li6": "Soluciones manuales introducidas durante implementaciones rápidas",
"soxScaling.section5.p3": "Estandarizar temprano la gestión de accesos, la gobernanza de cambios, las expectativas de documentación y la responsabilidad por sistemas tiende a reducir tensiones operativas significativas más adelante.",

"soxScaling.final.title": "Qué deberían estandarizar temprano las compañías",
"soxScaling.final.p1": "Las organizaciones suelen preguntar cuándo deben comenzar los esfuerzos formales de preparación SOX. Una conversación más útil se centra en qué disciplinas operativas deben estandarizarse antes de que aumente la presión de auditoría.",

"soxScaling.final.ownership": "Propiedad",
"soxScaling.final.ownership.li1": "Responsabilidad clara sobre controles",
"soxScaling.final.ownership.li2": "Responsabilidades de revisión definidas",
"soxScaling.final.ownership.li3": "Procedimientos de escalamiento y delegación",
"soxScaling.final.ownership.li4": "Alineación de gobernanza multifuncional",

"soxScaling.final.cadence": "Cadencia",
"soxScaling.final.cadence.li1": "Cronogramas de ejecución estandarizados",
"soxScaling.final.cadence.li2": "Actividades de gobernanza impulsadas por calendario",
"soxScaling.final.cadence.li3": "Expectativas de revisión oportuna",
"soxScaling.final.cadence.li4": "Rutinas consistentes de monitoreo",

"soxScaling.final.evidence": "Evidencia",
"soxScaling.final.evidence.li1": "Estándares definidos de documentación",
"soxScaling.final.evidence.li2": "Prácticas centralizadas de retención",
"soxScaling.final.evidence.li3": "Trazabilidad clara de aprobaciones",
"soxScaling.final.evidence.li4": "Soporte repetible para la ejecución de controles",

"soxScaling.final.p2": "Las compañías que retrasan la madurez de gobernanza suelen descubrir que la preparación SOX se vuelve mucho más disruptiva y demandante de recursos de lo anticipado.",
"soxScaling.final.p3": "Las organizaciones que se adaptan con mayor eficacia tienden a ver la estandarización de controles no como una iniciativa de cumplimiento, sino como un requisito de escalabilidad operativa que respalda el crecimiento sostenible.",

"boardRisk.title": " ",
"boardRisk.subtitle": " ",

"boardRisk.intro1": "Muchas organizaciones no carecen de reportes de riesgo de TI. Los dashboards se generan regularmente, las métricas operativas se monitorean continuamente y el liderazgo recibe actualizaciones extensas sobre ciberseguridad, incidentes tecnológicos, cumplimiento, auditoría y remediación.",
"boardRisk.intro2": "Sin embargo, pese al volumen de reportes, las juntas suelen terminar las discusiones de gobernanza sin una comprensión clara de la exposición real al riesgo tecnológico.",
"boardRisk.intro3": "El problema rara vez es la falta de datos. Más a menudo, el reporte sigue siendo demasiado operativo, mientras que las juntas necesitan información que respalde juicio de supervisión, priorización estratégica y decisiones informadas por riesgo.",
"boardRisk.intro4": "Las organizaciones que avanzan con mayor fuerza están pasando de reportes centrados en volumen de actividad a reportes centrados en indicadores clave de riesgo que ayudan a las juntas a evaluar exposición, trayectoria, responsabilidad y preparación para decidir.",

"boardRisk.section1.title": "Las métricas operativas rara vez se traducen en visión de supervisión",
"boardRisk.section1.p1": "Una debilidad común en los reportes a la junta es asumir que más detalle operativo mejora automáticamente la visibilidad de gobernanza.",
"boardRisk.section1.p2": "Las juntas pueden recibir reportes extensos sobre vulnerabilidades, simulaciones de phishing, parches, cierre de tickets, auditorías, despliegue de herramientas o porcentajes de cumplimiento sin obtener claridad real sobre si la postura de riesgo está mejorando o deteriorándose.",
"boardRisk.section1.li1": "¿Dónde se está volviendo más expuesta la organización?",
"boardRisk.section1.li2": "¿Qué riesgos exceden los niveles de tolerancia establecidos?",
"boardRisk.section1.li3": "¿Las actividades de remediación reducen efectivamente la exposición material?",
"boardRisk.section1.li4": "¿Qué dependencias crean riesgo de concentración?",
"boardRisk.section1.li5": "¿Dónde persisten brechas de gobernanza pese a la actividad operativa?",
"boardRisk.section1.li6": "¿Qué tendencias requieren atención estratégica y no solo gestión táctica?",
"boardRisk.section1.p3": "Los entornos de reporte más sólidos reconocen que el reporte a la junta no es simplemente una versión resumida del reporte operativo. Es una disciplina de gobernanza separada con distinto encuadre, umbrales de escalamiento y medidas de efectividad.",

"boardRisk.section2.title": "Los KRI efectivos se enfocan en exposición, no actividad",
"boardRisk.section2.p1": "Las organizaciones suelen llamar KRI a las métricas de reporte a la junta, pero muchas siguen reportando KPI operativos en la práctica.",
"boardRisk.section2.p2": "Los indicadores clave de desempeño miden eficiencia, finalización o actividad de gestión. Los indicadores clave de riesgo ayudan a evaluar niveles cambiantes de exposición, preocupaciones emergentes y si el riesgo se está moviendo fuera de límites aceptables.",
"boardRisk.section2.li1": "Concentración de problemas de alto riesgo no resueltos",
"boardRisk.section2.li2": "Antigüedad de actividades críticas de remediación",
"boardRisk.section2.li3": "Dependencias de terceros que respaldan operaciones críticas",
"boardRisk.section2.li4": "Crecimiento de tecnologías obsoletas o sin soporte",
"boardRisk.section2.li5": "Tendencias de exposición de acceso privilegiado",
"boardRisk.section2.li6": "Frecuencia de excepciones de control en entornos de alto riesgo",
"boardRisk.section2.li7": "Hallazgos de auditoría recurrentes entre unidades de negocio",
"boardRisk.section2.li8": "Incidentes cibernéticos materiales que afectan operaciones críticas",
"boardRisk.section2.li9": "Tendencias de escalamiento vinculadas a regulación o resiliencia",
"boardRisk.section2.p3": "Estos indicadores ofrecen a las juntas mejor visibilidad sobre la trayectoria del riesgo que sobre la carga operativa.",
"boardRisk.section2.p4": "Las juntas suelen beneficiarse más de reportes transparentes sobre debilidades persistentes de gobernanza que de dashboards muy pulidos centrados en tasas de finalización.",

"boardRisk.section3.title": "El reporte a la junta debe aclarar la responsabilidad",
"boardRisk.section3.p1": "Otra debilidad común en reportes de riesgo de TI es la falta de visibilidad clara sobre responsabilidad.",
"boardRisk.section3.li1": "Qué ejecutivos son responsables de la remediación",
"boardRisk.section3.li2": "Si los plazos de remediación siguen siendo realistas",
"boardRisk.section3.li3": "Dónde está fallando la coordinación multifuncional",
"boardRisk.section3.li4": "Qué riesgos siguen escalando sin resolución suficiente",
"boardRisk.section3.li5": "Si la administración acepta formalmente ciertas exposiciones",
"boardRisk.section3.p2": "Sin visibilidad clara de propiedad, el reporte puede crear apariencia de actividad de gobernanza mientras oculta desafíos de ejecución no resueltos.",
"boardRisk.section3.li6": "Propiedad ejecutiva de riesgos materiales",
"boardRisk.section3.li7": "Análisis de antigüedad vinculado a exposición no resuelta",
"boardRisk.section3.li8": "Umbrales de escalamiento por demoras de remediación",
"boardRisk.section3.li9": "Visibilidad sobre excepciones recurrentes de gobernanza",
"boardRisk.section3.li10": "Análisis de tendencias por unidad de negocio o dominio tecnológico",
"boardRisk.section3.li11": "Distinción entre remediación táctica y reducción estructural de riesgo",
"boardRisk.section3.p3": "Las juntas no necesitan visibilidad sobre cada actividad operativa de remediación. Pero sí necesitan suficiente transparencia para determinar si las estructuras de responsabilidad funcionan bajo creciente complejidad operativa.",

"boardRisk.section4.title": "La madurez del reporte depende del contexto y la narrativa",
"boardRisk.section4.p1": "Un aspecto a menudo subestimado del reporte a la junta es la calidad de la narrativa.",
"boardRisk.section4.li1": "Por qué está cambiando la exposición al riesgo",
"boardRisk.section4.li2": "Qué tendencias importan más",
"boardRisk.section4.li3": "Si los problemas son aislados o sistémicos",
"boardRisk.section4.li4": "Cómo prioriza la administración la respuesta",
"boardRisk.section4.li5": "Qué decisiones pueden requerir atención de la junta",
"boardRisk.section4.p2": "Los entornos sólidos complementan los KRI con interpretación concisa que explica la importancia operativa sin abrumar con detalle técnico.",
"boardRisk.section4.p3": "Las narrativas efectivas aclaran qué cambió, por qué importa, cómo responde la administración y si la exposición mejora, se estabiliza o empeora.",

"boardRisk.final.title": "El reporte a la junta debe apoyar decisiones de gobernanza",
"boardRisk.final.p1": "En última instancia, un reporte efectivo de riesgo de TI debe ayudar a la junta a tomar mejores decisiones de gobernanza, no solo mantenerla informada sobre actividad operativa.",
"boardRisk.final.li1": "Tendencias de exposición en lugar de volumen de actividad",
"boardRisk.final.li2": "Concentración de riesgo en lugar de incidentes aislados",
"boardRisk.final.li3": "Claridad de responsabilidad en lugar de propiedad generalizada",
"boardRisk.final.li4": "Efectividad de remediación en lugar de estadísticas de cierre",
"boardRisk.final.li5": "Indicadores prospectivos en lugar de resúmenes históricos",
"boardRisk.final.li6": "Decisiones de gobernanza que requieren escalamiento o inversión",
"boardRisk.final.p2": "Las organizaciones que se adapten con éxito probablemente serán aquellas capaces de traducir entornos complejos de riesgo operativo en inteligencia de supervisión clara que apoye decisiones informadas sin simplificar en exceso la exposición subyacente.",

"aiAudit.title": "",
"aiAudit.subtitle": " ",

"aiAudit.intro1": "Muchas organizaciones aún tratan la gobernanza de IA como una iniciativa emergente. Los auditores la tratan cada vez más como una realidad operativa.",
"aiAudit.intro2": "Los equipos de liderazgo que antes veían la gobernanza de IA como una preocupación futura ahora reciben preguntas prácticas sobre responsabilidad, supervisión, documentación y ejecución de controles.",
"aiAudit.intro3": "En muchos entornos, la administración está descubriendo que la adopción de IA avanzó más rápido que la madurez de gobernanza.",
"aiAudit.intro4": "En distintos sectores, cuatro temas de gobernanza aparecen de forma consistente en discusiones de auditoría: inventario, aprobaciones, monitoreo continuo y documentación del ciclo de vida.",

"aiAudit.section1.title": "El inventario se está convirtiendo en el punto de partida de la gobernanza de IA",
"aiAudit.section1.p1": "Una de las primeras preguntas que hacen los auditores es simple: ¿dónde se usa IA en la organización?",
"aiAudit.section1.p2": "La adopción de IA rara vez ocurre mediante un programa centralizado. Los equipos de negocio experimentan con herramientas de IA generativa, tecnología integra capacidades de aprendizaje automático y los proveedores incorporan funciones de IA en plataformas existentes.",
"aiAudit.section1.p3": "Las organizaciones no pueden gobernar tecnologías eficazmente si no pueden identificarlas de manera consistente.",
"aiAudit.section1.li1": "Inventarios centralizados de sistemas y casos de uso habilitados por IA",
"aiAudit.section1.li2": "Criterios para definir qué constituye IA “dentro del alcance”",
"aiAudit.section1.li3": "Clasificaciones de riesgo vinculadas al impacto operativo o regulatorio",
"aiAudit.section1.li4": "Responsabilidad de propiedad para cada implementación",
"aiAudit.section1.li5": "Revisiones periódicas para validar la integridad del inventario",
"aiAudit.section1.p4": "Las organizaciones que responden con mayor eficacia tratan el inventario de IA como un proceso dinámico de gobernanza, no como un ejercicio documental único.",

"aiAudit.section2.title": "La gobernanza de aprobaciones requiere más que alineación informal",
"aiAudit.section2.p1": "Una vez identificado el uso de IA, los auditores examinan la gobernanza alrededor del despliegue y las aprobaciones.",
"aiAudit.section2.p2": "Lo que suele faltar es una gobernanza estructurada alrededor de la evaluación de riesgos y la trazabilidad de aprobaciones.",
"aiAudit.section2.li1": "Requisitos de aprobación basados en exposición al riesgo",
"aiAudit.section2.li2": "Umbrales de revisión de gobernanza",
"aiAudit.section2.li3": "Responsabilidad por decisiones de aceptación de riesgo",
"aiAudit.section2.li4": "Rutas de escalamiento para implementaciones de mayor riesgo",
"aiAudit.section2.li5": "Documentación que respalde decisiones de despliegue",
"aiAudit.section2.p3": "Los entornos sólidos abordan esto estableciendo estructuras prácticas de aprobación temprano, incluyendo expectativas de revisión, criterios de clasificación de riesgo y responsabilidad por decisiones de implementación.",

"aiAudit.section3.title": "Los controles de monitoreo son cada vez más importantes",
"aiAudit.section3.p1": "El inventario y las aprobaciones establecen la estructura inicial. El monitoreo determina si la gobernanza sigue siendo efectiva en el tiempo.",
"aiAudit.section3.p2": "Los entornos habilitados por IA evolucionan continuamente. Cambian los modelos, los proveedores introducen funcionalidades, los datos se modifican, el uso se expande y las dependencias operativas aumentan.",
"aiAudit.section3.li1": "Cambios en sistemas habilitados por IA",
"aiAudit.section3.li2": "Accesos y permisos de usuarios continuos",
"aiAudit.section3.li3": "Uso y retención de datos",
"aiAudit.section3.li4": "Actividades de manejo de excepciones",
"aiAudit.section3.li5": "Actualizaciones de proveedores que introducen nuevas capacidades de IA",
"aiAudit.section3.li6": "Escalamiento de incidentes o preocupaciones de gobernanza",
"aiAudit.section3.li7": "Alineación entre uso operativo y alcance aprobado",
"aiAudit.section3.p3": "Los controles de monitoreo efectivos no requieren necesariamente herramientas sofisticadas. Más a menudo requieren disciplina operativa, cadencia de revisión, procedimientos de escalamiento y responsabilidad por reevaluar supuestos de gobernanza a medida que el entorno evoluciona.",

"aiAudit.section4.title": "La documentación del ciclo de vida se vuelve crítica bajo escrutinio de auditoría",
"aiAudit.section4.p1": "Las organizaciones suelen subestimar lo rápido que las discusiones de IA se convierten en discusiones de documentación cuando comienza una auditoría.",
"aiAudit.section4.li1": "Evaluaciones iniciales de riesgo",
"aiAudit.section4.li2": "Decisiones de aprobación y despliegue",
"aiAudit.section4.li3": "Expectativas de control",
"aiAudit.section4.li4": "Actividades de monitoreo",
"aiAudit.section4.li5": "Procesos de gestión de cambios",
"aiAudit.section4.li6": "Manejo de excepciones",
"aiAudit.section4.li7": "Revisiones periódicas de gobernanza",
"aiAudit.section4.li8": "Decisiones de retiro o desmantelamiento",
"aiAudit.section4.p2": "La documentación fragmentada dificulta demostrar consistencia, responsabilidad y confiabilidad de la supervisión.",
"aiAudit.section4.li9": "Estándares definidos de retención de evidencia",
"aiAudit.section4.li10": "Repositorios centralizados de gobernanza",
"aiAudit.section4.li11": "Responsabilidades de propiedad documental",
"aiAudit.section4.li12": "Expectativas de trazabilidad para aprobaciones y revisiones",
"aiAudit.section4.li13": "Estándares para demostrar ejecución de controles",
"aiAudit.section4.li14": "Validación periódica de integridad documental",
"aiAudit.section4.p3": "La documentación del ciclo de vida probablemente será uno de los indicadores más claros que separen organizaciones con madurez operativa de gobernanza de aquellas que dependen principalmente de gobernanza a nivel de políticas.",

"aiAudit.final.title": "Lo que los auditores realmente evalúan",
"aiAudit.final.p1": "La mayoría de los auditores no esperan que las organizaciones eliminen todo riesgo relacionado con IA. Evalúan si la administración ha establecido disciplina de gobernanza proporcional a la exposición operativa.",
"aiAudit.final.li1": "¿Sabe la administración dónde existe IA?",
"aiAudit.final.li2": "¿Los despliegues se gobiernan mediante aprobaciones estructuradas?",
"aiAudit.final.li3": "¿Los controles se monitorean consistentemente en el tiempo?",
"aiAudit.final.li4": "¿Las actividades de gobernanza pueden evidenciarse durante el ciclo de vida del sistema?",
"aiAudit.final.li5": "¿Las estructuras de responsabilidad son suficientemente claras para apoyar la remediación?",
"aiAudit.final.p2": "Las organizaciones que abordan la gobernanza de IA de manera pragmática suelen desempeñarse mejor bajo escrutinio que aquellas que intentan adaptar la gobernanza después de que la adopción ya se aceleró significativamente.",
"aiAudit.final.p3": "Con el tiempo, la brecha entre gobernanza basada en políticas y gobernanza operativa será cada vez más visible.",

"sox30.title": " ",

"sox30.intro1": "Cuando los plazos de SOX se comprimen, TI casi siempre se convierte en el punto de presión.",
"sox30.intro2": "Finanzas es responsable de la afirmación financiera, pero TI determina si los auditores pueden confiar realmente en los sistemas que producen esos números.",
"sox30.intro3": "Si el acceso no está bien gobernado, si los cambios se ejecutan de forma inconsistente o si los flujos de datos no se comprenden bien, los controles financieros se vuelven difíciles de respaldar, sin importar cuán bien estén documentados.",
"sox30.intro4": "En plazos comprimidos, el objetivo no es una madurez perfecta de cumplimiento. Es establecer suficiente estructura y consistencia para que los auditores puedan seguir cómo se gobiernan los sistemas, cómo operan los controles y quién es responsable de la ejecución.",
"sox30.intro5": "En la mayoría de las organizaciones, esa claridad no está completamente establecida cuando comienza la preparación SOX.",

"sox30.section1.title": "La visibilidad suele ser la primera limitación, no los controles",
"sox30.section1.p1": "El reto inicial rara vez es la ausencia de controles. La mayoría de las organizaciones ya tiene procesos de acceso, flujos de cambio, aprobaciones y revisiones operativas de alguna forma.",
"sox30.section1.p2": "El problema es que estos procesos suelen haber evolucionado independientemente entre equipos y sistemas durante períodos de crecimiento.",
"sox30.section1.p3": "Esto se vuelve más visible al intentar responder una pregunta básica: ¿qué sistemas realmente importan para el reporte financiero?",
"sox30.section1.p4": "Las plataformas ERP suelen ser claras. La complejidad surge alrededor de aplicaciones adyacentes, capas de reporte, integraciones y procesos manuales que respaldan el cierre financiero.",
"sox30.section1.p5": "Lo que sorprende a muchas organizaciones es cuántos sistemas no financieros influyen en resultados financieros mediante transformaciones, exportaciones y ajustes manuales.",
"sox30.section1.p6": "Sin una visión clara y acordada del alcance, todo lo que sigue se vuelve más difícil de estabilizar.",

"sox30.section2.title": "El diseño de controles rara vez es el verdadero problema",
"sox30.section2.p1": "Una vez entendido el alcance, la atención se desplaza naturalmente a los controles generales de TI.",
"sox30.section2.p2": "La gestión de accesos puede existir, pero las prácticas de aprobación y revisión pueden variar por sistema. La gestión de cambios puede estar documentada, pero los cambios de emergencia o menores pueden manejarse fuera de flujos formales.",
"sox30.section2.p3": "El problema no es si existen controles. Es si operan de manera repetible y defendible.",
"sox30.section2.p4": "En entornos SOX, la inconsistencia suele ser más problemática que la ausencia.",
"sox30.section2.p5": "Los auditores no evalúan intención. Evalúan confiabilidad.",
"sox30.section2.p6": "Ahí empieza la fricción, especialmente en organizaciones que escalaron operativamente antes de estandarizar expectativas de gobernanza.",

"sox30.section3.title": "La automatización cambia la naturaleza del riesgo de control",
"sox30.section3.p1": "A medida que los sistemas maduran, una parte creciente de la ejecución de controles financieros se automatiza.",
"sox30.section3.p2": "Esto es positivo desde una perspectiva de eficiencia, pero cambia significativamente el requisito de gobernanza.",
"sox30.section3.p3": "El foco cambia de si un control fue ejecutado manualmente a si el sistema que ejecuta el control está configurado, restringido y gobernado adecuadamente en el tiempo.",
"sox30.section3.p4": "Un problema recurrente es depender demasiado de salidas del sistema sin comprender suficientemente cómo se generan o modifican.",
"sox30.section3.p5": "Aquí la alineación entre TI y finanzas se vuelve esencial. Finanzas se enfoca en resultados. TI debe enfocarse en la integridad de los mecanismos que producen esos resultados.",
"sox30.section3.p6": "Ambas perspectivas son necesarias, pero los entornos SOX requieren que operen en sincronía.",

"sox30.section4.title": "La disciplina de evidencia determina la eficiencia de auditoría",
"sox30.section4.p1": "Uno de los aspectos más subestimados de la preparación SOX es la gestión de evidencia.",
"sox30.section4.p2": "Los controles pueden operar correctamente, pero si la evidencia es inconsistente, fragmentada o difícil de recuperar, el control se vuelve difícil de defender.",
"sox30.section4.p3": "En muchas organizaciones, la evidencia existe en múltiples sistemas y canales de comunicación.",
"sox30.section4.p4": "Individualmente, esto no es inusual. Colectivamente, crea fricción de auditoría evitable.",
"sox30.section4.p5": "El problema central no es el almacenamiento. Es la previsibilidad.",
"sox30.section4.p6": "Los auditores necesitan entender no solo que existe evidencia, sino que puede producirse de forma consistente y confiable en el tiempo.",
"sox30.section4.p7": "Las organizaciones que gestionan SOX eficazmente estandarizan temprano las expectativas de evidencia, incluyendo qué debe conservarse, dónde reside y cómo se produce.",

"sox30.section5.title": "Los walkthroughs exponen cómo opera realmente el entorno",
"sox30.section5.p1": "En algún momento, las organizaciones pasan de documentar controles a validar cómo operan en la práctica.",
"sox30.section5.p2": "Ahí es donde las brechas suelen hacerse más visibles.",
"sox30.section5.p3": "Lo que aparece no es necesariamente ausencia de controles, sino variación en la ejecución entre equipos, sistemas o personas.",
"sox30.section5.p4": "Los problemas comunes suelen surgir en higiene de accesos, disciplina de cambios y gobernanza de acceso privilegiado.",
"sox30.section5.p5": "Estos hallazgos rara vez son inesperados internamente. Destacan la diferencia entre funcionalidad operativa y estructura lista para auditoría.",
"sox30.section5.p6": "El propósito de los walkthroughs no es la remediación inmediata. Es obtener claridad sobre dónde el entorno es estable y dónde depende de patrones informales de ejecución.",

"sox30.section6.title": "La alineación del liderazgo se convierte en el punto de inflexión",
"sox30.section6.p1": "A medida que mejora la claridad, la conversación pasa de controles individuales a la postura general de preparación.",
"sox30.section6.p2": "En esta etapa, el liderazgo necesita una visión consolidada de dónde está la organización, qué brechas existen y qué esfuerzo se requiere para avanzar hacia pruebas formales sin disrupción evitable.",
"sox30.section6.p3": "Aquí la alineación entre CIO y CFO se vuelve crítica. La preparación SOX no es una iniciativa de TI; es una responsabilidad compartida.",
"sox30.section6.p4": "Lo más importante no es la perfección, sino una comprensión compartida de exposición, madurez de controles y trayectoria de preparación.",
"sox30.section6.p5": "Las organizaciones que tienen dificultades en esta etapa suelen hacerlo no porque falten controles, sino porque no existe una visión unificada de cómo se comportan los controles en el entorno.",

"sox30.section7.title": "Dónde la mayoría de las organizaciones subestima el esfuerzo",
"sox30.section7.p1": "Algunos patrones aparecen consistentemente en entornos de rápido crecimiento.",
"sox30.section7.p2": "Los controles suelen asumirse más consistentes de lo que realmente son. El riesgo de acceso privilegiado se subestima. La disciplina de cambios se debilita durante el crecimiento rápido. Los reportes generados por sistemas no siempre se gobiernan con suficiente rigor.",
"sox30.section7.p3": "Individualmente, estos problemas rara vez crean fallas inmediatas. El desafío es acumulativo.",

"sox30.final.title": "Perspectiva final",
"sox30.final.p1": "La preparación SOX de TI no se logra únicamente mediante documentación o agregando controles aislados.",
"sox30.final.p2": "Se logra cuando una organización puede explicar claramente cómo se gobiernan los sistemas, cómo operan los controles y cómo la evidencia respalda esos controles consistentemente en el tiempo.",
"sox30.final.p3": "Las organizaciones que transitan con mayor eficacia hacia entornos SOX no son necesariamente las que tienen los marcos de control más maduros, sino aquellas con suficiente claridad, consistencia y disciplina operativa para que los auditores comprendan el entorno sin interpretación.",
"sox30.final.p4": "Esa claridad convierte la preparación SOX de un punto de fricción en un proceso de gobernanza manejable."

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
"trust.item4": "财务管理",

    "services.heading": "我们的核心咨询服务",
    "services.card1.title": "风险咨询",
"services.card1.text": "企业风险、技术风险、运营风险、网络安全及治理支持，帮助管理层将风险决策与战略目标、监管要求及运营韧性保持一致",

"services.card2.title": "内部审计与财务管理",
"services.card2.text": "专注于内部控制、SOX、ICFR、预算管理、财务运营及报告流程的内部审计与财务管理咨询，旨在加强治理、提升财务透明度，并降低审计与运营风险。",

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

"services.opt.title": "内部审计与财务管理",
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
    "insights.f3.text": "关键领域：清单、审批、监控和生命周期管理。",


"insights.readPost": "阅读文章",

"aiGov.title": "",
"aiGov.subtitle": " ",

"aiGov.intro1": "人工智能的发展速度已经超过了多数治理结构原本能够承载的节奏。各行业组织正在将 AI 嵌入分析、运营、客户互动、软件开发和决策流程中，其速度往往超过周边控制环境的成熟度。",
"aiGov.intro2": "董事会也正在相应作出反应。领导团队现在面临关于 AI 采用所涉及的责任、监督、监管暴露和运营风险的直接问题。",
"aiGov.intro3": "多数组织的 AI 治理问题并不是因为缺少政策或原则，而是因为缺少运营纪律。",

"aiGov.section1.title": "治理始于范围界定",
"aiGov.section1.p1": "AI 治理最早的失效之一发生在识别阶段。组织通常低估了确定 AI 实际在业务中何处运行的难度。",
"aiGov.section1.p2": "AI 采用很少通过单一集中化项目进入组织。它通常在部门、平台、供应商工具以及业务主导的试验中逐步出现。",
"aiGov.section1.p3": "如果管理层无法清晰识别 AI 在何处影响业务活动，有效监督就无从谈起。",
"aiGov.section1.li1": "明确界定哪些 AI 属于“范围内”的标准",
"aiGov.section1.li2": "AI 系统和使用案例的集中清单",
"aiGov.section1.li3": "明确的责任归属",
"aiGov.section1.li4": "与运营和监管暴露相一致的风险分级标准",
"aiGov.section1.li5": "针对较高风险实施的升级阈值",
"aiGov.section1.p4": "治理范围必须超越内部开发模型。当前一些最重要的暴露来自内置 AI 功能的第三方平台。",

"aiGov.section2.title": "流程叙述比控制测试更快揭示弱点",
"aiGov.section2.p1": "范围确定后，组织往往直接进入控制评估。但在实践中，一个非常有价值的治理活动并不高度技术化：即建立运营流程叙述。",
"aiGov.section2.p2": "高质量的流程叙述能够促使业务、技术、合规和领导层之间形成一致理解。",
"aiGov.section2.li1": "AI 流程的业务目的",
"aiGov.section2.li2": "涉及的系统、数据来源和依赖关系",
"aiGov.section2.li3": "决策点和人工监督活动",
"aiGov.section2.li4": "自动化或模型使用带来的风险",
"aiGov.section2.li5": "用于缓解这些风险的控制活动",
"aiGov.section2.li6": "责任与升级职责",
"aiGov.section2.li7": "通过执行生成的证据",
"aiGov.section2.p3": "流程叙述在技术与非技术利益相关方之间建立共同语言。董事会不需要机器学习架构细节，而需要看到治理职责如何被执行。",

"aiGov.section3.title": "穿行测试揭示治理是否真正存在",
"aiGov.section3.p1": "政策描述意图。穿行测试揭示现实。",
"aiGov.section3.p2": "组织经常在穿行测试中发现，其治理模型在演示材料中比在实际运营中更加清晰。",
"aiGov.section3.li1": "AI 系统如何进入生产环境",
"aiGov.section3.li2": "审批与变更管理活动",
"aiGov.section3.li3": "人工审核与覆盖机制",
"aiGov.section3.li4": "数据验证程序",
"aiGov.section3.li5": "监控与例外管理",
"aiGov.section3.li6": "访问控制与职责分离实践",
"aiGov.section3.li7": "事件升级流程",
"aiGov.section3.li8": "文档保留要求",
"aiGov.section3.p3": "董事会应将穿行测试视为治理验证活动，而不仅仅是审计程序。",

"aiGov.section4.title": "证据标准正在成为核心治理议题",
"aiGov.section4.p1": "随着 AI 监督逐渐成熟，治理讨论越来越多地转化为证据讨论。",
"aiGov.section4.p2": "组织可能持续执行审核、审批、监控和监督程序，但如果无法通过可靠证据证明这些活动，控制环境就难以被辩护。",
"aiGov.section4.li1": "必须保留哪些文档",
"aiGov.section4.li2": "证据保存在哪里",
"aiGov.section4.li3": "证据保留的责任归属",
"aiGov.section4.li4": "保留期限",
"aiGov.section4.li5": "证明控制执行的标准",
"aiGov.section4.li6": "验证证据完整性的程序",
"aiGov.section4.p3": "董事会不需要查看每一个运营工件，但需要确信管理层具备能够在审查下支撑治理主张的证据实践。",

"aiGov.section5.title": "整改纪律决定治理可信度",
"aiGov.section5.p1": "任何治理环境都不会完全没有控制缺口或运营不一致。成熟组织与准备不足组织的区别在于，管理层能否及早发现问题、明确分配责任并有纪律地整改缺陷。",
"aiGov.section5.li1": "未定义的责任结构",
"aiGov.section5.li2": "不一致的审批",
"aiGov.section5.li3": "不完整的文档",
"aiGov.section5.li4": "薄弱的监控实践",
"aiGov.section5.li5": "第三方监督缺口",
"aiGov.section5.li6": "数据治理问题",
"aiGov.section5.li7": "政策要求与运营执行之间不一致",
"aiGov.section5.p2": "董事会应关注跨业务单元重复出现的问题。重复性例外通常表明治理设计存在更广泛的弱点，而非孤立的运营失败。",

"aiGov.final.title": "董事会真正需要什么",
"aiGov.final.p1": "多数董事会并不试图成为人工智能专家。他们真正想判断的是，管理层是否已经建立足够的运营纪律，能够负责任地部署 AI，并在审查下为这些实践进行辩护。",
"aiGov.final.p2": "这需要看到 AI 存在于何处、责任如何明确、控制是否持续运行，以及问题是否能在成为重大事件前暴露出来。",
"aiGov.final.li1": "定义范围",
"aiGov.final.li2": "建立运营流程叙述",
"aiGov.final.li3": "通过穿行测试验证执行",
"aiGov.final.li4": "标准化证据要求",
"aiGov.final.li5": "实施有纪律的整改跟踪",
"aiGov.final.p3": "成功适应的组织未必是 AI 采用最快的组织，更可能是能够证明治理成熟度与部署同步演进，而非事后补救的组织。",

"thirdParty.title": "",
"thirdParty.subtitle": "在日益互联的环境中建立 AI 治理、责任机制和可辩护控制的实务方法",

"thirdParty.intro1": "多数组织已不再运行于清晰定义的技术边界内。关键业务运营依赖不断扩大的云服务商、软件平台、托管服务提供商、数据处理方、AI 供应商以及外部开发伙伴网络。",
"thirdParty.intro2": "对许多组织而言，最重要的控制弱点不再源自内部，而是来自业务运营依赖但未以内部系统同等严谨程度治理的第三方关系。",
"thirdParty.intro3": "董事会、监管机构、客户和外部审计师正在更加关注组织如何评估第三方网络暴露，尤其是在 AI 技术加速供应商集成速度和复杂性的背景下。",

"thirdParty.section1.title": "第三方风险已成为运营治理议题",
"thirdParty.section1.p1": "许多组织仍将第三方网络监督建立在定期风险评估和供应商准入评审之上。虽然这些活动仍然重要，但单靠它们已不再足够。",
"thirdParty.section1.p2": "第三方暴露现在深度嵌入日常运营。云服务商托管关键基础设施，SaaS 平台支持财务报告和运营流程，托管服务商保持对核心环境的特权访问。",
"thirdParty.section1.p3": "“已批准供应商”自动意味着“已批准 AI 使用”的假设，正在成为重要治理盲点。",
"thirdParty.section1.li1": "哪些第三方带来重大的网络或 AI 相关暴露",
"thirdParty.section1.li2": "这些供应商可以访问哪些系统和数据",
"thirdParty.section1.li3": "供应商平台是否嵌入 AI 功能",
"thirdParty.section1.li4": "供应商监督责任如何在内部分配",
"thirdParty.section1.li5": "有哪些控制用于持续监控风险变化",
"thirdParty.section1.p4": "这需要超越采购和合规职能的治理方法。网络与 AI 相关第三方暴露已成为企业风险管理的核心组成部分。",

"thirdParty.section2.title": "责任机制比组织预期更快失效",
"thirdParty.section2.p1": "第三方治理中最常见的长期弱点之一是责任归属不清。",
"thirdParty.section2.p2": "供应商关系通常同时涉及采购、法务、技术、安全、合规、运营和业务领导层。虽然职责在组织结构上看似明确，但运营层面的责任常常被分散。",
"thirdParty.section2.p3": "AI 供应商使这一问题更加复杂。组织正在越来越多地采用核心处理逻辑、模型行为或决策机制对客户部分不透明的技术。",
"thirdParty.section2.li1": "关键供应商关系的高管责任归属",
"thirdParty.section2.li2": "与运营使用相关的风险责任",
"thirdParty.section2.li3": "针对新兴问题的正式升级路径",
"thirdParty.section2.li4": "与 AI 功能变化相关的治理评审触发条件",
"thirdParty.section2.li5": "包括安全、法务、合规和运营的跨职能监督结构",
"thirdParty.section2.p4": "共享责任模型只有在责任保持明确时才有效。在许多组织中，它反而成为分散责任的机制。",

"thirdParty.section3.title": "实务型 AI 治理需要运营控制",
"thirdParty.section3.p1": "许多组织仍在概念层面处理 AI 治理。政策存在，原则已经起草，治理委员会定期开会，但底层运营控制往往仍不成熟或执行不一致。",
"thirdParty.section3.p2": "实务型 AI 治理要求组织建立控制，以验证 AI 技术如何被引入、监控和治理。",
"thirdParty.section3.li1": "AI 清单和分类流程",
"thirdParty.section3.li2": "部署前治理评审要求",
"thirdParty.section3.li3": "高风险用例的明确审批流程",
"thirdParty.section3.li4": "数据处理和保留标准",
"thirdParty.section3.li5": "重大决策的人为监督要求",
"thirdParty.section3.li6": "供应商变更的持续监控程序",
"thirdParty.section3.li7": "事件或控制失效的升级协议",
"thirdParty.section3.p3": "AI 治理不应作为与企业风险管理脱节的独立创新框架运行，而应作为现有治理原则的延伸，并以更高运营严谨性加以执行。",

"thirdParty.section4.title": "第三方尽职调查正在变得持续化",
"thirdParty.section4.p1": "过去，许多组织将供应商尽职调查视为一次性活动。供应商准入时执行评估，合同签署后，除非发生重大事件，监控活动会逐渐减弱。",
"thirdParty.section4.p2": "第三方环境现在持续演变。供应商引入新的 AI 能力、修改数据处理实践、扩大分包商使用、迁移基础设施或改变服务模式，其速度远超传统治理周期的监控设计。",
"thirdParty.section4.li1": "关键供应商的持续监控",
"thirdParty.section4.li2": "基于运营依赖的风险分级",
"thirdParty.section4.li3": "与技术变化相关的触发式再评估",
"thirdParty.section4.li4": "针对 AI 服务的强化治理评审",
"thirdParty.section4.li5": "更严格的文档和证据标准",
"thirdParty.section4.li6": "董事会层面对重大第三方暴露的可见性",
"thirdParty.section4.p3": "网络和 AI 相关风险不再是静态治理议题，而是需要持续可见性和再评估的动态运营风险。",

"thirdParty.section5.title": "在审查下，证据和文档将更加重要",
"thirdParty.section5.p1": "组织通常低估了监管机构、审计师、客户或法律相关方介入后，治理讨论会多快变成证据讨论。",
"thirdParty.section5.li1": "评估是否真正执行？",
"thirdParty.section5.li2": "问题是否被适当升级？",
"thirdParty.section5.li3": "审批是否有记录？",
"thirdParty.section5.li4": "部署前是否评估了 AI 相关风险？",
"thirdParty.section5.li5": "监控活动是否一致执行？",
"thirdParty.section5.li6": "例外是否得到有效整改？",
"thirdParty.section5.p2": "没有可辩护证据，治理主张会迅速变弱。",
"thirdParty.section5.li7": "证据保留要求",
"thirdParty.section5.li8": "文档标准",
"thirdParty.section5.li9": "评审程序",
"thirdParty.section5.li10": "升级记录",
"thirdParty.section5.li11": "例外管理跟踪",
"thirdParty.section5.li12": "治理委员会报告",
"thirdParty.section5.p3": "在审计或监管调查中有效应对的组织，往往不是治理框架最复杂的组织，而是能够清楚证明治理活动在一段时间内持续执行的组织。",

"thirdParty.final.title": "董事会应提出的问题",
"thirdParty.final.p1": "董事会不需要逐一评估每个供应商关系，但需要确信管理层了解重大第三方网络和 AI 暴露在哪里，以及治理实践是否跟得上运营依赖。",
"thirdParty.final.li1": "哪些第三方带来最高运营和监管暴露？",
"thirdParty.final.li2": "AI 功能通过哪些供应商平台被引入？",
"thirdParty.final.li3": "治理责任在内部如何分配？",
"thirdParty.final.li4": "哪些控制验证持续监督？",
"thirdParty.final.li5": "管理层能多快识别新兴第三方风险问题？",
"thirdParty.final.li6": "治理活动能否在外部审查下被证明？",
"thirdParty.final.p2": "更早建立有纪律治理结构的组织，将更有能力同时平衡创新、运营韧性和监管要求。",
"thirdParty.final.p3": "随着时间推移，最强的控制环境未必属于第三方依赖最少的组织，而更可能属于能够证明外部风险暴露受到与内部同等严谨治理的组织。",

"soxScaling.title": " ",
"soxScaling.subtitle": " ",

"soxScaling.intro1": "快速成长的组织很少因为缺乏人才或业务动能而困难。更常见的是，当运营增长超过支持财务报告、技术治理和控制执行流程的成熟度时，压力开始积累。",
"soxScaling.intro2": "进入这一阶段的多数组织并不是从零开始。审批流程已经存在，审查正在发生，财务和技术团队也以不同方式履行监督。",
"soxScaling.intro3": "最有效完成这一转型的组织通常较早意识到，SOX 准备不是增加合规层级，而是在复杂性进一步扩大之前标准化运营纪律。",

"soxScaling.section1.title": "审计摩擦通常在正式测试前就已经开始",
"soxScaling.section1.p1": "许多公司认为审计摩擦是在测试开始后才出现。实际上，压力通常在组织开始记录多年自然演变形成的流程时就已经出现。",
"soxScaling.section1.p2": "快速成长的企业天然追求速度。团队快速适应，职责频繁变化，流程持续演变以支持扩张。",
"soxScaling.section1.li1": "类似控制在不同团队中执行方式不同",
"soxScaling.section1.li2": "审批通过非正式沟通渠道完成",
"soxScaling.section1.li3": "关键审查活动依赖特定个人",
"soxScaling.section1.li4": "证据保留实践不一致",
"soxScaling.section1.li5": "技术变更未经过正式治理",
"soxScaling.section1.li6": "周期性控制责任归属不清",
"soxScaling.section1.p3": "外部审计师对一致性的评估不同于运营团队。实际运行良好的审查控制，如果按季度、审核人或业务单元执行方式不同，也可能在测试中产生问题。",

"soxScaling.section2.title": "控制责任需要比多数成长型公司预期更多的结构",
"soxScaling.section2.p1": "SOX 准备早期的压力点之一是责任结构。在快速成长组织中，职责常随业务扩张而扩大。",
"soxScaling.section2.p2": "许多组织发现自己有运营负责人，但没有明确的控制负责人。有人可能了解日常流程如何运作，但对执行、证据保留、升级和持续一致性的责任并不清晰。",
"soxScaling.section2.p3": "更有效进入成熟 SOX 环境的公司，通常会比最初预期更早建立责任结构。",

"soxScaling.section3.title": "复杂性增加时，执行节奏纪律变得更重要",
"soxScaling.section3.p1": "审计摩擦的另一个常见来源是执行时间不一致。在成长型组织中，运营优先级持续变化，重复性治理活动可能逐渐变成被动响应，而非有纪律地执行。",
"soxScaling.section3.p2": "从审计角度看，时间不一致通常意味着监督纪律和控制可靠性存在更大问题。",
"soxScaling.section3.li1": "明确的执行时间表",
"soxScaling.section3.li2": "标准化审查计划",
"soxScaling.section3.li3": "基于日历的认证活动",
"soxScaling.section3.li4": "延迟执行的升级程序",
"soxScaling.section3.li5": "定期管理层监督审查",
"soxScaling.section3.p3": "这些纪律一开始可能显得行政化，但在审计审查加强时会创造非常有价值的运营可预测性。",

"soxScaling.section4.title": "证据标准通常比控制设计更容易产生摩擦",
"soxScaling.section4.p1": "许多组织在准备 SOX 时高度关注控制设计，却低估了证据纪律的运营重要性。",
"soxScaling.section4.p2": "审查会发生，审批会完成，调节会准备，访问决策会作出，但支持证据可能存在于邮件、电子表格、消息平台、工单系统或未文档化流程中。",
"soxScaling.section4.li1": "必须保留哪些证据",
"soxScaling.section4.li2": "文档应存放在哪里",
"soxScaling.section4.li3": "审批可追溯性要求",
"soxScaling.section4.li4": "命名规则和保留期限",
"soxScaling.section4.li5": "证明审查完整性的标准",
"soxScaling.section4.li6": "记录例外的程序",
"soxScaling.section4.p3": "最有效管理审计的公司，通常是那些在业务扩张导致证据管理碎片化之前，就较早引入运营一致性的组织。",

"soxScaling.section5.title": "技术环境通常比治理流程扩展得更快",
"soxScaling.section5.p1": "在组织成长期间，技术复杂性往往迅速增加。ERP 实施、云迁移、SaaS 扩张、并购、自动化项目和不断变化的报告环境都会引入额外治理需求。",
"soxScaling.section5.p2": "在许多公司中，技术环境在运营层面比周边控制结构成熟得更快。",
"soxScaling.section5.li1": "访问治理不一致",
"soxScaling.section5.li2": "过度特权访问",
"soxScaling.section5.li3": "变更管理可追溯性薄弱",
"soxScaling.section5.li4": "系统责任归属不清",
"soxScaling.section5.li5": "接口监控不完整",
"soxScaling.section5.li6": "快速实施过程中引入的手工变通做法",
"soxScaling.section5.p3": "及早标准化访问管理、变更治理、文档要求和系统责任，通常能减少后续重大运营压力。",

"soxScaling.final.title": "公司应尽早标准化什么",
"soxScaling.final.p1": "组织经常询问何时应开始正式 SOX 准备。更有价值的问题是，在审计压力增强前应标准化哪些运营纪律。",

"soxScaling.final.ownership": "责任归属",
"soxScaling.final.ownership.li1": "明确的控制责任",
"soxScaling.final.ownership.li2": "定义清楚的审查职责",
"soxScaling.final.ownership.li3": "升级和授权程序",
"soxScaling.final.ownership.li4": "跨职能治理对齐",

"soxScaling.final.cadence": "执行节奏",
"soxScaling.final.cadence.li1": "标准化执行计划",
"soxScaling.final.cadence.li2": "基于日历的治理活动",
"soxScaling.final.cadence.li3": "及时审查要求",
"soxScaling.final.cadence.li4": "一致的监控例行机制",

"soxScaling.final.evidence": "证据",
"soxScaling.final.evidence.li1": "明确的文档标准",
"soxScaling.final.evidence.li2": "集中化保留实践",
"soxScaling.final.evidence.li3": "清晰的审批可追溯性",
"soxScaling.final.evidence.li4": "支持控制执行的可重复证据",

"soxScaling.final.p2": "延迟治理成熟的公司经常发现，SOX 准备比预期更具干扰性且更耗费资源。",
"soxScaling.final.p3": "最有效适应的组织，往往将控制标准化视为支持可持续增长的运营扩展要求，而不是单纯的合规项目。",

"boardRisk.title": " ",
"boardRisk.subtitle": " ",

"boardRisk.intro1": "许多组织并不缺少 IT 风险报告。仪表盘定期生成，运营指标持续跟踪，高管层经常收到关于网络安全活动、技术事件、合规项目、审计发现和整改工作的详细更新。",
"boardRisk.intro2": "然而，即便报告数量很多，董事会仍常常在治理讨论后无法清楚理解组织真实的技术风险暴露。",
"boardRisk.intro3": "问题很少是缺少数据。更多时候，问题在于报告过于运营化，而董事会需要支持监督判断、战略优先级和风险知情决策的信息。",
"boardRisk.intro4": "进展最快的组织正在从以活动量为中心的报告，转向以关键风险指标为中心的报告，以帮助董事会评估暴露、趋势、责任和决策准备度。",

"boardRisk.section1.title": "运营指标很少直接转化为监督洞察",
"boardRisk.section1.p1": "董事会报告中最常见的弱点之一，是认为更多运营细节会自动提升治理可见性。",
"boardRisk.section1.p2": "董事会可能收到关于漏洞数量、钓鱼演练、补丁统计、工单关闭率、审计活动、安全工具部署或合规比例的大量报告，却仍无法判断整体风险态势是在改善还是恶化。",
"boardRisk.section1.li1": "组织在哪些方面暴露正在增加？",
"boardRisk.section1.li2": "哪些风险超过既定容忍水平？",
"boardRisk.section1.li3": "整改活动是否有效降低重大暴露？",
"boardRisk.section1.li4": "哪些依赖关系形成集中风险？",
"boardRisk.section1.li5": "尽管有运营活动，治理缺口仍在哪里持续存在？",
"boardRisk.section1.li6": "哪些趋势需要战略关注而非战术管理？",
"boardRisk.section1.p3": "最强的治理报告环境认识到，董事会报告并不是运营报告的压缩版，而是一项独立治理纪律，需要不同框架、升级阈值和有效性衡量方式。",

"boardRisk.section2.title": "有效的 KRI 聚焦暴露，而非活动",
"boardRisk.section2.p1": "组织常将董事会报告指标称为 KRI，但实践中许多仍是在报告运营 KPI。",
"boardRisk.section2.p2": "关键绩效指标通常衡量执行效率、完成情况或管理活动。关键风险指标旨在帮助领导层评估变化中的暴露水平、新兴治理问题以及风险是否正在超出可接受边界。",
"boardRisk.section2.li1": "未解决高风险问题的集中程度",
"boardRisk.section2.li2": "关键整改活动的逾期情况",
"boardRisk.section2.li3": "支撑关键运营的第三方依赖",
"boardRisk.section2.li4": "不受支持或生命周期结束技术的增长",
"boardRisk.section2.li5": "特权访问暴露趋势",
"boardRisk.section2.li6": "高风险环境中控制例外频率",
"boardRisk.section2.li7": "跨业务单元重复出现的审计问题",
"boardRisk.section2.li8": "影响关键运营的重大网络安全事件",
"boardRisk.section2.li9": "与监管或韧性问题相关的升级趋势",
"boardRisk.section2.p3": "这些指标让董事会更好地看到风险趋势，而不仅仅是运营工作量。",
"boardRisk.section2.p4": "董事会通常从对持续治理弱点的透明报告中获得更多价值，而不是从强调活动完成率的精美仪表盘中获得价值。",

"boardRisk.section3.title": "董事会报告应明确责任",
"boardRisk.section3.p1": "IT 风险报告的另一个常见弱点，是缺少明确的责任可见性。",
"boardRisk.section3.li1": "哪些高管负责整改",
"boardRisk.section3.li2": "整改时间表是否仍然现实",
"boardRisk.section3.li3": "跨职能协调在哪里失败",
"boardRisk.section3.li4": "哪些风险在没有充分解决的情况下持续升级",
"boardRisk.section3.li5": "管理层是否正式接受特定暴露",
"boardRisk.section3.p2": "如果没有清晰的责任可见性，报告可能制造治理活动存在的表象，同时掩盖未解决的执行问题。",
"boardRisk.section3.li6": "重大风险的高管责任",
"boardRisk.section3.li7": "与未解决暴露相关的逾期分析",
"boardRisk.section3.li8": "整改延迟的升级阈值",
"boardRisk.section3.li9": "重复治理例外的可见性",
"boardRisk.section3.li10": "跨业务单元或技术领域的趋势分析",
"boardRisk.section3.li11": "战术整改与结构性风险降低之间的区分",
"boardRisk.section3.p3": "董事会不需要看到每一项运营整改活动，但需要足够透明度来判断管理层责任结构是否在复杂运营环境下有效运作。",

"boardRisk.section4.title": "报告成熟度取决于背景和叙述",
"boardRisk.section4.p1": "董事会报告中容易被忽视的方面之一是叙述质量。",
"boardRisk.section4.li1": "为什么风险暴露正在变化",
"boardRisk.section4.li2": "哪些趋势最重要",
"boardRisk.section4.li3": "问题是孤立的还是系统性的",
"boardRisk.section4.li4": "管理层如何优先安排应对工作",
"boardRisk.section4.li5": "哪些决策可能需要董事会关注",
"boardRisk.section4.p2": "强大的董事会报告环境会用简洁解释补充 KRI，说明运营意义，而不会用技术细节淹没董事。",
"boardRisk.section4.p3": "有效叙述应说明发生了什么变化、为什么重要、管理层如何应对，以及暴露是在改善、稳定还是恶化。",

"boardRisk.final.title": "董事会报告应支持治理决策",
"boardRisk.final.p1": "最终，有效的 IT 风险报告应帮助董事会作出更好的治理决策，而不仅仅是了解运营活动。",
"boardRisk.final.li1": "暴露趋势，而非活动数量",
"boardRisk.final.li2": "风险集中，而非孤立事件",
"boardRisk.final.li3": "责任清晰，而非泛泛归属",
"boardRisk.final.li4": "整改有效性，而非关闭统计",
"boardRisk.final.li5": "前瞻性指标，而非历史总结",
"boardRisk.final.li6": "需要升级或投资的治理决策",
"boardRisk.final.p2": "成功适应的组织，将能够把复杂运营风险环境转化为清晰的监督情报，支持知情治理决策，同时不对底层暴露作过度简化。",

"aiAudit.title": "",
"aiAudit.subtitle": " ",

"aiAudit.intro1": "许多组织仍将 AI 治理视为新兴项目。审计师则越来越将其视为运营现实。",
"aiAudit.intro2": "曾将 AI 治理视为未来事项的领导团队，现在正被问及关于责任、监督、文档和控制执行的实务问题。",
"aiAudit.intro3": "在许多环境中，管理层正在发现 AI 采用速度已经超过治理成熟度。",
"aiAudit.intro4": "各行业审计讨论中持续出现四个治理主题：清单管理、审批治理、持续监控和生命周期文档。",

"aiAudit.section1.title": "清单正成为 AI 治理的起点",
"aiAudit.section1.p1": "审计师越来越常问的第一个问题看似简单：组织中哪里正在使用 AI？",
"aiAudit.section1.p2": "AI 采用很少通过一个集中项目发生。业务团队独立试验生成式 AI 工具，技术团队将机器学习能力集成进应用，供应商在现有平台中加入 AI 功能。",
"aiAudit.section1.p3": "如果组织无法一致识别这些技术，就无法有效治理它们。",
"aiAudit.section1.li1": "AI 系统和使用案例的集中清单",
"aiAudit.section1.li2": "定义哪些 AI 属于“范围内”的标准",
"aiAudit.section1.li3": "与运营或监管影响相关的风险分类",
"aiAudit.section1.li4": "每项实施的责任归属",
"aiAudit.section1.li5": "验证清单完整性的定期评审流程",
"aiAudit.section1.p4": "最有效应对的组织通常将 AI 清单管理视为动态治理流程，而不是一次性文档工作。",

"aiAudit.section2.title": "审批治理需要超过非正式一致",
"aiAudit.section2.p1": "一旦组织识别 AI 使用，审计师接下来通常关注部署和审批活动周围的治理。",
"aiAudit.section2.p2": "经常缺失的是围绕风险评估和审批可追溯性的结构化治理。",
"aiAudit.section2.li1": "基于风险暴露的审批要求",
"aiAudit.section2.li2": "治理评审阈值",
"aiAudit.section2.li3": "风险接受决策责任",
"aiAudit.section2.li4": "较高风险实施的升级路径",
"aiAudit.section2.li5": "支持部署决策的文档",
"aiAudit.section2.p3": "强治理环境通过尽早建立实用审批结构来解决此问题，包括明确的评审要求、风险分级标准和实施决策责任。",

"aiAudit.section3.title": "监控控制正变得越来越重要",
"aiAudit.section3.p1": "清单和审批建立初始治理结构。监控决定治理是否随时间保持有效。",
"aiAudit.section3.p2": "AI 环境持续演变。模型变化，供应商引入新功能，数据输入变化，业务使用扩展，运营依赖增加。",
"aiAudit.section3.li1": "AI 系统变更",
"aiAudit.section3.li2": "持续的用户访问和权限",
"aiAudit.section3.li3": "数据使用和保留实践",
"aiAudit.section3.li4": "例外处理活动",
"aiAudit.section3.li5": "引入新 AI 能力的供应商更新",
"aiAudit.section3.li6": "事件或治理问题升级",
"aiAudit.section3.li7": "运营使用与批准范围之间的一致性",
"aiAudit.section3.p3": "有效监控控制不一定需要复杂工具，更常需要运营纪律、明确评审节奏、升级程序，以及随环境演变重新评估治理假设的责任。",

"aiAudit.section4.title": "生命周期文档在审计审查下变得关键",
"aiAudit.section4.p1": "组织经常低估审计开始后 AI 治理讨论会多快转变为文档讨论。",
"aiAudit.section4.li1": "初始风险评估",
"aiAudit.section4.li2": "审批和部署决策",
"aiAudit.section4.li3": "控制要求",
"aiAudit.section4.li4": "监控活动",
"aiAudit.section4.li5": "变更管理流程",
"aiAudit.section4.li6": "例外处理",
"aiAudit.section4.li7": "定期治理评审",
"aiAudit.section4.li8": "退役或停用决策",
"aiAudit.section4.p2": "碎片化文档会严重妨碍证明一致性、责任和监督可靠性。",
"aiAudit.section4.li9": "明确的证据保留标准",
"aiAudit.section4.li10": "集中化治理存储库",
"aiAudit.section4.li11": "文档责任归属",
"aiAudit.section4.li12": "审批和评审可追溯性要求",
"aiAudit.section4.li13": "证明控制执行的标准",
"aiAudit.section4.li14": "文档完整性定期验证",
"aiAudit.section4.p3": "生命周期文档可能成为区分具备运营治理成熟度的组织与仍主要依赖政策层面治理组织的最清晰指标之一。",

"aiAudit.final.title": "审计师最终评估什么",
"aiAudit.final.p1": "多数审计师并不期望组织消除所有 AI 相关风险。他们评估的是管理层是否建立了与组织运营暴露相匹配的治理纪律。",
"aiAudit.final.li1": "管理层是否知道 AI 存在于何处？",
"aiAudit.final.li2": "部署是否通过结构化审批进行治理？",
"aiAudit.final.li3": "控制是否随时间持续监控？",
"aiAudit.final.li4": "治理活动能否在系统生命周期中被证明？",
"aiAudit.final.li5": "责任结构是否足够清晰以支持问题整改？",
"aiAudit.final.p2": "务实推进 AI 治理的组织，在审查下通常比那些在部署大幅加速后才试图补建治理的组织表现更好。",
"aiAudit.final.p3": "随着时间推移，政策驱动治理与运营治理之间的差距将越来越明显。",

"sox30.title": " ",

"sox30.intro1": "当 SOX 时间表被压缩时，IT 几乎总会成为压力点。",
"sox30.intro2": "财务负责财务认定，但 IT 决定审计师是否能够真正依赖产生这些数字的系统。",
"sox30.intro3": "如果访问治理松散、变更执行不一致或数据流理解不足，财务控制即使文档完善，也难以被可靠依赖。",
"sox30.intro4": "在压缩时间表下，目标不是完美的合规成熟度，而是建立足够的结构和一致性，使审计师能够理解系统如何治理、控制如何运行以及谁对执行负责。",
"sox30.intro5": "在多数组织中，SOX 准备开始时这种清晰度尚未完全到位。",

"sox30.section1.title": "可见性通常是第一个限制，而不是控制",
"sox30.section1.p1": "初始挑战很少是缺少控制。多数组织已经以某种形式存在访问流程、变更流程、审批机制和运营审查。",
"sox30.section1.p2": "问题在于这些流程通常在成长过程中跨团队和系统独立演变。",
"sox30.section1.p3": "当试图回答一个基本问题时，这一点最明显：哪些系统真正影响财务报告？",
"sox30.section1.p4": "ERP 平台通常较清晰。复杂性出现在相邻应用、报告层、系统集成以及支持财务结账的手工流程周围。",
"sox30.section1.p5": "令领导层惊讶的是，许多非财务系统仍会通过数据转换、导出和手工调整影响财务结果。",
"sox30.section1.p6": "如果没有清晰并达成一致的范围视图，后续所有稳定工作都会更困难。",

"sox30.section2.title": "控制设计很少是真正的问题",
"sox30.section2.p1": "范围明确后，注意力自然转向 IT 一般控制。",
"sox30.section2.p2": "访问管理可能存在，但审批和审查实践在不同系统间可能不同。变更管理可能有文档，但紧急变更或小型生产更新有时在正式流程之外处理。",
"sox30.section2.p3": "问题不是控制是否存在，而是它们是否以可重复、可辩护的方式运行。",
"sox30.section2.p4": "在 SOX 环境中，不一致往往比缺失更成问题。",
"sox30.section2.p5": "审计师评估的不是意图，而是可靠性。",
"sox30.section2.p6": "摩擦往往从这里开始，尤其是那些在标准化治理要求前就已运营扩张的组织。",

"sox30.section3.title": "自动化改变控制风险的性质",
"sox30.section3.p1": "随着系统成熟，越来越多的财务控制执行被自动化。",
"sox30.section3.p2": "从效率角度看这通常是积极的，但它显著改变了治理要求。",
"sox30.section3.p3": "关注点从控制是否由人工执行，转向执行该控制的系统是否被适当配置、限制并随时间受到治理。",
"sox30.section3.p4": "一个反复出现的问题是，在没有充分理解系统输出如何生成或修改的情况下，过度依赖系统输出。",
"sox30.section3.p5": "这正是 IT 与财务对齐变得关键之处。财务关注结果，IT 必须关注产生这些结果的机制完整性。",
"sox30.section3.p6": "两种视角都必要，但 SOX 环境要求它们同步运作。",

"sox30.section4.title": "证据纪律决定审计效率",
"sox30.section4.p1": "SOX 准备中最容易被低估的方面之一是证据管理。",
"sox30.section4.p2": "控制可能正确运行，但如果证据不一致、碎片化或难以获取，该控制就难以在审计测试中被辩护。",
"sox30.section4.p3": "在许多组织中，证据存在于多个系统和沟通渠道中。",
"sox30.section4.p4": "单独来看这并不罕见。但整体来看，它会造成可避免的审计摩擦。",
"sox30.section4.p5": "核心问题不是存储，而是可预测性。",
"sox30.section4.p6": "审计师不仅需要知道证据存在，还需要知道证据能够随时间以可靠格式持续产生。",
"sox30.section4.p7": "有效管理 SOX 的组织通常会尽早标准化证据要求，包括保留什么、保存在哪里以及如何生成。",

"sox30.section5.title": "穿行测试揭示环境实际如何运行",
"sox30.section5.p1": "某个阶段，组织会从记录控制转向验证控制实际如何运行。",
"sox30.section5.p2": "通常，这时缺口会更加明显。",
"sox30.section5.p3": "显现出来的并不一定是缺少控制，而是团队、系统或个人之间执行方式的差异。",
"sox30.section5.p4": "常见问题通常出现在访问卫生、变更纪律和特权访问治理方面。",
"sox30.section5.p5": "这些发现内部通常并不意外。它们揭示的是运营可用性与审计就绪结构之间的差异。",
"sox30.section5.p6": "穿行测试的目的不是立即整改，而是明确环境哪里稳定、哪里依赖非正式执行模式。",

"sox30.section6.title": "领导层对齐成为转折点",
"sox30.section6.p1": "随着清晰度提升，讨论会从个别控制转向整体准备状态。",
"sox30.section6.p2": "在这一阶段，领导层需要整合视图，了解组织所处位置、存在的缺口以及进入正式测试前需要投入的工作。",
"sox30.section6.p3": "这时 CIO 与 CFO 的对齐至关重要。SOX 准备不是 IT 项目，而是共同责任。",
"sox30.section6.p4": "最重要的不是完美，而是对暴露、控制成熟度和准备趋势形成共同理解。",
"sox30.section6.p5": "在此阶段困难的组织，通常不是因为缺少控制，而是缺少对控制在环境中如何运行的统一视图。",

"sox30.section7.title": "多数组织低估工作量的领域",
"sox30.section7.p1": "快速成长环境中会反复出现一些模式。",
"sox30.section7.p2": "控制常被假设比实际更一致。特权访问风险经常被低估。快速增长期间变更纪律容易弱化。系统生成报告不一定受到足够严格治理。",
"sox30.section7.p3": "单独来看，这些问题很少立即导致失败。挑战在于累积效应。",

"sox30.final.title": "最终观点",
"sox30.final.p1": "IT SOX 准备无法仅靠文档或单独增加控制来实现。",
"sox30.final.p2": "当组织能够清楚解释系统如何治理、控制如何运行、证据如何随时间持续支持这些控制时，SOX 准备才真正实现。",
"sox30.final.p3": "最有效进入 SOX 环境的组织未必拥有最成熟的控制框架，而是具备足够清晰度、一致性和运营纪律，使审计师无需额外解释即可理解环境。",
"sox30.final.p4": "这种清晰度最终将 SOX 准备从摩擦点转变为可管理的治理流程。"
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

  },


ko: {
  /* Index */
  "nav.services": "서비스",
  "nav.approach": "접근 방식",
  "nav.insights": "인사이트",
  "nav.about": "소개",
  "nav.contact": "문의",
  "nav.cta": "상담 예약 →",

  "hero.title": '복잡함을 넘어<br><span class="accent">명확함으로</span>',
  "hero.lead1": "우리는 이사회와 C-레벨 경영진이 기업 리스크, 기술 및 사이버보안을 강화하고, 감사 준비성, 규제 신뢰도 및 운영 회복력을 높이는 통제 환경을 구축하도록 지원합니다",

  "hero.lead2": "기업, IT, 사이버 및 운영 프로세스 전반에 걸친 명확하고 방어 가능한 통제 프레임워크 리스크에 맞춰 합리화된 통제로 보증 수준을 유지하면서 복잡성을 줄입니다",
  "hero.lead3": "감사, 규제기관 및 이해관계자의 검토를 견딜 수 있는 증거 기준 자신 있는 의사결정, 책임성 및 확장 가능한 성장을 가능하게 하는 거버넌스 구조",

  "statement.headline": "감사 준비가 된 통제<br>이사회 수준의 신뢰",
  "statement.subtext": "불필요한 오버헤드 없이 Big Four 수준의 품질.<br><br>실질적이고 방어 가능한 결과를 통해 기업, 기술 및 사이버보안 리스크 환경을 강화합니다.<br><br>감사인, 규제기관 및 실제 환경의 검토를 견딜 수 있도록 설계된 비즈니스 중심 리스크 및 통제 프레임워크, 기술 거버넌스 및 AI 감독.<br><br>더 단순한 통제 설계. 더 강력한 증거. 더 적은 예기치 못한 문제.",
  "trust.item1": "리스크 자문",
  "trust.item2": "내부 감사",
  "trust.item3": "사이버보안",
"trust.item4": "재무 관리",

  "services.heading": "핵심 자문 서비스",
  "services.card1.title": "리스크 자문",
"services.card1.text": "리더십이 위험 의사결정을 전략, 규제 요구사항 및 운영 회복탄력성과 연계할 수 있도록 지원하는 엔터프라이즈 리스크, 기술 리스크, 운영 리스크, 사이버보안 및 거버넌스 지원",

"services.card2.title": "내부감사 및 재무 관리",
  "services.card2.text": "내부 통제, SOX, ICFR, 예산 관리, 재무 운영 및 보고 프로세스에 중점을 둔 내부 감사 및 재무 관리 자문 서비스를 통해 거버넌스를 강화하고 재무 가시성을 향상시키며 감사 및 운영 리스크를 완화합니다.",

  "services.card3.title": "사이버보안",
  "services.card3.text": "운영을 보호하고 규정 준수를 지원하는 ID, 접근, 클라우드, 애플리케이션, 데이터 및 제3자 리스크 통제에 중점을 둔 비즈니스 연계 사이버보안 자문",

  "common.learnMore": "자세히 보기",
  "band.leftTitle": "리스크 노출에서",
  "band.big": '<span class="accent">리스크 신뢰로</span>',
  "band.link": "우리의 접근 방식 보기",
  "why.title": "Primevant를 선택하는 이유",
  "why.reason1.title": "Big 4 수준의 품질 기준.",
  "why.reason1.text": "방법론 기반.<br>감사에 방어 가능.",
  "why.reason2.title": "부티크형 민첩성.",
  "why.reason2.text": "직접적인 파트너 참여.<br>더 빠른 의사결정.",
  "why.reason3.title": "경영진 중심의 실행.",
  "why.reason3.text": "이사회 수준의 인사이트.<br>운영 소음이 아닙니다.",
  "footer.privacy": "개인정보 보호",

  /* Services */
  "services.heroTitle": "비즈니스 중심 <br>기업 리스크 및<br><span style='color:var(--blue2)'>통제 자문</span>.",
  "services.heroLead": "우리는 조직이 강력한 거버넌스를 구축하고 리스크를 명확하고 실행 가능한 결과로 전환하여 경영진의 명확성과 자신 있고 방어 가능한 의사결정을 가능하게 하도록 지원합니다.",
  "services.sectionTitle": "서비스 라인",

  "services.sox.title": "리스크 자문",
  "services.sox.subtitle": "기업, 운영, 재무 및 기술 리스크를 비즈니스 전략에 맞춥니다",
  "services.sox.desc": "핵심 초점",
  "services.sox.offeringsTitle": "대표 서비스",
  "services.sox.b1": "기업 리스크 관리(ERM)",
  "services.sox.b2": "운영 및 재무 리스크 평가",
  "services.sox.b4": "전환 리스크(ERP, M&A, 신제품)",
  "services.sox.b5": "규제 및 컴플라이언스 리스크",
  "services.sox.b7": "기업 SOX 준비 및 개선 스프린트",
  "services.sox.b8": "기업 및 프로세스 수준 리스크 평가",
  "services.sox.b10": "SOC 2 준비, 평가 및 감사 지원",
  "services.sox.b12": "AI 거버넌스 및 통제 자문(정책 + 감독)",
  "services.sox.b13": "제3자 리스크 관리",

"services.opt.title": "내부감사 및 재무 관리",
  "services.opt.subtitle": "비즈니스 프로세스와 IT 시스템 전반에서 감사 준비가 된 통제 환경을 설계하고 유지합니다",
  "services.opt.desc": "핵심 초점",
  "services.opt.offeringsTitle": "대표 서비스",
  "services.opt.b1": "SOX / ICFR(비즈니스 + IT 통제)",
  "services.opt.b2": "내부 감사 전환 및 공동 수행",
  "services.opt.b3": "비즈니스 프로세스 통제(R2R, O2C, P2P, 재고, 급여)",
  "services.opt.b4": "ITGC 및 애플리케이션 통제",
  "services.opt.b5": "감사 준비 및 개선",
  "services.opt.b7": "시스템 구축 검토(가동 전/후)",
  "services.opt.b8": "SOX 프로그램 설계 및 실행",
  "services.opt.b9": "비즈니스 프로세스 워크스루 및 통제 설계",
  "services.opt.b10": "ERP 통제 프레임워크(SAP, Oracle, Workday) 합리화 및 최적화",

  "services.itgc.title": "사이버보안",
  "services.itgc.subtitle": "안전하고 회복력 있는 기술 환경을 통해 비즈니스 운영과 재무 무결성을 보호합니다",
  "services.itgc.desc": "핵심 초점",
  "services.itgc.offeringsTitle": "대표 서비스",
  "services.itgc.b1": "비즈니스 영향에 맞춘 사이버 리스크",
  "services.itgc.b2": "ID, 접근 및 권한 통제",
  "services.itgc.b3": "클라우드 및 SaaS 리스크(재무 데이터, 보고 시스템)",
  "services.itgc.b4": "애플리케이션 및 데이터 보안",
  "services.itgc.b5": "SOX 및 규제 준수를 지원하는 기술 리스크",
  "services.itgc.b6": "보안 아키텍처 및 리스크 평가",
  "services.itgc.b7": "IAM / 권한 접근 거버넌스",
  "services.itgc.b8": "정보보안 및 리스크 평가(ISO 27001, NIST CSF 및 기타 프레임워크)",
  "services.itgc.b9": "데이터 무결성 및 보호 전략",
  "services.itgc.b13": "SOX / ICFR에 맞춘 보안 통제",

  "services.cta": "산업별 규제 관점을 원하시나요? <span>산업 보기</span> →",

  "services.models.title": "참여 모델",
  "services.models.m1": "고정 수수료 스프린트 - 정의된 결과와 빠른 실행에 가장 적합합니다. 마일스톤과 명확한 산출물 목록이 포함됩니다.",
  "services.models.m2": "상한형 T&M - 복잡성이 달라지는 개선 작업에 적합합니다. 합의된 상한과 주간 비용 가시성이 포함됩니다.",
  "services.models.m3": "리테이너 - 제한된 시간, 응답 기대사항 및 분기별 계획을 포함한 지속적 자문.",

  "services.addons.title": "선택적 추가 서비스(안정화 이후)",
  "services.addons.intro": "IT 통제 기반이 안정화되면 Primevant Advisory는 인접한 리스크 우선순위를 지원할 수 있습니다.",
  "services.addons.a1": "사이버 리스크 평가 및 거버넌스",
  "services.addons.a2": "제3자 리스크 지원(SOC 보고서 검토, 통제 매핑)",
  "services.addons.a3": "AI 거버넌스 및 통제 자문(정책 + 감독)",

  /* Industries */
  "industries.kicker": "산업",
  "industries.heroTitle": "귀사의 산업이 실제로 운영되는 방식에 맞춘<br><span>규제 관점</span>.",
  "industries.heading": "우리가 지원하는 산업",
  "industries.intro": "Primevant Advisory는 강력한 거버넌스, 회복력 있는 시스템 및 감사 준비가 된 통제가 필수적인 고도로 규제되고 기술 중심적인 산업 전반의 조직을 지원합니다. 우리의 경험은 복잡한 기업 환경 전반의 리스크와 통제, 사이버보안 거버넌스, 개인정보보호 의무 및 규제 준수를 포함합니다.<br><br>우리는 리더십 팀과 협력하여 규제 기대사항을 리스크 감독과 운영 회복력을 강화하는 실질적이고 지속 가능한 통제 환경으로 전환합니다.",

  "industries.fs.title": "금융 서비스",
  "industries.fs.text": "Primevant Advisory는 금융기관이 SOX, GLBA, FFIEC 지침 및 PCI DSS와 같은 감독 기대사항 및 프레임워크에 리스크와 사이버보안 거버넌스를 맞추도록 지원하며, 재무보고 무결성, 운영 회복력 및 고객 신뢰를 지원하는 통제를 강화합니다.",

  "industries.healthcare.title": "헬스케어",
  "industries.healthcare.text": "Primevant Advisory는 의료기관이 HIPAA 개인정보보호 및 보안 기대사항에 맞춘 거버넌스와 보안 관행을 강화하도록 지원하여 민감한 환자 정보를 보호하고 핵심 임상 시스템의 신뢰성과 연속성을 보장하도록 돕습니다.",

  "industries.saas.title": "기술 / SaaS",
  "industries.saas.text": "Primevant Advisory는 기술 및 SaaS 조직이 SOC 보고 및 ISO 기반 보안 프로그램과 같은 산업 보증 프레임워크에 거버넌스, 리스크 관리 및 보안 관행을 맞추도록 지원하여 개인정보보호 준수, 운영 회복력 및 고객 신뢰를 지원하는 확장 가능한 통제 환경을 가능하게 합니다.",

  "industries.manufacturing.title": "제조",
  "industries.manufacturing.text": "Primevant Advisory는 제조 조직이 기업 IT 및 운영기술 환경 전반의 거버넌스와 사이버보안을 강화하여 통제 환경, 운영 회복력, 지식재산 보호 및 안전하고 신뢰할 수 있는 생산 시스템을 지원하도록 돕습니다.",

  "industries.retail.title": "소비재 / 리테일",
  "industries.retail.text": "Primevant Advisory는 소비재 및 리테일 조직이 리스크 거버넌스, 결제 보안 및 데이터 보호 관행을 강화하여 안전한 디지털 상거래, 규제 준수 및 지속적인 고객 신뢰를 지원하도록 돕습니다.",

  "industries.other.title": "기타 규제 환경",
  "industries.other.text": "Primevant Advisory는 규제 환경에서 운영되는 조직이 거버넌스와 사이버보안 관행을 산업별 규제 기대사항 및 연방 보안 프레임워크에 맞추면서 회복력 있고 감사 준비가 된 통제 프로그램을 구축하도록 지원합니다.",

  /* Approach */
  "approach.heroTitle": "빠르게 실행<br><span style='color:var(--blue2)'>안전한 제공<br></span>명확한 범위.",
  "approach.heroLead": "부티크 속도와 Big 4 수준의 엄격함, 이사회용 산출물, 감사에 방어 가능한 문서화 및 지속 가능한 실행 리듬.",

  "approach.sectionTitle": "Primevant 제공 모델",

  "approach.assess.title": "평가",
  "approach.assess.text": "현재 상태, 주요 리스크 및 이해관계자 기대사항을 확인하고 방어 가능한 통제와 증거로 가는 가장 빠른 경로를 정의합니다 <br><br>산출물: 범위 메모, 일정, 산출물, 증거 기대사항",

  "approach.align.title": "정렬",
  "approach.align.text": "범위 확대를 방지하기 위해 포함/제외 범위, 이해관계자 역할 및 변경 통제를 명확히 설정합니다.<br><br>산출물: 킥오프 계획, RAID 로그, 주간 상태 보고 리듬",

  "approach.deliver.title": "제공",
  "approach.deliver.text": "감사 준비가 된 문서화와 실질적인 개선 지원을 통해 마일스톤에 맞춰 실행합니다.<br><br>산출물: 업데이트된 RCM/내러티브, 증거 플레이북, 개선 추적기",

  "approach.sustain.title": "지속",
  "approach.sustain.text": "진전이 과제 종료 후에도 유지되도록 클라이언트 팀에 템플릿, 기준 및 지식 이전을 제공합니다.<br><br>산출물: 운영 리듬, 교육 노트, 인수인계 체크리스트",

  "approach.security.title": "보안 및 기밀성",
  "approach.security.text": "Primevant는 고객 정보를 신중하게 처리합니다. 과제는 보안 저장소, 최소 권한 접근 및 정의된 보존 관행을 사용합니다.<br><br>필요 시 고객 보안 요구사항 및 벤더 온보딩 프로세스에 맞출 수 있습니다.",

  "approach.communication.title": "커뮤니케이션",
  "approach.communication.text": "고객은 진행 상황, 리스크, 필요한 의사결정 및 다음 단계를 포함한 명확한 주간 상태 업데이트를 받습니다.<br><br>기본 리듬: 주간 상태 보고 + 필요 시 워킹 세션.",

  /* Insights */
  "insights.heroCta": "Primevant 인사이트",
  "insights.title": "리스크 명확성<br><span style='color:var(--blue2)'>통제 인사이트</span><br>경영진의 신뢰",
  "insights.lede": "명확성, 통제 및 신뢰를 추구하는 CFO, CIO, CISO 및 내부감사 리더를 위해 설계된 기업 리스크, 기술 및 통제에 관한 실질적 인사이트.",
  "insights.p1.title": "30일 안에 SOX 준비",
  "insights.p1.text": "범위, 내러티브, 워크스루, 증거 기준 및 개선 추적에 대한 현실적인 순서.",
  "insights.read": "게시물 읽기 →",

  "insights.p2.title": "AI 거버넌스 및 통제 준비: 이사회가 실제로 필요로 하는 것",
  "insights.p2.text": "조직이 실질적인 AI 거버넌스를 구축하고 책임성을 정의하며 혁신, 리스크 및 규제 기대사항의 균형을 맞추는 통제를 구현하는 방법.",

  "insights.p3.title": "사이버 리스크 및 제3자 노출: 기업 통제 환경의 가장 약한 연결고리 강화",
  "insights.p3.text": "일회성 평가를 넘어 지속적이고 리스크에 맞춘 감독으로 이동하면서 기업 전반의 사이버 및 벤더 리스크를 식별, 평가 및 관리하는 방법.",
  "insights.coming": "곧 공개 →",

  "insights.featured": "추천",

  "insights.f1.title": "빠르게 성장하는 조직의 SOX 준비",
  "insights.f1.text": "감사 마찰이 발생하는 지점과 조기에 표준화해야 할 요소(소유자, 리듬, 증거).",

  "insights.f2.title": "IT 리스크 거버넌스를 위한 이사회 보고",
  "insights.f2.text": "운영 지표에서 감독 의사결정을 지원하는 이사회 수준의 KRI로 전환합니다.",

  "insights.f3.title": "감사인이 요구할 AI 거버넌스 통제",
  "insights.f3.text": "통제 주제: 인벤토리, 승인, 모니터링 및 수명주기 문서화.",

  "insights.readPost": "게시물 읽기",

  "aiGov.title": "",
  "aiGov.subtitle": " ",

  "aiGov.intro1": "인공지능은 대부분의 거버넌스 구조가 수용하도록 설계된 속도보다 더 빠르게 발전하고 있습니다. 여러 산업의 조직들은 분석, 운영, 고객 참여, 소프트웨어 개발 및 의사결정 프로세스에 AI를 도입하고 있으며, 그 속도는 주변 통제 환경의 성숙도를 초과하는 경우가 많습니다.",
  "aiGov.intro2": "이사회도 이에 대응하고 있습니다. 리더십 팀은 이제 AI 도입과 관련된 책임성, 감독, 규제 노출 및 운영 리스크에 대한 직접적인 질문을 받고 있습니다.",
  "aiGov.intro3": "대부분의 조직이 AI 거버넌스 문제를 겪는 이유는 정책이나 원칙이 없어서가 아닙니다. 운영 규율이 부족하기 때문입니다.",

  "aiGov.section1.title": "거버넌스는 범위에서 시작됩니다",
  "aiGov.section1.p1": "AI 거버넌스의 가장 초기 실패 중 하나는 식별 단계에서 발생합니다. 조직은 AI가 실제로 비즈니스 전반에서 어디에서 작동하는지 파악하는 것이 얼마나 어려운지 과소평가하는 경우가 많습니다.",
  "aiGov.section1.p2": "AI 도입은 하나의 중앙화된 이니셔티브를 통해 조직에 들어오는 경우가 드뭅니다. 부서, 플랫폼, 벤더 도구 및 비즈니스 주도 실험 전반에서 점진적으로 나타납니다.",
  "aiGov.section1.p3": "경영진이 AI가 비즈니스 활동에 영향을 미치는 위치를 자신 있게 식별할 수 없다면 의미 있는 감독은 불가능합니다.",
  "aiGov.section1.li1": "AI가 “범위 내”에 해당하는지 판단하는 명확한 기준",
  "aiGov.section1.li2": "AI 지원 시스템 및 사용 사례의 중앙화된 인벤토리",
  "aiGov.section1.li3": "정의된 소유권 책임",
  "aiGov.section1.li4": "운영 및 규제 노출에 맞춘 리스크 등급 기준",
  "aiGov.section1.li5": "고위험 구현에 대한 에스컬레이션 기준",
  "aiGov.section1.p4": "거버넌스 범위는 내부 개발 모델을 넘어 확장되어야 합니다. 오늘날 가장 중요한 노출 중 일부는 AI 기능이 내장된 제3자 플랫폼에서 발생합니다.",

  "aiGov.section2.title": "내러티브는 통제 테스트보다 빠르게 약점을 드러냅니다",
  "aiGov.section2.p1": "범위가 설정되면 조직은 종종 곧바로 통제 평가로 이동합니다. 실제로 가장 가치 있는 거버넌스 활동 중 하나는 훨씬 덜 기술적인 운영 내러티브 개발입니다.",
  "aiGov.section2.p2": "잘 개발된 내러티브는 비즈니스 이해관계자, 기술팀, 컴플라이언스 기능 및 리더십 간의 정렬을 강제합니다.",
  "aiGov.section2.li1": "AI 프로세스의 비즈니스 목적",
  "aiGov.section2.li2": "관련 시스템, 데이터 소스 및 의존성",
  "aiGov.section2.li3": "의사결정 지점 및 인간 감독 활동",
  "aiGov.section2.li4": "자동화 또는 모델 사용으로 도입되는 리스크",
  "aiGov.section2.li5": "해당 리스크를 완화하기 위한 통제 활동",
  "aiGov.section2.li6": "책임성과 에스컬레이션 책임",
  "aiGov.section2.li7": "실행을 통해 생성되는 증거",
  "aiGov.section2.p3": "내러티브는 기술 및 비기술 이해관계자 간의 공통 언어를 만듭니다. 이사회는 머신러닝 아키텍처의 세부사항이 아니라 거버넌스 책임이 어떻게 실행되고 있는지에 대한 가시성이 필요합니다.",

  "aiGov.section3.title": "워크스루는 거버넌스가 실제로 존재하는지 드러냅니다",
  "aiGov.section3.p1": "정책은 의도를 설명합니다. 워크스루는 현실을 드러냅니다.",
  "aiGov.section3.p2": "조직은 워크스루 중 거버넌스 모델이 운영 실행보다 발표 자료에서 더 명확히 존재한다는 사실을 자주 발견합니다.",
  "aiGov.section3.li1": "AI 시스템이 운영 환경으로 이동하는 방식",
  "aiGov.section3.li2": "승인 및 변경 관리 활동",
  "aiGov.section3.li3": "인간 검토 및 재정의 메커니즘",
  "aiGov.section3.li4": "데이터 검증 절차",
  "aiGov.section3.li5": "모니터링 및 예외 관리",
  "aiGov.section3.li6": "접근 통제 및 직무 분리 관행",
  "aiGov.section3.li7": "사고 에스컬레이션 프로세스",
  "aiGov.section3.li8": "문서 보존 기대사항",
  "aiGov.section3.p3": "이사회는 워크스루를 단순한 감사 절차가 아니라 거버넌스 검증 활동으로 보아야 합니다.",

  "aiGov.section4.title": "증거 기준은 핵심 거버넌스 이슈가 되고 있습니다",
  "aiGov.section4.p1": "AI 감독이 성숙해짐에 따라 거버넌스 대화는 점점 더 증거 대화가 됩니다.",
  "aiGov.section4.p2": "조직은 검토, 승인, 모니터링 활동 및 감독 절차를 일관되게 수행할 수 있지만, 이러한 활동을 신뢰할 수 있는 증거로 입증할 수 없다면 통제 환경을 방어하기 어렵습니다.",
  "aiGov.section4.li1": "어떤 문서를 보존해야 하는지",
  "aiGov.section4.li2": "증거가 어디에 보관되는지",
  "aiGov.section4.li3": "보존에 대한 소유 책임",
  "aiGov.section4.li4": "보존 기간",
  "aiGov.section4.li5": "통제 실행을 증거화하는 기준",
  "aiGov.section4.li6": "증거 무결성 검증 절차",
  "aiGov.section4.p3": "이사회는 모든 운영 산출물에 대한 가시성이 필요한 것은 아닙니다. 경영진의 거버넌스 주장을 외부 검토 아래에서도 뒷받침할 수 있는 증거 관행이 있다는 신뢰가 필요합니다.",

  "aiGov.section5.title": "개선 규율이 거버넌스 신뢰성을 결정합니다",
  "aiGov.section5.p1": "어떤 거버넌스 환경도 통제 격차나 운영 불일치에서 자유롭지 않습니다. 성숙한 조직과 준비되지 않은 조직을 구분하는 것은 경영진이 문제를 조기에 식별하고, 책임을 명확히 부여하며, 결함을 규율 있게 개선할 수 있는지입니다.",
  "aiGov.section5.li1": "정의되지 않은 소유 구조",
  "aiGov.section5.li2": "일관되지 않은 승인",
  "aiGov.section5.li3": "불완전한 문서화",
  "aiGov.section5.li4": "약한 모니터링 관행",
  "aiGov.section5.li5": "제3자 감독 격차",
  "aiGov.section5.li6": "데이터 거버넌스 우려",
  "aiGov.section5.li7": "정책 요구사항과 운영 실행 간의 불일치",
  "aiGov.section5.p2": "이사회는 사업부 전반에서 반복되는 문제에 주목해야 합니다. 반복적인 예외는 일반적으로 개별 운영 실패가 아니라 거버넌스 설계의 더 광범위한 약점을 나타냅니다.",

  "aiGov.final.title": "이사회가 실제로 필요로 하는 것",
  "aiGov.final.p1": "대부분의 이사회는 인공지능 전문가가 되려는 것이 아닙니다. 경영진이 AI를 책임 있게 배포하고 외부 검토 아래에서도 그 관행을 방어할 수 있을 만큼 충분한 운영 규율을 구축했는지 판단하려는 것입니다.",
  "aiGov.final.p2": "이를 위해서는 AI가 어디에 존재하는지에 대한 가시성, 책임성에 대한 명확성, 통제가 일관되게 운영된다는 증거, 그리고 문제가 중대한 사건이 되기 전에 드러난다는 신뢰가 필요합니다.",
  "aiGov.final.li1": "범위 정의",
  "aiGov.final.li2": "운영 내러티브 개발",
  "aiGov.final.li3": "워크스루를 통한 실행 검증",
  "aiGov.final.li4": "증거 기대사항 표준화",
  "aiGov.final.li5": "규율 있는 개선 추적 구현",
  "aiGov.final.p3": "성공적으로 적응하는 조직은 반드시 AI 도입 속도가 가장 빠른 조직은 아닐 것입니다. 오히려 거버넌스 성숙도가 도입 이후가 아니라 도입과 함께 발전했음을 입증할 수 있는 조직일 가능성이 높습니다.",

  "thirdParty.title": "",
  "thirdParty.subtitle": "점점 더 상호 연결되는 환경에서 AI 거버넌스, 책임성 및 방어 가능한 통제를 구축하기 위한 실질적 접근 방식",

  "thirdParty.intro1": "대부분의 조직은 더 이상 명확히 정의된 기술 경계 안에서 운영되지 않습니다. 핵심 비즈니스 운영은 이제 클라우드 제공업체, 소프트웨어 플랫폼, 관리형 서비스 제공업체, 데이터 처리업체, AI 지원 벤더 및 외부 개발 파트너로 구성된 확장된 네트워크에 의존합니다.",
  "thirdParty.intro2": "많은 조직에서 가장 중요한 통제 약점은 더 이상 내부에서 시작되지 않습니다. 비즈니스가 운영상 의존하지만 내부 시스템과 동일한 엄격함으로 완전히 관리하지 않는 제3자 관계를 통해 나타납니다.",
  "thirdParty.intro3": "이사회, 규제기관, 고객 및 외부 감사인은 특히 AI 지원 기술이 벤더 통합의 속도와 복잡성을 가속화함에 따라 조직이 제3자 사이버 노출을 평가하는 방식에 더 큰 주의를 기울이고 있습니다.",

  "thirdParty.section1.title": "제3자 리스크는 운영 거버넌스 이슈가 되었습니다",
  "thirdParty.section1.p1": "많은 조직은 여전히 정기적인 리스크 평가와 벤더 온보딩 검토를 중심으로 제3자 사이버 감독을 구성합니다. 이러한 활동은 여전히 중요하지만, 그 자체만으로는 더 이상 충분하지 않습니다.",
  "thirdParty.section1.p2": "제3자 노출은 이제 일상 운영에 깊이 내재되어 있습니다. 클라우드 제공업체는 핵심 인프라를 호스팅하고, SaaS 플랫폼은 재무보고와 운영 워크플로를 지원하며, 관리형 서비스 제공업체는 핵심 환경에 대한 권한 접근을 유지합니다.",
  "thirdParty.section1.p3": "“승인된 벤더”가 자동으로 “승인된 AI 사용”을 의미한다는 가정은 의미 있는 거버넌스 사각지대가 되고 있습니다.",
  "thirdParty.section1.li1": "어떤 제3자가 중요한 사이버 또는 AI 관련 노출을 도입하는지",
  "thirdParty.section1.li2": "그 벤더들이 어떤 시스템과 데이터에 접근할 수 있는지",
  "thirdParty.section1.li3": "AI 기능이 벤더 플랫폼 내에 내장되어 있는지",
  "thirdParty.section1.li4": "벤더 감독에 대한 내부 책임이 어떻게 부여되는지",
  "thirdParty.section1.li5": "시간에 따라 변화하는 리스크를 모니터링하기 위해 어떤 통제가 존재하는지",
  "thirdParty.section1.p4": "이는 조달 및 컴플라이언스 기능을 넘어서는 거버넌스 접근 방식을 요구합니다. 사이버 및 AI 관련 제3자 노출은 이제 기업 리스크 관리의 핵심 영역입니다.",

  "thirdParty.section2.title": "책임성은 조직이 예상하는 것보다 더 빠르게 무너집니다",
  "thirdParty.section2.p1": "제3자 거버넌스에서 가장 지속적인 약점 중 하나는 불명확한 소유권입니다.",
  "thirdParty.section2.p2": "벤더 관계는 종종 조달, 법무, 기술, 보안, 컴플라이언스, 운영 및 비즈니스 리더십을 동시에 가로지릅니다. 책임이 조직적으로 정의된 것처럼 보일 수 있지만, 운영상 책임성은 자주 분산됩니다.",
  "thirdParty.section2.p3": "AI 지원 벤더는 이를 더욱 복잡하게 만들고 있습니다. 조직은 핵심 처리 로직, 모델 동작 또는 의사결정 메커니즘이 고객에게 부분적으로 불투명한 기술을 점점 더 채택하고 있습니다.",
  "thirdParty.section2.li1": "핵심 벤더 관계에 대한 경영진 소유권",
  "thirdParty.section2.li2": "운영 사용과 연결된 리스크 책임성",
  "thirdParty.section2.li3": "새롭게 나타나는 우려에 대한 공식 에스컬레이션 경로",
  "thirdParty.section2.li4": "AI 기능 변경과 연결된 거버넌스 검토 트리거",
  "thirdParty.section2.li5": "보안, 법무, 컴플라이언스 및 운영을 포함한 교차 기능 감독 구조",
  "thirdParty.section2.p4": "공유 책임 모델은 책임성이 명확하게 유지될 때만 작동합니다. 많은 조직에서 이는 책임을 분산시키는 장치가 됩니다.",

  "thirdParty.section3.title": "실질적인 AI 거버넌스에는 운영 통제가 필요합니다",
  "thirdParty.section3.p1": "많은 조직은 여전히 AI 거버넌스를 개념 수준에서 접근하고 있습니다. 정책은 존재합니다. 원칙도 작성되었습니다. 거버넌스 위원회도 정기적으로 회의합니다. 그러나 그 아래의 운영 통제는 여전히 미성숙하거나 일관되지 않게 구현되는 경우가 많습니다.",
  "thirdParty.section3.p2": "실질적인 AI 거버넌스는 AI 지원 기술이 운영상 어떻게 도입되고, 모니터링되며, 관리되는지 검증할 수 있는 통제를 조직이 구축할 것을 요구합니다.",
  "thirdParty.section3.li1": "AI 인벤토리 및 분류 프로세스",
  "thirdParty.section3.li2": "배포 전 거버넌스 검토 요구사항",
  "thirdParty.section3.li3": "고위험 사용 사례를 위한 정의된 승인 워크플로",
  "thirdParty.section3.li4": "데이터 처리 및 보존 기준",
  "thirdParty.section3.li5": "중요 의사결정을 위한 인간 감독 요구사항",
  "thirdParty.section3.li6": "벤더 변경에 대한 지속적 모니터링 절차",
  "thirdParty.section3.li7": "사고 또는 통제 실패에 대한 에스컬레이션 프로토콜",
  "thirdParty.section3.p3": "AI 거버넌스는 기업 리스크 관리와 분리된 별도의 혁신 프레임워크로 운영되어서는 안 됩니다. 이는 기존 거버넌스 원칙을 더 큰 운영 엄격함으로 적용한 확장이어야 합니다.",

  "thirdParty.section4.title": "제3자 실사는 지속적인 활동이 되고 있습니다",
  "thirdParty.section4.p1": "역사적으로 많은 조직은 벤더 실사를 일회성 활동으로 접근했습니다. 온보딩 중 평가가 수행되고, 계약이 체결되며, 중대한 사고가 발생하지 않는 한 모니터링 활동은 시간이 지날수록 약화되었습니다.",
  "thirdParty.section4.p2": "제3자 환경은 이제 지속적으로 진화합니다. 벤더는 새로운 AI 기능을 도입하고, 데이터 처리 관행을 변경하며, 하청업체 사용을 확대하고, 인프라를 이전하거나, 기존 거버넌스 주기가 모니터링하도록 설계된 속도보다 훨씬 빠르게 서비스 모델을 변경합니다.",
  "thirdParty.section4.li1": "핵심 벤더의 지속적 모니터링",
  "thirdParty.section4.li2": "운영 의존도에 기반한 리스크 등급",
  "thirdParty.section4.li3": "기술 변경과 연결된 트리거 기반 재평가",
  "thirdParty.section4.li4": "AI 지원 서비스에 대한 강화된 거버넌스 검토",
  "thirdParty.section4.li5": "더 엄격한 문서화 및 증거 기준",
  "thirdParty.section4.li6": "중요한 제3자 노출에 대한 이사회 수준 가시성",
  "thirdParty.section4.p3": "사이버 및 AI 관련 리스크는 더 이상 정적인 거버넌스 이슈가 아닙니다. 지속적인 가시성과 재평가가 필요한 동적인 운영 리스크입니다.",

  "thirdParty.section5.title": "외부 검토 아래에서는 증거와 문서화가 더 중요해집니다",
  "thirdParty.section5.p1": "조직은 규제기관, 감사인, 고객 또는 법무 이해관계자가 관여하면 거버넌스 대화가 얼마나 빠르게 증거 대화로 전환되는지 과소평가하는 경우가 많습니다.",
  "thirdParty.section5.li1": "평가가 실제로 수행되었는가?",
  "thirdParty.section5.li2": "우려사항이 적절히 에스컬레이션되었는가?",
  "thirdParty.section5.li3": "승인이 문서화되었는가?",
  "thirdParty.section5.li4": "배포 전에 AI 관련 리스크가 평가되었는가?",
  "thirdParty.section5.li5": "모니터링 활동이 일관되게 수행되었는가?",
  "thirdParty.section5.li6": "예외가 효과적으로 개선되었는가?",
  "thirdParty.section5.p2": "방어 가능한 증거가 없으면 거버넌스 주장은 빠르게 약화됩니다.",
  "thirdParty.section5.li7": "증거 보존 기대사항",
  "thirdParty.section5.li8": "문서화 기준",
  "thirdParty.section5.li9": "검토 절차",
  "thirdParty.section5.li10": "에스컬레이션 기록",
  "thirdParty.section5.li11": "예외 관리 추적",
  "thirdParty.section5.li12": "거버넌스 위원회 보고",
  "thirdParty.section5.p3": "감사나 규제 조사에 효과적으로 대응하는 조직은 가장 정교한 거버넌스 프레임워크를 가진 조직이 아닐 때가 많습니다. 오히려 운영 거버넌스 활동이 시간이 지나도 일관되게 수행되었음을 보여주는 명확한 증거를 제시할 수 있는 조직입니다.",

  "thirdParty.final.title": "이사회가 물어야 할 질문",
  "thirdParty.final.p1": "이사회가 모든 벤더 관계를 개별적으로 평가할 필요는 없습니다. 그러나 경영진이 중요한 제3자 사이버 및 AI 관련 노출이 어디에 있는지 이해하고 있으며, 거버넌스 관행이 운영 의존도와 함께 발전하고 있는지에 대한 신뢰는 필요합니다.",
  "thirdParty.final.li1": "어떤 제3자가 우리의 가장 높은 운영 및 규제 노출을 도입하는가?",
  "thirdParty.final.li2": "AI 기능은 벤더 플랫폼을 통해 어디에 도입되고 있는가?",
  "thirdParty.final.li3": "거버넌스 책임은 내부적으로 어떻게 배정되어 있는가?",
  "thirdParty.final.li4": "지속적인 감독을 검증하는 통제는 무엇인가?",
  "thirdParty.final.li5": "경영진은 새로운 제3자 리스크 이슈를 얼마나 빠르게 식별할 수 있는가?",
  "thirdParty.final.li6": "거버넌스 활동은 외부 검토 아래에서 증거화될 수 있는가?",
  "thirdParty.final.p2": "규율 있는 거버넌스 구조를 더 일찍 구축하는 조직은 혁신, 운영 회복력 및 규제 기대사항의 균형을 동시에 맞추는 데 훨씬 더 강한 위치에 있게 됩니다.",
  "thirdParty.final.p3": "시간이 지남에 따라 가장 강력한 통제 환경은 제3자 의존성이 가장 적은 조직이 아닐 수 있습니다. 오히려 외부 리스크 노출이 내부적으로 기대되는 것과 동일한 엄격함으로 관리되고 있음을 입증할 수 있는 조직일 가능성이 높습니다.",

  "soxScaling.title": " ",
  "soxScaling.subtitle": " ",

  "soxScaling.intro1": "빠르게 성장하는 조직이 어려움을 겪는 이유는 유능한 인재나 강한 비즈니스 추진력이 부족해서가 드뭅니다. 더 흔하게는 운영 성장이 재무보고, 기술 거버넌스 및 통제 실행을 지원하는 프로세스의 성숙도를 앞지를 때 압력이 쌓이기 시작합니다.",
  "soxScaling.intro2": "이 단계에 진입하는 대부분의 조직은 완전히 처음부터 시작하는 것이 아닙니다. 승인 프로세스는 이미 존재합니다. 검토도 이루어지고 있습니다. 재무 및 기술 팀은 다양한 형태로 비즈니스 전반에 대한 감독을 수행하고 있습니다.",
  "soxScaling.intro3": "이 전환을 가장 효과적으로 헤쳐 나가는 조직은 SOX 준비가 컴플라이언스 층을 추가하는 것이 아니라 복잡성이 더 커지기 전에 운영 규율을 표준화하는 것임을 조기에 인식하는 경향이 있습니다.",

  "soxScaling.section1.title": "감사 마찰은 보통 공식 테스트 이전에 시작됩니다",
  "soxScaling.section1.p1": "많은 회사는 감사 마찰이 테스트 활동이 시작된 후에 발생한다고 가정합니다. 실제로는 여러 해 동안 자연스럽게 진화한 프로세스를 문서화하기 시작할 때 훨씬 더 이른 단계에서 부담이 나타납니다.",
  "soxScaling.section1.p2": "빠르게 성장하는 비즈니스는 자연스럽게 속도를 최적화합니다. 팀은 빠르게 적응하고, 책임은 자주 바뀌며, 프로세스는 확장을 지원하기 위해 지속적으로 진화합니다.",
  "soxScaling.section1.li1": "유사한 통제가 팀마다 다르게 수행됨",
  "soxScaling.section1.li2": "비공식 커뮤니케이션 채널을 통한 승인",
  "soxScaling.section1.li3": "주요 검토 활동이 특정 개인에게 의존",
  "soxScaling.section1.li4": "일관되지 않은 증거 보존 관행",
  "soxScaling.section1.li5": "공식 거버넌스 없이 구현되는 기술 변경",
  "soxScaling.section1.li6": "반복 통제 소유권에 대한 제한된 명확성",
  "soxScaling.section1.p3": "외부 감사인은 운영 팀과는 다르게 일관성을 평가합니다. 실제로는 적절히 작동하는 검토 통제도 분기, 검토자 또는 사업부에 따라 실행 방식이 달라지면 테스트 중 문제가 될 수 있습니다.",

  "soxScaling.section2.title": "통제 소유권에는 대부분의 성장 기업이 예상하는 것보다 더 많은 구조가 필요합니다",
  "soxScaling.section2.p1": "SOX 준비의 초기 압박 지점 중 하나는 책임 구조입니다. 빠르게 성장하는 조직에서는 책임이 비즈니스 자체와 함께 자주 확장됩니다.",
  "soxScaling.section2.p2": "많은 조직은 운영 소유자는 있지만 명확히 정의된 통제 소유자는 없다는 사실을 발견합니다. 누군가는 프로세스가 일상적으로 어떻게 작동하는지 이해할 수 있지만, 실행, 증거 보존, 에스컬레이션 관리 및 지속적 일관성에 대한 책임성은 불명확할 수 있습니다.",
  "soxScaling.section2.p3": "성숙한 SOX 환경으로 더 효과적으로 전환하는 회사는 일반적으로 예상보다 더 일찍 소유권 구조를 구축합니다.",

  "soxScaling.section3.title": "복잡성이 커질수록 실행 리듬의 규율이 더욱 중요해집니다",
  "soxScaling.section3.p1": "감사 마찰의 또 다른 일반적인 원인은 일관되지 않은 실행 시점입니다. 성장하는 조직에서는 운영 우선순위가 지속적으로 바뀌며, 반복적인 거버넌스 활동은 점차 규율 있는 방식보다 반응적인 방식으로 변할 수 있습니다.",
  "soxScaling.section3.p2": "감사 관점에서 시점의 불일치는 일반적으로 감독 규율과 통제 신뢰성에 대한 더 큰 우려를 나타냅니다.",
  "soxScaling.section3.li1": "정의된 실행 일정",
  "soxScaling.section3.li2": "표준화된 검토 일정",
  "soxScaling.section3.li3": "캘린더 기반 인증 활동",
  "soxScaling.section3.li4": "지연된 실행에 대한 에스컬레이션 절차",
  "soxScaling.section3.li5": "정기적인 경영진 감독 검토",
  "soxScaling.section3.p3": "이러한 규율은 처음에는 행정적으로 보일 수 있지만, 감사 검토가 증가할 때 매우 가치 있는 운영 예측 가능성을 만듭니다.",

  "soxScaling.section4.title": "증거 기준은 보통 통제 설계보다 더 많은 마찰을 만듭니다",
  "soxScaling.section4.p1": "SOX 준비를 하는 많은 조직은 통제 설계에 상당한 관심을 기울이면서 증거 규율의 운영상 중요성을 과소평가합니다.",
  "soxScaling.section4.p2": "검토는 수행되고, 승인은 완료되며, 조정은 준비되고, 접근 결정은 이루어지지만, 이를 뒷받침하는 증거는 이메일 체인, 스프레드시트, 메시징 플랫폼, 티켓 시스템 또는 문서화되지 않은 워크플로 전반에 존재할 수 있습니다.",
  "soxScaling.section4.li1": "어떤 증거를 보존해야 하는지",
  "soxScaling.section4.li2": "문서가 어디에 위치해야 하는지",
  "soxScaling.section4.li3": "승인 추적성 기대사항",
  "soxScaling.section4.li4": "명명 규칙 및 보존 기간",
  "soxScaling.section4.li5": "검토 완전성을 입증하는 기준",
  "soxScaling.section4.li6": "예외 문서화 절차",
  "soxScaling.section4.p3": "감사를 가장 효과적으로 관리하는 회사는 비즈니스가 확장되면서 증거 관리가 분산되기 전에 충분히 일찍 운영 일관성을 도입한 조직인 경우가 많습니다.",

  "soxScaling.section5.title": "기술 환경은 보통 거버넌스 프로세스보다 더 빠르게 확장됩니다",
  "soxScaling.section5.p1": "조직 성장 기간 동안 기술 복잡성은 빠르게 증가하는 경향이 있습니다. ERP 구축, 클라우드 이전, SaaS 확장, 인수합병, 자동화 이니셔티브 및 변화하는 보고 환경은 모두 추가적인 거버넌스 요구를 도입합니다.",
  "soxScaling.section5.p2": "많은 회사에서 기술 환경은 주변 통제 구조보다 운영상 더 빠르게 성숙합니다.",
  "soxScaling.section5.li1": "일관되지 않은 접근 거버넌스",
  "soxScaling.section5.li2": "과도한 권한 접근",
  "soxScaling.section5.li3": "약한 변경 관리 추적성",
  "soxScaling.section5.li4": "제한적인 시스템 소유권 명확성",
  "soxScaling.section5.li5": "불완전한 인터페이스 모니터링",
  "soxScaling.section5.li6": "빠른 구축 과정에서 도입된 수동 우회 절차",
  "soxScaling.section5.p3": "접근 관리, 변경 거버넌스, 문서화 기대사항 및 시스템 책임성을 조기에 표준화하면 이후의 상당한 운영 부담을 줄이는 경향이 있습니다.",

  "soxScaling.final.title": "회사가 조기에 표준화해야 할 것",
  "soxScaling.final.p1": "조직은 종종 공식 SOX 준비를 언제 시작해야 하는지 묻습니다. 더 유용한 대화는 감사 압력이 커지기 전에 어떤 운영 규율을 표준화해야 하는지에 초점을 맞춥니다.",

  "soxScaling.final.ownership": "소유권",
  "soxScaling.final.ownership.li1": "명확한 통제 책임성",
  "soxScaling.final.ownership.li2": "정의된 검토 책임",
  "soxScaling.final.ownership.li3": "에스컬레이션 및 위임 절차",
  "soxScaling.final.ownership.li4": "교차 기능 거버넌스 정렬",

  "soxScaling.final.cadence": "리듬",
  "soxScaling.final.cadence.li1": "표준화된 실행 일정",
  "soxScaling.final.cadence.li2": "캘린더 기반 거버넌스 활동",
  "soxScaling.final.cadence.li3": "시기적절한 검토 기대사항",
  "soxScaling.final.cadence.li4": "일관된 모니터링 루틴",

  "soxScaling.final.evidence": "증거",
  "soxScaling.final.evidence.li1": "정의된 문서화 기준",
  "soxScaling.final.evidence.li2": "중앙화된 보존 관행",
  "soxScaling.final.evidence.li3": "명확한 승인 추적성",
  "soxScaling.final.evidence.li4": "통제 실행에 대한 반복 가능한 지원",

  "soxScaling.final.p2": "거버넌스 성숙을 지연하는 회사는 SOX 준비가 예상보다 훨씬 더 혼란스럽고 많은 자원을 요구한다는 사실을 자주 발견합니다.",
  "soxScaling.final.p3": "가장 효과적으로 적응하는 조직은 통제 표준화를 컴플라이언스 이니셔티브가 아니라 지속 가능한 성장을 지원하는 운영 확장성 요구사항으로 보는 경향이 있습니다."

,

"boardRisk.title": " ",
"boardRisk.subtitle": " ",

"boardRisk.intro1": "많은 조직에는 IT 리스크 보고가 부족하지 않습니다. 대시보드는 정기적으로 생성되고, 운영 지표는 지속적으로 추적되며, 경영진은 사이버보안 활동, 기술 사고, 컴플라이언스 이니셔티브, 감사 발견사항 및 개선 활동을 다루는 광범위한 업데이트를 자주 받습니다.",
"boardRisk.intro2": "그러나 보고량이 많음에도 불구하고, 이사회는 조직의 실제 기술 리스크 노출을 명확히 이해하지 못한 채 거버넌스 논의를 마치는 경우가 많습니다.",
"boardRisk.intro3": "문제는 데이터 부족인 경우가 드뭅니다. 더 흔하게는 보고가 지나치게 운영 중심인 반면, 이사회는 감독 판단, 전략적 우선순위 설정 및 리스크 기반 의사결정을 지원하는 정보가 필요하다는 점입니다.",
"boardRisk.intro4": "가장 강하게 진전하는 조직은 일반적으로 활동량 중심의 보고에서 벗어나, 이사회가 노출, 추세, 책임성 및 의사결정 준비도를 평가할 수 있도록 돕는 핵심 리스크 지표 중심의 보고로 이동하고 있습니다.",

"boardRisk.section1.title": "운영 지표는 감독 인사이트로 잘 전환되지 않습니다",
"boardRisk.section1.p1": "이사회 보고에서 가장 흔한 약점 중 하나는 더 많은 운영 세부사항이 자동으로 거버넌스 가시성을 개선한다는 가정입니다.",
"boardRisk.section1.p2": "이사회는 취약점 수, 피싱 모의훈련, 패치 통계, 티켓 종료율, 감사 활동, 보안 도구 배포 진행률 또는 컴플라이언스 비율에 대한 광범위한 보고를 받을 수 있지만, 조직의 전체 리스크 상태가 개선되고 있는지 악화되고 있는지에 대한 의미 있는 명확성을 얻지 못할 수 있습니다.",
"boardRisk.section1.li1": "조직은 어디에서 더 많이 노출되고 있는가?",
"boardRisk.section1.li2": "어떤 리스크가 설정된 허용 수준을 초과하는가?",
"boardRisk.section1.li3": "개선 활동이 중요한 노출을 효과적으로 줄이고 있는가?",
"boardRisk.section1.li4": "어떤 의존성이 집중 리스크를 만드는가?",
"boardRisk.section1.li5": "운영 활동에도 불구하고 거버넌스 격차가 어디에 지속되고 있는가?",
"boardRisk.section1.li6": "어떤 추세가 전술적 관리가 아니라 전략적 관심을 필요로 하는가?",
"boardRisk.section1.p3": "가장 강력한 거버넌스 보고 환경은 이사회 보고가 단순히 운영 보고의 축약판이 아니라는 점을 인식합니다. 이는 다른 프레이밍, 다른 에스컬레이션 기준 및 다른 효과성 측정이 필요한 별도의 거버넌스 규율입니다.",

"boardRisk.section2.title": "효과적인 KRI는 활동이 아니라 노출에 집중합니다",
"boardRisk.section2.p1": "조직은 이사회 보고 지표를 KRI라고 부르지만, 실제로는 여전히 운영 KPI를 보고하는 경우가 많습니다.",
"boardRisk.section2.p2": "핵심 성과 지표는 일반적으로 실행 효율성, 운영 완료 또는 관리 활동을 측정합니다. 핵심 리스크 지표는 리더십이 변화하는 노출 수준, 새롭게 나타나는 거버넌스 우려 및 리스크가 허용 범위를 벗어나고 있는지 평가하도록 돕기 위한 것입니다.",
"boardRisk.section2.li1": "해결되지 않은 고위험 이슈의 집중도",
"boardRisk.section2.li2": "중요 개선 활동의 노후화",
"boardRisk.section2.li3": "핵심 운영을 지원하는 제3자 의존성",
"boardRisk.section2.li4": "지원 종료 또는 수명 종료 기술의 증가",
"boardRisk.section2.li5": "권한 접근 노출 추세",
"boardRisk.section2.li6": "고위험 환경에서의 통제 예외 빈도",
"boardRisk.section2.li7": "사업부 전반에서 반복되는 감사 이슈",
"boardRisk.section2.li8": "핵심 운영에 영향을 미치는 중대한 사이버보안 사고",
"boardRisk.section2.li9": "규제 또는 회복력 우려와 연결된 에스컬레이션 추세",
"boardRisk.section2.p3": "이러한 지표는 운영 업무량보다 리스크 추세에 대한 더 나은 가시성을 이사회에 제공합니다.",
"boardRisk.section2.p4": "이사회는 일반적으로 활동 완료율을 강조하는 세련된 대시보드보다 지속적인 거버넌스 약점에 대한 투명한 보고에서 더 많은 가치를 얻습니다.",

"boardRisk.section3.title": "이사회 보고는 책임성을 명확히 해야 합니다",
"boardRisk.section3.p1": "IT 리스크 보고의 또 다른 흔한 약점은 명확한 책임성 가시성이 없다는 점입니다.",
"boardRisk.section3.li1": "어떤 임원이 개선 책임을 소유하는가",
"boardRisk.section3.li2": "개선 일정이 현실적인가",
"boardRisk.section3.li3": "교차 기능 조정이 어디에서 실패하고 있는가",
"boardRisk.section3.li4": "어떤 리스크가 충분한 해결 없이 계속 에스컬레이션되고 있는가",
"boardRisk.section3.li5": "경영진이 특정 노출을 공식적으로 수용하고 있는가",
"boardRisk.section3.p2": "명확한 소유권 가시성이 없으면 보고는 거버넌스 활동이 있는 것처럼 보이게 하면서 그 아래의 해결되지 않은 실행 문제를 가릴 수 있습니다.",
"boardRisk.section3.li6": "중요 리스크에 대한 경영진 소유권",
"boardRisk.section3.li7": "해결되지 않은 노출과 연결된 노후화 분석",
"boardRisk.section3.li8": "지연된 개선에 대한 에스컬레이션 기준",
"boardRisk.section3.li9": "반복되는 거버넌스 예외에 대한 가시성",
"boardRisk.section3.li10": "사업부 또는 기술 도메인 전반의 추세 분석",
"boardRisk.section3.li11": "전술적 개선과 구조적 리스크 감소의 구분",
"boardRisk.section3.p3": "이사회는 모든 운영 개선 활동에 대한 가시성이 필요하지는 않습니다. 그러나 경영진 책임 구조가 증가하는 운영 복잡성 속에서 효과적으로 작동하는지 판단할 수 있을 만큼의 투명성은 필요합니다.",

"boardRisk.section4.title": "보고 성숙도는 맥락과 내러티브에 달려 있습니다",
"boardRisk.section4.p1": "이사회 보고에서 간과되기 쉬운 요소 중 하나는 내러티브 품질입니다.",
"boardRisk.section4.li1": "리스크 노출이 왜 변하고 있는가",
"boardRisk.section4.li2": "어떤 추세가 가장 중요한가",
"boardRisk.section4.li3": "이슈가 개별적인가 아니면 체계적인가",
"boardRisk.section4.li4": "경영진이 대응 노력을 어떻게 우선순위화하고 있는가",
"boardRisk.section4.li5": "어떤 의사결정이 이사회 관심을 필요로 할 수 있는가",
"boardRisk.section4.p2": "강력한 이사회 보고 환경은 기술적 세부사항으로 이사들을 압도하지 않으면서 운영상 의미를 설명하는 간결한 해석을 KRI와 함께 제공합니다.",
"boardRisk.section4.p3": "효과적인 내러티브는 무엇이 변했는지, 왜 중요한지, 경영진이 어떻게 대응하고 있는지, 그리고 노출이 개선되고 있는지, 안정화되고 있는지, 악화되고 있는지를 명확히 합니다.",

"boardRisk.final.title": "이사회 보고는 거버넌스 의사결정을 지원해야 합니다",
"boardRisk.final.p1": "궁극적으로 효과적인 IT 리스크 보고는 이사회가 단순히 운영 활동에 대해 정보를 받는 것을 넘어 더 나은 거버넌스 의사결정을 내리도록 도와야 합니다.",
"boardRisk.final.li1": "활동량이 아닌 노출 추세",
"boardRisk.final.li2": "개별 사고가 아닌 리스크 집중도",
"boardRisk.final.li3": "일반적 소유권이 아닌 책임성 명확성",
"boardRisk.final.li4": "종료 통계가 아닌 개선 효과성",
"boardRisk.final.li5": "과거 요약이 아닌 미래지향적 지표",
"boardRisk.final.li6": "에스컬레이션 또는 투자가 필요한 거버넌스 의사결정",
"boardRisk.final.p2": "성공적으로 적응하는 조직은 복잡한 운영 리스크 환경을 과도하게 단순화하지 않으면서, 정보에 기반한 거버넌스 의사결정을 지원하는 명확한 감독 인텔리전스로 전환할 수 있는 조직일 가능성이 높습니다.",

"aiAudit.title": "",
"aiAudit.subtitle": " ",

"aiAudit.intro1": "많은 조직은 여전히 AI 거버넌스를 새로운 이니셔티브로 취급하고 있습니다. 그러나 감사인은 점점 더 이를 운영 현실로 보고 있습니다.",
"aiAudit.intro2": "한때 AI 거버넌스를 미래 상태의 문제로 보았던 리더십 팀은 이제 책임성, 감독, 문서화 및 통제 실행에 대한 실질적인 질문을 받고 있습니다.",
"aiAudit.intro3": "많은 환경에서 경영진은 AI 도입이 거버넌스 성숙도보다 더 빠르게 진행되었다는 사실을 발견하고 있습니다.",
"aiAudit.intro4": "여러 산업에서 네 가지 거버넌스 주제가 감사 논의에서 일관되게 나타나고 있습니다: 인벤토리 관리, 승인 거버넌스, 지속적 모니터링 및 수명주기 문서화.",

"aiAudit.section1.title": "인벤토리는 AI 거버넌스의 출발점이 되고 있습니다",
"aiAudit.section1.p1": "감사인이 점점 더 자주 묻는 첫 질문 중 하나는 단순해 보이지만 중요합니다: 조직 전반에서 AI가 어디에 사용되고 있는가?",
"aiAudit.section1.p2": "AI 도입은 하나의 중앙화된 프로그램을 통해 발생하는 경우가 드뭅니다. 비즈니스 팀은 생성형 AI 도구를 독립적으로 실험합니다. 기술 그룹은 애플리케이션에 머신러닝 기능을 통합합니다. 벤더는 기존 플랫폼에 내장형 AI 기능을 도입합니다.",
"aiAudit.section1.p3": "조직은 기술을 일관되게 식별할 수 없다면 효과적으로 관리할 수 없습니다.",
"aiAudit.section1.li1": "AI 지원 시스템 및 사용 사례의 중앙화된 인벤토리",
"aiAudit.section1.li2": "무엇이 AI “범위 내”에 해당하는지 정의하는 기준",
"aiAudit.section1.li3": "운영 또는 규제 영향과 연결된 리스크 분류",
"aiAudit.section1.li4": "각 구현에 대한 소유 책임",
"aiAudit.section1.li5": "인벤토리 완전성을 검증하기 위한 정기 검토 프로세스",
"aiAudit.section1.p4": "가장 효과적으로 대응하는 조직은 AI 인벤토리 관리를 일회성 문서화 활동이 아니라 동적인 거버넌스 프로세스로 취급하는 조직입니다.",

"aiAudit.section2.title": "승인 거버넌스에는 비공식적 합의 이상이 필요합니다",
"aiAudit.section2.p1": "조직이 AI 사용을 식별하면, 감사인이 다음으로 살펴보는 영역은 배포 및 승인 활동을 둘러싼 거버넌스입니다.",
"aiAudit.section2.p2": "자주 빠져 있는 것은 리스크 평가와 승인 추적성을 둘러싼 구조화된 거버넌스입니다.",
"aiAudit.section2.li1": "리스크 노출에 기반한 승인 요구사항",
"aiAudit.section2.li2": "거버넌스 검토 기준",
"aiAudit.section2.li3": "리스크 수용 결정에 대한 책임성",
"aiAudit.section2.li4": "고위험 구현에 대한 에스컬레이션 경로",
"aiAudit.section2.li5": "배포 결정을 뒷받침하는 문서화",
"aiAudit.section2.p3": "강력한 거버넌스 환경은 명확히 정의된 검토 기대사항, 리스크 등급 기준 및 구현 결정에 대한 책임성을 포함하여 실질적인 승인 구조를 조기에 구축함으로써 이 문제를 해결합니다.",

"aiAudit.section3.title": "모니터링 통제는 점점 더 중요해지고 있습니다",
"aiAudit.section3.p1": "인벤토리와 승인은 초기 거버넌스 구조를 확립합니다. 모니터링은 거버넌스가 시간이 지나도 효과적으로 유지되는지 판단합니다.",
"aiAudit.section3.p2": "AI 지원 환경은 지속적으로 진화합니다. 모델은 변하고, 벤더는 새로운 기능을 도입하며, 데이터 입력은 바뀌고, 비즈니스 사용은 확대되며, 운영 의존성은 시간이 지남에 따라 증가합니다.",
"aiAudit.section3.li1": "AI 지원 시스템의 변경",
"aiAudit.section3.li2": "지속적인 사용자 접근 및 권한",
"aiAudit.section3.li3": "데이터 사용 및 보존 관행",
"aiAudit.section3.li4": "예외 처리 활동",
"aiAudit.section3.li5": "새로운 AI 기능을 도입하는 벤더 업데이트",
"aiAudit.section3.li6": "사고 또는 거버넌스 우려의 에스컬레이션",
"aiAudit.section3.li7": "운영 사용과 승인된 범위 간의 정렬",
"aiAudit.section3.p3": "효과적인 모니터링 통제가 반드시 고도화된 도구를 필요로 하는 것은 아닙니다. 더 자주 필요한 것은 운영 규율, 정의된 검토 리듬, 에스컬레이션 절차 및 환경이 진화함에 따라 거버넌스 가정을 재평가할 책임성입니다.",

"aiAudit.section4.title": "수명주기 문서화는 감사 검토에서 핵심이 되고 있습니다",
"aiAudit.section4.p1": "조직은 감사가 시작되면 AI 거버넌스 논의가 얼마나 빠르게 문서화 논의로 전환되는지 과소평가하는 경우가 많습니다.",
"aiAudit.section4.li1": "초기 리스크 평가",
"aiAudit.section4.li2": "승인 및 배포 결정",
"aiAudit.section4.li3": "통제 기대사항",
"aiAudit.section4.li4": "모니터링 활동",
"aiAudit.section4.li5": "변경 관리 프로세스",
"aiAudit.section4.li6": "예외 처리",
"aiAudit.section4.li7": "정기적인 거버넌스 검토",
"aiAudit.section4.li8": "폐기 또는 운영 종료 결정",
"aiAudit.section4.p2": "분산된 문서화는 일관성, 책임성 및 감독 신뢰성을 입증하는 데 큰 어려움을 만듭니다.",
"aiAudit.section4.li9": "정의된 증거 보존 기준",
"aiAudit.section4.li10": "중앙화된 거버넌스 저장소",
"aiAudit.section4.li11": "문서화 소유 책임",
"aiAudit.section4.li12": "승인 및 검토에 대한 추적성 기대사항",
"aiAudit.section4.li13": "통제 실행을 입증하는 기준",
"aiAudit.section4.li14": "문서 완전성에 대한 정기 검증",
"aiAudit.section4.p3": "수명주기 문서화는 운영 거버넌스 성숙도를 갖춘 조직과 여전히 정책 수준 거버넌스에 주로 의존하는 조직을 구분하는 가장 명확한 지표 중 하나가 될 가능성이 높습니다.",

"aiAudit.final.title": "감사인이 궁극적으로 평가하는 것",
"aiAudit.final.p1": "대부분의 감사인은 조직이 모든 AI 관련 리스크를 제거할 것을 기대하지 않습니다. 그들은 경영진이 조직의 운영 노출에 비례하는 거버넌스 규율을 구축했는지를 평가합니다.",
"aiAudit.final.li1": "경영진은 AI가 어디에 존재하는지 알고 있는가?",
"aiAudit.final.li2": "배포는 구조화된 승인을 통해 관리되는가?",
"aiAudit.final.li3": "통제는 시간이 지나도 일관되게 모니터링되는가?",
"aiAudit.final.li4": "거버넌스 활동은 시스템 수명주기 전반에서 증거화될 수 있는가?",
"aiAudit.final.li5": "문제가 발생할 때 개선을 지원할 만큼 책임 구조가 명확한가?",
"aiAudit.final.p2": "AI 거버넌스에 실용적으로 접근하는 조직은 배포 활동이 이미 크게 가속화된 후에 거버넌스를 뒤늦게 맞추려는 조직보다 외부 검토에서 훨씬 더 나은 성과를 보이는 경향이 있습니다.",
"aiAudit.final.p3": "시간이 지남에 따라 정책 중심 거버넌스와 운영 거버넌스 간의 격차는 점점 더 분명해질 것입니다.",

/* about */

"about.tophero.title": "우리의 사람. 귀하의 신뢰. 탁월한 정밀성.",

"about.hero.title": "Big 4 수준의 규율을 갖춘<br><span style='color:var(--blue2)'>이사회 수준 리스크 자문</span>.",
"about.hero.lead": "Primevant Advisory는 리더십 팀이 거버넌스를 강화하고, 리스크를 효과적으로 관리하며, 회복력 있는 내부통제 환경을 지속할 수 있도록 지원합니다.",

"about.section.title": "Primevant Advisory 소개",
"about.section.lead": "Primevant Advisory는 기업 리스크, 기술, 사이버보안 및 통제에 중점을 둔 부티크 자문 회사입니다. 우리는 불필요한 오버헤드 없이 명확한 범위, 경영진 수준의 커뮤니케이션 및 방어 가능한 결과를 제공합니다.",

"about.mission.title": "우리의 미션",
"about.mission.text": "조직이 비즈니스 운영과 일치하는 실질적이고 방어 가능한 방식으로 기업 리스크 및 통제 환경을 강화하도록 지원하여, 거버넌스, 기술 및 보증 프로그램 전반에서 예기치 못한 문제를 줄이고 신뢰를 높입니다.",

"about.values.title": "우리의 가치",
"about.values.text": "명확성(명확한 범위, 기대사항 및 결과), 규율(일관되고 방어 가능한 증거와 실행), 판단(리스크 기반의 적정한 통제), 신뢰(고객 정보와 관계의 안전한 처리).",

"about.founder.name": "Uchechi Osuagwu",
"about.founder.role": "매니징 파트너",

"about.founder.background.title": "배경 요약",
"about.founder.background.p1": "Uchechi Osuagwu는 전 EY 뉴욕시 파트너이자 15년 이상의 경험을 보유한 숙련된 기술 리스크 임원으로, Fortune 500 조직을 위한 기업 감사, 사이버보안, AI 전략 및 디지털 전환 이니셔티브를 이끌어 왔습니다. 그녀의 경력은 기술, 리스크 및 비즈니스 성과가 교차하는 복잡하고 고도로 규제된 글로벌 환경을 아우릅니다.",
"about.founder.background.p2": "Uchechi는 성장, 규제 준비 및 회복력을 지원하기 위해 기술 통제를 강화하고, AI 거버넌스를 운영화하며, 기업 리스크 및 감사 프레임워크를 현대화하는 대규모 프로그램을 이끌었습니다. 그녀는 경력 전반에 걸쳐 이사회, 경영진 및 규제기관과 긴밀히 협력하며 SOX 준비, 사이버 회복력, 제3자 리스크 및 신기술 리스크에 대해 자문해 왔습니다.",
"about.founder.background.p3": "그녀는 복잡한 통제, 보안 및 AI 과제를 실질적이고 비즈니스에 맞춘 전략으로 전환하며 기술적 복잡성과 경영진 의사결정 사이의 간극을 연결하는 능력으로 인정받고 있습니다.",

"about.founder.credentials.title": "자격 및 전문성",
"about.founder.credentials.l1": "기술 리스크, 기업 감사, 사이버보안 및 AI 거버넌스 분야에서 15년 이상의 리더십",
"about.founder.credentials.l2": "SOX, ITGC, 접근 통제, 변경 관리 및 증거 기반 통제 프레임워크에 대한 깊은 전문성",
"about.founder.credentials.l3": "기업 환경 전반에서 AI 거버넌스 및 리스크 관리를 운영화한 검증된 경험",
"about.founder.credentials.l4": "규제 준비, 사이버 리스크 및 새로운 AI 위협에 대해 이사회와 C-레벨 리더가 신뢰하는 자문가",
"about.founder.credentials.l5": "금융 서비스, 헬스케어, 기술 및 소비재 산업 전반의 글로벌 운영 지원 경험",
"about.founder.credentials.l6": "기술, 리스크, 감사 및 비즈니스 이해관계자를 하나의 실행 중심 리스크 전략으로 통합하는 능력으로 알려져 있음",

"about.founder.credibility.title": "신뢰성 진술",
"about.founder.credibility.p1": "Uchechi는 경영진 판단, 기술적 깊이 및 실질적인 실행 경험의 드문 조합을 제공합니다. 그녀는 리스크를 식별하는 것뿐만 아니라 이를 해결하는 사람으로 고위 리더들의 신뢰를 받고 있으며, 실제 환경에서 작동하는 통제 환경, 거버넌스 모델 및 운영 구조를 설계합니다.",
"about.founder.credibility.p2": "그녀의 접근 방식은 규율 있고, 결과 중심이며, 감사, 규제 및 기업 실행의 현실에 기반합니다. Primevant Advisory를 통해 Uchechi는 조직이 규제 압력과 기술 변화를 전략적 이점으로 전환하도록 지원합니다.",

"about.narrative.title": "거버넌스를 강화합니다.<br><span style='color:var(--blue2)'>자신 있는 의사결정을 가능하게 합니다.</span>",
"about.narrative.p1": "Primevant Advisory는 리더십 팀과 협력하여 강력한 거버넌스 프레임워크를 구축하고 리스크를 명확하고 실행 가능한 결과로 전환합니다.",
"about.narrative.p2": "우리는 조직이 비즈니스, 리스크 및 통제를 정렬하여 감독을 강화하고, 규제 기대사항을 충족하며, 성장을 지원하는 회복력 있는 운영 환경을 구축하도록 돕습니다.",

"about.team.title": "역량 및 팀",
"about.team.lead": "Primevant Advisory는 복잡한 기업 환경을 지원하도록 구성된 거버넌스, 리스크, 사이버보안 및 규제 분야의 집중적이고 우수한 전문가 네트워크를 통해 서비스를 제공합니다.",

"about.team.card1.title": "기업 거버넌스 및 리스크 역량",
"about.team.card1.text": "규제 기대사항과 비즈니스 우선순위에 맞춘 재무보고, 운영, 사이버보안 및 기술 영역 전반의 거버넌스, 리스크 및 통제 프로그램 지원 경험.",

"about.team.card2.title": "Big 4 및 산업 경험",
"about.team.card2.text": "팀 구성원은 선도적인 자문회사 및 복잡한 기업 환경에서의 경험을 보유하고 있으며, 금융 서비스, 헬스케어, 기술 및 소비재 산업 전반의 조직을 지원합니다.",

"about.team.card3.title": "유연한 제공 모델",
"about.team.card3.text": "과제는 고위 리더십 감독 아래 구성되며, 범위, 일정 및 규제 요구사항을 정밀하게 충족하기 위해 전문 역량으로 확장됩니다.",

"about.founder.more": "추가 정보",
"about.teamCredibility.title": "팀 신뢰성",
"about.teamCredibility.p1": "Primevant Advisory는 고위 리더십 감독과 거버넌스, 리스크, 사이버보안 및 규제 분야의 우수한 전문가 네트워크를 결합합니다. 이 모델을 통해 회사는 복잡한 기업 환경에서 기대되는 깊이와 규율로 실질적이고 감사 준비가 된 결과를 제공합니다.",
"about.teamCredibility.p2": "우리의 과제는 적절한 전문성을 적절한 과제에 투입하도록 구성되며, 경영진 판단, 전문 역량 및 일관된 제공 기준의 균형을 맞춰 규제 준비, 회복력 있는 운영 및 비즈니스 중심 리스크 관리를 지원합니다.",

"about.founder.less": "정보 줄이기",

/* contact */

"contact.banner": "문의하기",
"contact.heroTitle": "귀하의<br><span style='color:var(--blue2)'>통제 및 리스크 목표</span>에 맞춰 정렬하겠습니다.",
"contact.p1": "<b>리스크를 경영진의 실행으로 전환합니다.</b> 우리는 기술팀, 내부감사 및 경영진 간의 간극을 연결하여 통제 프레임워크가 비즈니스 및 운영 우선순위를 지원하도록 합니다.",
"contact.p2": "<b>복잡성과 마찰을 줄입니다.</b> 우리는 통제 설계, 문서화 및 증거 관행을 간소화하여 팀이 통제 관리보다 성과와 가치 창출에 더 많은 시간을 쓸 수 있도록 합니다.",
"contact.p3": "<b>검증된 자문가와 함께하십시오.</b> 이사회, C-레벨 및 감사위원회를 지원한 깊은 경험을 바탕으로, 규제, 감사 및 이해관계자 검토를 견딜 수 있는 실질적인 솔루션을 제공합니다.",

"contact.formTitle": "메시지 보내기",
"contact.name": "성명 *",
"contact.email": "이메일 *",
"contact.topic": "주제",
"contact.message": "메시지 *",
"contact.submit": "제출",
"contact.viewServices": "서비스 보기",

"contact.details": "연락처 정보",
"contact.response": "일반적으로 영업일 기준 1일 이내에 응답합니다. 긴급한 감사 일정 관련 문의의 경우 메시지에 “긴급”이라고 포함해 주세요.",

/* Privacy */

"privacy.title": "개인정보 처리방침",
"privacy.lead": "Primevant Advisory는 귀하의 개인정보를 존중하며 정보를 신중하고 전문적으로 처리합니다. 본 고지는 이 웹사이트를 통해 수집하는 정보와 그 사용 방식을 설명합니다.",

"privacy.updated": "마지막 업데이트:",

"privacy.collect.title": "수집하는 정보",
"privacy.collect.text": "귀하가 당사에 연락할 때(예: 문의 페이지를 통해), 이름, 이메일 주소, 회사명 및 메시지 내용과 같이 귀하가 제공하는 정보를 수집할 수 있습니다.",

"privacy.use.title": "정보 사용 방법",
"privacy.use.text": "당사는 귀하가 제공한 정보를 문의 응답, 미팅 일정 조율, 요청 자료 제공 및 잠재적 서비스에 대한 커뮤니케이션에 사용합니다. 당사는 개인정보를 판매하지 않습니다.",

"privacy.security.title": "데이터 처리 및 보호",
"privacy.security.text": "Primevant Advisory는 무단 접근, 사용 또는 공개로부터 정보를 보호하기 위해 합리적인 관리적 및 기술적 보호 조치를 적용합니다. 고객 과제의 경우 데이터 처리 및 보존 조건은 일반적으로 계약(예: MSA/SOW)에 의해 관리됩니다.",

"privacy.thirdparty.title": "제3자 서비스",
"privacy.thirdparty.text": "향후 분석, 양식 처리 또는 일정 예약 도구와 같은 제3자 서비스를 도입하는 경우, 해당 제공업체 및 관련 데이터 관행을 반영하도록 본 고지를 업데이트할 것입니다.",

"privacy.contact.title": "문의",
"privacy.contact.text": "본 고지에 대한 질문은 <b>info@primevantadvisory.com</b> 로 문의해 주세요.",

/* Sox readiness Insight */

"sox30.title": " ",

"sox30.intro1": "SOX 일정이 압축되면 IT는 거의 항상 압박 지점이 됩니다.",
"sox30.intro2": "재무팀은 재무 주장에 대한 책임을 갖지만, 감사인이 해당 숫자를 생성하는 시스템을 실제로 신뢰할 수 있는지를 결정하는 것은 IT입니다. 이 관계는 감사 검토가 본격화되면 매우 현실적으로 드러납니다.",
"sox30.intro3": "접근이 느슨하게 관리되거나, 변경 활동이 일관되지 않게 실행되거나, 데이터 흐름이 충분히 이해되지 않는다면, 재무 통제는 아무리 잘 문서화되어 있어도 신뢰하기 어려워집니다. 통제 설계와 통제 신뢰성 사이의 간극이 대부분의 SOX 준비 노력에서 부담이 시작되는 지점입니다.",
"sox30.intro4": "압축된 일정에서 목표는 완벽한 컴플라이언스 성숙도가 아닙니다. 감사인이 시스템이 어떻게 관리되고, 통제가 실제로 어떻게 운영되며, 누가 실행에 책임이 있는지 따라갈 수 있을 만큼 충분한 구조와 일관성을 구축하는 것입니다.",
"sox30.intro5": "대부분의 조직에서 이러한 명확성은 SOX 준비가 시작되는 시점에 완전히 갖춰져 있지 않습니다.",

"sox30.section1.title": "첫 번째 제약은 보통 통제가 아니라 가시성입니다",
"sox30.section1.p1": "초기 과제는 통제가 없다는 것이 드문 경우입니다. 대부분의 조직에는 이미 어떤 형태로든 접근 프로세스, 변경 워크플로, 승인 메커니즘 및 운영 검토가 존재합니다.",
"sox30.section1.p2": "문제는 이러한 프로세스가 성장 기간 동안 팀과 시스템 전반에서 독립적으로 발전했다는 점입니다. 존재하는 것은 일반적으로 통합된 통제 환경이라기보다 여러 관행의 모음입니다.",
"sox30.section1.p3": "이는 기본적인 질문에 답하려 할 때 가장 뚜렷하게 드러납니다: 어떤 시스템이 실제로 재무보고에 중요한가?",
"sox30.section1.p4": "ERP 플랫폼은 일반적으로 비교적 명확합니다. 복잡성은 인접 애플리케이션, 보고 계층, 시스템 통합 및 재무 마감 활동을 지원하는 수동 프로세스 주변에서 발생합니다.",
"sox30.section1.p5": "리더십 팀을 놀라게 하는 것은 재무 시스템이 아닌 많은 시스템도 데이터 변환, 내보내기 및 수동 조정을 통해 재무 결과에 영향을 미친다는 점입니다.",
"sox30.section1.p6": "범위에 대한 명확하고 합의된 관점이 없으면 그 이후의 모든 안정화 작업이 더 어려워집니다.",

"sox30.section2.title": "통제 설계가 실제 문제인 경우는 드뭅니다",
"sox30.section2.p1": "범위가 이해되면 관심은 자연스럽게 IT 일반통제로 이동합니다. 문서상으로는 간단해 보이지만 실제로는 불일치가 드러나기 시작합니다.",
"sox30.section2.p2": "접근 관리는 존재할 수 있지만 승인 및 검토 관행은 시스템마다 다를 수 있습니다. 변경 관리는 문서화되어 있을 수 있지만 긴급 변경이나 소규모 운영 변경은 때때로 공식 워크플로 밖에서 처리됩니다. 운영 통제는 효과적으로 작동할 수 있지만 실행 증거가 항상 일관되게 보존되는 것은 아닙니다.",
"sox30.section2.p3": "문제는 통제가 존재하는지 여부가 아닙니다. 그것이 반복 가능하고 방어 가능한 방식으로 운영되는지 여부입니다.",
"sox30.section2.p4": "SOX 환경에서는 불일치가 부재보다 더 문제가 되는 경우가 많습니다.",
"sox30.section2.p5": "감사인은 의도를 평가하지 않습니다. 신뢰성을 평가합니다.",
"sox30.section2.p6": "바로 이 지점에서 마찰이 드러나기 시작하며, 특히 거버넌스 기대사항을 표준화하기 전에 운영적으로 성장한 조직에서 그렇습니다.",

"sox30.section3.title": "자동화는 통제 리스크의 성격을 바꿉니다",
"sox30.section3.p1": "시스템이 성숙해짐에 따라 재무 통제 실행의 상당 부분이 자동화됩니다. 승인은 워크플로에 내장되고, 보고서는 시스템에서 생성되며, 계산은 수동이 아니라 플랫폼 내에서 직접 수행됩니다.",
"sox30.section3.p2": "이는 효율성 관점에서는 일반적으로 긍정적이지만, 거버넌스 요구사항을 크게 변화시킵니다.",
"sox30.section3.p3": "초점은 통제가 수동으로 수행되었는지 여부에서 해당 통제를 수행하는 시스템이 적절히 구성되고, 제한되며, 시간이 지나도 관리되는지 여부로 이동합니다.",
"sox30.section3.p4": "반복적으로 발생하는 문제는 시스템 출력이 어떻게 생성되거나 수정되는지 충분히 이해하지 못한 채 시스템 출력에 과도하게 의존하는 것입니다. 보고서 로직, 구성 설정 또는 접근 매개변수가 거버넌스 감독 없이 변경될 수 있다면, 프로세스가 안정적으로 보이더라도 downstream 재무 통제가 손상될 수 있습니다.",
"sox30.section3.p5": "바로 여기에서 IT와 재무의 정렬이 필수적이 됩니다. 재무는 결과에 집중하는 경향이 있습니다. IT는 그 결과를 만들어내는 메커니즘의 무결성에 집중해야 합니다.",
"sox30.section3.p6": "두 관점 모두 필요하지만, SOX 환경에서는 두 관점이 함께 작동해야 합니다.",

"sox30.section4.title": "증거 규율이 감사 효율성을 결정합니다",
"sox30.section4.p1": "SOX 준비에서 가장 과소평가되는 요소 중 하나는 증거 관리입니다.",
"sox30.section4.p2": "통제가 올바르게 운영될 수 있지만, 증거가 일관되지 않거나, 분산되어 있거나, 검색하기 어렵다면 감사 테스트 중 해당 통제를 방어하기 어려워집니다.",
"sox30.section4.p3": "많은 조직에서 증거는 여러 시스템과 커뮤니케이션 채널 전반에 존재합니다. 승인은 티켓 도구에, 변경 기록은 스프레드시트에, 접근 검토는 이메일 체인이나 플랫폼 내보내기에, 운영 로그는 중앙화된 보존 기준 없이 시스템 인터페이스에 있을 수 있습니다.",
"sox30.section4.p4": "개별적으로는 이것이 이상하지 않습니다. 그러나 전체적으로는 피할 수 있는 감사 마찰을 만듭니다.",
"sox30.section4.p5": "핵심 문제는 저장이 아닙니다. 예측 가능성입니다.",
"sox30.section4.p6": "감사인은 증거가 존재한다는 것뿐만 아니라, 시간이 지나도 신뢰할 수 있는 형식으로 일관되게 생성될 수 있다는 것을 이해해야 합니다.",
"sox30.section4.p7": "SOX 환경을 효과적으로 관리하는 조직은 무엇을 보존해야 하는지, 어디에 위치해야 하는지, 어떻게 생성되는지를 포함하여 증거 기대사항을 조기에 표준화하는 경향이 있습니다. 이러한 일관성은 감사 혼란을 크게 줄입니다.",

"sox30.section5.title": "워크스루는 환경이 실제로 어떻게 운영되는지 드러냅니다",
"sox30.section5.p1": "어느 시점에서 조직은 통제 문서화에서 실제 운영 방식 검증으로 이동합니다.",
"sox30.section5.p2": "일반적으로 이 단계에서 격차가 더 뚜렷하게 보입니다.",
"sox30.section5.p3": "자주 드러나는 것은 통제의 부재가 아니라 팀, 시스템 또는 개인 간의 실행 차이입니다. 일부 영역은 엄격히 관리되는 반면, 다른 영역은 비공식 관행이나 조직 내 지식에 크게 의존할 수 있습니다.",
"sox30.section5.p4": "일반적인 이슈는 접근 위생, 변경 규율 및 권한 접근 거버넌스에서 나타나는 경향이 있습니다. 긴급 절차는 존재할 수 있지만 일관되게 문서화되지 않습니다. 공유 계정이나 레거시 접근 구조가 예상보다 오래 남아 있을 수 있습니다.",
"sox30.section5.p5": "이러한 발견사항은 내부적으로 전혀 예상 밖인 경우가 드뭅니다. 그것이 보여주는 것은 운영 기능성과 감사 준비 구조 사이의 차이입니다.",
"sox30.section5.p6": "워크스루의 목적은 즉각적인 개선이 아닙니다. 환경이 어디에서 안정적이며 어디에서 비공식 실행 패턴에 의존하는지 명확히 하는 것입니다.",

"sox30.section6.title": "리더십 정렬이 전환점이 됩니다",
"sox30.section6.p1": "명확성이 향상되면 대화는 개별 통제에서 전체 준비 상태로 이동합니다.",
"sox30.section6.p2": "이 단계에서 리더십은 조직이 어디에 서 있는지, 어떤 격차가 존재하는지, 그리고 불필요한 혼란 없이 공식 테스트로 이동하기 위해 어떤 노력이 필요한지에 대한 통합된 관점이 필요합니다.",
"sox30.section6.p3": "바로 여기에서 CIO와 CFO 간의 정렬이 중요해집니다. SOX 준비는 IT 이니셔티브가 아닙니다. 재무보고 무결성은 재무 프로세스와 이를 지원하는 시스템 모두에 의존하기 때문에 공동 책임입니다.",
"sox30.section6.p4": "가장 중요한 것은 완벽함이 아닙니다. 노출, 통제 성숙도 및 준비 추세에 대한 공유된 이해입니다.",
"sox30.section6.p5": "이 단계에서 어려움을 겪는 조직은 보통 통제가 없어서가 아니라, 해당 통제가 환경 전반에서 어떻게 작동하는지에 대한 통합된 관점이 없기 때문에 어려움을 겪습니다.",

"sox30.section7.title": "대부분의 조직이 노력을 과소평가하는 영역",
"sox30.section7.p1": "빠르게 성장하는 환경 전반에서 몇 가지 패턴이 일관되게 나타납니다.",
"sox30.section7.p2": "통제는 실제보다 더 일관된 것으로 가정되는 경우가 많습니다. 권한 접근 리스크는 자주 과소평가됩니다. 변경 규율은 빠른 성장 기간 동안 약화되는 경향이 있습니다. 시스템 생성 보고서는 항상 충분한 엄격함으로 관리되지 않습니다. 증거 관행은 의도적으로 설계되기보다 자연스럽게 발전합니다.",
"sox30.section7.p3": "개별적으로 이러한 이슈는 즉각적인 실패 지점을 만드는 경우가 드뭅니다. 문제는 누적 효과입니다. 감사 검토 아래에서는 여러 영역의 작은 불일치가 disproportionate한 마찰을 만듭니다.",

"sox30.final.title": "최종 관점",
"sox30.final.p1": "IT SOX 준비는 문서화나 개별 통제 추가만으로 달성되지 않습니다.",
"sox30.final.p2": "조직이 시스템이 어떻게 관리되고, 통제가 실제로 어떻게 운영되며, 증거가 시간이 지나도 해당 통제를 어떻게 일관되게 뒷받침하는지 명확히 설명할 수 있을 때 달성됩니다.",
"sox30.final.p3": "SOX 환경으로 가장 효과적으로 전환하는 조직은 반드시 가장 성숙한 통제 프레임워크를 가진 조직이 아닙니다. 감사인이 해석 없이 환경을 이해할 수 있을 만큼 충분한 명확성, 일관성 및 운영 규율을 갖춘 조직입니다.",
"sox30.final.p4": "그 명확성이 궁극적으로 SOX 준비를 마찰 지점에서 관리 가능한 거버넌스 프로세스로 전환합니다."

},

ja: {
  /* Index */
  "nav.services": "サービス",
  "nav.approach": "アプローチ",
  "nav.insights": "インサイト",
  "nav.about": "会社概要",
  "nav.contact": "お問い合わせ",
  "nav.cta": "相談を予約 →",

  "hero.title": '複雑さを超えた<br><span class="accent">明確さ</span>',
  "hero.lead1": "私たちは、取締役会と経営陣がエンタープライズリスク、テクノロジー、サイバーセキュリティを強化し、監査対応力、規制上の信頼性、業務レジリエンスを高める統制環境を構築できるよう支援します",

  "hero.lead2": "エンタープライズ、IT、サイバー、業務プロセス全体にわたる明確で防御可能な統制フレームワーク 保証水準を犠牲にせず複雑性を低減する、リスクに整合した合理的な統制",
  "hero.lead3": "監査、規制当局、ステークホルダーの精査に耐えうる証跡基準 自信ある意思決定、説明責任、拡張可能な成長を支えるガバナンス構造",

  "statement.headline": "監査対応可能な統制<br>取締役会レベルの信頼",
  "statement.subtext": "過剰なコストを伴わないBig Four品質。<br><br>実務的かつ防御可能な成果により、エンタープライズ、テクノロジー、サイバーセキュリティのリスク環境を強化します。<br><br>監査人、規制当局、実務上の精査に耐えうるよう設計された、ビジネス主導のリスク・統制フレームワーク、テクノロジーガバナンス、AI監督。<br><br>よりシンプルな統制設計。より強い証跡。より少ない想定外。",
  "trust.item1": "リスクアドバイザリー",
  "trust.item2": "内部監査",
  "trust.item3": "サイバーセキュリティ",
"trust.item4": "財務管理",

  "services.heading": "主要アドバイザリーサービス",
  "services.card1.title": "リスクアドバイザリー",
"services.card1.text": "経営層がリスク判断を戦略、規制要件、および業務レジリエンスと整合させることを支援する、エンタープライズリスク、テクノロジーリスク、オペレーショナルリスク、サイバーセキュリティ、およびガバナンス支援",
"services.card2.title": "内部監査および財務管理",
  "services.card2.text": "内部統制、SOX、ICFR、予算管理、財務運営、および報告プロセスに重点を置いた内部監査・財務管理アドバイザリーを通じて、ガバナンスの強化、財務可視性の向上、および監査・業務リスクの低減を支援します。",

  "services.card3.title": "サイバーセキュリティ",
  "services.card3.text": "業務を保護しコンプライアンスを支援する、アイデンティティ、アクセス、クラウド、アプリケーション、データ、第三者リスク統制に焦点を当てたビジネス整合型サイバーセキュリティアドバイザリー",

  "common.learnMore": "詳しく見る",
  "band.leftTitle": "リスクエクスポージャーから",
  "band.big": '<span class="accent">リスクへの信頼へ</span>',
  "band.link": "私たちのアプローチを見る",
  "why.title": "Primevantが選ばれる理由",
  "why.reason1.title": "Big 4水準の品質基準。",
  "why.reason1.text": "方法論に基づく。<br>監査に耐えうる。",
  "why.reason2.title": "ブティック型の機動力。",
  "why.reason2.text": "パートナーが直接関与。<br>より迅速な意思決定。",
  "why.reason3.title": "経営層向けの提供力。",
  "why.reason3.text": "取締役会向けの洞察。<br>単なる業務ノイズではありません。",
  "footer.privacy": "プライバシー",

  /* Services */
  "services.heroTitle": "ビジネス主導の<br>エンタープライズリスク＆<br><span style='color:var(--blue2)'>統制アドバイザリー</span>。",
  "services.heroLead": "私たちは、組織が強固なガバナンスを確立し、リスクを明確で実行可能な成果へと変換することで、経営陣の明確性と自信を持った防御可能な意思決定を可能にします。",
  "services.sectionTitle": "サービスライン",

  "services.sox.title": "リスクアドバイザリー",
  "services.sox.subtitle": "エンタープライズ、業務、財務、テクノロジーリスクを事業戦略に整合させます",
  "services.sox.desc": "主な重点領域",
  "services.sox.offeringsTitle": "代表的なサービス",
  "services.sox.b1": "エンタープライズリスク管理（ERM）",
  "services.sox.b2": "業務および財務リスク評価",
  "services.sox.b4": "変革リスク（ERP、M&A、新製品）",
  "services.sox.b5": "規制およびコンプライアンスリスク",
  "services.sox.b7": "エンタープライズSOX準備・是正スプリント",
  "services.sox.b8": "エンタープライズおよびプロセスレベルのリスク評価",
  "services.sox.b10": "SOC 2準備、評価、監査支援",
  "services.sox.b12": "AIガバナンスおよび統制アドバイザリー（ポリシー＋監督）",
  "services.sox.b13": "第三者リスク管理",

"services.opt.title": "内部監査および財務管理",
  "services.opt.subtitle": "業務プロセスとITシステム全体で、監査対応可能な統制環境を設計し維持します",
  "services.opt.desc": "主な重点領域",
  "services.opt.offeringsTitle": "代表的なサービス",
  "services.opt.b1": "SOX / ICFR（業務＋IT統制）",
  "services.opt.b2": "内部監査の変革および共同実施",
  "services.opt.b3": "業務プロセス統制（R2R、O2C、P2P、在庫、給与）",
  "services.opt.b4": "ITGCおよびアプリケーション統制",
  "services.opt.b5": "監査対応準備および是正",
  "services.opt.b7": "システム導入レビュー（稼働前／稼働後）",
  "services.opt.b8": "SOXプログラムの設計および実行",
  "services.opt.b9": "業務プロセスウォークスルーおよび統制設計",
  "services.opt.b10": "ERP統制フレームワーク（SAP、Oracle、Workday）の合理化および最適化",

  "services.itgc.title": "サイバーセキュリティ",
  "services.itgc.subtitle": "安全でレジリエントなテクノロジー環境を通じて、業務運営と財務の完全性を保護します",
  "services.itgc.desc": "主な重点領域",
  "services.itgc.offeringsTitle": "代表的なサービス",
  "services.itgc.b1": "ビジネス影響に整合したサイバーリスク",
  "services.itgc.b2": "アイデンティティ、アクセス、特権統制",
  "services.itgc.b3": "クラウドおよびSaaSリスク（財務データ、報告システム）",
  "services.itgc.b4": "アプリケーションおよびデータセキュリティ",
  "services.itgc.b5": "SOXおよび規制コンプライアンスを支えるテクノロジーリスク",
  "services.itgc.b6": "セキュリティアーキテクチャおよびリスク評価",
  "services.itgc.b7": "IAM / 特権アクセスガバナンス",
  "services.itgc.b8": "情報セキュリティおよびリスク評価（ISO 27001、NIST CSF、その他フレームワーク）",
  "services.itgc.b9": "データ完全性および保護戦略",
  "services.itgc.b13": "SOX / ICFRに整合したセキュリティ統制",

  "services.cta": "業界別の規制観点をご希望ですか？ <span>業界を見る</span> →",

  "services.models.title": "エンゲージメントモデル",
  "services.models.m1": "固定報酬スプリント - 明確に定義された成果と迅速な実行に最適です。マイルストーンと明確な成果物リストを含みます。",
  "services.models.m2": "上限付きT&M - 複雑性が変動する是正対応に適しています。合意された上限額と週次の消化状況可視化を含みます。",
  "services.models.m3": "リテイナー - 限定された時間、対応期待値、四半期計画を含む継続的アドバイザリー。",

  "services.addons.title": "任意の追加サービス（安定化後）",
  "services.addons.intro": "IT統制基盤が安定した後、Primevant Advisoryは隣接するリスク優先事項を支援できます。",
  "services.addons.a1": "サイバーリスク評価およびガバナンス",
  "services.addons.a2": "第三者リスク支援（SOCレポートレビュー、統制マッピング）",
  "services.addons.a3": "AIガバナンスおよび統制アドバイザリー（ポリシー＋監督）",

  /* Industries */
  "industries.kicker": "業界",
  "industries.heroTitle": "貴社の業界が実際に運営される方法に整合した<br><span>規制観点</span>。",
  "industries.heading": "支援する業界",
  "industries.intro": "Primevant Advisoryは、強固なガバナンス、レジリエントなシステム、監査対応可能な統制が不可欠な、高度に規制されたテクノロジー主導の業界に属する組織を支援します。当社の経験は、複雑な企業環境におけるリスクと統制、サイバーセキュリティガバナンス、プライバシー義務、規制コンプライアンスに及びます。<br><br>私たちはリーダーシップチームと協力し、規制上の期待事項を、リスク監督と業務レジリエンスを強化する実務的で持続可能な統制環境へと変換します。",

  "industries.fs.title": "金融サービス",
  "industries.fs.text": "Primevant Advisoryは、金融機関がSOX、GLBA、FFIECガイダンス、PCI DSSなどの監督上の期待事項およびフレームワークにリスクとサイバーセキュリティガバナンスを整合させ、財務報告の完全性、業務レジリエンス、顧客信頼を支える統制を強化できるよう支援します。",

  "industries.healthcare.title": "ヘルスケア",
  "industries.healthcare.text": "Primevant Advisoryは、医療機関がHIPAAのプライバシーおよびセキュリティ上の期待事項に整合したガバナンスとセキュリティ実務を強化し、機密性の高い患者情報を保護しながら、重要な臨床システムの信頼性と継続性を確保できるよう支援します。",

  "industries.saas.title": "テクノロジー / SaaS",
  "industries.saas.text": "Primevant Advisoryは、テクノロジーおよびSaaS企業がSOCレポーティングやISOに整合したセキュリティプログラムなどの業界保証フレームワークに、ガバナンス、リスク管理、セキュリティ実務を整合させ、プライバシーコンプライアンス、業務レジリエンス、顧客信頼を支える拡張可能な統制環境を実現できるよう支援します。",

  "industries.manufacturing.title": "製造業",
  "industries.manufacturing.text": "Primevant Advisoryは、製造業の組織がエンタープライズITおよび運用技術環境全体でガバナンスとサイバーセキュリティを強化し、統制環境、業務レジリエンス、知的財産保護、安全で信頼性の高い生産システムを支援できるよう支援します。",

  "industries.retail.title": "消費財 / 小売",
  "industries.retail.text": "Primevant Advisoryは、消費財および小売企業がリスクガバナンス、決済セキュリティ、データ保護実務を強化し、安全なデジタルコマース、規制コンプライアンス、継続的な顧客信頼を支援できるよう支援します。",

  "industries.other.title": "その他の規制環境",
  "industries.other.text": "Primevant Advisoryは、規制環境で事業を行う組織が、ガバナンスとサイバーセキュリティ実務を業界固有の規制期待事項および連邦セキュリティフレームワークに整合させ、レジリエントで監査対応可能な統制プログラムを構築できるよう支援します。",

  /* Approach */
  "approach.heroTitle": "迅速に実行<br><span style='color:var(--blue2)'>安全な提供<br></span>明確な範囲。",
  "approach.heroLead": "ブティック型のスピードとBig 4水準の厳格さ、取締役会向け成果物、監査に耐えうる文書化、持続可能な進行リズム。",

  "approach.sectionTitle": "Primevantの提供モデル",

  "approach.assess.title": "評価",
  "approach.assess.text": "現状、主要リスク、ステークホルダーの期待事項を確認し、防御可能な統制と証跡に至る最短経路を定義します <br><br>成果物：スコープメモ、タイムライン、成果物、証跡期待事項",

  "approach.align.title": "整合",
  "approach.align.text": "スコープ拡大を防ぐため、対象範囲／対象外範囲、ステークホルダーの役割、変更管理を明確に設定します。<br><br>成果物：キックオフ計画、RAIDログ、週次ステータスリズム",

  "approach.deliver.title": "提供",
  "approach.deliver.text": "監査対応可能な文書化と実務的な是正支援を通じて、マイルストーンに沿って実行します。<br><br>成果物：更新されたRCM／ナラティブ、証跡プレイブック、是正トラッカー",

  "approach.sustain.title": "定着",
  "approach.sustain.text": "進捗がエンゲージメント終了後も維持されるよう、クライアントチームにテンプレート、基準、ナレッジ移転を提供します。<br><br>成果物：運用リズム、トレーニングノート、引き継ぎチェックリスト",

  "approach.security.title": "セキュリティと機密性",
  "approach.security.text": "Primevantはクライアント情報を慎重に取り扱います。エンゲージメントでは、安全なリポジトリ、最小権限アクセス、定義された保存実務を使用します。<br><br>必要に応じて、クライアントのセキュリティ要件やベンダーオンボーディングプロセスに整合できます。",

  "approach.communication.title": "コミュニケーション",
  "approach.communication.text": "クライアントは、進捗、リスク、必要な意思決定、次のステップを含む明確な週次ステータス更新を受け取ります。<br><br>標準リズム：週次ステータス＋必要に応じたワーキングセッション。",

  /* Insights */
  "insights.heroCta": "Primevantインサイト",
  "insights.title": "リスクの明確性<br><span style='color:var(--blue2)'>統制インサイト</span><br>経営層の信頼",
  "insights.lede": "明確性、統制、信頼を求めるCFO、CIO、CISO、内部監査リーダーのために設計された、エンタープライズリスク、テクノロジー、統制に関する実務的な洞察。",
  "insights.p1.title": "30日でのSOX準備",
  "insights.p1.text": "スコープ、ナラティブ、ウォークスルー、証跡基準、是正トラッキングの現実的な進め方。",
  "insights.read": "記事を読む →",

  "insights.p2.title": "AIガバナンスと統制準備：取締役会が本当に必要とするもの",
  "insights.p2.text": "組織が実務的なAIガバナンスを確立し、説明責任を定義し、イノベーション、リスク、規制上の期待事項のバランスを取る統制を実装する方法。",

  "insights.p3.title": "サイバーリスクと第三者エクスポージャー：企業統制環境における最も弱いリンクの強化",
  "insights.p3.text": "一時点の評価を超え、継続的でリスクに整合した監督へ移行しながら、企業全体のサイバーおよびベンダーリスクを特定、評価、管理する方法。",
  "insights.coming": "近日公開 →",

  "insights.featured": "注目",

  "insights.f1.title": "急成長企業におけるSOX準備",
  "insights.f1.text": "監査上の摩擦がどこから生じるのか、そして早期に標準化すべきもの（オーナー、リズム、証跡）。",

  "insights.f2.title": "ITリスクガバナンスのための取締役会報告",
  "insights.f2.text": "運用指標から、監督上の意思決定を支える取締役会レベルのKRIへ移行します。",

  "insights.f3.title": "監査人が求めるAIガバナンス統制",
  "insights.f3.text": "統制テーマ：インベントリ、承認、モニタリング、ライフサイクル文書化。",

  "insights.readPost": "記事を読む",

  "aiGov.title": "",
  "aiGov.subtitle": " ",

  "aiGov.intro1": "人工知能は、多くのガバナンス構造が想定していた速度を上回って進化しています。さまざまな業界の組織は、分析、業務、顧客対応、ソフトウェア開発、意思決定プロセスにAIを組み込んでおり、その速度は周辺の統制環境の成熟度を上回ることが少なくありません。",
  "aiGov.intro2": "取締役会もそれに応じて対応しています。リーダーシップチームは現在、AI導入に関連する説明責任、監督、規制上のエクスポージャー、業務リスクについて直接的な質問を受けています。",
  "aiGov.intro3": "多くの組織がAIガバナンス上の課題を抱える理由は、ポリシーや原則がないからではありません。運用上の規律が不足しているからです。",

  "aiGov.section1.title": "ガバナンスはスコープから始まります",
  "aiGov.section1.p1": "AIガバナンスにおける初期の失敗の一つは、識別段階で発生します。組織は、AIが実際にビジネス全体のどこで稼働しているのかを把握する難しさを過小評価しがちです。",
  "aiGov.section1.p2": "AI導入が単一の中央集権的な取り組みを通じて組織に入ることはまれです。部門、プラットフォーム、ベンダーツール、ビジネス主導の実験を通じて段階的に広がります。",
  "aiGov.section1.p3": "経営陣がAIがどこでビジネス活動に影響を与えているのかを自信を持って特定できなければ、意味のある監督は不可能です。",
  "aiGov.section1.li1": "AIが「スコープ内」に該当するかを判断する明確な基準",
  "aiGov.section1.li2": "AI対応システムおよびユースケースの中央管理されたインベントリ",
  "aiGov.section1.li3": "定義された所有責任",
  "aiGov.section1.li4": "業務上および規制上のエクスポージャーに整合したリスク階層基準",
  "aiGov.section1.li5": "高リスク実装に対するエスカレーション基準",
  "aiGov.section1.p4": "ガバナンスのスコープは、社内開発モデルを超えて拡張される必要があります。今日、最も重要なエクスポージャーの一部は、AI機能が組み込まれた第三者プラットフォームから生じています。",

  "aiGov.section2.title": "ナラティブは統制テストよりも早く弱点を明らかにします",
  "aiGov.section2.p1": "スコープが確立されると、組織はしばしばすぐに統制評価へ進みます。実務上、最も価値のあるガバナンス活動の一つは、より技術的でない運用ナラティブの作成です。",
  "aiGov.section2.p2": "十分に作成されたナラティブは、ビジネスステークホルダー、テクノロジーチーム、コンプライアンス機能、リーダーシップの整合を促します。",
  "aiGov.section2.li1": "AIプロセスのビジネス目的",
  "aiGov.section2.li2": "関係するシステム、データソース、依存関係",
  "aiGov.section2.li3": "意思決定ポイントおよび人による監督活動",
  "aiGov.section2.li4": "自動化またはモデル利用によって導入されるリスク",
  "aiGov.section2.li5": "それらのリスクを軽減するための統制活動",
  "aiGov.section2.li6": "説明責任およびエスカレーション責任",
  "aiGov.section2.li7": "実行を通じて生成される証跡",
  "aiGov.section2.p3": "ナラティブは、技術系および非技術系ステークホルダーの間に共通言語を作ります。取締役会に必要なのは機械学習アーキテクチャの詳細ではなく、ガバナンス責任がどのように実行されているかについての可視性です。",

  "aiGov.section3.title": "ウォークスルーはガバナンスが実際に存在するかを明らかにします",
  "aiGov.section3.p1": "ポリシーは意図を説明します。ウォークスルーは現実を明らかにします。",
  "aiGov.section3.p2": "組織はウォークスルーの中で、ガバナンスモデルが運用実態よりもプレゼンテーション資料の中でより明確に存在していることに気づくことがよくあります。",
  "aiGov.section3.li1": "AIシステムが本番環境へ移行する方法",
  "aiGov.section3.li2": "承認および変更管理活動",
  "aiGov.section3.li3": "人によるレビューおよびオーバーライドの仕組み",
  "aiGov.section3.li4": "データ検証手続",
  "aiGov.section3.li5": "モニタリングおよび例外管理",
  "aiGov.section3.li6": "アクセス統制および職務分掌の実務",
  "aiGov.section3.li7": "インシデントエスカレーションプロセス",
  "aiGov.section3.li8": "文書保存に関する期待事項",
  "aiGov.section3.p3": "取締役会はウォークスルーを単なる監査手続ではなく、ガバナンス検証活動として捉えるべきです。",

  "aiGov.section4.title": "証跡基準は重要なガバナンス課題になりつつあります",
  "aiGov.section4.p1": "AI監督が成熟するにつれ、ガバナンスの議論はますます証跡の議論になります。",
  "aiGov.section4.p2": "組織はレビュー、承認、モニタリング活動、監督手続を一貫して実施しているかもしれませんが、それらの活動を信頼できる証跡で示せなければ、統制環境を防御することは困難になります。",
  "aiGov.section4.li1": "どの文書を保存すべきか",
  "aiGov.section4.li2": "証跡がどこに保管されているか",
  "aiGov.section4.li3": "保存に関する所有責任",
  "aiGov.section4.li4": "保存期間",
  "aiGov.section4.li5": "統制実行を証跡化するための基準",
  "aiGov.section4.li6": "証跡の完全性を検証する手続",
  "aiGov.section4.p3": "取締役会にすべての運用成果物への可視性が必要なわけではありません。必要なのは、経営陣のガバナンス主張を外部の精査に耐える形で支えられる証跡実務への信頼です。",

  "aiGov.section5.title": "是正規律がガバナンスの信頼性を決定します",
  "aiGov.section5.p1": "統制ギャップや運用上の不整合がまったくないガバナンス環境はありません。成熟した組織と準備不足の組織を分けるのは、経営陣が問題を早期に特定し、責任を明確に割り当て、規律をもって不備を是正できるかどうかです。",
  "aiGov.section5.li1": "定義されていない所有構造",
  "aiGov.section5.li2": "一貫性のない承認",
  "aiGov.section5.li3": "不完全な文書化",
  "aiGov.section5.li4": "弱いモニタリング実務",
  "aiGov.section5.li5": "第三者監督のギャップ",
  "aiGov.section5.li6": "データガバナンス上の懸念",
  "aiGov.section5.li7": "ポリシー要件と運用実行の不整合",
  "aiGov.section5.p2": "取締役会は、事業部門全体で繰り返される問題に注意を払うべきです。繰り返し発生する例外は、個別の運用失敗ではなく、ガバナンス設計のより広範な弱点を示すことが多いからです。",

  "aiGov.final.title": "取締役会が本当に必要とするもの",
  "aiGov.final.p1": "多くの取締役会は人工知能の専門家になろうとしているわけではありません。経営陣がAIを責任を持って展開し、その実務を外部の精査に耐えうる形で防御できるだけの運用規律を確立しているかを判断しようとしているのです。",
  "aiGov.final.p2": "そのためには、AIがどこに存在するのかについての可視性、説明責任の明確性、統制が一貫して機能していることを示す証跡、そして問題が重大な事象になる前に表面化するという信頼が必要です。",
  "aiGov.final.li1": "スコープを定義する",
  "aiGov.final.li2": "運用ナラティブを作成する",
  "aiGov.final.li3": "ウォークスルーを通じて実行を検証する",
  "aiGov.final.li4": "証跡期待事項を標準化する",
  "aiGov.final.li5": "規律ある是正トラッキングを実装する",
  "aiGov.final.p3": "成功する組織は、必ずしもAI導入の速度が最も速い組織ではありません。むしろ、ガバナンスの成熟度が導入後ではなく導入と並行して進化したことを示せる組織である可能性が高いです。",

  "thirdParty.title": "",
  "thirdParty.subtitle": "ますます相互接続される環境において、AIガバナンス、説明責任、防御可能な統制を確立するための実務的アプローチ",

  "thirdParty.intro1": "多くの組織は、もはや明確に定義されたテクノロジー境界の中で運営されていません。重要な業務運営は現在、クラウドプロバイダー、ソフトウェアプラットフォーム、マネージドサービスプロバイダー、データ処理業者、AI対応ベンダー、外部開発パートナーからなる拡大したネットワークに依存しています。",
  "thirdParty.intro2": "多くの組織において、最も重要な統制上の弱点はもはや内部から生じるものではありません。事業が運用上依存している一方で、内部システムと同じ厳格さでは十分に管理していない第三者関係を通じて発生します。",
  "thirdParty.intro3": "取締役会、規制当局、顧客、外部監査人は、特にAI対応技術がベンダー統合の速度と複雑性を高める中で、組織が第三者のサイバーエクスポージャーをどのように評価しているかに対して、より厳しい目を向けています。",

  "thirdParty.section1.title": "第三者リスクは運用ガバナンス上の課題になりました",
  "thirdParty.section1.p1": "多くの組織は、依然として定期的なリスク評価とベンダーオンボーディングレビューを中心に第三者サイバー監督を構成しています。これらの活動は重要であり続けますが、それだけではもはや十分ではありません。",
  "thirdParty.section1.p2": "第三者エクスポージャーは現在、日常業務に深く組み込まれています。クラウドプロバイダーは重要インフラをホストし、SaaSプラットフォームは財務報告や業務ワークフローを支え、マネージドサービスプロバイダーは中核環境への特権アクセスを維持します。",
  "thirdParty.section1.p3": "「承認済みベンダー」が自動的に「承認済みAI利用」を意味するという前提は、重要なガバナンス上の盲点になりつつあります。",
  "thirdParty.section1.li1": "どの第三者が重要なサイバーまたはAI関連エクスポージャーをもたらしているか",
  "thirdParty.section1.li2": "それらのベンダーがアクセスできるシステムおよびデータ",
  "thirdParty.section1.li3": "AI機能がベンダープラットフォームに組み込まれているか",
  "thirdParty.section1.li4": "ベンダー監督に対する内部責任がどのように割り当てられているか",
  "thirdParty.section1.li5": "時間の経過とともに変化するリスクを監視するために存在する統制",
  "thirdParty.section1.p4": "これには、調達およびコンプライアンス機能を超えたガバナンスアプローチが必要です。サイバーおよびAI関連の第三者エクスポージャーは、現在、エンタープライズリスク管理の中心に位置しています。",

  "thirdParty.section2.title": "説明責任は組織が想定するよりも早く崩れます",
  "thirdParty.section2.p1": "第三者ガバナンスにおける最も根強い弱点の一つは、不明確な所有権です。",
  "thirdParty.section2.p2": "ベンダー関係は、調達、法務、テクノロジー、セキュリティ、コンプライアンス、業務、ビジネスリーダーシップを同時にまたぐことが多いです。責任が組織上定義されているように見えても、運用上の説明責任はしばしば断片化します。",
  "thirdParty.section2.p3": "AI対応ベンダーはこれをさらに複雑にしています。組織は、中核的な処理ロジック、モデル挙動、意思決定メカニズムが顧客に対して部分的に不透明な技術をますます採用しています。",
  "thirdParty.section2.li1": "重要なベンダー関係に対する経営陣の所有責任",
  "thirdParty.section2.li2": "運用利用に紐づくリスク説明責任",
  "thirdParty.section2.li3": "新たな懸念に対する正式なエスカレーション経路",
  "thirdParty.section2.li4": "AI機能変更に紐づくガバナンスレビューのトリガー",
  "thirdParty.section2.li5": "セキュリティ、法務、コンプライアンス、業務を含む部門横断的な監督体制",
  "thirdParty.section2.p4": "共有責任モデルは、説明責任が明確に維持される場合にのみ機能します。多くの組織では、それが責任を拡散させる仕組みになってしまいます。",

  "thirdParty.section3.title": "実務的なAIガバナンスには運用統制が必要です",
  "thirdParty.section3.p1": "多くの組織は、依然としてAIガバナンスを概念レベルで捉えています。ポリシーは存在し、原則も作成され、ガバナンス委員会も定期的に開催されています。しかし、その下にある運用統制は未成熟、または一貫性なく実装されていることが少なくありません。",
  "thirdParty.section3.p2": "実務的なAIガバナンスでは、AI対応技術が運用上どのように導入され、監視され、管理されているかを検証できる統制を確立する必要があります。",
  "thirdParty.section3.li1": "AIインベントリおよび分類プロセス",
  "thirdParty.section3.li2": "導入前のガバナンスレビュー要件",
  "thirdParty.section3.li3": "高リスクユースケースのための定義された承認ワークフロー",
  "thirdParty.section3.li4": "データ取扱いおよび保存基準",
  "thirdParty.section3.li5": "重要な意思決定に対する人による監督要件",
  "thirdParty.section3.li6": "ベンダー変更に対する継続的モニタリング手続",
  "thirdParty.section3.li7": "インシデントまたは統制不備に対するエスカレーションプロトコル",
  "thirdParty.section3.p3": "AIガバナンスは、エンタープライズリスク管理から切り離された別個のイノベーションフレームワークとして運営されるべきではありません。既存のガバナンス原則を、より高い運用規律で適用する拡張として機能すべきです。",

  "thirdParty.section4.title": "第三者デューデリジェンスは継続的な活動になっています",
  "thirdParty.section4.p1": "歴史的に、多くの組織はベンダーデューデリジェンスを一時点の活動として捉えていました。オンボーディング時に評価が実施され、契約が締結され、大きなインシデントが発生しない限り、モニタリング活動は時間とともに軽くなっていきました。",
  "thirdParty.section4.p2": "第三者環境は現在、継続的に進化しています。ベンダーは新しいAI機能を導入し、データ処理実務を変更し、サブコントラクター利用を拡大し、インフラを移行し、従来のガバナンスサイクルが監視するよう設計されていた速度をはるかに上回るペースでサービスモデルを変更します。",
  "thirdParty.section4.li1": "重要ベンダーの継続的モニタリング",
  "thirdParty.section4.li2": "運用依存度に基づくリスク階層化",
  "thirdParty.section4.li3": "技術変更に紐づくトリガーベースの再評価",
  "thirdParty.section4.li4": "AI対応サービスに対する強化されたガバナンスレビュー",
  "thirdParty.section4.li5": "より厳格な文書化および証跡基準",
  "thirdParty.section4.li6": "重要な第三者エクスポージャーに対する取締役会レベルの可視性",
  "thirdParty.section4.p3": "サイバーおよびAI関連リスクは、もはや静的なガバナンス課題ではありません。継続的な可視性と再評価を必要とする動的な運用リスクです。",

  "thirdParty.section5.title": "精査の下では証跡と文書化がより重要になります",
  "thirdParty.section5.p1": "組織は、規制当局、監査人、顧客、法務ステークホルダーが関与すると、ガバナンスの議論がどれほど早く証跡の議論に変わるかを過小評価しがちです。",
  "thirdParty.section5.li1": "評価は実際に実施されたのか？",
  "thirdParty.section5.li2": "懸念事項は適切にエスカレーションされたのか？",
  "thirdParty.section5.li3": "承認は文書化されたのか？",
  "thirdParty.section5.li4": "導入前にAI関連リスクは評価されたのか？",
  "thirdParty.section5.li5": "モニタリング活動は一貫して実施されたのか？",
  "thirdParty.section5.li6": "例外は効果的に是正されたのか？",
  "thirdParty.section5.p2": "防御可能な証跡がなければ、ガバナンス上の主張は急速に弱まります。",
  "thirdParty.section5.li7": "証跡保存の期待事項",
  "thirdParty.section5.li8": "文書化基準",
  "thirdParty.section5.li9": "レビュー手続",
  "thirdParty.section5.li10": "エスカレーション記録",
  "thirdParty.section5.li11": "例外管理トラッキング",
  "thirdParty.section5.li12": "ガバナンス委員会報告",
  "thirdParty.section5.p3": "監査や規制照会に効果的に対応する組織は、必ずしも最も精緻なガバナンスフレームワークを持つ組織ではありません。むしろ、運用ガバナンス活動が時間を通じて一貫して実施されたことを示す明確な証跡を提示できる組織であることが多いです。",

  "thirdParty.final.title": "取締役会が問うべきこと",
  "thirdParty.final.p1": "取締役会がすべてのベンダー関係を個別に評価する必要はありません。しかし、経営陣が重要な第三者サイバーおよびAI関連エクスポージャーがどこに存在するかを理解し、ガバナンス実務が運用依存度に追いついているかについての信頼は必要です。",
  "thirdParty.final.li1": "どの第三者が当社に最も高い運用上および規制上のエクスポージャーをもたらしているか？",
  "thirdParty.final.li2": "AI機能はベンダープラットフォームを通じてどこに導入されているか？",
  "thirdParty.final.li3": "ガバナンス責任は社内でどのように割り当てられているか？",
  "thirdParty.final.li4": "継続的監督を検証する統制は何か？",
  "thirdParty.final.li5": "経営陣は新たな第三者リスク課題をどれほど迅速に特定できるか？",
  "thirdParty.final.li6": "ガバナンス活動は外部の精査に対して証跡化できるか？",
  "thirdParty.final.p2": "規律あるガバナンス構造を早期に確立する組織は、イノベーション、業務レジリエンス、規制上の期待事項を同時にバランスさせるうえではるかに強い立場に立てます。",
  "thirdParty.final.p3": "長期的には、最も強固な統制環境を持つのは、必ずしも第三者依存が最も少ない組織ではありません。むしろ、外部リスクエクスポージャーが内部に期待されるのと同じ厳格さで管理されていることを示せる組織である可能性が高いです。",

  "soxScaling.title": " ",
  "soxScaling.subtitle": " ",

  "soxScaling.intro1": "急成長する組織が苦労するのは、有能な人材や強い事業推進力が不足しているからではほとんどありません。より一般的には、業務成長が財務報告、テクノロジーガバナンス、統制実行を支えるプロセスの成熟度を上回るときに、圧力が高まり始めます。",
  "soxScaling.intro2": "この段階に入る多くの組織は、ゼロから始めているわけではありません。承認プロセスはすでに存在し、レビューも行われています。財務チームやテクノロジーチームは、ビジネス全体でさまざまな形の監督を実施しています。",
  "soxScaling.intro3": "この移行を最も効果的に乗り越える組織は、SOX準備とはコンプライアンス層を追加することではなく、複雑性がさらに拡大する前に運用規律を標準化することであると早期に認識する傾向があります。",

  "soxScaling.section1.title": "監査上の摩擦は通常、正式なテストの前に始まります",
  "soxScaling.section1.p1": "多くの企業は、監査上の摩擦はテスト活動が始まってから生じると考えます。実際には、数年にわたって自然に発展してきたプロセスを文書化し始める時点で、負荷はより早く表面化します。",
  "soxScaling.section1.p2": "急成長企業は自然にスピードを最適化します。チームは迅速に適応し、責任は頻繁に移り、プロセスは拡大を支えるために継続的に進化します。",
  "soxScaling.section1.li1": "類似した統制がチームごとに異なる方法で実施されている",
  "soxScaling.section1.li2": "非公式なコミュニケーションチャネルを通じて承認が行われている",
  "soxScaling.section1.li3": "重要なレビュー活動が特定の個人に依存している",
  "soxScaling.section1.li4": "証跡保存実務に一貫性がない",
  "soxScaling.section1.li5": "正式なガバナンスなしに技術変更が実装されている",
  "soxScaling.section1.li6": "反復的な統制所有者に関する明確性が限定的である",
  "soxScaling.section1.p3": "外部監査人は、運用チームとは異なる観点で一貫性を評価します。実務上十分に機能しているレビュー統制であっても、四半期、レビュー担当者、事業部門によって実行方法が異なれば、テスト時に問題となる可能性があります。",

  "soxScaling.section2.title": "統制所有権には、多くの成長企業が想定する以上の構造が必要です",
  "soxScaling.section2.p1": "SOX準備における初期の圧力点の一つは、説明責任の構造です。急成長する組織では、責任はビジネス自体の拡大に合わせて頻繁に拡大します。",
  "soxScaling.section2.p2": "多くの組織は、運用オーナーはいるものの、明確に定義された統制オーナーがいないことに気づきます。誰かがプロセスの日常的な運用を理解していても、実行、証跡保存、エスカレーション管理、継続的な一貫性に対する説明責任が不明確な場合があります。",
  "soxScaling.section2.p3": "成熟したSOX環境へより効果的に移行する企業は、一般的に想定よりも早い段階で所有権構造を確立します。",

  "soxScaling.section3.title": "複雑性が高まるにつれ、実行リズムの規律がますます重要になります",
  "soxScaling.section3.p1": "監査上の摩擦のもう一つの一般的な原因は、実行タイミングの不一致です。成長企業では、運用上の優先順位が常に変化し、反復的なガバナンス活動が規律あるものではなく、徐々に反応的なものになりがちです。",
  "soxScaling.section3.p2": "監査の観点では、タイミングの不一致は通常、監督規律と統制信頼性に関するより大きな懸念を示します。",
  "soxScaling.section3.li1": "定義された実行タイムライン",
  "soxScaling.section3.li2": "標準化されたレビュー予定",
  "soxScaling.section3.li3": "カレンダー主導の認証活動",
  "soxScaling.section3.li4": "実行遅延に対するエスカレーション手続",
  "soxScaling.section3.li5": "定期的な経営監督レビュー",
  "soxScaling.section3.p3": "これらの規律は当初は管理的に見えるかもしれませんが、監査上の精査が高まるにつれて非常に価値のある運用上の予測可能性を生み出します。",

  "soxScaling.section4.title": "証跡基準は通常、統制設計よりも多くの摩擦を生みます",
  "soxScaling.section4.p1": "SOX準備を進める多くの組織は、統制設計に大きな注意を払う一方で、証跡規律の運用上の重要性を過小評価します。",
  "soxScaling.section4.p2": "レビューは行われ、承認は完了し、照合は作成され、アクセス判断はなされます。しかし、それを支える証跡は、メールチェーン、スプレッドシート、メッセージングプラットフォーム、チケットシステム、または文書化されていないワークフローに分散している可能性があります。",
  "soxScaling.section4.li1": "どの証跡を保存すべきか",
  "soxScaling.section4.li2": "文書がどこに保管されるべきか",
  "soxScaling.section4.li3": "承認の追跡可能性に関する期待事項",
  "soxScaling.section4.li4": "命名規則および保存期間",
  "soxScaling.section4.li5": "レビューの完全性を示すための基準",
  "soxScaling.section4.li6": "例外を文書化する手続",
  "soxScaling.section4.p3": "監査を最も効果的に管理する企業は、事業が拡大して証跡管理が断片化する前に、十分早く運用上の一貫性を導入した組織であることが多いです。",

  "soxScaling.section5.title": "テクノロジー環境は通常、ガバナンスプロセスよりも速く拡張します",
  "soxScaling.section5.p1": "組織の成長期には、テクノロジーの複雑性が急速に高まる傾向があります。ERP導入、クラウド移行、SaaS拡大、買収、オートメーション施策、変化する報告環境は、すべて追加的なガバナンス要求をもたらします。",
  "soxScaling.section5.p2": "多くの企業では、テクノロジー環境が周辺の統制構造よりも運用上早く成熟します。",
  "soxScaling.section5.li1": "一貫性のないアクセスガバナンス",
  "soxScaling.section5.li2": "過剰な特権アクセス",
  "soxScaling.section5.li3": "弱い変更管理の追跡可能性",
  "soxScaling.section5.li4": "限定的なシステム所有権の明確性",
  "soxScaling.section5.li5": "不完全なインターフェースモニタリング",
  "soxScaling.section5.li6": "急速な導入の中で発生した手作業の回避策",
  "soxScaling.section5.p3": "アクセス管理、変更ガバナンス、文書化期待事項、システム説明責任を早期に標準化することで、後の大きな運用負荷を軽減できる傾向があります。",

  "soxScaling.final.title": "企業が早期に標準化すべきこと",
  "soxScaling.final.p1": "組織はしばしば、正式なSOX準備をいつ始めるべきかを尋ねます。より有用な議論は、監査上の圧力が高まる前に、どの運用規律を標準化すべきかに焦点を当てることです。",

  "soxScaling.final.ownership": "所有権",
  "soxScaling.final.ownership.li1": "明確な統制説明責任",
  "soxScaling.final.ownership.li2": "定義されたレビュー責任",
  "soxScaling.final.ownership.li3": "エスカレーションおよび委任手続",
  "soxScaling.final.ownership.li4": "部門横断的なガバナンス整合",

  "soxScaling.final.cadence": "リズム",
  "soxScaling.final.cadence.li1": "標準化された実行スケジュール",
  "soxScaling.final.cadence.li2": "カレンダー主導のガバナンス活動",
  "soxScaling.final.cadence.li3": "タイムリーなレビュー期待事項",
  "soxScaling.final.cadence.li4": "一貫したモニタリングルーティン",

  "soxScaling.final.evidence": "証跡",
  "soxScaling.final.evidence.li1": "定義された文書化基準",
  "soxScaling.final.evidence.li2": "中央管理された保存実務",
  "soxScaling.final.evidence.li3": "明確な承認追跡性",
  "soxScaling.final.evidence.li4": "統制実行を支える反復可能な証跡",

  "soxScaling.final.p2": "ガバナンス成熟を遅らせる企業は、SOX準備が想定以上に混乱を招き、リソースを必要とすることをしばしば発見します。",
  "soxScaling.final.p3": "最も効果的に適応する組織は、統制標準化をコンプライアンス施策ではなく、持続可能な成長を支える運用上の拡張性要件として捉える傾向があります。"

  ,

"boardRisk.title": " ",
"boardRisk.subtitle": " ",

"boardRisk.intro1": "多くの組織にはITリスク報告が不足しているわけではありません。ダッシュボードは定期的に作成され、運用指標は継続的に追跡され、経営陣はサイバーセキュリティ活動、技術インシデント、コンプライアンス施策、監査指摘、是正活動に関する広範な更新を受けています。",
"boardRisk.intro2": "しかし、報告量が多いにもかかわらず、取締役会は組織の実際のテクノロジーリスクエクスポージャーを明確に理解しないままガバナンス議論を終えることがよくあります。",
"boardRisk.intro3": "問題はデータ不足であることはまれです。より多くの場合、報告が運用面に偏りすぎており、取締役会が必要とする監督判断、戦略的優先順位付け、リスクに基づく意思決定を支える情報になっていないことです。",
"boardRisk.intro4": "最も進展している組織は、活動量中心の報告から、取締役会がエクスポージャー、方向性、説明責任、意思決定準備状況を評価できる主要リスク指標中心の報告へ移行しています。",

"boardRisk.section1.title": "運用指標は監督上の洞察に変換されにくい",
"boardRisk.section1.p1": "取締役会報告で最も一般的な弱点の一つは、より多くの運用詳細が自動的にガバナンスの可視性を高めるという前提です。",
"boardRisk.section1.p2": "取締役会は、脆弱性件数、フィッシング訓練、パッチ適用統計、チケット完了率、監査活動、セキュリティツール展開状況、コンプライアンス率などの広範な報告を受けても、組織全体のリスク姿勢が改善しているのか悪化しているのかについて意味のある明確性を得られないことがあります。",
"boardRisk.section1.li1": "組織はどこでより多くのエクスポージャーを抱えているのか？",
"boardRisk.section1.li2": "どのリスクが設定された許容水準を超えているのか？",
"boardRisk.section1.li3": "是正活動は重要なエクスポージャーを効果的に低減しているのか？",
"boardRisk.section1.li4": "どの依存関係が集中リスクを生み出しているのか？",
"boardRisk.section1.li5": "運用活動にもかかわらず、どこでガバナンスギャップが継続しているのか？",
"boardRisk.section1.li6": "どの傾向が戦術的管理ではなく戦略的注意を必要としているのか？",
"boardRisk.section1.p3": "最も強力なガバナンス報告環境は、取締役会報告が単なる運用報告の要約ではないことを認識しています。それは異なる枠組み、異なるエスカレーション基準、異なる有効性測定を必要とする別個のガバナンス規律です。",

"boardRisk.section2.title": "効果的なKRIは活動ではなくエクスポージャーに焦点を当てます",
"boardRisk.section2.p1": "組織は取締役会報告指標をKRIと呼ぶことが多いですが、実際には依然として運用KPIを報告している場合があります。",
"boardRisk.section2.p2": "主要業績指標は一般的に実行効率、運用完了、管理活動を測定します。主要リスク指標は、リーダーシップが変化するエクスポージャー水準、新たなガバナンス上の懸念、リスクが許容範囲を超えているかどうかを評価できるようにするものです。",
"boardRisk.section2.li1": "未解決の高リスク課題の集中",
"boardRisk.section2.li2": "重要な是正活動の滞留",
"boardRisk.section2.li3": "重要業務を支える第三者依存関係",
"boardRisk.section2.li4": "サポート終了またはライフサイクル終了技術の増加",
"boardRisk.section2.li5": "特権アクセスエクスポージャーの傾向",
"boardRisk.section2.li6": "高リスク環境における統制例外の頻度",
"boardRisk.section2.li7": "事業部門全体で繰り返される監査指摘",
"boardRisk.section2.li8": "重要業務に影響する重大なサイバーセキュリティインシデント",
"boardRisk.section2.li9": "規制またはレジリエンス上の懸念に紐づくエスカレーション傾向",
"boardRisk.section2.p3": "これらの指標は、運用作業量ではなくリスクの方向性について、取締役会により良い可視性を提供します。",
"boardRisk.section2.p4": "取締役会は一般的に、活動完了率を強調する洗練されたダッシュボードよりも、継続的なガバナンス上の弱点に関する透明な報告からより大きな価値を得ます。",

"boardRisk.section3.title": "取締役会報告は説明責任を明確にすべきです",
"boardRisk.section3.p1": "ITリスク報告のもう一つの一般的な弱点は、明確な説明責任の可視性が欠如していることです。",
"boardRisk.section3.li1": "どの経営幹部が是正責任を持っているのか",
"boardRisk.section3.li2": "是正タイムラインは現実的なのか",
"boardRisk.section3.li3": "部門横断的な調整はどこで失敗しているのか",
"boardRisk.section3.li4": "どのリスクが十分に解決されないままエスカレーションし続けているのか",
"boardRisk.section3.li5": "経営陣は特定のエクスポージャーを正式に受容しているのか",
"boardRisk.section3.p2": "明確な所有責任の可視性がなければ、報告はガバナンス活動が存在するように見せながら、その下にある未解決の実行上の課題を覆い隠す可能性があります。",
"boardRisk.section3.li6": "重要リスクに対する経営幹部の所有責任",
"boardRisk.section3.li7": "未解決エクスポージャーに紐づく滞留分析",
"boardRisk.section3.li8": "是正遅延に対するエスカレーション基準",
"boardRisk.section3.li9": "繰り返されるガバナンス例外への可視性",
"boardRisk.section3.li10": "事業部門または技術領域全体の傾向分析",
"boardRisk.section3.li11": "戦術的是正と構造的リスク低減の区別",
"boardRisk.section3.p3": "取締役会はすべての運用是正活動を見る必要はありません。ただし、増大する運用上の複雑性の中で経営陣の説明責任構造が有効に機能しているか判断できるだけの透明性は必要です。",

"boardRisk.section4.title": "報告成熟度は文脈とナラティブに依存します",
"boardRisk.section4.p1": "取締役会報告で見落とされがちな側面の一つは、ナラティブの質です。",
"boardRisk.section4.li1": "なぜリスクエクスポージャーが変化しているのか",
"boardRisk.section4.li2": "どの傾向が最も重要なのか",
"boardRisk.section4.li3": "課題は個別的なのか、または構造的なのか",
"boardRisk.section4.li4": "経営陣は対応をどのように優先順位付けしているのか",
"boardRisk.section4.li5": "どの意思決定が取締役会の注意を必要とする可能性があるのか",
"boardRisk.section4.p2": "強力な取締役会報告環境は、技術的詳細で取締役を圧倒することなく、運用上の意味を説明する簡潔な解釈をKRIに補足します。",
"boardRisk.section4.p3": "効果的なナラティブは、何が変わったのか、なぜ重要なのか、経営陣がどのように対応しているのか、そしてエクスポージャーが改善、安定、悪化しているのかを明確にします。",

"boardRisk.final.title": "取締役会報告はガバナンス意思決定を支援すべきです",
"boardRisk.final.p1": "最終的に、効果的なITリスク報告は、取締役会が単に運用活動について情報を得るだけでなく、より良いガバナンス意思決定を行えるよう支援すべきです。",
"boardRisk.final.li1": "活動量ではなくエクスポージャー傾向",
"boardRisk.final.li2": "個別インシデントではなくリスク集中",
"boardRisk.final.li3": "一般的な所有権ではなく説明責任の明確性",
"boardRisk.final.li4": "完了統計ではなく是正の有効性",
"boardRisk.final.li5": "過去の要約ではなく将来志向の指標",
"boardRisk.final.li6": "エスカレーションまたは投資を必要とするガバナンス意思決定",
"boardRisk.final.p2": "成功する組織は、複雑な運用リスク環境を過度に単純化することなく、情報に基づくガバナンス意思決定を支える明確な監督インテリジェンスへ変換できる組織である可能性が高いです。",

"aiAudit.title": "",
"aiAudit.subtitle": " ",

"aiAudit.intro1": "多くの組織は、依然としてAIガバナンスを新たな取り組みとして扱っています。しかし監査人は、ますますこれを運用上の現実として扱っています。",
"aiAudit.intro2": "かつてAIガバナンスを将来状態の課題と見ていたリーダーシップチームは、現在、説明責任、監督、文書化、統制実行について実務的な質問を受けています。",
"aiAudit.intro3": "多くの環境で、経営陣はAI導入がガバナンス成熟度よりも速く進んだことに気づいています。",
"aiAudit.intro4": "業界全体で、監査議論において一貫して現れている4つのガバナンステーマがあります：インベントリ管理、承認ガバナンス、継続的モニタリング、ライフサイクル文書化。",

"aiAudit.section1.title": "インベントリはAIガバナンスの出発点になりつつあります",
"aiAudit.section1.p1": "監査人がますます最初に尋ねる質問の一つは、一見単純です：組織全体でAIはどこで使われているのか？",
"aiAudit.section1.p2": "AI導入が一つの中央集権的なプログラムを通じて発生することはまれです。ビジネスチームは生成AIツールを独自に試し、テクノロジーチームはアプリケーションに機械学習機能を統合し、ベンダーは既存プラットフォームに組み込みAI機能を導入します。",
"aiAudit.section1.p3": "組織は、技術を一貫して識別できなければ、それを効果的に管理することはできません。",
"aiAudit.section1.li1": "AI対応システムおよびユースケースの中央管理されたインベントリ",
"aiAudit.section1.li2": "AIが「スコープ内」に該当するものを定義する基準",
"aiAudit.section1.li3": "業務または規制影響に紐づくリスク分類",
"aiAudit.section1.li4": "各実装に対する所有責任",
"aiAudit.section1.li5": "インベントリの完全性を検証する定期レビュー手続",
"aiAudit.section1.p4": "最も効果的に対応している組織は、AIインベントリ管理を一度きりの文書化活動ではなく、動的なガバナンスプロセスとして扱っています。",

"aiAudit.section2.title": "承認ガバナンスには非公式な整合以上のものが必要です",
"aiAudit.section2.p1": "組織がAI利用を特定すると、監査人が次に確認する領域は、展開および承認活動を取り巻くガバナンスです。",
"aiAudit.section2.p2": "頻繁に欠けているのは、リスク評価と承認の追跡可能性を支える構造化されたガバナンスです。",
"aiAudit.section2.li1": "リスクエクスポージャーに基づく承認要件",
"aiAudit.section2.li2": "ガバナンスレビュー基準",
"aiAudit.section2.li3": "リスク受容判断に対する説明責任",
"aiAudit.section2.li4": "高リスク実装に対するエスカレーション経路",
"aiAudit.section2.li5": "展開判断を支える文書化",
"aiAudit.section2.p3": "強力なガバナンス環境は、明確に定義されたレビュー期待事項、リスク階層基準、実装判断に対する説明責任を含む実務的な承認構造を早期に確立することで、この課題に対応します。",

"aiAudit.section3.title": "モニタリング統制はますます重要になっています",
"aiAudit.section3.p1": "インベントリと承認は初期のガバナンス構造を確立します。モニタリングは、ガバナンスが時間の経過とともに有効であり続けるかを判断します。",
"aiAudit.section3.p2": "AI対応環境は継続的に進化します。モデルは変化し、ベンダーは新機能を導入し、データ入力は変わり、ビジネス利用は拡大し、運用依存性は時間とともに増加します。",
"aiAudit.section3.li1": "AI対応システムの変更",
"aiAudit.section3.li2": "継続的なユーザーアクセスおよび権限",
"aiAudit.section3.li3": "データ利用および保存実務",
"aiAudit.section3.li4": "例外処理活動",
"aiAudit.section3.li5": "新たなAI機能を導入するベンダー更新",
"aiAudit.section3.li6": "インシデントまたはガバナンス上の懸念のエスカレーション",
"aiAudit.section3.li7": "運用利用と承認済みスコープの整合",
"aiAudit.section3.p3": "効果的なモニタリング統制は、必ずしも高度なツールを必要としません。多くの場合、必要なのは運用規律、定義されたレビューリズム、エスカレーション手続、環境が進化する中でガバナンス上の前提を再評価する説明責任です。",

"aiAudit.section4.title": "ライフサイクル文書化は監査上の精査において重要になっています",
"aiAudit.section4.p1": "組織は、監査が始まるとAIガバナンスの議論がどれほど早く文書化の議論に変わるかを過小評価しがちです。",
"aiAudit.section4.li1": "初期リスク評価",
"aiAudit.section4.li2": "承認および展開判断",
"aiAudit.section4.li3": "統制期待事項",
"aiAudit.section4.li4": "モニタリング活動",
"aiAudit.section4.li5": "変更管理プロセス",
"aiAudit.section4.li6": "例外処理",
"aiAudit.section4.li7": "定期的なガバナンスレビュー",
"aiAudit.section4.li8": "廃止または利用終了判断",
"aiAudit.section4.p2": "断片化された文書化は、一貫性、説明責任、監督の信頼性を示すうえで大きな困難を生み出します。",
"aiAudit.section4.li9": "定義された証跡保存基準",
"aiAudit.section4.li10": "中央管理されたガバナンスリポジトリ",
"aiAudit.section4.li11": "文書化に関する所有責任",
"aiAudit.section4.li12": "承認およびレビューの追跡可能性期待事項",
"aiAudit.section4.li13": "統制実行を示すための基準",
"aiAudit.section4.li14": "文書完全性の定期的検証",
"aiAudit.section4.p3": "ライフサイクル文書化は、運用ガバナンス成熟度を持つ組織と、依然として主にポリシーレベルのガバナンスに依存する組織を分ける最も明確な指標の一つになる可能性があります。",

"aiAudit.final.title": "監査人が最終的に評価しているもの",
"aiAudit.final.p1": "多くの監査人は、組織がAI関連リスクをすべて排除することを期待しているわけではありません。彼らは、経営陣が組織の運用上のエクスポージャーに見合ったガバナンス規律を確立しているかを評価しています。",
"aiAudit.final.li1": "経営陣はAIがどこに存在するかを把握しているか？",
"aiAudit.final.li2": "展開は構造化された承認を通じて管理されているか？",
"aiAudit.final.li3": "統制は時間の経過とともに一貫してモニタリングされているか？",
"aiAudit.final.li4": "ガバナンス活動はシステムライフサイクル全体で証跡化できるか？",
"aiAudit.final.li5": "課題が発生した際に是正を支えるだけの説明責任構造は明確か？",
"aiAudit.final.p2": "AIガバナンスに実務的に取り組む組織は、展開活動が大きく加速した後でガバナンスを後付けしようとする組織よりも、精査の下ではるかに良い結果を出す傾向があります。",
"aiAudit.final.p3": "時間の経過とともに、ポリシー主導のガバナンスと運用ガバナンスの差はますます明確になります。",

/* about */

"about.tophero.title": "私たちの人材。貴社の信頼。卓越した精度。",

"about.hero.title": "Big 4水準の規律を備えた<br><span style='color:var(--blue2)'>取締役会レベルのリスクアドバイザリー</span>。",
"about.hero.lead": "Primevant Advisoryは、リーダーシップチームがガバナンスを強化し、リスクを効果的に管理し、レジリエントな内部統制環境を維持できるよう支援します。",

"about.section.title": "Primevant Advisoryについて",
"about.section.lead": "Primevant Advisoryは、エンタープライズリスク、テクノロジー、サイバーセキュリティ、統制に焦点を当てたブティック型アドバイザリー会社です。私たちは、不要なオーバーヘッドなしに、明確なスコープ、経営層向けコミュニケーション、防御可能な成果を提供します。",

"about.mission.title": "私たちのミッション",
"about.mission.text": "組織がビジネス運営に整合した実務的かつ防御可能な方法でエンタープライズリスクおよび統制環境を強化し、ガバナンス、テクノロジー、保証プログラム全体で想定外を減らし、信頼を高めることを支援します。",

"about.values.title": "私たちの価値観",
"about.values.text": "明確性（明確なスコープ、期待事項、成果）、規律（一貫した防御可能な証跡と実行）、判断（リスクに基づいた適正な統制）、信頼（クライアント情報と関係の安全な取り扱い）。",

"about.founder.name": "Uchechi Osuagwu",
"about.founder.role": "マネージングパートナー",

"about.founder.background.title": "経歴概要",
"about.founder.background.p1": "Uchechi Osuagwuは、元EYニューヨーク市パートナーであり、Fortune 500企業向けにエンタープライズ監査、サイバーセキュリティ、AI戦略、デジタルトランスフォーメーション施策を率いてきた、15年以上の経験を持つ熟練したテクノロジーリスクエグゼクティブです。彼女のキャリアは、テクノロジー、リスク、ビジネス成果が交差する複雑で高度に規制されたグローバル環境に及びます。",
"about.founder.background.p2": "Uchechiは、成長、規制対応、レジリエンスを支えるため、テクノロジー統制の強化、AIガバナンスの運用化、エンタープライズリスクおよび監査フレームワークの近代化に焦点を当てた大規模プログラムを率いてきました。キャリアを通じて、取締役会、経営陣、規制当局と緊密に連携し、SOX準備、サイバーレジリエンス、第三者リスク、新興テクノロジーリスクについて助言してきました。",
"about.founder.background.p3": "彼女は、複雑な統制、セキュリティ、AIの課題を実務的でビジネスに整合した戦略へ変換し、技術的複雑性と経営層の意思決定の間のギャップを埋める能力で知られています。",

"about.founder.credentials.title": "資格・専門性",
"about.founder.credentials.l1": "テクノロジーリスク、エンタープライズ監査、サイバーセキュリティ、AIガバナンスにおける15年以上のリーダーシップ",
"about.founder.credentials.l2": "SOX、ITGC、アクセス統制、変更管理、証跡ベースの統制フレームワークに関する深い専門性",
"about.founder.credentials.l3": "エンタープライズ環境全体でAIガバナンスおよびリスク管理を運用化した実績",
"about.founder.credentials.l4": "規制対応、サイバーリスク、新たなAI脅威について取締役会およびC-suiteリーダーが信頼するアドバイザー",
"about.founder.credentials.l5": "金融サービス、ヘルスケア、テクノロジー、消費財業界全体のグローバルオペレーション支援経験",
"about.founder.credentials.l6": "テクノロジー、リスク、監査、ビジネスステークホルダーを一つの実行重視のリスク戦略に統合することで知られる",

"about.founder.credibility.title": "信頼性に関するステートメント",
"about.founder.credibility.p1": "Uchechiは、経営判断、技術的深さ、実務的な提供経験という稀有な組み合わせを備えています。彼女はリスクを特定するだけでなく、それを解決する人物として上級リーダーから信頼されており、現実の環境で機能する統制環境、ガバナンスモデル、運用構造を設計します。",
"about.founder.credibility.p2": "彼女のアプローチは規律があり、成果重視で、監査、規制、企業実行の現実に根ざしています。Primevant Advisoryを通じて、Uchechiは組織が規制圧力と技術変化を戦略的優位性へ転換できるよう支援します。",

"about.narrative.title": "ガバナンスを強化します。<br><span style='color:var(--blue2)'>自信ある意思決定を可能にします。</span>",
"about.narrative.p1": "Primevant Advisoryは、リーダーシップチームと協力して強固なガバナンスフレームワークを確立し、リスクを明確で実行可能な成果へ変換します。",
"about.narrative.p2": "私たちは、組織がビジネス、リスク、統制を整合させ、監督を強化し、規制上の期待事項を満たし、成長を支えるレジリエントな運用環境を構築できるよう支援します。",

"about.team.title": "能力とチーム",
"about.team.lead": "Primevant Advisoryは、複雑なエンタープライズ環境を支援するために構成された、ガバナンス、リスク、サイバーセキュリティ、規制分野にわたる集中した高水準の専門家ネットワークを通じてサービスを提供します。",

"about.team.card1.title": "エンタープライズガバナンスおよびリスク能力",
"about.team.card1.text": "規制上の期待事項とビジネス優先事項に整合した、財務報告、業務、サイバーセキュリティ、テクノロジー領域におけるガバナンス、リスク、統制プログラム支援経験。",

"about.team.card2.title": "Big 4および業界経験",
"about.team.card2.text": "チームメンバーは、主要アドバイザリー会社および複雑な企業環境での経験を持ち、金融サービス、ヘルスケア、テクノロジー、消費財業界の組織を支援しています。",

"about.team.card3.title": "柔軟な提供モデル",
"about.team.card3.text": "エンゲージメントは上級リーダーシップの監督のもとで構成され、スコープ、タイムライン、規制要件を精度高く満たすため、専門的な能力で拡張されます。",

"about.founder.more": "詳細情報",
"about.teamCredibility.title": "チームの信頼性",
"about.teamCredibility.p1": "Primevant Advisoryは、上級リーダーシップの監督と、ガバナンス、リスク、サイバーセキュリティ、規制分野にわたる高水準の専門家ネットワークを組み合わせています。このモデルにより、当社は複雑な企業環境で期待される深さと規律をもって、実務的で監査対応可能な成果を提供できます。",
"about.teamCredibility.p2": "私たちのエンゲージメントは、適切な課題に適切な専門性を投入するよう構成され、経営判断、専門能力、一貫した提供基準のバランスを取りながら、規制対応、レジリエントな運用、ビジネスに整合したリスク管理を支援します。",

"about.founder.less": "情報を少なく表示",

/* contact */

"contact.banner": "お問い合わせ",
"contact.heroTitle": "貴社の<br><span style='color:var(--blue2)'>統制およびリスク目標</span>に整合します。",
"contact.p1": "<b>リスクを経営アクションへ変換します。</b> 私たちは、テクノロジーチーム、内部監査、経営陣の間のギャップを埋め、統制フレームワークがビジネスおよび運用上の優先事項を支えるようにします。",
"contact.p2": "<b>複雑性と摩擦を軽減します。</b> 私たちは、統制設計、文書化、証跡実務を合理化し、チームが統制管理に費やす時間を減らし、業績と価値創出により多くの時間を使えるようにします。",
"contact.p3": "<b>実績あるアドバイザーと連携してください。</b> 取締役会、C-suite、監査委員会を支援してきた深い経験に基づき、規制、監査、ステークホルダーの精査に耐えうる実務的なソリューションを提供します。",

"contact.formTitle": "メッセージを送信",
"contact.name": "氏名 *",
"contact.email": "メール *",
"contact.topic": "トピック",
"contact.message": "メッセージ *",
"contact.submit": "送信",
"contact.viewServices": "サービスを見る",

"contact.details": "連絡先情報",
"contact.response": "通常、1営業日以内に返信します。緊急の監査サイクルに関するご相談の場合は、メッセージに「time sensitive」と記載してください。",

/* Privacy */

"privacy.title": "プライバシー通知",
"privacy.lead": "Primevant Advisoryは、お客様のプライバシーを尊重し、情報を慎重かつ専門的に取り扱います。本通知は、このウェブサイトを通じて収集する情報とその利用方法を説明します。",

"privacy.updated": "最終更新日:",

"privacy.collect.title": "収集する情報",
"privacy.collect.text": "お問い合わせページなどを通じて当社に連絡する場合、お名前、メールアドレス、会社名、メッセージ内容など、お客様が提供する情報を収集することがあります。",

"privacy.use.title": "情報の利用方法",
"privacy.use.text": "当社は、お客様が提供した情報を、お問い合わせへの回答、面談調整、 requested materials の提供、潜在的なサービスに関する連絡に使用します。当社は個人情報を販売しません。",

"privacy.security.title": "データの取り扱いと保護",
"privacy.security.text": "Primevant Advisoryは、情報を不正アクセス、使用、開示から保護するために、合理的な管理上および技術上の保護措置を適用します。クライアントエンゲージメントにおいては、データの取り扱いおよび保存条件は通常、契約（例：MSA/SOW）により規定されます。",

"privacy.thirdparty.title": "第三者サービス",
"privacy.thirdparty.text": "将来的に分析、フォーム処理、スケジューリングツールなどの第三者サービスを導入する場合は、それらの提供者および関連するデータ実務を反映するため、本通知を更新します。",

"privacy.contact.title": "お問い合わせ",
"privacy.contact.text": "本通知に関するご質問は <b>info@primevantadvisory.com</b> までご連絡ください。",

/* Sox readiness Insight */

"sox30.title": " ",

"sox30.intro1": "SOXのスケジュールが圧縮されると、ITはほぼ常にプレッシャーポイントになります。",
"sox30.intro2": "財務部門は財務上の主張に責任を持ちますが、監査人がその数値を生成するシステムを実際に信頼できるかを決定するのはITです。この関係は、監査上の精査が本格化すると非常に現実的になります。",
"sox30.intro3": "アクセスが緩く管理され、変更活動が一貫して実行されず、データフローが十分に理解されていない場合、財務統制がどれほどよく文書化されていても信頼することは困難になります。統制設計と統制信頼性のギャップこそ、多くのSOX準備活動が負荷を感じ始める場所です。",
"sox30.intro4": "圧縮されたタイムラインにおける目的は、完全なコンプライアンス成熟度ではありません。監査人が、システムがどのように管理され、統制が実務上どのように運用され、誰が実行責任を持つのかを追跡できるだけの構造と一貫性を確立することです。",
"sox30.intro5": "多くの組織では、SOX準備が始まる時点でその明確性は十分に整っていません。",

"sox30.section1.title": "最初の制約は通常、統制ではなく可視性です",
"sox30.section1.p1": "初期の課題が統制の欠如であることはまれです。多くの組織には、何らかの形でアクセスプロセス、変更ワークフロー、承認メカニズム、運用レビューがすでに存在しています。",
"sox30.section1.p2": "問題は、これらのプロセスが成長期にチームやシステム全体で独立して発展してきたことです。存在しているのは通常、統合された統制環境ではなく、実務の集合体です。",
"sox30.section1.p3": "これは、基本的な質問に答えようとするときに最も明確になります：財務報告に実際に重要なシステムはどれか？",
"sox30.section1.p4": "ERPプラットフォームは通常比較的明確です。複雑性は、隣接するアプリケーション、報告レイヤー、システム統合、財務締め活動を支える手作業プロセスの周辺で発生します。",
"sox30.section1.p5": "リーダーシップチームが驚くことが多いのは、非財務システムであっても、データ変換、エクスポート、手作業調整を通じて財務結果に影響を与えるものが多いという点です。",
"sox30.section1.p6": "スコープについて明確で合意された見解がなければ、その後のすべての安定化作業は困難になります。",

"sox30.section2.title": "統制設計が本当の問題であることはまれです",
"sox30.section2.p1": "スコープが理解されると、関心は自然にIT全般統制へ移ります。紙の上では単純に見えますが、実務では不整合が表面化し始めます。",
"sox30.section2.p2": "アクセス管理は存在するかもしれませんが、承認およびレビュー実務はシステムごとに異なることがあります。変更管理は文書化されていても、緊急変更や小規模な本番更新が正式なワークフロー外で処理されることがあります。運用統制は有効に機能していても、実行証跡が常に一貫して保存されているとは限りません。",
"sox30.section2.p3": "問題は統制が存在するかどうかではありません。それが反復可能で防御可能な方法で運用されているかどうかです。",
"sox30.section2.p4": "SOX環境では、不整合は欠如よりも問題となることが多いです。",
"sox30.section2.p5": "監査人は意図を評価しているのではありません。信頼性を評価しています。",
"sox30.section2.p6": "特に、ガバナンス期待事項を標準化する前に運用面で成長した組織では、ここで摩擦が表面化し始めます。",

"sox30.section3.title": "自動化は統制リスクの性質を変えます",
"sox30.section3.p1": "システムが成熟するにつれ、財務統制実行の大部分が自動化されます。承認はワークフローに組み込まれ、レポートはシステム生成となり、計算は手作業ではなくプラットフォーム内で直接実行されます。",
"sox30.section3.p2": "これは効率性の観点では一般的に前向きですが、ガバナンス要件を大きく変えます。",
"sox30.section3.p3": "焦点は、統制が手作業で実施されたかどうかから、その統制を実行するシステムが適切に設定され、制限され、時間の経過とともに管理されているかへ移ります。",
"sox30.section3.p4": "繰り返し発生する課題は、システム出力がどのように生成または変更されるかについて十分に理解しないまま、システム出力に過度に依存することです。レポートロジック、設定、アクセスパラメータがガバナンス監督なしに変更できる場合、プロセスが安定して見えても下流の財務統制は損なわれる可能性があります。",
"sox30.section3.p5": "ここでITと財務の整合が不可欠になります。財務は成果に焦点を当てる傾向があります。ITは、その成果を生み出す仕組みの完全性に焦点を当てる必要があります。",
"sox30.section3.p6": "両方の視点が必要ですが、SOX環境ではそれらが連動して機能する必要があります。",

"sox30.section4.title": "証跡規律が監査効率を決定します",
"sox30.section4.p1": "SOX準備で最も過小評価される要素の一つは、証跡管理です。",
"sox30.section4.p2": "統制が正しく運用されていても、証跡が一貫しておらず、分散しており、取得が難しい場合、監査テスト中にその統制を防御することは困難になります。",
"sox30.section4.p3": "多くの組織では、証跡は複数のシステムやコミュニケーションチャネルに存在します。承認はチケットツールに、変更記録はスプレッドシートに、アクセスレビューはメールスレッドやプラットフォームのエクスポートに、運用ログは中央保存基準なしにシステムインターフェース内に存在する可能性があります。",
"sox30.section4.p4": "個別には珍しいことではありません。しかし集合的には、回避可能な監査上の摩擦を生み出します。",
"sox30.section4.p5": "核心的な問題は保存ではありません。予測可能性です。",
"sox30.section4.p6": "監査人は、証跡が存在することだけでなく、それが時間を通じて信頼できる形式で一貫して生成できることを理解する必要があります。",
"sox30.section4.p7": "SOX環境を効果的に管理する組織は、何を保存すべきか、どこに保存すべきか、どのように生成されるかを含め、証跡期待事項を早期に標準化する傾向があります。その一貫性は監査上の混乱を大きく減らします。",

"sox30.section5.title": "ウォークスルーは環境が実際にどのように運用されているかを明らかにします",
"sox30.section5.p1": "ある時点で、組織は統制の文書化から、実際にどのように運用されているかの検証へ移ります。",
"sox30.section5.p2": "通常、この段階でギャップがより明確になります。",
"sox30.section5.p3": "表面化するのは統制の欠如ではなく、チーム、システム、個人間の実行のばらつきであることが多いです。一部の領域は厳格に管理されている一方で、他の領域は非公式な実務や組織内知識に大きく依存している可能性があります。",
"sox30.section5.p4": "一般的な課題は、アクセス衛生、変更規律、特権アクセスガバナンスに現れる傾向があります。緊急手続は存在していても一貫して文書化されていないことがあります。共有アカウントやレガシーアクセス構造が想定より長く残っていることもあります。",
"sox30.section5.p5": "これらの発見事項は、社内では必ずしも予想外ではありません。それらが示しているのは、運用上機能していることと監査対応可能な構造との違いです。",
"sox30.section5.p6": "ウォークスルーの目的は即時是正ではありません。環境のどこが安定しており、どこが非公式な実行パターンに依存しているかを明確にすることです。",

"sox30.section6.title": "リーダーシップの整合が転換点になります",
"sox30.section6.p1": "明確性が高まるにつれ、議論は個別統制から全体的な準備状況へ移ります。",
"sox30.section6.p2": "この段階では、リーダーシップは組織がどこに立っているのか、どのギャップが存在するのか、不要な混乱なく正式なテストに進むためにどの程度の取り組みが必要なのかについて、統合された見解を必要とします。",
"sox30.section6.p3": "ここでCIOとCFOの整合が重要になります。SOX準備はIT施策ではありません。財務報告の完全性は、財務プロセスとそれを支えるシステムの両方に依存するため、共同責任です。",
"sox30.section6.p4": "最も重要なのは完璧さではありません。エクスポージャー、統制成熟度、準備状況の方向性について共通理解を持つことです。",
"sox30.section6.p5": "この段階で苦労する組織は、統制が欠けているからではなく、その統制が環境全体でどのように機能しているかについて統一された見解がないために苦労することが多いです。",

"sox30.section7.title": "多くの組織が工数を過小評価する領域",
"sox30.section7.p1": "急成長環境では、いくつかのパターンが一貫して現れます。",
"sox30.section7.p2": "統制は実際よりも一貫していると想定されがちです。特権アクセスリスクは頻繁に過小評価されます。変更規律は急成長期に弱まりがちです。システム生成レポートは常に十分な厳格さで管理されているとは限りません。証跡実務は意図的に設計されるのではなく、自然発生的に進化します。",
"sox30.section7.p3": "個別には、これらの課題が直ちに失敗点を生むことはまれです。課題は累積的です。監査上の精査の下では、複数領域にわたる小さな不整合が不釣り合いな摩擦を生み出します。",

"sox30.final.title": "最終的な視点",
"sox30.final.p1": "IT SOX準備は、文書化や個別統制の追加だけで達成されるものではありません。",
"sox30.final.p2": "組織が、システムがどのように管理され、統制が実務上どのように運用され、証跡が時間を通じてそれらの統制をどのように一貫して支えているのかを明確に説明できるときに達成されます。",
"sox30.final.p3": "SOX環境へ最も効果的に移行する組織は、必ずしも最も成熟した統制フレームワークを持つ組織ではありません。監査人が解釈なしに環境を理解できるだけの明確性、一貫性、運用規律を備えた組織です。",
"sox30.final.p4": "その明確性こそが、SOX準備を摩擦点から管理可能なガバナンスプロセスへ変えるものです。"
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
