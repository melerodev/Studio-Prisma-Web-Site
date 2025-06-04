// Funcionalidad del sitio web Estudio Prisma

// Variables globales
let currentSlide = 0;
const projects = [
    {
        title: "Rebranding Café Luna",
        client: "Café Luna",
        description: "Identidad visual completa para cadena de cafeterías premium"
    },
    {
        title: "Sitio Web TechStart",
        client: "TechStart",
        description: "Diseño web moderno para startup tecnológica"
    },
    {
        title: "Campaña Visual EcoVerde",
        client: "EcoVerde",
        description: "Campaña publicitaria para marca sostenible"
    },
    {
        title: "Packaging Artesanal",
        client: "Miel Dorada",
        description: "Diseño de packaging para productos artesanales"
    }
];

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeNavbar();
    initializeCarousel();
    initializeBrandsCarousel();
    initializeBackToTop();
    initializeContactForm();
    initializeScrollIndicator();
    initializeAnimations();
    initializeSmoothScroll();
});

// Funcionalidad del navbar
function initializeNavbar() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Cambiar icono del botón
            const icon = mobileMenuBtn.querySelector('svg');
            if (mobileMenu.classList.contains('hidden')) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            }
        });

        // Cerrar menú móvil al hacer clic en un enlace
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('svg');
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            });
        });

        // Cerrar menú móvil al hacer clic fuera de él
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('svg');
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            }
        });
    }

    // Efecto de transparencia del navbar al hacer scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            } else {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }
        }
    });
}

// Funcionalidad del carousel principal
function initializeCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    
    if (!carouselTrack || !prevBtn || !nextBtn) return;

    let autoPlayInterval;

    // Auto-play del carousel
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Event listeners para los botones
    prevBtn.addEventListener('click', function() {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });

    nextBtn.addEventListener('click', function() {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });

    // Pausar auto-play al hacer hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Soporte para touch/swipe en móviles
    let startX = 0;
    let endX = 0;

    carouselTrack.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });

    carouselTrack.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            stopAutoPlay();
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            startAutoPlay();
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % projects.length;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + projects.length) % projects.length;
        updateCarousel();
    }

    function updateCarousel() {
        const translateX = -currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
    }

    // Iniciar auto-play
    startAutoPlay();

    // Soporte para navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        }
    });
}

// Funcionalidad del carousel de marcas
function initializeBrandsCarousel() {
    const brandsTrack = document.getElementById('brands-track');
    
    if (!brandsTrack) return;

    let scrollPosition = 0;
    let isPaused = false;
    let animationId;
    const scrollSpeed = 0.5;

    function scrollBrands() {
        if (!isPaused) {
            scrollPosition += scrollSpeed;
            
            // Reset cuando llegue al final
            if (scrollPosition >= brandsTrack.scrollWidth / 3) {
                scrollPosition = 0;
            }
            
            brandsTrack.scrollLeft = scrollPosition;
        }
        animationId = requestAnimationFrame(scrollBrands);
    }

    // Pausar al hacer hover
    brandsTrack.addEventListener('mouseenter', () => {
        isPaused = true;
    });

    brandsTrack.addEventListener('mouseleave', () => {
        isPaused = false;
    });

    // Pausar cuando no está visible (optimización de rendimiento)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isPaused = false;
            } else {
                isPaused = true;
            }
        });
    });

    observer.observe(brandsTrack);

    // Iniciar animación
    animationId = requestAnimationFrame(scrollBrands);
}

// Funcionalidad del botón "Volver arriba"
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;

    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.remove('hidden');
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.add('hidden');
            backToTopBtn.classList.remove('visible');
        }
    });

    // Scroll suave al hacer clic
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Funcionalidad del formulario de contacto
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(contactForm);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Validación básica
        if (!data.nombre || !data.email || !data.mensaje) {
            showNotification('Por favor, completa todos los campos obligatorios.', 'error');
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Por favor, introduce un email válido.', 'error');
            return;
        }

        // Validar teléfono si se proporciona
        if (data.telefono && data.telefono.length > 0) {
            const phoneRegex = /^[\+]?[0-9\s\-$$$$]{9,}$/;
            if (!phoneRegex.test(data.telefono)) {
                showNotification('Por favor, introduce un teléfono válido.', 'error');
                return;
            }
        }

        // Mostrar loading
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Enviando...';
        submitBtn.disabled = true;

        // Simular envío del formulario (aquí conectarías con tu backend)
        setTimeout(() => {
            showNotification('¡Gracias por tu mensaje! Te contactaremos pronto.', 'success');
            
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Limpiar formulario
            contactForm.reset();
            
            console.log('Datos del formulario:', data);
        }, 2000);
    });

    // Validación en tiempo real
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(input);
        });

        input.addEventListener('input', function() {
            clearFieldError(input);
        });
    });
}

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Limpiar errores previos
    clearFieldError(field);
    
    // Validaciones específicas
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    }
    
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Email no válido');
            return false;
        }
    }
    
    if (fieldName === 'telefono' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-$$$$]{9,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Teléfono no válido');
            return false;
        }
    }
    
    return true;
}

// Mostrar error en campo
function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    
    // Crear o actualizar mensaje de error
    let errorMsg = field.parentNode.querySelector('.field-error');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'field-error text-sm text-red-500 mt-1';
        field.parentNode.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
}

// Limpiar error en campo
function clearFieldError(field) {
    field.style.borderColor = '';
    const errorMsg = field.parentNode.querySelector('.field-error');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Funcionalidad del indicador de scroll en hero
function initializeScrollIndicator() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Inicializar animaciones al hacer scroll
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        // Configurar estado inicial
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        observer.observe(element);
    });
}

// Scroll suave para todos los enlaces internos
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Ajuste para navbar fijo
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Crear contenedor de notificaciones si no existe
    let container = document.getElementById('notifications-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notifications-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }

    // Crear notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        font-size: 14px;
        line-height: 1.4;
    `;
    
    notification.textContent = message;
    container.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);

    // Permitir cerrar al hacer clic
    notification.addEventListener('click', function() {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Utilidades adicionales
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Optimizar scroll events
const optimizedScrollHandler = throttle(function() {
    // Aquí puedes agregar lógica adicional para eventos de scroll
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Lazy loading para imágenes (si decides implementarlo)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Detectar si el usuario prefiere movimiento reducido
function respectsReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Ajustar animaciones según preferencias del usuario
if (respectsReducedMotion()) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

// Manejo de errores globales
window.addEventListener('error', function(e) {
    console.error('Error en el sitio:', e.error);
    // Aquí podrías enviar errores a un servicio de monitoreo
});

// Funcionalidad para modo oscuro (preparado para implementación futura)
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (darkModeToggle) {
        // Verificar preferencia guardada
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        }
        
        darkModeToggle.addEventListener('click', function() {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}

// Inicializar funcionalidades adicionales cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    initializeDarkMode();
});

// Exportar funciones para uso global si es necesario
window.EstudioPrisma = {
    showNotification,
    validateField,
    debounce,
    throttle
};