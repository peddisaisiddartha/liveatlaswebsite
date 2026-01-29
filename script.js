// Additional interactive features and enhancements

// Cursor Trail Effect
const cursorTrail = document.createElement('div');
cursorTrail.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.6), transparent);
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    display: none;
`;
document.body.appendChild(cursorTrail);

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorTrail.style.left = mouseX - 10 + 'px';
    cursorTrail.style.top = mouseY - 10 + 'px';
    cursorTrail.style.display = 'block';
});

// Intersection Observer for fade-in animations
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, {
    threshold: 0.1
});

// Apply to various elements
document.querySelectorAll('.section-title, .hero-subtitle').forEach(el => {
    fadeInObserver.observe(el);
});

// Smooth scroll behavior enhancement
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Dynamic background gradient on scroll
let scrollPosition = 0;
window.addEventListener('scroll', () => {
    scrollPosition = window.scrollY;
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const progress = (window.innerHeight - rect.top) / window.innerHeight;
            if (section.classList.contains('features') || section.classList.contains('how-it-works')) {
                const hue = 220 + (progress * 40);
                section.style.background = `linear-gradient(180deg, hsl(${hue}, 30%, 10%) 0%, hsl(${hue + 20}, 35%, 15%) 100%)`;
            }
        }
    });
});

// Destination cards hover effect enhancement
const destinationCards = document.querySelectorAll('.destination-card');
destinationCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.03)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Add parallax effect to hero background
const heroSection = document.querySelector('.hero');
if (heroSection) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        if (heroSection.querySelector('.hero-bg')) {
            heroSection.querySelector('.hero-bg').style.transform = `translateY(${parallax}px)`;
        }
    });
}

// Floating animation for CTA buttons
const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
ctaButtons.forEach((btn, index) => {
    setInterval(() => {
        btn.style.transform = `translateY(${Math.sin(Date.now() / 1000 + index) * 3}px)`;
    }, 50);
});

// Add ripple effect to buttons
const buttons = document.querySelectorAll('.cta-primary, .cta-secondary, .book-btn, .explore-btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Enhanced card animations on scroll
const cards = document.querySelectorAll('.feature-card, .highlight-card');
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) rotateX(0)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.1
});

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px) rotateX(-10deg)';
    card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    cardObserver.observe(card);
});

// Add typing effect to hero title (if on homepage)
const glitchTitle = document.querySelector('.glitch');
if (glitchTitle && window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    const originalText = glitchTitle.textContent;
    glitchTitle.textContent = '';
    let charIndex = 0;
    
    const typeEffect = setInterval(() => {
        if (charIndex < originalText.length) {
            glitchTitle.textContent += originalText.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typeEffect);
        }
    }, 100);
}

// Add active state to navigation
const navLinks = document.querySelectorAll('.nav-menu a');
const currentPath = window.location.pathname;

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath.split('/').pop() || 
        (currentPath.endsWith('/') && link.getAttribute('href') === 'index.html')) {
        link.style.color = 'var(--primary-color)';
    }
});

// Performance optimization: Lazy load images
const images = document.querySelectorAll('img[src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                img.style.opacity = '1';
            }, 100);
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Add loading indicator
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--dark-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 3px solid rgba(0, 212, 255, 0.3);
        border-top-color: var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    
    loader.appendChild(spinner);
    
    // Remove loader after page loads
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }, 1000);
});

// Add spin animation
const spinStyle = document.createElement('style');
spinStyle.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(spinStyle);

console.log('✨ Enhanced interactivity loaded!');
