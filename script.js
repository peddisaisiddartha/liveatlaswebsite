// Additional JavaScript utilities and features for LiveAtlas

// Preloader functionality
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation if element exists
document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const text = typingElement.getAttribute('data-text') || typingElement.textContent;
        typeWriter(typingElement, text, 80);
    }
});

// Destination filter functionality
const destinationFilters = {
    all: () => true,
    popular: (card) => card.dataset.popular === 'true',
    new: (card) => card.dataset.new === 'true',
    featured: (card) => card.dataset.featured === 'true'
};

function filterDestinations(filterType) {
    const cards = document.querySelectorAll('.destination-card');
    const filter = destinationFilters[filterType] || destinationFilters.all;
    
    cards.forEach(card => {
        if (filter(card)) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
}

// Search functionality for destinations
const searchInput = document.getElementById('destination-search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const destinationCards = document.querySelectorAll('.destination-card');
        
        destinationCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Tour price calculator
function calculateTourPrice(destination, duration, extras = []) {
    const basePrices = {
        india: 299,
        uae: 399,
        denmark: 449,
        antarctica: 899
    };
    
    const durationMultiplier = {
        '1hour': 1,
        '2hours': 1.8,
        '4hours': 3.2,
        'fullday': 5
    };
    
    const extraPrices = {
        'private': 100,
        'shopping': 50,
        'photo-package': 75,
        'recording': 150
    };
    
    let totalPrice = basePrices[destination] || 299;
    totalPrice *= durationMultiplier[duration] || 1;
    
    extras.forEach(extra => {
        totalPrice += extraPrices[extra] || 0;
    });
    
    return totalPrice;
}

// Real-time form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Add real-time validation to form inputs
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

if (emailInput) {
    emailInput.addEventListener('blur', (e) => {
        if (e.target.value && !validateEmail(e.target.value)) {
            e.target.style.borderColor = '#ff006e';
            showError(e.target, 'Please enter a valid email address');
        } else {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            hideError(e.target);
        }
    });
}

if (phoneInput) {
    phoneInput.addEventListener('blur', (e) => {
        if (e.target.value && !validatePhone(e.target.value)) {
            e.target.style.borderColor = '#ff006e';
            showError(e.target, 'Please enter a valid phone number');
        } else {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            hideError(e.target);
        }
    });
}

function showError(input, message) {
    let errorDiv = input.parentElement.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ff006e';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        input.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function hideError(input) {
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Virtual tour preview functionality
function previewTour(destination) {
    // This would connect to your VR preview system
    console.log(`Previewing tour for: ${destination}`);
    
    // Show preview modal
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.innerHTML = `
        <div class="preview-content">
            <span class="close-preview">&times;</span>
            <h2>Virtual Tour Preview: ${destination}</h2>
            <div class="preview-video">
                <p>360° Preview loading...</p>
            </div>
            <button onclick="scrollToBooking()" class="book-now-btn">Book This Tour</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close preview
    modal.querySelector('.close-preview').addEventListener('click', () => {
        modal.remove();
    });
}

// Stats counter animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.floor(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animate stats when they come into view
const stats = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => statsObserver.observe(stat));

// Currency converter for prices
const currencies = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    INR: 83,
    AED: 3.67
};

function convertPrice(amount, fromCurrency = 'USD', toCurrency = 'USD') {
    const usdAmount = amount / currencies[fromCurrency];
    return (usdAmount * currencies[toCurrency]).toFixed(2);
}

// Initialize currency selector if it exists
const currencySelector = document.getElementById('currency-selector');
if (currencySelector) {
    currencySelector.addEventListener('change', (e) => {
        const selectedCurrency = e.target.value;
        const priceElements = document.querySelectorAll('.price');
        
        priceElements.forEach(element => {
            const basePrice = parseFloat(element.getAttribute('data-base-price'));
            const convertedPrice = convertPrice(basePrice, 'USD', selectedCurrency);
            element.textContent = `${selectedCurrency} ${convertedPrice}`;
        });
    });
}

// Guide availability checker
async function checkGuideAvailability(destination, date, time) {
    // This would connect to your backend API
    return new Promise((resolve) => {
        setTimeout(() => {
            const available = Math.random() > 0.3; // 70% chance of availability
            resolve(available);
        }, 1000);
    });
}

// Live chat widget initialization
function initializeLiveChat() {
    const chatButton = document.createElement('div');
    chatButton.className = 'live-chat-button';
    chatButton.innerHTML = '<i class="fas fa-comments"></i>';
    chatButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        cursor: pointer;
        box-shadow: 0 5px 20px rgba(0, 212, 255, 0.5);
        z-index: 9999;
        transition: all 0.3s ease;
    `;
    
    chatButton.addEventListener('mouseenter', () => {
        chatButton.style.transform = 'scale(1.1)';
    });
    
    chatButton.addEventListener('mouseleave', () => {
        chatButton.style.transform = 'scale(1)';
    });
    
    chatButton.addEventListener('click', () => {
        alert('Live chat feature coming soon! For now, please email us at info@liveatlas.com');
    });
    
    document.body.appendChild(chatButton);
}

// Initialize live chat on page load
document.addEventListener('DOMContentLoaded', initializeLiveChat);

// Social share functionality
function shareToSocial(platform, url = window.location.href, title = document.title) {
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// Add share buttons to destination pages
function addShareButtons() {
    const shareContainer = document.querySelector('.share-buttons');
    if (shareContainer) {
        shareContainer.innerHTML = `
            <button onclick="shareToSocial('facebook')" class="share-btn facebook">
                <i class="fab fa-facebook-f"></i>
            </button>
            <button onclick="shareToSocial('twitter')" class="share-btn twitter">
                <i class="fab fa-twitter"></i>
            </button>
            <button onclick="shareToSocial('linkedin')" class="share-btn linkedin">
                <i class="fab fa-linkedin-in"></i>
            </button>
            <button onclick="shareToSocial('whatsapp')" class="share-btn whatsapp">
                <i class="fab fa-whatsapp"></i>
            </button>
        `;
    }
}

// Wishlist functionality
const wishlist = JSON.parse(localStorage.getItem('liveatlas-wishlist')) || [];

function addToWishlist(destination) {
    if (!wishlist.includes(destination)) {
        wishlist.push(destination);
        localStorage.setItem('liveatlas-wishlist', JSON.stringify(wishlist));
        showNotification(`${destination} added to wishlist!`);
        updateWishlistUI();
    }
}

function removeFromWishlist(destination) {
    const index = wishlist.indexOf(destination);
    if (index > -1) {
        wishlist.splice(index, 1);
        localStorage.setItem('liveatlas-wishlist', JSON.stringify(wishlist));
        showNotification(`${destination} removed from wishlist`);
        updateWishlistUI();
    }
}

function updateWishlistUI() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(btn => {
        const destination = btn.getAttribute('data-destination');
        if (wishlist.includes(destination)) {
            btn.classList.add('active');
            btn.querySelector('i').className = 'fas fa-heart';
        } else {
            btn.classList.remove('active');
            btn.querySelector('i').className = 'far fa-heart';
        }
    });
    
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

// Show notification
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: rgba(10, 14, 39, 0.95);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        border: 1px solid rgba(0, 212, 255, 0.5);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize wishlist UI on page load
document.addEventListener('DOMContentLoaded', updateWishlistUI);

// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.className = 'back-to-top';
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--gradient-3);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 9998;
    box-shadow: 0 5px 20px rgba(0, 212, 255, 0.5);
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log(`Page load time: ${entry.loadEventEnd - entry.fetchStart}ms`);
            }
        }
    });
    observer.observe({ entryTypes: ['navigation'] });
}

console.log('✨ LiveAtlas interactive features loaded successfully!');
