(function () {
  var projects = window.PORTFOLIO_PROJECTS || [];
  var filters = window.PORTFOLIO_FILTERS || ["All"];
  var currentLang = localStorage.getItem("portfolioLanguage") || "en";
  var currentFilter = "All";
  var currentProject = null;

  var ui = {
    en: {
      navHome: "Home",
      heroEyebrow: "Lighting Design Portfolio",
      heroCopy: "Selected lighting work across theme parks, ceremonies, theatre, concerts, and architectural productions.",
      selectedProjects: "Selected Projects",
      workArchive: "Work Archive",
      emptyState: "No projects found for this filter.",
      footerTitle: "Lighting Designer / Lighting Systems Designer",
      footerNote: "Selected works across themed entertainment, theatre, ceremonies, and architectural environments.",
      backToProjects: "Back to projects",
      projectNotes: "Project Notes",
      gallery: "Gallery",
      pdfPreview: "Lighting Plans Preview",
      noPdf: "No PDF has been added for this project yet.",
      coverPending: "Cover pending",
      openProject: "Open",
      all: "All",
      metaRole: "Role",
      metaYear: "Year",
      metaVenue: "Location"
    },
    zh: {
      navHome: "Home",
      heroEyebrow: "灯光设计作品集",
      heroCopy: "精选主题公园、剧场、演艺与建筑空间灯光项目。",
      selectedProjects: "精选项目",
      workArchive: "作品档案",
      emptyState: "这个分类暂无项目。",
      footerTitle: "灯光设计师 / 灯光系统设计师",
      footerNote: "精选主题娱乐、剧场演出、仪式活动与建筑空间项目。",
      backToProjects: "返回项目列表",
      projectNotes: "项目说明",
      gallery: "图片",
      pdfPreview: "Lighting Plans Preview",
      noPdf: "这个项目还没有添加 PDF 图纸。",
      coverPending: "等待添加封面",
      openProject: "打开",
      all: "全部",
      metaRole: "Role",
      metaYear: "年份",
      metaVenue: "Location"
    }
  };

  var filterLabels = {
    en: {
      All: "All",
      "Theme Park": "Theme Park",
      Theatre: "Theatre",
      Show: "Show",
      Architectural: "Architectural"
    },
    zh: {
      All: "全部",
      "Theme Park": "主题公园",
      Theatre: "剧场",
      Show: "演艺",
      Architectural: "建筑景观"
    }
  };
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function byId(id) {
    return projects.find(function (project) {
      return project.id === id;
    });
  }

  function text(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value[currentLang] || value.en || value.zh || "";
  }

  function createElement(tag, className, value) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (value) element.textContent = value;
    return element;
  }

  function coverCandidates(project) {
    if (project.cover) return [project.cover];
    return [
      "project-assets/" + project.id + "/cover/cover.jpg",
      "project-assets/" + project.id + "/cover/cover.JPG",
      "project-assets/" + project.id + "/cover/cover.png",
      "project-assets/" + project.id + "/cover/cover.PNG",
      "project-assets/" + project.id + "/cover/cover.jpeg",
      "project-assets/" + project.id + "/cover/cover.JPEG",
      "project-assets/" + project.id + "/cover/cover.webp",
      "project-assets/" + project.id + "/cover/cover.WEBP"
    ];
  }

  function setCoverImage(image, project, onMissing) {
    var candidates = coverCandidates(project);
    var index = 0;

    function tryNext() {
      if (index >= candidates.length) {
        image.removeAttribute("src");
        if (onMissing) onMissing();
        return;
      }
      image.src = candidates[index];
      index += 1;
    }

    image.onerror = tryNext;
    image.onload = function () {
      image.onerror = null;
      image.hidden = false;
    };
    image.alt = text(project.title) + " cover image";
    tryNext();
  }

  function projectMatchesFilter(project, filter) {
    if (filter === "All") return true;
    return project.category === filter;
  }

  function labelFilter(filter) {
    return (filterLabels[currentLang] && filterLabels[currentLang][filter]) || filter;
  }

  function applyLanguage() {
    document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.lang = currentLang;

    qsa("[data-i18n]").forEach(function (element) {
      var key = element.dataset.i18n;
      if (ui[currentLang][key]) element.textContent = ui[currentLang][key];
    });

    qsa("[data-lang-button]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.langButton === currentLang);
    });

    renderFilters();
    renderProjectCards(currentFilter);
    if (currentProject) renderProjectDetail(currentProject);
  }

  function setupLanguageToggle() {
    qsa("[data-lang-button]").forEach(function (button) {
      button.addEventListener("click", function () {
        currentLang = button.dataset.langButton;
        localStorage.setItem("portfolioLanguage", currentLang);
        applyLanguage();
      });
    });
  }

  function renderFilters() {
    var filterRoot = qs("[data-filters]");
    var grid = qs("[data-project-grid]");
    if (!filterRoot || !grid) return;

    filterRoot.innerHTML = "";
    filters.forEach(function (filter) {
      var button = createElement("button", "filter-button" + (filter === currentFilter ? " active" : ""), labelFilter(filter));
      button.type = "button";
      button.dataset.filter = filter;
      button.addEventListener("click", function () {
        currentFilter = filter;
        renderFilters();
        renderProjectCards(filter);
      });
      filterRoot.appendChild(button);
    });
  }

  function renderProjectCards(activeFilter) {
    var grid = qs("[data-project-grid]");
    var emptyState = qs("[data-empty-state]");
    if (!grid) return;

    grid.innerHTML = "";
    var visibleProjects = projects.filter(function (project) {
      return projectMatchesFilter(project, activeFilter || "All");
    }).sort(function (a, b) {
      if (a.id === "brisbane-convention-exhibition-centre-2025") return -1;
      if (b.id === "brisbane-convention-exhibition-centre-2025") return 1;
      return (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0);
    });

    visibleProjects.forEach(function (project, index) {
      var card = document.createElement("article");
      card.className = "project-card reveal";
      card.style.transitionDelay = Math.min(index * 45, 225) + "ms";

      var link = document.createElement("a");
      link.href = "project.html?id=" + encodeURIComponent(project.id);
      link.setAttribute("aria-label", ui[currentLang].openProject + " " + text(project.title));

      var imageWrap = createElement("div", "project-image-wrap");
      var image = document.createElement("img");
      var placeholder = createElement("div", "cover-placeholder");
      placeholder.innerHTML = "<span>" + ui[currentLang].coverPending + "</span>";
      placeholder.hidden = true;
      image.loading = "lazy";
      imageWrap.appendChild(image);
      imageWrap.appendChild(placeholder);
      setCoverImage(image, project, function () {
        image.hidden = true;
        placeholder.hidden = false;
      });

      var body = createElement("div", "project-card-body");
      var meta = createElement("p", "project-card-meta", [labelFilter(project.category), project.year].filter(Boolean).join(" / "));
      var location = createElement("p", "project-card-location", text(project.venue));
      var title = createElement("h3", "", text(project.title));
      body.appendChild(title);
      body.appendChild(meta);
      if (text(project.venue)) body.appendChild(location);

      link.appendChild(imageWrap);
      link.appendChild(body);
      card.appendChild(link);
      grid.appendChild(card);
    });

    if (emptyState) emptyState.hidden = visibleProjects.length > 0;
    observeReveal();
  }

  function renderProjectDetail(projectOverride) {
    var detailRoot = qs("[data-project-detail]");
    if (!detailRoot) return;

    var project = projectOverride;
    if (!project) {
      var params = new URLSearchParams(window.location.search);
      project = byId(params.get("id") || "");
    }
    if (!project) {
      detailRoot.hidden = true;
      return;
    }

    currentProject = project;
    document.title = text(project.title) + " | Elvis Yi Lighting Portfolio";

    qs("[data-project-description]").textContent = text(project.description);
    qs("[data-project-body-title]").textContent = text(project.title);

    renderProjectMeta(project);
    renderGallery(project);
    renderPdfList(project);
    observeReveal();
  }

  function renderProjectMeta(project) {
    var meta = qs("[data-project-meta]");
    if (!meta) return;
    meta.innerHTML = "";
    [
      [ui[currentLang].metaYear, project.year],
      [ui[currentLang].metaRole, text(project.role)],
      [ui[currentLang].metaVenue, text(project.venue)]
    ].forEach(function (item) {
      if (!item[1]) return;
      var group = createElement("div", "");
      group.appendChild(createElement("dt", "", item[0]));
      group.appendChild(createElement("dd", "", item[1]));
      meta.appendChild(group);
    });
  }

  function renderPdfList(project) {
    var pdfs = project.pdfs || (project.pdf ? [{ title: { en: "PDF", zh: "PDF" }, file: project.pdf }] : []);
    var list = qs("[data-project-pdf-list]");
    var iframe = qs("[data-project-pdf]");
    var empty = qs("[data-project-pdf-empty]");
    if (!list || !iframe || !empty) return;

    list.innerHTML = "";
    if (pdfs.length === 0) {
      empty.hidden = false;
      iframe.hidden = true;
      return;
    }

    empty.hidden = true;
    iframe.hidden = false;

    function selectPdf(pdf, selectedButton) {
      qsa(".pdf-option", list).forEach(function (button) {
        button.classList.toggle("active", button === selectedButton);
      });
      iframe.src = pdf.file;
    }

    pdfs.forEach(function (pdf, index) {
      var button = createElement("button", "pdf-option" + (index === 0 ? " active" : ""), text(pdf.title) || ("PDF " + (index + 1)));
      button.type = "button";
      button.addEventListener("click", function () {
        selectPdf(pdf, button);
      });
      list.appendChild(button);
      if (index === 0) selectPdf(pdf, button);
    });
  }

  function renderGallery(project) {
    var gallery = qs("[data-project-gallery]");
    var section = qs("[data-gallery-section]");
    var images = project.gallery || [];
    if (!gallery || !section) return;

    gallery.innerHTML = "";
    section.hidden = images.length === 0;
    images.forEach(function (src) {
      var button = document.createElement("button");
      button.className = "gallery-item";
      button.type = "button";
      var image = document.createElement("img");
      image.src = src;
      image.alt = text(project.title) + " gallery image";
      image.loading = "lazy";
      button.appendChild(image);
      button.addEventListener("click", function () {
        openLightbox(src, image.alt);
      });
      gallery.appendChild(button);
    });
  }

  function openLightbox(src, alt) {
    var lightbox = qs("[data-lightbox]");
    var image = qs("[data-lightbox-image]");
    if (!lightbox || !image) return;
    image.src = src;
    image.alt = alt || "";
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    var lightbox = qs("[data-lightbox]");
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove("no-scroll");
  }

  function setupLightbox() {
    var lightbox = qs("[data-lightbox]");
    var close = qs("[data-lightbox-close]");
    if (!lightbox || !close) return;
    close.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeLightbox();
    });
  }

  function setupHeader() {
    var header = qs("[data-header]");
    if (!header) return;
    var keepSolid = header.classList.contains("solid") && !qs("[data-hero]");
    function update() {
      header.classList.toggle("solid", keepSolid || window.scrollY > 24);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function observeReveal() {
    var revealItems = qsa(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupHeader();
    setupLanguageToggle();
    setupLightbox();
    renderProjectDetail();
    applyLanguage();
    observeReveal();
  });
})();
