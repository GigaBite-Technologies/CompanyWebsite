(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile nav
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  function setNavOpen(open) {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navLinks.classList.toggle("open", open);
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setNavOpen(!isOpen);
    });

    // Close menu after clicking a link (mobile)
    navLinks.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => setNavOpen(false));
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;
      const clickInside = navLinks.contains(target) || navToggle.contains(target);
      if (!clickInside) setNavOpen(false);
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const el = document.querySelector(href);
      if (!el) return;

      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", href);
    });
  });

  // Active nav highlighting
  const sections = ["#what", "#services", "#brands", "#story", "#links", "#contact"]
    .map(id => document.querySelector(id))
    .filter(Boolean);

  const navAnchors = Array.from(document.querySelectorAll(".nav-link"))
    .filter(a => a.getAttribute("href")?.startsWith("#"));

  function setActive(hash) {
    navAnchors.forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === hash);
    });
  }

  if (sections.length) {
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio - a.intersectionRatio))[0];

      if (visible?.target?.id) {
        setActive("#" + visible.target.id);
      }
    }, { root: null, threshold: [0.25, 0.45, 0.65] });

    sections.forEach(s => io.observe(s));
  }

  // Contact form → generates a mailto draft locally
  const form = document.getElementById("contactForm");
  const mailtoFallback = document.getElementById("mailtoFallback");
  const formNote = document.getElementById("formNote");

  const toEmail = "steven@gigabite.tech";

  function buildMailto({ name, email, topic, message }) {
    const subject = `GigaBite Technologies — ${topic}`;
    const body =
`Hi Steven,

My name is ${name}. I’m reaching out about: ${topic}.

${message}

Contact:
- Email: ${email}

Thanks!
${name}
`;
    const params = new URLSearchParams({ subject, body });
    return `mailto:${encodeURIComponent(toEmail)}?${params.toString()}`;
  }

  function setFallbackLink(url) {
    if (!mailtoFallback) return;
    mailtoFallback.href = url;
  }

  setFallbackLink(`mailto:${encodeURIComponent(toEmail)}`);

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const payload = {
        name: String(fd.get("name") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        topic: String(fd.get("topic") || "").trim(),
        message: String(fd.get("message") || "").trim(),
      };

      const url = buildMailto(payload);
      setFallbackLink(url);

      // Try opening the mail app directly
      window.location.href = url;

      if (formNote) {
        formNote.textContent = "Email draft generated. If your mail app didn’t open, click “Open mail app”.";
      }
    });
  }
})();
