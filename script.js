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
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const projects = document.querySelectorAll('.project');

  projects.forEach(project => {
    project.addEventListener('click', () => {
      lightboxImage.src = project.dataset.image;
      lightboxCaption.textContent = project.dataset.caption;
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.setAttribute('aria-hidden', 'true');
  });

  // Fechar lightbox ao clicar fora da imagem
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
      lightbox.setAttribute('aria-hidden', 'true');
    }
  });

  // Esconder tela de carregamento após o carregamento
  window.addEventListener('load', () => {
    document.getElementById('loading').style.display = 'none';
  });
});
