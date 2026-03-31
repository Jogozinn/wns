const siteHeader = document.querySelector(".site-header");
const siteNav = document.querySelector(".site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const navGroups = document.querySelectorAll(".nav-group");
const navTriggers = document.querySelectorAll("[data-dropdown-trigger]");

const isMobileNav = () => window.matchMedia("(max-width: 860px)").matches;

const syncHeaderState = () => {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeDropdowns = () => {
  navGroups.forEach((group) => {
    group.classList.remove("is-open");
  });

  navTriggers.forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "false");
  });
};

const closeNav = () => {
  if (!siteNav || !menuToggle) {
    return;
  }

  siteNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
  closeDropdowns();
};

navTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (!isMobileNav()) {
      return;
    }

    const group = trigger.closest(".nav-group");

    if (!group) {
      return;
    }

    const shouldOpen = !group.classList.contains("is-open");
    closeDropdowns();

    if (shouldOpen) {
      group.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const nextState = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(nextState));
    document.body.classList.toggle("nav-open", nextState);

    if (!nextState) {
      closeDropdowns();
    }
  });

  document.addEventListener("click", (event) => {
    const clickedNav = siteNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedNav && !clickedToggle) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobileNav()) {
      closeDropdowns();
      document.body.classList.remove("nav-open");
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

const pageName = document.body.dataset.page;

document.querySelectorAll("[data-nav]").forEach((link) => {
  if (link.dataset.nav === pageName) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
});

navGroups.forEach((group) => {
  if (group.querySelector("[aria-current='page']")) {
    group.classList.add("has-active");
  }
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    if (isMobileNav()) {
      closeNav();
    }
  });
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const organization = String(formData.get("organization") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const focus = String(formData.get("focus") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const status = document.querySelector("[data-form-status]");

    if (!name || !organization || !email || !focus || !message) {
      if (status) {
        status.textContent = "Please complete each field before continuing.";
      }
      return;
    }

    const subject = encodeURIComponent(`WNS Contact Request - ${organization}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Organization: ${organization}`,
        `Email: ${email}`,
        `Primary focus: ${focus}`,
        "",
        "What needs to improve:",
        message,
      ].join("\n")
    );

    if (status) {
      status.textContent = "Opening your email client with a drafted message.";
    }

    window.location.href = `mailto:info@wrightnowsolutions.com?subject=${subject}&body=${body}`;
  });
}
