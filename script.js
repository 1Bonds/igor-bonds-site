const SELECTORS = {
  year: '#year',
  themeToggle: '#theme-toggle',
  progressBar: '#progress-bar',
  hamburger: '.hamburger',
  navLinks: '.nav-links',
  navLink: '.nav-link',
  sectionAnim: '.section-anim',
  testimonials: '.testimonial',
  filterBtn: '.filter-btn',
  project: '.project',
  lightbox: '#lightbox',
  lightboxContent: '.lightbox-content',
  lightboxImage: '.lightbox-image',
  lightboxCounter: '.lightbox-counter',
  lightboxCaption: '.lightbox-caption',
  lightboxThumbnails: '.lightbox-thumbnails',
  lightboxClose: '.lightbox-close',
  lightboxPrev: '.lightbox-prev',
  lightboxNext: '.lightbox-next',
  form: '.contact-form',
  formMessage: '.form-message',
  backToTop: '#back-to-top',
  loading: '#loading',
  blogSearch: '#blog-search',
  blogGrid: '#blog-grid',
  map: '#map',
  shareBtn: '.share-btn'
};

const blogPosts = [
  {
    title: 'Como a IA está Transformando Negócios',
    image: 'https://images.unsplash.com/photo-1516321310764-8d4c29ee4382?fit=crop&w=300&h=200',
    excerpt: 'Descubra como a inteligência artificial pode impulsionar sua empresa.',
    link: '#'
  },
  {
    title: '5 Tendências em Desenvolvimento Web',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?fit=crop&w=300&h=200',
    excerpt: 'Fique por dentro das novidades que estão moldando a web.',
    link: '#'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Atualizar ano no rodapé
  document.querySelector(SELECTORS.year).textContent = new Date().getFullYear();

  // Modo escuro
  const body = document.body;
  const themeToggle = document.querySelector(SELECTORS.themeToggle);
  const savedTheme = localStorage.getItem('theme') || 'light';
  body.dataset.theme = savedTheme;
  themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

  themeToggle.addEventListener('click', () => {
    const newTheme = body.dataset.theme === 'light' ? 'dark' : 'light';
    body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });

  // Barra de progresso com debounce
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  window.addEventListener('scroll', debounce(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.querySelector(SELECTORS.progressBar).style.width = `${scrollPercent}%`;
  }, 10));

  // Menu responsivo
  const hamburger = document.querySelector(SELECTORS.hamburger);
  const navLinks = document.querySelector(SELECTORS.navLinks);

  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll(SELECTORS.navLink).forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Animação ao rolar
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

  document.querySelectorAll(SELECTORS.sectionAnim).forEach(section => {
    observer.observe(section);
  });

  // Carrossel de depoimentos
  const testimonials = document.querySelectorAll(SELECTORS.testimonials);
  let currentTestimonial = 0;

  const showTestimonial = index => {
    testimonials.forEach((testimonial, i) => {
      testimonial.classList.toggle('active', i === index);
    });
  };

  const nextTestimonial = () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  };

  showTestimonial(currentTestimonial);
  setInterval(nextTestimonial, 5000);

  // Filtros do portfólio
  const filterButtons = document.querySelectorAll(SELECTORS.filterBtn);
  const projects = document.querySelectorAll(SELECTORS.project);

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      projects.forEach(project => {
        const category = project.dataset.category;
        project.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (filter === 'all' || filter === category) {
          project.style.display = 'block';
          project.style.opacity = '1';
          project.style.transform = 'translateY(0)';
        } else {
          project.style.opacity = '0';
          project.style.transform = 'translateY(20px)';
          setTimeout(() => { project.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // Lightbox do portfólio
  const lightbox = document.querySelector(SELECTORS.lightbox);
  const lightboxContent = document.querySelector(SELECTORS.lightboxContent);
  const lightboxImage = document.querySelector(SELECTORS.lightboxImage);
  const lightboxCounter = document.querySelector(SELECTORS.lightboxCounter);
  const lightboxCaption = document.querySelector(SELECTORS.lightboxCaption);
  const lightboxThumbnails = document.querySelector(SELECTORS.lightboxThumbnails);
  const lightboxClose = document.querySelector(SELECTORS.lightboxClose);
  const lightboxPrev = document.querySelector(SELECTORS.lightboxPrev);
  const lightboxNext = document.querySelector(SELECTORS.lightboxNext);
  let currentIndex = 0;
  let isZoomed = false;

  const updateLightbox = index => {
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
  };

  const updateThumbnails = visibleProjects => {
    lightboxThumbnails.innerHTML = '';
    visibleProjects.forEach((project, index) => {
      const thumb = document.createElement('img');
      thumb.src = project.dataset.thumbnail;
      thumb.alt = `Miniatura do projeto ${index + 1}`;
      thumb.classList.add('lightbox-thumbnail');
      if (index === currentIndex) thumb.classList.add('active');
      thumb.addEventListener('click', () => updateLightbox(index));
      lightboxThumbnails.appendChild(thumb);
    });
  };

  projects.forEach((project, index) => {
    project.addEventListener('click', e => {
      if (e.target.closest('.share-btn')) return;
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

  // Compartilhar projetos
  document.querySelectorAll(SELECTORS.shareBtn).forEach(btn => {
    btn.addEventListener('click', () => {
      const project = btn.closest('.project');
      const caption = project.dataset.caption;
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: caption,
          text: `Confira este projeto da Igor Bonds: ${caption}`,
          url
        });
      } else {
        alert(`Compartilhar: ${caption} - ${url}`);
      }
    });
  });

  // Validação do formulário com Formspree
  const form = document.querySelector(SELECTORS.form);
  const formMessage = document.querySelector(SELECTORS.formMessage);

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
        formMessage.textContent = response.ok ? 'Mensagem enviada com sucesso!' : 'Erro ao enviar a mensagem.';
        formMessage.classList.toggle('success', response.ok);
        formMessage.classList.add('visible');
        if (response.ok) form.reset();
        setTimeout(() => {
          formMessage.classList.remove('visible');
        }, 5000);
      } catch (error) {
        formMessage.textContent = 'Erro de conexão.';
        formMessage.classList.add('visible');
        setTimeout(() => {
          formMessage.classList.remove('visible');
        }, 5000);
      }
    }
  });

  // Validação em tempo real
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      const error = group.querySelector('.form-error');
      if (input.validity.valid) {
        group.classList.remove('invalid');
        error.textContent = '';
      }
    });
  });

  // Blog dinâmico
  const blogGrid = document.querySelector(SELECTORS.blogGrid);
  const blogSearch = document.querySelector(SELECTORS.blogSearch);
  let cachedPosts = JSON.parse(sessionStorage.getItem('blogPosts')) || blogPosts;

  const renderBlog = posts => {
    blogGrid.innerHTML = posts.map(post => `
      <div class="blog-card">
        <img src="${post.image}" alt="${post.title}" loading="lazy" />
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <a href="${post.link}" class="blog-link">Leia Mais</a>
      </div>
    `).join('');
  };

  renderBlog(cachedPosts);
  sessionStorage.setItem('blogPosts', JSON.stringify(cachedPosts));

  blogSearch.addEventListener('input', () => {
    const query = blogSearch.value.toLowerCase();
    const filteredPosts = blogPosts.filter(post =>
      post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query)
    );
    renderBlog(filteredPosts);
  });

  // Mapa com Leaflet
  const map = L.map(SELECTORS.map.slice(1)).setView([-23.565432, -46.654321], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.marker([-23.565432, -46.654321]).addTo(map)
    .bindPopup('Igor Bonds - São Paulo')
    .openPopup();

  // Botão Voltar ao Topo
  const backToTop = document.querySelector(SELECTORS.backToTop);
  window.addEventListener('scroll', debounce(() => {
    backToTop.classList.toggle('visible', window.scrollY > 300);
  }, 10));

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Esconder tela de carregamento
  window.addEventListener('load', () => {
    document.querySelector(SELECTORS.loading).style.display = 'none';
  });
});
