// Aguarda o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
  // Menu responsivo (hamburger)
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Animação ao rolar (scroll reveal)
  const animatedSections = document.querySelectorAll('.section-anim');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target); // Remove o observador após a animação
      }
    });
  }, {
    threshold: 0.1 // Gatilho da animação: 10% visível
  });

  animatedSections.forEach(section => {
    observer.observe(section);
  });
});
