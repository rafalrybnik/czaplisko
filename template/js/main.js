/**
 * Czaplisko Siedlisko - Main JavaScript
 * Vanilla JavaScript for all interactive functionality
 */

// ========== MOBILE MENU TOGGLE ==========
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      const isOpen = mobileMenu.classList.contains('translate-x-0');
      
      if (isOpen) {
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('translate-x-full');
      } else {
        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0');
      }
    });

    // Close menu when clicking on a link
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('translate-x-full');
      });
    });
  }
});

// ========== HERO SLIDER ==========
let currentSlide = 0;
let slideInterval;

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.slide-indicator');
  
  if (slides.length === 0) return;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.remove('opacity-0');
        slide.classList.add('opacity-70');
      } else {
        slide.classList.remove('opacity-70');
        slide.classList.add('opacity-0');
      }
    });

    indicators.forEach((indicator, i) => {
      if (i === index) {
        indicator.classList.remove('w-6', 'bg-white/40');
        indicator.classList.add('w-12', 'bg-[#78b3ce]');
      } else {
        indicator.classList.remove('w-12', 'bg-[#78b3ce]');
        indicator.classList.add('w-6', 'bg-white/40');
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  // Auto-play
  slideInterval = setInterval(nextSlide, 5000);

  // Manual controls
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function() {
      clearInterval(slideInterval);
      currentSlide = index;
      showSlide(currentSlide);
      slideInterval = setInterval(nextSlide, 5000);
    });
  });

  // Initialize first slide
  showSlide(0);
}

// Initialize hero slider when DOM is ready
document.addEventListener('DOMContentLoaded', initHeroSlider);

// ========== GALLERY LIGHTBOX ==========
let currentImageIndex = 0;
let galleryImages = [];

function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!lightbox) return;

  galleryImages = Array.from(galleryItems).map(item => item.querySelector('img').src);

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', function() {
      currentImageIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    // Small timeout to ensure display:flex is applied before opacity transition starts
    setTimeout(() => {
      lightbox.classList.remove('opacity-0');
      lightbox.classList.add('opacity-100');
    }, 10);
    updateLightboxImage();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('opacity-100');
    lightbox.classList.add('opacity-0');
    
    // Wait for transition to finish before hiding
    setTimeout(() => {
      lightbox.classList.remove('flex');
      lightbox.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }

  function updateLightboxImage() {
    lightboxImage.src = galleryImages[currentImageIndex];
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      showPrevImage();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      showNextImage();
    });
  }

  // Close on background click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    }
  });
}

document.addEventListener('DOMContentLoaded', initGalleryLightbox);

// ========== FAQ ACCORDION ==========
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (question && answer) {
      question.addEventListener('click', function() {
        const isOpen = !answer.classList.contains('hidden');

        if (isOpen) {
          answer.classList.add('hidden');
          icon.classList.remove('fa-minus');
          icon.classList.add('fa-plus');
        } else {
          answer.classList.remove('hidden');
          icon.classList.remove('fa-plus');
          icon.classList.add('fa-minus');
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', initFAQAccordion);

// ========== CONTACT FORM VALIDATION ==========
function initContactForm() {
  const contactForm = document.getElementById('contact-form');

  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    // Validate name
    if (!name.value.trim()) {
      showError(name, 'Name is required');
      isValid = false;
    }

    // Validate email
    if (!email.value.trim()) {
      showError(email, 'Email is required');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError(email, 'Please enter a valid email');
      isValid = false;
    }

    // Validate message
    if (!message.value.trim()) {
      showError(message, 'Message is required');
      isValid = false;
    }

    if (isValid) {
      // Form is valid - show success message
      showSuccessMessage();
      contactForm.reset();
    }
  });

  function showError(input, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-xs mt-1';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
    input.classList.add('border-red-500');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4';
    successDiv.textContent = 'Thank you for your message! We will get back to you soon.';
    contactForm.insertBefore(successDiv, contactForm.firstChild);

    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }

  // Remove error styling on input
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      this.classList.remove('border-red-500');
      const error = this.parentElement.querySelector('.error-message');
      if (error) error.remove();
    });
  });
}

document.addEventListener('DOMContentLoaded', initContactForm);

// ========== SMOOTH SCROLLING ==========
document.addEventListener('DOMContentLoaded', function() {
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;

      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// ========== ANIMATED COUNTER (for Gallery stats) ==========
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('.animated-counter');
  
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        entry.target.classList.add('counted');
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

document.addEventListener('DOMContentLoaded', initCounters);
