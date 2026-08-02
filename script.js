document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-menu');

    let scrollFrame = null;
    const updateNavbar = () => navbar?.classList.toggle('scrolled', window.scrollY > 50);
    updateNavbar();
    window.addEventListener('scroll', () => {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(() => {
            updateNavbar();
            scrollFrame = null;
        });
    }, { passive: true });

    const closeMenu = () => {
        navLinks?.classList.remove('active');
        mobileMenu?.classList.remove('is-active');
        mobileMenu?.setAttribute('aria-expanded', 'false');
        mobileMenu?.setAttribute('aria-label', 'Abrir menu de navegação');
        document.body.style.overflow = '';
    };

    mobileMenu?.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('is-active', isOpen);
        mobileMenu.setAttribute('aria-expanded', String(isOpen));
        mobileMenu.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 960 && navLinks?.classList.contains('active')) closeMenu();
    }, { passive: true });

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
        document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
    } else {
        document.querySelectorAll('.reveal').forEach(element => element.classList.add('active'));
    }

    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = [...track.children];
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const carousel = document.querySelector('.carousel-container');
        let currentIndex = 0;
        let startX = 0;

        slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', String(index !== 0));
        });

        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            prevButton.classList.toggle('hidden', currentIndex === 0);
            nextButton.classList.toggle('hidden', currentIndex === slides.length - 1);
            slides.forEach((slide, index) => slide.setAttribute('aria-hidden', String(index !== currentIndex)));
        };

        nextButton.addEventListener('click', () => { if (currentIndex < slides.length - 1) { currentIndex += 1; updateCarousel(); } });
        prevButton.addEventListener('click', () => { if (currentIndex > 0) { currentIndex -= 1; updateCarousel(); } });
        track.addEventListener('touchstart', event => { startX = event.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', event => {
            const distance = startX - event.changedTouches[0].clientX;
            if (Math.abs(distance) < 50) return;
            if (distance > 0) nextButton.click(); else prevButton.click();
        }, { passive: true });
        carousel.addEventListener('keydown', event => {
            if (event.key === 'ArrowRight') { event.preventDefault(); nextButton.click(); }
            if (event.key === 'ArrowLeft') { event.preventDefault(); prevButton.click(); }
            if (event.key === 'Home') { event.preventDefault(); currentIndex = 0; updateCarousel(); }
            if (event.key === 'End') { event.preventDefault(); currentIndex = slides.length - 1; updateCarousel(); }
        });
        updateCarousel();
    }

    document.querySelectorAll('.accordion details').forEach(item => {
        item.addEventListener('toggle', () => {
            if (!item.open) return;
            document.querySelectorAll('.accordion details').forEach(other => {
                if (other !== item) other.open = false;
            });
        });
    });
});
