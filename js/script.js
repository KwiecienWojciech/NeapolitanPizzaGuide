document.addEventListener("DOMContentLoaded", () => {
  const isRecepturaPage = document.body.classList.contains("receptura-page");

  // === Dynamiczne ładowanie navbaru i stopki ===
  const loadHTML = (selector, filePath) => {
    const container = document.querySelector(selector);
    if (container) {
      fetch(filePath)
        .then(res => res.text())
        .then(html => {
          container.innerHTML = html;
        });
    }
  };

  loadHTML("#navbar-container", "../partials/navbar.html");
  loadHTML("#footer-container", "../partials/footer.html");

  // === Flip karty historia ===
  const historiaCards = document.querySelectorAll('.historia-inner');
  historiaCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  // === Lightbox init ===
  window.addEventListener("load", () => {
    if (typeof lightbox !== 'undefined') {
      lightbox.option({
        resizeDuration: 200,
        wrapAround: true,
        albumLabel: "Zdjęcie %1 z %2",
        alwaysShowNavOnTouchDevices: true,
        disableScrolling: true
      });
    }
  });

  // === Reveal animacje ===
  const revealSections = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });
  revealSections.forEach(section => observer.observe(section));

  // === Funkcja logiki mobilnej ===
  const initMobileSlider = () => {
  const slides = document.querySelectorAll(".mobile-slider .slide");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const wrapper = document.querySelector(".slides-wrapper");
  let currentSlide = 0;

 const updateButtons = () => {
  if (prevBtn) {
    prevBtn.style.visibility = currentSlide === 0 ? "hidden" : "visible";
    prevBtn.style.opacity = currentSlide === 0 ? "0" : "1";
  }
  if (nextBtn) {
    nextBtn.style.visibility = currentSlide === slides.length - 1 ? "hidden" : "visible";
    nextBtn.style.opacity = currentSlide === slides.length - 1 ? "0" : "1";
  }
};

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    currentSlide = index;
    updateButtons();
  };

  if (slides.length > 0 && prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentSlide > 0) showSlide(currentSlide - 1);
    });

    nextBtn.addEventListener("click", () => {
      if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
    });

    // Swipe gestures
    let startX = 0;
    if (wrapper) {
      wrapper.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
      });

      wrapper.addEventListener("touchend", e => {
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;
        if (diff < -50 && currentSlide < slides.length - 1) showSlide(currentSlide + 1);
        if (diff > 50 && currentSlide > 0) showSlide(currentSlide - 1);
      });
    }

    showSlide(0); // Start from first slide
  }
};


  // === Funkcja logiki desktopowej ===
  const initDesktopSections = () => {
    const menuItems = document.querySelectorAll(".receptura-menu li");
    const sections = document.querySelectorAll(".receptura-section");
    const sidebar = document.querySelector(".sidebar-italian-green");
    let currentIndex = 0;

    if (sidebar) {
      setTimeout(() => sidebar.classList.add("visible"), 200);
    }

    const showSection = (index) => {
      sections.forEach((section, i) => {
        const content = section.querySelector(".receptura-content");
        section.classList.toggle("active", i === index);
        if (content) {
          if (i === index) {
            content.classList.add("fade-in-up", "visible");
          } else {
            content.classList.remove("fade-in-up", "visible");
          }
        }
      });

      menuItems.forEach((item, i) => {
        item.classList.toggle("active", i === index);
      });

      currentIndex = index;
    };

    menuItems.forEach((item, index) => {
      item.addEventListener("click", () => showSection(index));
    });

    window.addEventListener("wheel", (e) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      const newIndex = Math.min(Math.max(currentIndex + direction, 0), sections.length - 1);
      if (newIndex !== currentIndex) {
        showSection(newIndex);
      }
    }, { passive: false });

    showSection(0);
  };

  // === Dynamiczne przełączanie trybu ===
  let currentMode = null;

  const handleResponsiveMode = () => {
    const isNowMobile = window.innerWidth <= 768;

    if (isRecepturaPage) {
      if (isNowMobile && currentMode !== "mobile") {
        currentMode = "mobile";
        initMobileSlider();
      }

      if (!isNowMobile && currentMode !== "desktop") {
        currentMode = "desktop";
        initDesktopSections();
      }
    }
  };

  handleResponsiveMode();
  window.addEventListener("resize", handleResponsiveMode);
});
