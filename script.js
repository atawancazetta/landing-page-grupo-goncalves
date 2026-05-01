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

    // 2. Alternar Menu Mobile (Hambúrguer)
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('is-active');
        mobileMenu.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar menu ao clicar em link para melhor experiência mobile (UX)
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
                window.scrollTo({ /* Nota: Ajustado para considerar a altura da navbar */
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

    // --- Lógica do Carrossel (Página Produção) ---
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.carousel-indicators');
        
        let currentIndex = 0;

        // Configurar indicadores (pontos)
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('indicator');
            if (index === 0) dot.classList.add('active');
            dotsNav.appendChild(dot);
        });
        const dots = Array.from(dotsNav.children);

        const updateCarousel = () => {
            // Obtém a largura do container para calcular o deslocamento corretamente
            const slideWidth = track.parentElement.getBoundingClientRect().width;
            
            // No desktop o slideWidth é dividido por 3, no mobile por 1, etc.
            // Mas como cada .carousel-slide tem flex-basis, o cálculo abaixo é mais seguro:
            const offset = slides[currentIndex].offsetLeft;
            track.style.transform = `translateX(-${offset}px)`;
            
            // Atualizar botões
            const itemsVisible = window.innerWidth > 992 ? 3 : (window.innerWidth > 768 ? 2 : 1);
            prevButton.classList.toggle('hidden', currentIndex === 0);
            nextButton.classList.toggle('hidden', currentIndex >= slides.length - itemsVisible);
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        nextButton.addEventListener('click', () => {
            const itemsVisible = window.innerWidth > 992 ? 3 : (window.innerWidth > 768 ? 2 : 1);
            if (currentIndex < slides.length - itemsVisible) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        // Clique nos pontos
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const itemsVisible = window.innerWidth > 992 ? 3 : (window.innerWidth > 768 ? 2 : 1);
                if (index <= slides.length - itemsVisible) {
                    currentIndex = index;
                    updateCarousel();
                }
            });
        });

        // Suporte a Swipe (Arrastar)
        let startX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        track.addEventListener('touchend', e => {
            if (!isDragging) return;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (diff > 50) nextButton.click();
            if (diff < -50) prevButton.click();
            isDragging = false;
        }, { passive: true });

        // Ajustar no redimensionamento da tela
        window.addEventListener('resize', () => {
            currentIndex = 0; // Resetar para evitar erros de cálculo
            updateCarousel();
        });

        updateCarousel();
    }
});