document.addEventListener('DOMContentLoaded', function () {
  const revealElements = document.querySelectorAll('.reveal');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${index * 70}ms`;
    observer.observe(element);
  });

  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });

  document.querySelectorAll('#mainNav a').forEach((link) => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
      }
    });
  });

  // Portfolio Filtering Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === itemCategory) {
          item.classList.remove('hidden');
          // Trigger a small delay to re-run reveal if necessary, 
          // though usually they stay visible once revealed.
          setTimeout(() => {
            item.classList.add('visible');
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Contact Form Loader Logic
  const contactForm = document.querySelector('.contact-form');
  const globalLoader = document.getElementById('globalLoader');

  if (contactForm && globalLoader) {
    contactForm.addEventListener('submit', function() {
      globalLoader.classList.add('active');
    });
  }
});