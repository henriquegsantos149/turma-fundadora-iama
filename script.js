// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initAccordions();
  initScrollReveal();
  initCarousels();
  initLightbox();
  initFormControls();
  initAdmission3DScroll();
});

// 1. Sticky Header
function initHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check once on load
}

// 2. Mobile Menu Toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    
    // Update icon
    if (typeof lucide !== 'undefined') {
      if (isOpen) {
        toggleBtn.innerHTML = '<i data-lucide="x"></i>';
      } else {
        toggleBtn.innerHTML = '<i data-lucide="menu"></i>';
      }
      lucide.createIcons();
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

// 3. Accordions (Disciplines & FAQ)
function initAccordions() {
  // Curriculum Accordions
  const curriculumItems = document.querySelectorAll('.curriculum-section .accordion-item');
  curriculumItems.forEach(item => {
    const toggle = item.querySelector('.accordion-toggle');
    const content = item.querySelector('.accordion-content');

    if (!toggle || !content) return;

    toggle.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Collapse all other items
      curriculumItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherToggle = otherItem.querySelector('.accordion-toggle');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
          if (otherContent) {
            otherContent.setAttribute('aria-hidden', 'true');
            otherContent.style.maxHeight = '0px';
          }
        }
      });

      if (isActive) {
        item.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // FAQ Accordions
  const faqItems = document.querySelectorAll('.faq-section .faq-item');
  faqItems.forEach(item => {
    const toggle = item.querySelector('.faq-toggle');
    const content = item.querySelector('.faq-content');

    if (!toggle || !content) return;

    toggle.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Collapse all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherToggle = otherItem.querySelector('.faq-toggle');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
          if (otherContent) {
            otherContent.setAttribute('aria-hidden', 'true');
            otherContent.style.maxHeight = '0px';
          }
        }
      });

      if (isActive) {
        item.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// 4. Scroll Reveal Observer
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

// 5. Custom Carousels / Sliders (Mentores & Depoimentos)
function initCarousels() {
  setupCarousel('mentors-track', 'mentors-prev', 'mentors-next', 'mentors-dots');
  setupCarousel('testimonials-track', 'testimonials-prev', 'testimonials-next', 'testimonials-dots');

  function setupCarousel(trackId, prevBtnId, nextBtnId, dotsContainerId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsContainerId);

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const originalSlides = Array.from(track.children);
    if (originalSlides.length === 0) return;

    const cloneCount = 3;
    let currentIndex = 0;
    let isTransitioning = false;

    // Clone slides
    const firstClones = [];
    const lastClones = [];

    for (let i = 0; i < cloneCount; i++) {
      firstClones.push(originalSlides[i % originalSlides.length].cloneNode(true));
      lastClones.push(originalSlides[(originalSlides.length - 1 - i + originalSlides.length) % originalSlides.length].cloneNode(true));
    }
    lastClones.reverse();

    // Prepend last clones
    lastClones.forEach(clone => {
      track.insertBefore(clone, track.firstChild);
    });

    // Append first clones
    firstClones.forEach(clone => {
      track.appendChild(clone);
    });

    const updateSlider = (withTransition = true) => {
      const slideWidth = originalSlides[0].getBoundingClientRect().width;
      const gap = 24; // grid gap in CSS
      
      if (!withTransition) {
        track.style.transition = 'none';
        const offset = (currentIndex + cloneCount) * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
        track.offsetHeight; // force reflow
        track.style.transition = '';
      } else {
        track.style.transition = '';
        const offset = (currentIndex + cloneCount) * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
      }

      // Update active dot
      const dots = Array.from(dotsContainer.children);
      if (dots.length > 0) {
        let activeDotIndex = currentIndex;
        if (currentIndex < 0) {
          activeDotIndex = originalSlides.length - 1;
        } else if (currentIndex >= originalSlides.length) {
          activeDotIndex = 0;
        }
        dots.forEach((dot, index) => {
          if (index === activeDotIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    };

    const handleNext = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updateSlider(true);
    };

    const handlePrev = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updateSlider(true);
    };

    track.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'transform') return;
      isTransitioning = false;
      
      if (currentIndex >= originalSlides.length) {
        currentIndex = 0;
        updateSlider(false);
      } else if (currentIndex < 0) {
        currentIndex = originalSlides.length - 1;
        updateSlider(false);
      }
    });

    const buildDots = () => {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < originalSlides.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot-indicator');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          if (isTransitioning) return;
          currentIndex = i;
          updateSlider(true);
        });
        dotsContainer.appendChild(dot);
      }
    };

    // Button click listeners
    nextBtn.addEventListener('click', handleNext);
    prevBtn.addEventListener('click', handlePrev);

    // Initialize dots & initial position
    buildDots();
    updateSlider(false);

    window.addEventListener('resize', () => {
      updateSlider(false);
    });
  }
}

// 6. Image Lightbox Modal
function initLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  if (!lightbox || !lightboxImg || triggers.length === 0) return;

  const openLightbox = (imgSrc) => {
    lightboxImg.src = imgSrc;
    lightbox.style.display = 'flex';
    lightbox.offsetHeight; // force reflow
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!lightbox.classList.contains('active')) {
        lightbox.style.display = 'none';
      }
    }, 300);
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const img = trigger.querySelector('img') || trigger;
      if (img) {
        openLightbox(img.src);
      }
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === closeBtn) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// 7. Form Controls (Graduation Toggle, Phone Validation, GTM Tracking, Redirection)
function initFormControls() {
  const form = document.getElementById('enrollment-form');
  const gradSelect = document.getElementById('user-graduation');
  const areaGroup = document.getElementById('education-area-group');
  const areaInput = document.getElementById('user-education-area');
  const phoneInput = document.getElementById('user-whatsapp');

  if (!form || !gradSelect || !areaGroup || !phoneInput) return;

  // Initial State for graduation area
  areaGroup.classList.add('hidden');
  if (areaInput) areaInput.removeAttribute('required');

  // Show/Hide Area Input based on select value
  gradSelect.addEventListener('change', () => {
    if (gradSelect.value === 'Sim') {
      areaGroup.classList.remove('hidden');
      if (areaInput) areaInput.setAttribute('required', 'required');
    } else {
      areaGroup.classList.add('hidden');
      if (areaInput) {
        areaInput.removeAttribute('required');
        areaInput.value = ''; // Reset value
      }
    }
  });

  // Detailed Phone validation function
  const validatePhone = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue.length === 0) {
      return { isValid: true, message: '' }; // Required attribute handles empty field
    }
    
    if (cleanValue.length !== 11) {
      return { isValid: false, message: 'O WhatsApp deve ter exatamente 11 dígitos (DDD + 9 + número).' };
    }
    
    const ddd = cleanValue.substring(0, 2);
    const ninthDigit = cleanValue.charAt(2);
    
    // DDDs in Brazil are 11-99, second digit cannot be 0
    const dddRegex = /^[1-9][1-9]$/;
    if (!dddRegex.test(ddd)) {
      return { isValid: false, message: 'O DDD informado é inválido.' };
    }
    
    if (ninthDigit !== '9') {
      return { isValid: false, message: 'O número de celular deve começar com o dígito 9 (Ex: DD9XXXXXXXX).' };
    }
    
    return { isValid: true, message: '' };
  };

  // Strict Phone formatting and digits restriction (Exactly 11 digits)
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Strip non-numeric
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    e.target.value = value;
    // Clear validation error while typing to allow correction
    phoneInput.setCustomValidity('');
  });

  // Validate on blur (quietly, without reporting)
  phoneInput.addEventListener('blur', () => {
    const value = phoneInput.value;
    const validation = validatePhone(value);
    if (!validation.isValid) {
      phoneInput.setCustomValidity(validation.message);
    } else {
      phoneInput.setCustomValidity('');
    }
  });

  // Form Submission
  form.addEventListener('submit', (e) => {
    const validation = validatePhone(phoneInput.value);
    if (!validation.isValid) {
      e.preventDefault(); // Block submit
      phoneInput.setCustomValidity(validation.message);
      phoneInput.reportValidity(); // Show native bubble
      return;
    }

    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    if (!submitBtn) return;

    // Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Registrando sua vaga...';
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Directly transition to the success card (simulated delay for premium feel)
    setTimeout(() => {
      const card = document.getElementById('inscricao');
      if (card) {
        card.innerHTML = `
          <div class="card-glow-top"></div>
          <div class="text-center" style="padding: 20px 0; display: flex; flex-direction: column; align-items: center;">
            <div style="background-color: rgba(124, 191, 57, 0.1); border: 1px solid rgba(124, 191, 57, 0.2); color: var(--color-primary); width: 64px; height: 64px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border-radius: 20px 0 20px 0;">
              <i data-lucide="check" style="width: 32px; height: 32px;"></i>
            </div>
            <h3 class="card-title" style="color: var(--color-primary); margin-bottom: 12px;">Inscrição Realizada!</h3>
            <p class="card-subtitle" style="font-size: 1rem; margin-bottom: 24px; color: var(--color-text-muted-light);">Sua vaga na Turma Fundadora foi pré-reservada com sucesso. Nossa equipe entrará em contato via WhatsApp.</p>
            <a href="https://ambientalpro.com.br/" target="_blank" class="btn btn-primary btn-block">Acessar Site Principal</a>
          </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    }, 1000);
  });
}

// Global Custom styling injector for spinning animations
const inlineStyle = document.createElement('style');
inlineStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin {
    display: inline-block;
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(inlineStyle);

// 8. Smooth Scroll without Hash in URL
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#' || targetId === '') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      try {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      } catch (err) {
        console.warn('Invalid selector for smooth scroll:', targetId);
      }
    });
  });
}

// 9. 3D Scroll Animation for Admission Section (Aceternity UI replica)
function initAdmission3DScroll() {
  const container = document.querySelector('.admission-scroll-container');
  const card = document.querySelector('.admission-scroll-card');
  const header = document.querySelector('.admission-scroll-header');

  if (!container || !card || !header) return;

  const handleScroll = () => {
    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Check if container is in or close to viewport to optimize rendering
    if (rect.bottom < 0 || rect.top > viewportHeight) return;

    // Calculate scroll progress (0 when top is at bottom of viewport, 1 when bottom is at top of viewport)
    const totalDist = rect.height + viewportHeight;
    const currentPos = viewportHeight - rect.top;
    let progress = currentPos / totalDist;
    progress = Math.max(0, Math.min(1, progress));

    // Mapping values:
    // rotateX: 20deg to 0deg (progress 0 to 1)
    const rotateX = 20 - (progress * 20);

    // scale: [1.05, 1] on desktop, [0.75, 0.95] on mobile
    const isMobile = window.innerWidth <= 768;
    const startScale = isMobile ? 0.75 : 1.05;
    const endScale = isMobile ? 0.95 : 1.0;
    const scale = startScale + (progress * (endScale - startScale));

    // translateY (on header text): 0 to -80px
    const translateY = -80 * progress;

    // Apply transforms smoothly using requestAnimationFrame for high performance
    window.requestAnimationFrame(() => {
      card.style.transform = `rotateX(${rotateX}deg) scale(${scale})`;
      header.style.transform = `translateY(${translateY}px)`;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  handleScroll(); // Initial run
}
