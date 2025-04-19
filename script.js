document.addEventListener('DOMContentLoaded', () => {
  // Atualizar ano no rodapé
  document.getElementById('year').textContent = new Date().getFullYear();

  // Modo escuro
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('theme') || 'light';
  body.dataset.theme = savedTheme;
  themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

  themeToggle.addEventListener('click', () => {
    const newTheme = body.dataset.theme === 'light' ? 'dark' : 'light';
    body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });

  // Barra de progresso
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.getElementById('progress-bar').style.width = `${scrollPercent}%`;
  });

  // Menu responsivo
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Animação ao rolar
  const animatedSections = document.querySelectorAll('.section-anim');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  animatedSections.forEach(section => {
    observer.observe(section);
  });

  // Carrossel de depoimentos
  const testimonials = document.querySelectorAll('.testimonial');
  let currentTestimonial = 0;

  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.classList.toggle('active', i === index);
    });
  }

  function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  }

  showTestimonial(currentTestimonial);
  setInterval(nextTestimonial, 5000);

  // Filtros do portfólio
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      projects.forEach(project => {
        const category = project.dataset.category;
        project.style.display = filter === 'all' || filter === category ? 'block' : 'none';
      });
    });
  });

  // Lightbox do portfólio
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxCounter = document.querySelector('.lightbox-counter');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxThumbnails = document.querySelector('.lightbox-thumbnails');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let currentIndex = 0;
  let isZoomed = false;

  function updateLightbox(index) {
    currentIndex = index;
    const visibleProjects = Array.from(projects).filter(p => p.style.display !== 'none');
    if (visibleProjects.length === 0) return;
    lightboxImage.classList.add('fade');
    setTimeout(() => {
      lightboxImage.src = visibleProjects[index].dataset.image;
      lightboxCaption.textContent = visibleProjects[index].dataset.caption;
      lightboxCounter.textContent = `Imagem ${index + 1} de ${visibleProjects.length}`;
      lightboxImage.classList.remove('fade');
      updateThumbnails(visibleProjects);
    }, 300);
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.focus();
  }

  function updateThumbnails(visibleProjects) {
    lightboxThumbnails.innerHTML = '';
    visibleProjects.forEach((project, index) => {
      const thumb = document.createElement('img');
      thumb.src = project.dataset.thumbnail;
      thumb.alt = `Miniatura do projeto ${index + 1}`;
      thumb.classList.add('lightbox-thumbnail');
      if (index === currentIndex) {
        thumb.classList.add('active');
      }
      thumb.addEventListener('click', () => updateLightbox(index));
      lightboxThumbnails.appendChild(thumb);
    });
  }

  projects.forEach((project, index) => {
    project.addEventListener('click', () => {
      updateLightbox(index);
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.setAttribute('aria-hidden', 'true');
    isZoomed = false;
    lightboxImage.classList.remove('zoomed');
  });

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
      lightbox.setAttribute('aria-hidden', 'true');
      isZoomed = false;
      lightboxImage.classList.remove('zoomed');
    }
  });

  lightboxPrev.addEventListener('click', () => {
    const visibleProjects = Array.from(projects).filter(p => p.style.display !== 'none');
    currentIndex = (currentIndex - 1 + visibleProjects.length) % visibleProjects.length;
    updateLightbox(currentIndex);
  });

  lightboxNext.addEventListener('click', () => {
    const visibleProjects = Array.from(projects).filter(p => p.style.display !== 'none');
    currentIndex = (currentIndex + 1) % visibleProjects.length;
    updateLightbox(currentIndex);
  });

  lightboxImage.addEventListener('click', () => {
    isZoomed = !isZoomed;
    lightboxImage.classList.toggle('zoomed', isZoomed);
  });

  lightbox.addEventListener('keydown', e => {
    const visibleProjects = Array.from(projects).filter(p => p.style.display !== 'none');
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + visibleProjects.length) % visibleProjects.length;
      updateLightbox(currentIndex);
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % visibleProjects.length;
      updateLightbox(currentIndex);
    } else if (e.key === 'Escape') {
      lightbox.setAttribute('aria-hidden', 'true');
      isZoomed = false;
      lightboxImage.classList.remove('zoomed');
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  lightboxContent.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  lightboxContent.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const visibleProjects = Array.from(projects).filter(p => p.style.display !== 'none');
    if (touchEndX < touchStartX - 50) {
      currentIndex = (currentIndex + 1) % visibleProjects.length;
      updateLightbox(currentIndex);
    } else if (touchEndX > touchStartX + 50) {
      currentIndex = (currentIndex - 1 + visibleProjects.length) % visibleProjects.length;
      updateLightbox(currentIndex);
    }
  });

  // Validação do formulário com Formspree
  const form = document.querySelector('.contact-form');
  const formMessage = document.querySelector('.form-message');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    let isValid = true;

    form.querySelectorAll('.form-group').forEach(group => {
      const input = group.querySelector('input, textarea');
      const error = group.querySelector('.form-error');
      if (!input.validity.valid) {
        group.classList.add('invalid');
        error.textContent = input.validationMessage;
        isValid = false;
      } else {
        group.classList.remove('invalid');
        error.textContent = '';
      }
    });

    if (isValid) {
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          formMessage.textContent = 'Mensagem enviada com sucesso!';
          formMessage.classList.add('success');
          form.reset();
        } else {
          formMessage.textContent = 'Erro ao enviar a mensagem. Tente novamente.';
        }
      } catch (error) {
        formMessage.textContent = 'Erro de conexão. Verifique sua internet.';
      }
    }
  });

  // Botão Voltar ao Topo
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 300);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Esconder tela de carregamento
  window.addEventListener('load', () => {
    document.getElementById('loading').style.display = 'none';
  });
});
