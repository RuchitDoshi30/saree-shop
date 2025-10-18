document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded successfully!");

  // Load Navbar dynamically with error handling
  fetch("../components/navbar.html")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.text();
    })
    .then((data) => {
      document.getElementById("header").innerHTML = data;
      console.log("✅ Navbar loaded!");

      // Load auth.js after navbar is loaded
      if (!window.authSystem) {
        const authScript = document.createElement('script');
        authScript.src = '../assets/js/auth.js';
        authScript.onload = () => {
          console.log("✅ Auth system loaded after navbar!");
          // Update navbar after auth is loaded
          setTimeout(() => {
            if (window.authSystem) {
              window.authSystem.updateNavbar();
            }
          }, 100);
        };
        document.head.appendChild(authScript);
      }

      const navbar = document.querySelector("#header .navbar");
      const hero = document.querySelector(".hero-slider");
      const hamburger = document.getElementById("hamburger");
      const navRight = document.getElementById("navbar-right");

      // Scroll Effect (only if navbar and hero exist)
      if (navbar && hero) {
        window.addEventListener("scroll", () => {
          const heroHeight = hero.offsetHeight;
          const scrollY = window.scrollY;

          if (scrollY > heroHeight) {
            navbar.classList.add("past-hero");
          } else {
            navbar.classList.remove("past-hero");
          }
        });
      }

      // Hamburger Toggle
      if (hamburger && navRight) {
        hamburger.addEventListener("click", () => {
          hamburger.classList.toggle("active");
          navRight.classList.toggle("active");
        });
      }
    })
    .catch((err) => {
      console.error("❌ Error loading navbar:", err);
      // Fallback: show basic navigation if navbar fails to load
      document.getElementById("header").innerHTML = '<nav style="padding: 1rem; background: #800000; color: white; text-align: center;">Navigation Loading...</nav>';
    });

  // =========================
  // Hero Split Slider
  // =========================

  // Hero Slider Auto-Switch with error checking
  const slides = document.querySelectorAll('.hero-slider .slide');
  let current = 0;
  
  function showSlide(idx) {
    if (slides.length === 0) return;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
    });
  }
  
  function nextSlide() {
    if (slides.length === 0) return;
    current = (current + 1) % slides.length;
    showSlide(current);
  }
  
  if (slides.length > 0) {
    console.log(`✅ Hero slider initialized with ${slides.length} slides`);
    showSlide(current);
    setInterval(nextSlide, 5000);
  } else {
    console.log("⚠️ No hero slides found");
  }

  // =========================
  // Card functions
  // =========================

  // Global slider state for the main product slider
  let mainSlider = null;

  // Function to initialize sliders
  function initializeSlider(sliderContainer) {
    if (!sliderContainer) return;
    
    console.log("🔄 Initializing slider...");
    
    let currentIndex = 0;
    const grid = sliderContainer.querySelector('.product-grid');
    const cards = grid ? grid.querySelectorAll('.card') : [];
    let slidesToShow = 3;

    if (!grid || cards.length === 0) {
      console.log("⚠️ No product grid or cards found in slider");
      return;
    }

    console.log(`✅ Found ${cards.length} product cards`);

    // Store reference to main slider
    if (sliderContainer.classList.contains('slider') || sliderContainer.closest('.featured-products')) {
      mainSlider = {
        currentIndex: 0,
        grid: grid,
        cards: cards,
        slidesToShow: slidesToShow,
        sliderContainer: sliderContainer
      };
      console.log("✅ Main slider reference stored");
    }

    function handleMouseEnter() {
      cards.forEach(c => { if (c !== this) { c.classList.add('scale-down', 'reduce-opacity'); } });
    }
    function handleMouseLeave() {
      cards.forEach(c => c.classList.remove('scale-down', 'reduce-opacity'));
    }
    cards.forEach(c => {
      c.addEventListener('mouseenter', handleMouseEnter);
      c.addEventListener('mouseleave', handleMouseLeave);
    });

    function updateSlidesToShow() {
      const oldSlidesToShow = slidesToShow;
      if (window.innerWidth <= 600) slidesToShow = 1;
      else if (window.innerWidth <= 900) slidesToShow = 2;
      else slidesToShow = 3;
      
      if (oldSlidesToShow !== slidesToShow) {
        console.log(`📱 Slides to show updated: ${slidesToShow}`);
      }
      
      // Update main slider reference
      if (mainSlider && mainSlider.grid === grid) {
        mainSlider.slidesToShow = slidesToShow;
      }
      
      applyCardWidths();
      clampIndex();
      translate();
    }

    // Responsive width assignment
    function applyCardWidths() {
      const container = sliderContainer.querySelector('.slider-container');
      if (!container) return;
      const gap = parseFloat(getComputedStyle(grid).gap || 0);
      const totalGap = gap * (slidesToShow - 1);
      const available = container.clientWidth - totalGap;
      const cardWidth = Math.max(200, Math.floor(available / slidesToShow));
      cards.forEach(c => { c.style.width = cardWidth + 'px'; });
    }

    function clampIndex() {
      const maxIndex = Math.max(0, cards.length - slidesToShow);
      if (currentIndex > maxIndex) currentIndex = 0;
      if (currentIndex < 0) currentIndex = maxIndex;
      
      // Update main slider reference
      if (mainSlider && mainSlider.grid === grid) {
        mainSlider.currentIndex = currentIndex;
      }
    }

    function moveSlide(step) {
      currentIndex += step;
      clampIndex();
      translate();
    }

    function translate() {
      if (!cards.length) return;
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(grid).gap || 0);
      const offset = currentIndex * (cardWidth + gap);
      grid.style.transform = `translateX(-${offset}px)`;
    }

    // Event listeners for slider buttons
    const prevBtn = sliderContainer.querySelector('.prev');
    const nextBtn = sliderContainer.querySelector('.next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => moveSlide(-1));
      console.log("✅ Previous button listener added");
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => moveSlide(1));
      console.log("✅ Next button listener added");
    }

    window.addEventListener('resize', updateSlidesToShow);
    window.addEventListener('load', updateSlidesToShow);

    updateSlidesToShow();
  }

  // Initialize sliders with delay to ensure DOM is fully ready
  setTimeout(() => {
    const sliders = document.querySelectorAll('.slider');
    console.log(`🔍 Found ${sliders.length} sliders to initialize`);
    sliders.forEach((slider, index) => {
      console.log(`🔄 Initializing slider ${index + 1}`);
      initializeSlider(slider);
    });
  }, 100);

  // =========================
  // Footer
  // =========================

  fetch("../components/footer.html")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.text();
    })
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
      console.log("✅ Footer loaded!");
    })
    .catch((err) => {
      console.error("❌ Error loading footer:", err);
      // Fallback footer
      document.getElementById("footer").innerHTML = '<footer style="padding: 2rem; background: #f0f0f0; text-align: center;">Footer Loading...</footer>';
    });

});

// =========================
// Global Functions (for onclick handlers)
// =========================

// Global moveSlide function for onclick handlers in HTML
function moveSlide(step) {
  console.log(`🔄 Global moveSlide called with step: ${step}`);
  
  if (mainSlider) {
    mainSlider.currentIndex += step;
    
    // Clamp the index
    const maxIndex = Math.max(0, mainSlider.cards.length - mainSlider.slidesToShow);
    if (mainSlider.currentIndex > maxIndex) mainSlider.currentIndex = 0;
    if (mainSlider.currentIndex < 0) mainSlider.currentIndex = maxIndex;
    
    console.log(`📍 New slider index: ${mainSlider.currentIndex}`);
    
    // Translate
    if (mainSlider.cards.length > 0) {
      const cardWidth = mainSlider.cards[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(mainSlider.grid).gap || 0);
      const offset = mainSlider.currentIndex * (cardWidth + gap);
      mainSlider.grid.style.transform = `translateX(-${offset}px)`;
      console.log(`📐 Applied transform: translateX(-${offset}px)`);
    }
  } else {
    console.log("⚠️ Main slider not found or not initialized yet");
  }
}

// ✅ Keep this OUTSIDE so footer.html onclick works
function toggleSection(section) {
  var moreLink, lessLink, otherSection;

  if (section === 'care') {
    moreLink = document.getElementById('more-link-care');
    lessLink = document.getElementById('less-link-care');
    otherSection = document.getElementById('other-care');
  } else if (section === 'brands') {
    moreLink = document.getElementById('more-link-brands');
    lessLink = document.getElementById('less-link-brands');
    otherSection = document.getElementById('other-brands');
  }

  if (otherSection.style.display === 'none') {
    otherSection.style.display = 'block';
    moreLink.style.display = 'none';
    lessLink.style.display = 'inline';
  } else {
    otherSection.style.display = 'none';
    moreLink.style.display = 'inline';
    lessLink.style.display = 'none';
  }
}
