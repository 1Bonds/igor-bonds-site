document.addEventListener('DOMContentLoaded', () => {
  // Atualizar ano no rodapé
  document.getElementById('year').textContent = new Date().getFullYear();

  // Menu responsivo (hamburger)
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
  });

  // Fechar menu ao clicar em um link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Animação ao rolar (scroll reveal)
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
  const projects = document.querySelectorAll('.project');
  let currentIndex = 0;

  // Função para atualizar o lightbox
  function updateLightbox(index) {
    currentIndex = index;
    lightboxImage.classList.add('fade');
    setTimeout(() => {
      lightboxImage.src = projects[index].dataset.image;
      lightboxCaption.textContent = projects[index].dataset.caption;
      lightboxCounter.textContent = `Imagem ${index + 1} de ${projects.length}`;
      lightboxImage.classList.remove('fade');
      updateThumbnails();
    }, 300);
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.focus();
  }

  // Função para criar e atualizar miniaturas
  function updateThumbnails() {
    lightboxThumbnails.innerHTML = '';
    projects.forEach((project, index) => {
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

  // Abrir lightbox ao clicar em um projeto
  projects.forEach((project, index) => {
    project.addEventListener('click', () => {
      updateLightbox(index);
    });
  });

  // Fechar lightbox
  lightboxClose.addEventListener('click', () => {
    lightbox.setAttribute('aria-hidden', 'true');
  });

  // Fechar lightbox ao clicar fora da imagem
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
      lightbox.setAttribute('aria-hidden', 'true');
    }
  });

  // Navegação para a imagem anterior
  lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + projects.length) % projects.length;
    updateLightbox(currentIndex);
  });

  // Navegação para a próxima imagem
  lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % projects.length;
    updateLightbox(currentIndex);
  });

  // Navegação por teclado
  lightbox.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + projects.length) % projects.length;
      updateLightbox(currentIndex);
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % projects.length;
      updateLightbox(currentIndex);
    } else if (e.key === 'Escape') {
      lightbox.setAttribute('aria-hidden', 'true');
    }
  });

  // Suporte a swipe (toque)
  let touchStartX = 0;
  let touchEndX = 0;

  lightboxContent.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  lightboxContent.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) {
      currentIndex = (currentIndex + 1) % projects.length;
      updateLightbox(currentIndex);
    } else if (touchEndX > touchStartX + 50) {
      currentIndex = (currentIndex - 1 + projects.length) % projects.length;
      updateLightbox(currentIndex);
    }
  });

  // Esconder tela de carregamento após o carregamento
  window.addEventListener('load', () => {
    document.getElementById('loading').style.display = 'none';
  });
});
