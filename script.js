// ================================
// LiveAtlas Script.js (CLEAN & SAFE)
// ================================

// 🔗 SINGLE SOURCE OF TRUTH FOR BOOKING
function openBooking() {
    window.open('https://cal.com/live-atlas/60min', '_blank');
}

// --------------------------------
// Preloader
// --------------------------------
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 500);
    }
});

// --------------------------------
// Typing animation
// --------------------------------
function typeWriter(element, text, speed = 80) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i++);
            setTimeout(type, speed);
        }
    }
    type();
}

document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const text = typingElement.dataset.text || typingElement.textContent;
        typeWriter(typingElement, text);
    }
});

// --------------------------------
// Destination filtering
// --------------------------------
function filterDestinations(filter) {
    document.querySelectorAll('.destination-card').forEach(card => {
        card.style.display =
            filter === 'all' || card.dataset[filter] === 'true'
                ? 'block'
                : 'none';
    });
}

// --------------------------------
// Search destinations
// --------------------------------
const searchInput = document.getElementById('destination-search');
if (searchInput) {
    searchInput.addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.destination-card').forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(q) ? 'block' : 'none';
        });
    });
}

// --------------------------------
// Virtual tour preview
// --------------------------------
function previewTour(destination) {
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.innerHTML = `
        <div class="preview-content">
            <span class="close-preview">&times;</span>
            <h2>${destination} — Live Preview</h2>
            <p>360° preview coming soon.</p>
            <button class="book-now-btn">Book Live Tour</button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close-preview').onclick = () => modal.remove();
    modal.querySelector('.book-now-btn').onclick = openBooking;
}

// --------------------------------
// Stats counter
// --------------------------------
function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start);
        }
    }, 16);
}

const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('done')) {
            entry.target.classList.add('done');
            animateCounter(entry.target, +entry.target.dataset.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => statsObserver.observe(el));

// --------------------------------
// Live Chat (unchanged)
// --------------------------------
function initializeLiveChat() {
    const chatBtn = document.createElement('div');
    chatBtn.className = 'live-chat-button';
    chatBtn.innerHTML = '<i class="fas fa-comments"></i>';
    chatBtn.onclick = () =>
        alert('Live chat coming soon. Please email liveatlasco@gmail.com');
    document.body.appendChild(chatBtn);
}

document.addEventListener('DOMContentLoaded', initializeLiveChat);

// --------------------------------
// Back to top
// --------------------------------
const backToTop = document.createElement('button');
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTop.className = 'back-to-top';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 400 ? 'block' : 'none';
});

backToTop.onclick = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

// --------------------------------
console.log('✅ LiveAtlas script loaded cleanly');
