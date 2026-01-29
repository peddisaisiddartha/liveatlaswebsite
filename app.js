// ================================
// LiveAtlas app.js (CLEAN & SAFE)
// ================================

// 🔗 SINGLE SOURCE OF TRUTH FOR BOOKING
function openBooking() {
    window.open('https://cal.com/live-atlas/60min', '_blank');
}

// --------------------------------
// Particle Background Animation
// --------------------------------
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.mouse = { x: null, y: null, radius: 150 };
        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particles = [];

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                color: `rgba(0, 212, 255, ${Math.random() * 0.5 + 0.3})`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

            if (this.mouse.x !== null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    p.x -= Math.cos(angle) * 2;
                    p.y -= Math.sin(angle) * 2;
                }
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();

            this.particles.forEach((op, j) => {
                if (i !== j) {
                    const d = Math.hypot(p.x - op.x, p.y - op.y);
                    if (d < 100) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(0,212,255,${0.15})`;
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(op.x, op.y);
                        this.ctx.stroke();
                    }
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.init());
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// Init particles
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles');
    if (canvas) new ParticleSystem(canvas);
});

// --------------------------------
// Navbar scroll
// --------------------------------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 100);
});

// --------------------------------
// Mobile menu
// --------------------------------
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// --------------------------------
// Video modal
// --------------------------------
function playVideo() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

document.querySelector('.close-modal')?.addEventListener('click', () => {
    const modal = document.getElementById('videoModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    const iframe = modal.querySelector('iframe');
    if (iframe) iframe.src = iframe.src;
});

// --------------------------------
// 3D Card tilt
// --------------------------------
document.querySelectorAll('.card-3d').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rx = (y - r.height / 2) / 10;
        const ry = (r.width / 2 - x) / 10;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px)';
    });
});

// --------------------------------
// Back to top
// --------------------------------
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 400 ? 'block' : 'none';
});

backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

console.log('✅ LiveAtlas app.js loaded cleanly');
