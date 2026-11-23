/**
 * Ahmed Abdelhamed Portfolio - Pure JavaScript Logic
 * - I18n Engine (Arabic / English with dynamic RTL/LTR switching)
 * - Dark / Light Theme Manager with LocalStorage persistence
 * - Canvas Particles Starry Background with Repulse Effect
 * - Intro Screen Animation
 * - Scroll Spy & Sticky Floating Pill Navbar
 * - 3D Certificate Flipper & Fullscreen Zoom Lightbox
 * - Project Details Modal & Auto-cycling Slideshow
 * - Dynamic Floating Scroll-To-Top / Bottom Button
 * - Bulletproof Contact Form (PHP Endpoint + Direct Telegram Fallback)
 */

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 1. Projects Data
  // =========================================================================
  const projectsData = [
    {
      key: "project1",
      cover: "project_assets/student_care/student_care_cover.png",
      gallery: [
        "project_assets/student_care/student_care_cover.png",
        "project_assets/student_care/student_care_live_overview.webp",
        "project_assets/student_care/student_care_wix_overview.webp"
      ],
      links: {
        liveDemo: "https://studentcare.ahmedabdelhamed.com/",
        viewSource: "https://futureacademyyeg.wixsite.com/studentare"
      }
    },
    {
      key: "project2",
      cover: "project_assets/smart_career_hub/smart_career_hub_cover.png",
      gallery: [
        "project_assets/smart_career_hub/smart_career_hub_cover.png",
        "project_assets/smart_career_hub/smart_career_hub_overview.webp"
      ],
      links: {
        liveDemo: "https://smartcareerhub.ahmedabdelhamed.com/"
      }
    },
    {
      key: "project3",
      cover: "project_assets/al_ahly/al_ahly_miami_cover.png",
      gallery: [
        "project_assets/al_ahly/al_ahly_miami_cover.png",
        "project_assets/al_ahly/al_ahly_miami_project_view.webp"
      ],
      links: {
        behance: "https://www.behance.net/gallery/227829951/Al-Ahly-Club-Miami"
      }
    },
    {
      key: "project4",
      cover: "project_assets/pfa/pfa_final_project_cover.png",
      gallery: [
        "project_assets/pfa/pfa_final_project_cover.png",
        "project_assets/pfa/pfa_workbook_overview.webp"
      ],
      links: {
        viewSource: "https://docs.google.com/spreadsheets/d/1ZxEfc4cdqC-zrtGinZRyC2BI0-x_1o18/edit"
      }
    },
    {
      key: "project5",
      cover: "project_assets/arenco/arenco_real_estate_cover.png",
      gallery: [
        "project_assets/arenco/arenco_real_estate_cover.png",
        "project_assets/arenco/arenco_identity_overview.webp"
      ],
      links: {
        behance: "https://www.behance.net/gallery/125457221/Arenco-(Real-Estate)"
      }
    }
  ];

  // =========================================================================
  // 2. Certifications Data
  // =========================================================================
  const certificationsData = [
    { key: "cert1", image: "images/1.jpg" },
    { key: "cert2", image: "images/5.png" },
    { key: "cert3", image: "images/4.jpg" },
    { key: "cert4", image: "images/6.jpg" },
    { key: "cert5", image: "images/2.png" },
    { key: "cert6", image: "images/3.jpg" },
    { key: "cert7", image: "images/8.jpg" },
    { key: "cert8", image: "images/7.jpg" }
  ];

  // =========================================================================
  // 3. State Management
  // =========================================================================
  let currentLocale = localStorage.getItem("portfolio-locale") || "en";
  let currentTheme = localStorage.getItem("portfolio-theme") || "dark";
  let activeCertIndex = 0;
  let isCertFlipped = false;
  let certTimer = null;
  let isCertPaused = false;
  let activeProject = null;
  let activeProjectImgIndex = 0;
  let projectSlideshowTimer = null;

  // Telegram direct configuration
  const TELEGRAM_BOT_TOKEN = "8995459293:AAEcd6oYg4tKFyj18NcADDhu6JWMiKtLtAQ";
  const TELEGRAM_CHAT_ID = "6598326586";

  // =========================================================================
  // 4. Ultra-Smooth Intro Screen & Page Reveal
  // =========================================================================
  const introScreen = document.getElementById("intro-screen");
  const skipBtn = document.getElementById("intro-skip-btn");
  let introCompleted = false;

  function finishIntro() {
    if (introCompleted) return;
    introCompleted = true;
    if (introScreen) {
      introScreen.classList.add("hide");
      document.body.classList.add("page-ready");
      setTimeout(() => {
        const heroReveals = document.querySelectorAll("#hero .reveal-item");
        heroReveals.forEach(el => el.classList.add("revealed"));
      }, 150);
      setTimeout(() => {
        introScreen.style.display = "none";
      }, 850);
    } else {
      document.body.classList.add("page-ready");
    }
  }

  if (introScreen) {
    const introTimer = setTimeout(finishIntro, 5200);

    if (skipBtn) {
      skipBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        clearTimeout(introTimer);
        finishIntro();
      });
    }

    introScreen.addEventListener("click", () => {
      clearTimeout(introTimer);
      finishIntro();
    });

    window.addEventListener("keydown", (e) => {
      if (!introCompleted && (e.key === "Escape" || e.key === " " || e.key === "Enter")) {
        clearTimeout(introTimer);
        finishIntro();
      }
    });
  } else {
    document.body.classList.add("page-ready");
  }

  // =========================================================================
  // 5. Theme Manager
  // =========================================================================
  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem("portfolio-theme", theme);
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const themeBtn = document.querySelectorAll(".theme-toggle-btn");
    themeBtn.forEach(btn => {
      if (currentTheme === "dark") {
        btn.innerHTML = `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
      } else {
        btn.innerHTML = `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
      }
    });
  }

  document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  });

  applyTheme(currentTheme);

  // =========================================================================
  // 6. I18n Translation Engine
  // =========================================================================
  function applyLanguage(locale) {
    currentLocale = locale;
    localStorage.setItem("portfolio-locale", locale);
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", locale);

    // Update document title & description
    if (translations[locale] && translations[locale].meta) {
      document.title = translations[locale].meta.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", translations[locale].meta.description);
    }

    // Update all text nodes with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const keyPath = el.getAttribute("data-i18n");
      const text = getNestedTranslation(locale, keyPath);
      if (text !== undefined) {
        el.textContent = text;
      }
    });

    // Update placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const keyPath = el.getAttribute("data-i18n-placeholder");
      const text = getNestedTranslation(locale, keyPath);
      if (text !== undefined) {
        el.setAttribute("placeholder", text);
      }
    });

    // Update Language Switcher label (shows the OTHER language)
    document.querySelectorAll(".lang-label").forEach(el => {
      el.textContent = locale === "en" ? "ar" : "en";
    });

    // Re-render dynamic elements (Certificates, Projects, Modals)
    renderCertificate();
    renderProjectsList();
    if (activeProject) {
      updateProjectModalContent();
    }
  }

  function getNestedTranslation(locale, keyPath) {
    const keys = keyPath.split(".");
    let current = translations[locale];
    for (const k of keys) {
      if (!current || current[k] === undefined) return undefined;
      current = current[k];
    }
    return current;
  }

  document.querySelectorAll(".lang-toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      applyLanguage(currentLocale === "en" ? "ar" : "en");
    });
  });

  // =========================================================================
  // 7. Projects Grid Rendering
  // =========================================================================
  function renderProjectsList() {
    const container = document.getElementById("projects-grid");
    if (!container) return;
    const t = translations[currentLocale].Projects;

    container.innerHTML = projectsData.map((project, idx) => {
      const title = t[`${project.key}Title`];
      const category = t[`${project.key}Category`];
      const shortDesc = t[`${project.key}ShortDesc`];

      return `
        <article class="group glass-card overflow-hidden flex flex-col reveal-item">
          <div class="relative h-56 overflow-hidden bg-muted/20 cursor-pointer" onclick="openProjectModal(${idx})">
            <img 
              src="${project.cover}" 
              alt="${title}" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              loading="lazy"
            />
            <div class="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
              <button onclick="openProjectModal(${idx}); event.stopPropagation();" class="btn-primary flex items-center gap-2">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8M9 9 3 3m6 6V4.2M9 9H4.2"/></svg>
                <span>${t.viewProject}</span>
              </button>
            </div>
          </div>
          <div class="p-6 flex flex-col flex-1">
            <p class="text-xs text-primary mb-2 font-medium">${category}</p>
            <h3 class="text-xl font-bold text-foreground mb-3 leading-tight">${title}</h3>
            <p class="text-sm text-muted-foreground mb-6 leading-relaxed flex-1">${shortDesc}</p>
            
            <div class="flex flex-wrap gap-2 mt-auto">
              <button onclick="openProjectModal(${idx})" class="px-4 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex-1 text-center cursor-pointer">
                ${t.viewProject}
              </button>
              ${project.links.liveDemo ? `
                <a href="${project.links.liveDemo}" target="_blank" rel="noreferrer" class="p-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors" aria-label="Live Demo">
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10 7 5 3-5 3z"/><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M12 17v4"/><path d="M8 21h8"/></svg>
                </a>
              ` : ''}
              ${project.links.behance ? `
                <a href="${project.links.behance}" target="_blank" rel="noreferrer" class="p-2 rounded-lg bg-[#1769ff]/10 text-[#1769ff] hover:bg-[#1769ff]/20 transition-colors" aria-label="Behance">
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                </a>
              ` : ''}
              ${project.links.viewSource ? `
                <a href="${project.links.viewSource}" target="_blank" rel="noreferrer" class="p-2 rounded-lg bg-foreground/5 text-foreground hover:bg-foreground/10 transition-colors" aria-label="Source">
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                </a>
              ` : ''}
            </div>
          </div>
        </article>
      `;
    }).join("");

    observeReveals();
  }

  // =========================================================================
  // 8. Project Modal Dialog & Slideshow
  // =========================================================================
  const projectModal = document.getElementById("project-modal");
  
  window.openProjectModal = function(idx) {
    activeProject = projectsData[idx];
    activeProjectImgIndex = 0;
    updateProjectModalContent();
    projectModal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Auto slideshow every 3s
    clearInterval(projectSlideshowTimer);
    projectSlideshowTimer = setInterval(() => {
      if (!activeProject) return;
      activeProjectImgIndex = (activeProjectImgIndex + 1) % activeProject.gallery.length;
      updateProjectModalImage();
    }, 3000);
  };

  window.closeProjectModal = function() {
    projectModal.classList.remove("active");
    document.body.style.overflow = "auto";
    clearInterval(projectSlideshowTimer);
    activeProject = null;
  };

  // Close modal when clicking on backdrop
  if (projectModal) {
    projectModal.addEventListener("click", (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  function updateProjectModalContent() {
    if (!activeProject) return;
    const t = translations[currentLocale].Projects;
    const key = activeProject.key;

    document.getElementById("modal-project-category").textContent = t[`${key}Category`];
    document.getElementById("modal-project-title").textContent = t[`${key}Title`];
    document.getElementById("modal-project-desc").textContent = t[`${key}LongDesc`];

    // Key Features
    const featuresList = t[`${key}KeyFeatures`] || [];
    const featuresContainer = document.getElementById("modal-project-features");
    if (Array.isArray(featuresList)) {
      featuresContainer.innerHTML = featuresList.map(f => `<li class="mb-1 text-sm text-muted-foreground flex items-start gap-2"><span class="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span><span>${f}</span></li>`).join("");
    } else {
      featuresContainer.innerHTML = `<p class="text-sm text-muted-foreground">${featuresList}</p>`;
    }

    // Tech badges
    const techString = t[`${key}Tech`] || "";
    const techArray = techString.split(",").map(s => s.trim());
    document.getElementById("modal-project-tech").innerHTML = techArray.map(tech => `
      <span class="px-3 py-1.5 rounded-md bg-muted/50 text-xs font-medium text-muted-foreground border border-border/50">
        ${tech}
      </span>
    `).join("");

    // Links
    const linksContainer = document.getElementById("modal-project-links");
    linksContainer.innerHTML = `
      ${activeProject.links.liveDemo ? `
        <a href="${activeProject.links.liveDemo}" target="_blank" rel="noreferrer" class="btn-primary flex items-center gap-2">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10 7 5 3-5 3z"/><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M12 17v4"/><path d="M8 21h8"/></svg>
          <span>${t.liveDemo}</span>
        </a>
      ` : ''}
      ${activeProject.links.behance ? `
        <a href="${activeProject.links.behance}" target="_blank" rel="noreferrer" class="px-5 py-2.5 rounded-xl bg-[#1769ff] text-white font-medium hover:bg-[#1769ff]/90 transition-colors flex items-center gap-2 shadow-lg shadow-[#1769ff]/20">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
          <span>${t.viewOnBehance}</span>
        </a>
      ` : ''}
      ${activeProject.links.viewSource ? `
        <a href="${activeProject.links.viewSource}" target="_blank" rel="noreferrer" class="btn-outline flex items-center gap-2">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
          <span>${t.viewSource}</span>
        </a>
      ` : ''}
    `;

    updateProjectModalImage();
  }

  function updateProjectModalImage() {
    if (!activeProject) return;
    const imgEl = document.getElementById("modal-project-img");
    imgEl.style.opacity = "0";
    setTimeout(() => {
      imgEl.src = activeProject.gallery[activeProjectImgIndex];
      imgEl.style.opacity = "1";
    }, 150);

    // Update Dots
    const dotsContainer = document.getElementById("modal-project-dots");
    dotsContainer.innerHTML = activeProject.gallery.map((_, i) => `
      <button 
        onclick="setProjectImg(${i})" 
        class="h-2 transition-all rounded-full cursor-pointer ${i === activeProjectImgIndex ? 'w-6 bg-primary' : 'w-2 bg-foreground/30 hover:bg-foreground/50'}"
        aria-label="View image ${i + 1}"
      ></button>
    `).join("");
  }

  window.setProjectImg = function(i) {
    activeProjectImgIndex = i;
    updateProjectModalImage();
  };

  // Close modal on escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProjectModal();
      closeCertModal();
    }
  });

  // =========================================================================
  // 9. Certificates 3D Flipper & Zoom Lightbox
  // =========================================================================
  const certFlipper = document.getElementById("certificate-flipper");
  if (certFlipper) {
    certFlipper.addEventListener("mouseenter", () => { isCertPaused = true; });
    certFlipper.addEventListener("mouseleave", () => { isCertPaused = false; });
  }

  function renderCertificate() {
    const cert = certificationsData[activeCertIndex];
    const t = translations[currentLocale].Certifications;

    document.getElementById("cert-counter").textContent = `${String(activeCertIndex + 1).padStart(2, "0")} / ${String(certificationsData.length).padStart(2, "0")}`;
    document.getElementById("cert-img").src = cert.image;
    document.getElementById("cert-title").textContent = t[`${cert.key}Title`];
    document.getElementById("cert-issuer").textContent = t[`${cert.key}Issuer`];
    document.getElementById("cert-detail").textContent = t[`${cert.key}Detail`];

    // Render Dots
    const dotsContainer = document.getElementById("cert-dots");
    if (dotsContainer) {
      dotsContainer.innerHTML = certificationsData.map((c, i) => `
        <button 
          onclick="gotoCertificate(${i})" 
          class="h-2 rounded-full transition-all cursor-pointer ${i === activeCertIndex ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/40 hover:bg-muted-foreground'}"
          aria-label="Certificate ${i + 1}"
        ></button>
      `).join("");
    }
  }

  window.gotoCertificate = function(idx) {
    const flipper = document.getElementById("certificate-flipper");
    if (!flipper) return;
    flipper.classList.add("is-flipped");
    setTimeout(() => {
      activeCertIndex = (idx + certificationsData.length) % certificationsData.length;
      renderCertificate();
      flipper.classList.remove("is-flipped");
    }, 360);
  };

  window.nextCertificate = function() {
    gotoCertificate(activeCertIndex + 1);
  };

  window.prevCertificate = function() {
    gotoCertificate(activeCertIndex - 1);
  };

  // Auto flip every 3 seconds (when not hovered or in modal)
  function startCertAutoTimer() {
    clearInterval(certTimer);
    certTimer = setInterval(() => {
      const certModal = document.getElementById("cert-modal");
      if (!isCertPaused && (!certModal || !certModal.classList.contains("active"))) {
        nextCertificate();
      }
    }, 3000);
  }
  startCertAutoTimer();

  // Certificate Zoom Modal
  const certModal = document.getElementById("cert-modal");
  window.openCertModal = function() {
    document.getElementById("cert-modal-img").src = certificationsData[activeCertIndex].image;
    certModal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closeCertModal = function() {
    certModal.classList.remove("active");
    document.body.style.overflow = "auto";
  };

  if (certModal) {
    certModal.addEventListener("click", (e) => {
      if (e.target === certModal) {
        closeCertModal();
      }
    });
  }

  // =========================================================================
  // 10. Sticky Floating Navbar, Mobile Drawer & Active Scroll Spy
  // =========================================================================
  const navbar = document.getElementById("main-navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileNavItems = document.querySelectorAll(".mobile-nav-item");
  const sections = document.querySelectorAll("section[id]");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenuCloseBtn = document.getElementById("mobile-menu-close-btn");
  const mobileMenuDrawer = document.getElementById("mobile-menu-drawer");
  const mobileBackdrop = document.getElementById("mobile-backdrop");

  function handleNavbarScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    let currentSection = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 180;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });

    mobileNavItems.forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${currentSection}`) {
        item.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll();

  // Mobile Drawer Controls
  function openMobileMenu() {
    if (!mobileMenuDrawer) return;
    mobileMenuDrawer.classList.add("open");
    if (mobileBackdrop) mobileBackdrop.classList.add("open");
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.add("open");
      mobileMenuBtn.setAttribute("aria-expanded", "true");
    }
    mobileMenuDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    if (!mobileMenuDrawer) return;
    mobileMenuDrawer.classList.remove("open");
    if (mobileBackdrop) mobileBackdrop.classList.remove("open");
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.remove("open");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
    }
    mobileMenuDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";
  }

  window.closeMobileMenu = closeMobileMenu;

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      if (mobileMenuDrawer && mobileMenuDrawer.classList.contains("open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileMenuCloseBtn) {
    mobileMenuCloseBtn.addEventListener("click", closeMobileMenu);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener("click", closeMobileMenu);
  }

  document.querySelectorAll(".mobile-nav-item, .mobile-cta-btn, .mobile-social-btn").forEach(item => {
    item.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenuDrawer && mobileMenuDrawer.classList.contains("open")) {
      closeMobileMenu();
    }
  });

  // =========================================================================
  // 11. Floating Scroll Button
  // =========================================================================
  const floatingBtn = document.getElementById("floating-scroll-btn");
  let isAtBottom = false;

  function handleFloatingBtnScroll() {
    if (!floatingBtn) return;
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 300) {
      floatingBtn.classList.add("show");
    } else {
      floatingBtn.classList.remove("show");
    }

    const scrollPosition = window.innerHeight + scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const footer = document.querySelector("footer");

    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      if (footerRect.top < window.innerHeight) {
        const overlap = window.innerHeight - footerRect.top;
        floatingBtn.style.bottom = `${24 + overlap}px`;
        isAtBottom = true;
      } else {
        floatingBtn.style.bottom = "24px";
        isAtBottom = scrollPosition >= documentHeight - 80;
      }
    } else {
      floatingBtn.style.bottom = "24px";
      isAtBottom = scrollPosition >= documentHeight - 80;
    }

    floatingBtn.innerHTML = isAtBottom 
      ? `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`
      : `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
  }

  window.addEventListener("scroll", handleFloatingBtnScroll);

  if (floatingBtn) {
    floatingBtn.addEventListener("click", () => {
      if (isAtBottom) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          const contactBottom = contactSection.offsetTop + contactSection.offsetHeight;
          window.scrollTo({ top: contactBottom, behavior: "smooth" });
        } else {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
        }
      }
    });
  }

  // =========================================================================
  // 12. Intersection Observer for Scroll Reveals
  // =========================================================================
  function observeReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal-item").forEach(el => {
      // If already in viewport on load, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add("revealed");
      }
      observer.observe(el);
    });
  }

  // =========================================================================
  // 13. Canvas Particle Starry Background
  // =========================================================================
  const canvas = document.getElementById("particle-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    const particleCount = 170;
    const maxDistance = 120;
    const mouse = { x: null, y: null, radius: 130 };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener("mouseout", () => {
      mouse.x = null;
      mouse.y = null;
    });

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse Repulse Effect
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const dirX = (dx / dist) * force * 3.5;
            const dirY = (dy / dist) * force * 3.5;
            this.x -= dirX;
            this.y -= dirY;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = currentTheme === "dark" ? "#38bdf8" : "#10b981";
        ctx.globalAlpha = 0.5;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      const color = currentTheme === "dark" ? "56, 189, 248" : "16, 185, 129";

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${color}, ${0.25 * (1 - dist / maxDistance)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // =========================================================================
  // 14. Bulletproof Contact Form Handler (PHP + Direct Telegram Fallback)
  // =========================================================================
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status-msg");
  const submitBtn = document.getElementById("form-submit-btn");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const t = translations[currentLocale].Contact;
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message")
      };

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>${t.sending}</span>
      `;
      formStatus.textContent = "";
      formStatus.className = "mt-4 text-sm font-medium text-center";

      let success = false;

      // Strategy 1: Post to local PHP endpoint api/contact.php
      try {
        const response = await fetch("api/contact.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        const result = await response.json().catch(() => ({}));
        if (response.ok && result.ok) {
          success = true;
        }
      } catch (err) {
        // PHP endpoint unavailable (e.g. static preview or non-PHP server)
      }

      // Strategy 2: Direct client-side fetch to Telegram API fallback
      if (!success) {
        try {
          const telegramMessage = `New portfolio message\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nMessage:\n${data.message}`;
          const tgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
          const tgRes = await fetch(tgUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: telegramMessage
            })
          });
          const tgResult = await tgRes.json().catch(() => ({}));
          if (tgRes.ok && tgResult.ok) {
            success = true;
          }
        } catch (tgErr) {
          console.error("Telegram fallback error:", tgErr);
        }
      }

      if (success) {
        formStatus.textContent = t.successMessage;
        formStatus.classList.add("text-emerald-400");
        contactForm.reset();
      } else {
        formStatus.textContent = currentLocale === "ar" 
          ? "تعذر إرسال الرسالة في الوقت الحالي، يرجى المحاولة لاحقاً أو مراسلتنا عبر البريد الإلكتروني." 
          : "Unable to send message at this time. Please try again or email directly.";
        formStatus.classList.add("text-red-400");
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>${t.sendButton}</span>
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
      `;
    });
  }

  // =========================================================================
  // 15. Initial Execution
  // =========================================================================
  applyLanguage(currentLocale);
  observeReveals();
});
