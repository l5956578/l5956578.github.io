(function () {
  var yearText = String(new Date().getFullYear());
  var year = document.getElementById("year");
  if (year) year.textContent = yearText;
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = yearText;
  });

  document.querySelectorAll(".copy-email").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      copyText(text).then(function () {
        btn.classList.add("is-copied");
        btn.setAttribute("aria-label", "Email copied");
        window.setTimeout(function () {
          btn.classList.remove("is-copied");
          btn.setAttribute("aria-label", "Copy email address");
        }, 1600);
      });
    });
  });

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "0";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (e) {
        ok = false;
      }
      document.body.removeChild(area);
      if (ok) resolve();
      else reject(new Error("copy failed"));
    });
  }

  var fontSteps = [0.875, 1, 1.125, 1.25, 1.4];
  var fontDown = document.getElementById("font-down");
  var fontUp = document.getElementById("font-up");
  var fontIndex = 1;
  (function () {
    var saved = parseFloat(document.documentElement.style.getPropertyValue("--text-scale"));
    if (!isNaN(saved)) {
      var nearest = 0;
      fontSteps.forEach(function (step, i) {
        if (Math.abs(step - saved) < Math.abs(fontSteps[nearest] - saved)) nearest = i;
      });
      fontIndex = nearest;
    }
  })();
  function applyFontScale(index) {
    fontIndex = index;
    var scale = String(fontSteps[index]);
    document.documentElement.style.setProperty("--text-scale", scale);
    try {
      localStorage.setItem("ls-text-scale", scale);
    } catch (e) {}
    if (fontDown) fontDown.disabled = index === 0;
    if (fontUp) fontUp.disabled = index === fontSteps.length - 1;
  }
  if (fontDown && fontUp) {
    applyFontScale(fontIndex);
    fontDown.addEventListener("click", function () {
      if (fontIndex > 0) applyFontScale(fontIndex - 1);
    });
    fontUp.addEventListener("click", function () {
      if (fontIndex < fontSteps.length - 1) applyFontScale(fontIndex + 1);
    });
  }

  var themeBtn = document.getElementById("theme-toggle");
  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  function chosenTheme() {
    var theme = document.documentElement.getAttribute("data-theme");
    return theme === "light" || theme === "dark" ? theme : systemTheme();
  }
  function updateThemeButton() {
    if (!themeBtn) return;
    themeBtn.setAttribute(
      "aria-label",
      chosenTheme() === "dark" ? "Switch to day mode" : "Switch to night mode"
    );
  }
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeButton();
  }
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function () {
    setTheme(systemTheme());
  });
  updateThemeButton();
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      setTheme(chosenTheme() === "dark" ? "light" : "dark");
    });
  }

  var toggle = document.querySelector(".nav-toggle");
  var sidebar = document.getElementById("sidebar");
  var backdrop = document.querySelector(".nav-backdrop");
  if (!toggle || !sidebar) return;

  function setOpen(open) {
    sidebar.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (backdrop) {
      backdrop.hidden = !open;
      backdrop.classList.toggle("visible", open);
    }
  }

  toggle.addEventListener("click", function () {
    setOpen(!sidebar.classList.contains("open"));
  });

  if (backdrop) {
    backdrop.addEventListener("click", function () {
      setOpen(false);
    });
  }

  sidebar.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  var links = Array.prototype.slice.call(sidebar.querySelectorAll(".sidebar-nav a"));
  var sections = links
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  function onScroll() {
    var y = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= y) current = sec;
    });
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current.id);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
