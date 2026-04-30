document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    // 1. Efeito de Scroll da Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Alternar Menu Mobile
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('is-active');
        mobileMenu.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar menu ao clicar em link (UX Mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenu.classList.remove('is-active');
            document.body.style.overflow = '';
        });
    });

    // 3. Rolagem Suave para Navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                navLinks.classList.remove('active');
                window.scrollTo({
                    top: target.id === 'top' ? 0 : target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Animação de Revelação ao Rolar
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});