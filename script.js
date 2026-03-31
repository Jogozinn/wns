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
requestAnimationFrame(() => {
  document.body.classList.add("is-ready");
});
window.addEventListener("scroll", syncHeaderState, { passive: true });

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
  const status = document.querySelector("[data-form-status]");
  const submitButton = contactForm.querySelector("button[type='submit']");

  const setFormStatus = (message, state = "") => {
    if (!status) {
      return;
    }

    status.textContent = message;
    status.classList.remove("is-success", "is-error", "is-pending");

    if (state) {
      status.classList.add(`is-${state}`);
    }
  };

  contactForm.addEventListener("input", () => {
    if (status && status.textContent) {
      status.textContent = "";
      status.classList.remove("is-success", "is-error", "is-pending");
    }
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      setFormStatus("Please complete the required fields before submitting.", "error");
      return;
    }

    const endpoint = contactForm.getAttribute("action") || "";

    if (!endpoint || endpoint.includes("REPLACE_WITH_FORM_ID")) {
      setFormStatus("Replace the Formspree placeholder ID before using this form.", "error");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }

    setFormStatus("Sending your request...", "pending");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed.");
      }

      contactForm.reset();
      setFormStatus("Thank you. Your request has been submitted and WNS will follow up soon.", "success");
    } catch (error) {
      setFormStatus(
        "Your request could not be sent right now. Please try again or email info@wrightnowsolutions.com.",
        "error"
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
      }
    }
  });
}
