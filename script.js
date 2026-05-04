
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar'); 
    const mobileMenu = document.getElementById('mobile-menu'); 
    const navLinks = document.querySelector('.nav-links');

    // Navbar e Menu Mobile Efeito de Scroll da Navbar
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // Animações de Scroll - Menu Mobile: Controle de abertura e travamento do scroll do body
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

    // Carrossel Interativo - Rolagem Suave para Navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                if (navLinks) navLinks.classList.remove('active');
                window.scrollTo({ 
                    top: target.id === 'top' ? 0 : target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Ativa animações de revelação conforme o scroll atinge os elementos
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


    // Carrossel - Responsável por calcular o deslocamento lateral das imagens e gerenciar os pontos indicadores.
    
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.carousel-indicators');
        
        let currentIndex = 0;

      // Retorna quantos itens são visíveis ao mesmo tempo, Atualmente configurado para 1 (Single Slide).
         
        const getItemsVisible = () => {
            return 1;
        };

        const createDots = () => {
            dotsNav.innerHTML = '';
            const itemsVisible = getItemsVisible();
            const dotCount = slides.length - itemsVisible + 1;
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('button');
                dot.classList.add('indicator');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                dotsNav.appendChild(dot);
            }
        };


         // Atualiza a posição visual do carrossel e o estado dos botões.
        
        const updateCarousel = () => {
            const itemsVisible = getItemsVisible();
            if (currentIndex > slides.length - itemsVisible) {
                currentIndex = Math.max(0, slides.length - itemsVisible);
            }

            const offset = slides[currentIndex].offsetLeft;
            track.style.transform = `translateX(-${offset}px)`;
            
            prevButton.classList.toggle('hidden', currentIndex === 0);
            nextButton.classList.toggle('hidden', currentIndex >= slides.length - itemsVisible);
            
            const dots = Array.from(dotsNav.children);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        nextButton.addEventListener('click', () => {
            const itemsVisible = getItemsVisible();
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

        // Navegação por Gestos (Touch Events)
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
            createDots();
            updateCarousel();
        });

        createDots();
        updateCarousel();
    }
});