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
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#name")?.value.trim();
    const email = $("#email")?.value.trim();
    const msg = $("#message")?.value.trim();

    if (!name || !email || !msg) return showToast("Please complete required fields.");
    if (!email.includes("@")) return showToast("Please enter a valid email.");

    showToast("Message ready. (Hook backend later)");
    form.reset();
  });
})();