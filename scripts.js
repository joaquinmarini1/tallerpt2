// Hide loading screen after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
      }, 1500);
    });

    // Generate particles
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      particlesContainer.appendChild(particle);
    }

    // Book interactions
    const books = document.querySelectorAll('.book:not(.book-decorative)');
    books.forEach(book => {
      book.addEventListener('click', function() {
        const targetSection = this.dataset.section;
        const targetElement = document.getElementById(targetSection);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });

      // 3D tilt effect on hover
      book.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      });

      book.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
      });
    });

    // Interactive cards mouse tracking
    const cards = document.querySelectorAll('.interactive-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        this.style.setProperty('--mouse-x', x + '%');
        this.style.setProperty('--mouse-y', y + '%');
      });
    });

    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Animate counters
          if (entry.target.querySelector('.stat-number')) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
              const target = parseInt(stat.getAttribute('data-count'));
              const duration = 2000;
              const increment = target / (duration / 16);
              let current = 0;
              
              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
              }, 16);
            });
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('.content-section').forEach(section => {
      observer.observe(section);
    });

    // Progress bar
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;
      document.getElementById('progressBar').style.width = scrollPercentage + '%';
      
      // Show/hide floating nav
      const floatingNav = document.getElementById('floatingNav');
      if (scrollTop > 500) {
        floatingNav.classList.add('visible');
      } else {
        floatingNav.classList.remove('visible');
      }
      
      // Show/hide back to top button
      const backToTop = document.getElementById('backToTop');
      if (scrollTop > 1000) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
      
      // Update active nav dot
      const sections = document.querySelectorAll('.content-section, .hero-library');
      const navDots = document.querySelectorAll('.nav-dot');
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          navDots.forEach(dot => dot.classList.remove('active'));
          if (navDots[index]) {
            navDots[index].classList.add('active');
          }
        }
      });
    });

    // Navigation dots click
    document.querySelectorAll('.nav-dot').forEach(dot => {
      dot.addEventListener('click', function() {
        const target = this.dataset.target;
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Back to top
    document.getElementById('backToTop').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Parallax effect on bookshelf
    let ticking = false;
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const bookshelf = document.getElementById('bookshelf');
      if (bookshelf) {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        bookshelf.style.transform = `rotateX(5deg) translateY(${yPos}px)`;
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });

    function getRandomBookColor() {
      const colors = [
        ['#d15959ff', '#a8581bff'], // marrón oscuro
        ['#D4AF37', '#8B7355'], // ocre dorado
        ['#8B4513', '#654321']  // marrón rojizo
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    function shuffleBooks() {
      const shelf = document.querySelector('.shelf');
      const books = Array.from(shelf.children);
      
      // Asignar colores aleatorios a los libros decorativos
      books.forEach(book => {
        if (book.classList.contains('book-decorative')) {
          const [color1, color2] = getRandomBookColor();
          book.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
        }
      });
      
      // Mezclar los libros
      for (let i = books.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        shelf.appendChild(books[j]);
      }
    }

    // Llamar a la función cuando se carga la página
    document.addEventListener('DOMContentLoaded', shuffleBooks);
