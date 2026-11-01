// Sem van Dongen — Portfolio JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // 1. Navigation Scroll Effect
  const header = document.querySelector("header");
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        header.classList.add("header-scrolled");
        header.classList.remove("header-top");
      } else {
        header.classList.remove("header-scrolled");
        header.classList.add("header-top");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenuDrawer = document.getElementById("mobile-menu-drawer");
  const menuIconOpen = document.getElementById("menu-icon-open");
  const menuIconClose = document.getElementById("menu-icon-close");

  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener("click", () => {
      const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      const nextState = !isExpanded;
      mobileMenuBtn.setAttribute("aria-expanded", String(nextState));

      if (nextState) {
        mobileMenuDrawer.classList.remove("hidden");
        if (menuIconOpen) menuIconOpen.classList.add("hidden");
        if (menuIconClose) menuIconClose.classList.remove("hidden");
      } else {
        mobileMenuDrawer.classList.add("hidden");
        if (menuIconOpen) menuIconOpen.classList.remove("hidden");
        if (menuIconClose) menuIconClose.classList.add("hidden");
      }
    });
  }

  // 3. Dynamic Footer Copyright Year
  const yearElem = document.getElementById("current-year");
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // 4. About Page Lightbox Modal
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxAlt = document.getElementById("lightbox-alt");
  const lightboxCloseBtns = document.querySelectorAll("[data-close-lightbox]");

  const openLightbox = (src, alt, caption) => {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    if (lightboxCaption) lightboxCaption.textContent = caption || "Image Detail";
    if (lightboxAlt) lightboxAlt.textContent = alt || "";
    lightboxModal.classList.remove("hidden");
    lightboxModal.classList.add("flex");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.add("hidden");
    lightboxModal.classList.remove("flex");
    document.body.style.overflow = "unset";
  };

  document.querySelectorAll("[data-lightbox]").forEach((el) => {
    el.addEventListener("click", () => {
      const src = el.getAttribute("data-lightbox-src");
      const alt = el.getAttribute("data-lightbox-alt");
      const caption = el.getAttribute("data-lightbox-caption");
      openLightbox(src, alt, caption);
    });
  });

  lightboxCloseBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  });

  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // 5. Work Page: Project Modal & Filtering
  const projectModal = document.getElementById("project-modal");
  const projectModalContent = document.getElementById("project-modal-container");
  const projectCloseBtns = document.querySelectorAll("[data-close-project-modal]");

  const renderProjectModal = (p) => {
    if (!p) return;

    // Header fields
    const modalCategory = document.getElementById("modal-category");
    if (modalCategory) {
      modalCategory.textContent = `PROJECT ${p.number} // ${p.category}`;
    }

    const modalMeta = document.getElementById("modal-meta");
    if (modalMeta) {
      let metaHtml = `<span>${p.year}</span><span>/</span><span>${p.role}</span>`;
      if (p.collaborators) {
        metaHtml += `<span>/</span><span class="text-ink-dim">${p.collaborators}</span>`;
      }
      modalMeta.innerHTML = metaHtml;
    }

    const modalTitle = document.getElementById("modal-title");
    if (modalTitle) modalTitle.textContent = p.title;

    const modalSubtitle = document.getElementById("modal-subtitle");
    if (modalSubtitle) modalSubtitle.textContent = p.subtitle;

    const modalSummary = document.getElementById("modal-summary");
    if (modalSummary) modalSummary.textContent = p.summary;

    // Visual Documentation
    const modalDocCount = document.getElementById("modal-doc-count");
    if (modalDocCount) {
      modalDocCount.textContent = `${p.images.length} artifact${p.images.length > 1 ? "s" : ""}`;
    }

    const modalImages = document.getElementById("modal-images");
    if (modalImages) {
      if (p.imageLayout === "mobile") {
        modalImages.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
      } else {
        modalImages.className = "grid grid-cols-1 gap-6";
      }

      modalImages.innerHTML = p.images
        .map((src, idx) => {
          const caption =
            p.imageCaptions && p.imageCaptions[idx]
              ? p.imageCaptions[idx]
              : `Documentation — ${p.title}`;
          return `
        <div class="group relative overflow-hidden border border-line-strong bg-black">
          <div class="relative aspect-auto min-h-[300px] w-full max-h-[700px] flex items-center justify-center bg-black/40 p-4">
            <img src="${src}" alt="${p.title} - ${caption}" class="max-h-[640px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.01]" />
          </div>
          <div class="flex items-center justify-between border-t border-line bg-bg-card/90 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
            <span class="text-accent font-medium">Fig. 0${idx + 1} — ${caption}</span>
            <span class="hidden sm:inline text-ink-faint text-[10px]">${p.title}</span>
          </div>
        </div>
      `;
        })
        .join("");
    }

    // Editorial sections
    const modalEditorialGrid = document.getElementById("modal-editorial-grid");
    if (modalEditorialGrid) {
      let gridHtml = "";

      if (p.context) {
        gridHtml += `
          <div class="border-l border-accent/40 pl-6">
            <span class="font-mono text-xs uppercase tracking-[0.24em] text-accent">01 // Context & Problem</span>
            <h4 class="mt-1 font-display text-xl uppercase text-ink">Background</h4>
            <p class="mt-3 font-body text-sm leading-relaxed text-ink-dim sm:text-base">${p.context.replace(/\n\n/g, "</p><p class='mt-3 font-body text-sm leading-relaxed text-ink-dim sm:text-base'>")}</p>
          </div>
        `;
      }

      if (p.role) {
        gridHtml += `
          <div class="border-l border-line-strong pl-6">
            <span class="font-mono text-xs uppercase tracking-[0.24em] text-ink-faint">02 // Contribution</span>
            <h4 class="mt-1 font-display text-xl uppercase text-ink">My Role</h4>
            <p class="mt-3 font-body text-sm leading-relaxed text-ink-dim sm:text-base">${p.role}</p>
            ${p.collaborators ? `<p class="mt-2 font-mono text-xs text-ink-faint">Collaborators: ${p.collaborators}</p>` : ""}
          </div>
        `;
      }

      if (p.gameplay) {
        gridHtml += `
          <div class="border-l border-accent/60 pl-6 md:col-span-2">
            <span class="font-mono text-xs uppercase tracking-[0.24em] text-accent">03 // Game Mechanics & User Flow</span>
            <h4 class="mt-1 font-display text-xl uppercase text-ink">How the Game Works</h4>
            <p class="mt-2 font-body text-sm text-ink-dim">A 6-step interactive loop designed to turn passive museum visits into an active, collaborative discovery adventure:</p>
            <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              ${p.gameplay
                .map(
                  (step, i) => `
                <div class="border border-line bg-bg/80 p-4">
                  <div class="flex items-center justify-between font-mono text-[10px] text-accent font-bold uppercase tracking-wider">
                    <span>Step 0${i + 1}</span>
                    <span class="text-ink-faint">${step.phase || ""}</span>
                  </div>
                  <h5 class="mt-1 font-display text-base uppercase text-ink">${step.title}</h5>
                  <p class="mt-2 font-body text-xs leading-relaxed text-ink-dim">${step.desc}</p>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `;
      }

      const methodStepNumber = p.gameplay ? "04" : "03";
      const outcomeStepNumber = p.gameplay ? "05" : "04";

      if (p.process) {
        gridHtml += `
          <div class="border-l border-line-strong pl-6">
            <span class="font-mono text-xs uppercase tracking-[0.24em] text-ink-faint">${methodStepNumber} // Methodology</span>
            <h4 class="mt-1 font-display text-xl uppercase text-ink">The Process</h4>
            <p class="mt-3 font-body text-sm leading-relaxed text-ink-dim sm:text-base">${p.process.replace(/\n\n/g, "</p><p class='mt-3 font-body text-sm leading-relaxed text-ink-dim sm:text-base'>")}</p>
          </div>
        `;
      }

      if (p.result) {
        gridHtml += `
          <div class="border-l border-line-strong pl-6">
            <span class="font-mono text-xs uppercase tracking-[0.24em] text-ink-faint">${outcomeStepNumber} // Execution</span>
            <h4 class="mt-1 font-display text-xl uppercase text-ink">The Outcome</h4>
            <p class="mt-3 font-body text-sm leading-relaxed text-ink-dim sm:text-base">${p.result.replace(/\n\n/g, "</p><p class='mt-3 font-body text-sm leading-relaxed text-ink-dim sm:text-base'>")}</p>
          </div>
        `;
      }

      modalEditorialGrid.innerHTML = gridHtml;
    }

    // Reflection section
    const modalReflection = document.getElementById("modal-reflection");
    if (modalReflection) {
      if (p.reflection) {
        const reflectionStepNumber = p.gameplay ? "06" : "05";
        modalReflection.innerHTML = `
          <span class="font-mono text-xs uppercase tracking-[0.26em] text-bone">${reflectionStepNumber} // Reflection & Learnings</span>
          <h4 class="mt-2 font-display text-2xl uppercase text-ink">What I Learned</h4>
          <p class="mt-3 font-body text-base italic leading-relaxed text-ink-dim sm:text-lg">&ldquo;${p.reflection}&rdquo;</p>
        `;
        modalReflection.classList.remove("hidden");
      } else {
        modalReflection.classList.add("hidden");
      }
    }

    // Tags
    const modalTags = document.getElementById("modal-tags");
    if (modalTags) {
      modalTags.innerHTML = p.tags
        .map(
          (tag) => `
        <span class="border border-line bg-bg px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-ink-dim">#${tag}</span>
      `
        )
        .join("");
    }

    // External Link
    const modalLinkContainer = document.getElementById("modal-link-container");
    if (modalLinkContainer) {
      if (p.link) {
        modalLinkContainer.innerHTML = `
          <a href="${p.link.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 border border-accent bg-accent/10 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.16em] text-accent transition-all hover:bg-accent hover:text-bg">
            <span>${p.link.label}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5"><path d="M15 3h6v6"/><path d="10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
          </a>
        `;
      } else {
        modalLinkContainer.innerHTML = "";
      }
    }
  };

  const openProjectModal = (slugOrId) => {
    if (typeof PROJECTS === "undefined" || !projectModal) return;
    const project = PROJECTS.find((p) => p.slug === slugOrId || p.id === slugOrId);
    if (!project) return;

    renderProjectModal(project);
    projectModal.classList.remove("hidden");
    projectModal.classList.add("flex");
    document.body.style.overflow = "hidden";
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.add("hidden");
    projectModal.classList.remove("flex");
    document.body.style.overflow = "unset";
    if (window.history && window.history.replaceState) {
      const cleanUrl = window.location.pathname.split("?")[0];
      window.history.replaceState(null, "", cleanUrl);
    }
  };

  // Attach click to open project modal
  document.querySelectorAll("[data-project-slug]").forEach((el) => {
    el.addEventListener("click", () => {
      const slug = el.getAttribute("data-project-slug");
      openProjectModal(slug);
    });
  });

  projectCloseBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeProjectModal();
    });
  });

  if (projectModal) {
    projectModal.addEventListener("click", (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // Work Page: Check URL parameter (?project=slug)
  const urlParams = new URLSearchParams(window.location.search);
  const initialProjectSlug = urlParams.get("project");
  if (initialProjectSlug) {
    openProjectModal(initialProjectSlug);
    setTimeout(() => {
      const el = document.getElementById(initialProjectSlug);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  }

  // Work Page: Category Filter Logic
  const filterBtns = document.querySelectorAll("[data-filter]");
  const editorialLayout = document.getElementById("editorial-work-layout");
  const filteredGridLayout = document.getElementById("filtered-work-layout");
  const filteredGridContainer = document.getElementById("filtered-grid-container");

  if (filterBtns.length > 0 && typeof PROJECTS !== "undefined") {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedCat = btn.getAttribute("data-filter");

        // Update button styles
        filterBtns.forEach((b) => {
          b.className =
            "px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border border-line bg-bg-card/50 text-ink-dim hover:border-line-strong hover:text-ink";
        });
        btn.className =
          "px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border border-accent bg-accent text-bg font-bold";

        if (selectedCat === "All") {
          if (editorialLayout) editorialLayout.classList.remove("hidden");
          if (filteredGridLayout) filteredGridLayout.classList.add("hidden");
        } else {
          if (editorialLayout) editorialLayout.classList.add("hidden");
          if (filteredGridLayout) filteredGridLayout.classList.remove("hidden");

          const matches = PROJECTS.filter((p) => {
            if (selectedCat === "Speculative") return p.category.includes("Speculative");
            if (selectedCat === "Interaction") return p.category.includes("Interaction");
            if (selectedCat === "Editorial & Poster") return p.category.includes("Editorial");
            if (selectedCat === "Music Identity") return p.category.includes("Music");
            return true;
          });

          if (filteredGridContainer) {
            filteredGridContainer.innerHTML = matches
              .map(
                (p) => `
              <div id="${p.slug}" data-project-slug="${p.slug}" class="group cursor-pointer border border-line bg-bg-card p-6 transition-all duration-300 hover:border-accent">
                <div class="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <img src="${p.images[0]}" alt="${p.title}" class="h-full w-full ${p.imageFit === "contain" ? "object-contain p-3" : "object-cover"} transition-transform duration-500 group-hover:scale-105" />
                  <div class="absolute top-3 left-3 border border-line bg-bg/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                    ${p.number} // ${p.category}
                  </div>
                </div>
                <div class="mt-6">
                  <span class="font-mono text-xs text-ink-faint tracking-widest">${p.year}</span>
                  <h3 class="font-display text-3xl uppercase text-ink group-hover:text-accent transition-colors">
                    ${p.title}
                  </h3>
                  <p class="mt-2 font-body text-sm text-ink-dim line-clamp-3">
                    ${p.summary}
                  </p>
                </div>
              </div>
            `
              )
              .join("");

            // Re-bind click handlers for dynamic elements
            filteredGridContainer.querySelectorAll("[data-project-slug]").forEach((item) => {
              item.addEventListener("click", () => {
                const slug = item.getAttribute("data-project-slug");
                openProjectModal(slug);
              });
            });
          }
        }
      });
    });
  }

  // Global ESC Key Listener for Modals
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      closeProjectModal();
    }
  });
});
