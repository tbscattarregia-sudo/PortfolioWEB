// ==================================================
// MAIN.JS - PORTFOLIO TIZIANO
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------
     Scroll suave solo para anchors (#)
  ---------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------------------------------
     Tema claro / oscuro (opcional)
  ---------------------------------- */
  const themeBtn = document.getElementById("themeBtn");

  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-theme");
  }

  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("light-theme") ? "light" : "dark"
    );
  });

  /* ---------------------------------
     Fade-in al hacer scroll
  ---------------------------------- */
  const elements = document.querySelectorAll("section, .project-card");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

});
