// DATA
const gateways = [
    { name: 'DUBAI_HUB', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800' },
    { name: 'VOSTOK_STATION', img: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=800' },
    { name: 'SHIBUYA_NODE', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800' }
];

const products = [
    { id: 1, name: "ATLAS_X1_GOGGLES", price: 899, img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800" },
    { id: 2, name: "SENSORY_UNIT", price: 1200, img: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800" }
];

// 3D ENGINE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const globe = new THREE.Mesh(new THREE.SphereGeometry(7, 50, 50), new THREE.MeshBasicMaterial({ color: 0x00f2ff, wireframe: true, transparent: true, opacity: 0.05 }));
scene.add(globe);

const stars = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(15000 * 3).map(() => (Math.random()-0.5)*3000), 3)),
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, transparent: true, opacity: 0.5 })
);
scene.add(stars);
camera.position.z = 20;

// CONTENT RENDER
const gatewayList = document.getElementById('gateway-list');
gateways.forEach(g => {
    gatewayList.innerHTML += `
        <div class="tech-card" onclick="openPortal('${g.name}')">
            <img src="${g.img}">
            <h3>${g.name}</h3>
            <button class="btn-neural" style="margin-top:20px; width:100%;">MOUNT HEADSET</button>
        </div>`;
});

const shopList = document.getElementById('product-list');
products.forEach(p => {
    shopList.innerHTML += `<div class="tech-card"><img src="${p.img}"><h3>${p.name}</h3><p>$${p.price}</p><button class="btn-neural" onclick="addToCart(${p.id})" style="margin-top:20px; width:100%;">PROCURE</button></div>`;
});

// FUNCTIONS
let cart = [];
function addToCart(id) { cart.push(products.find(p => p.id === id)); document.getElementById('cart-count').innerText = cart.length; }
function toggleCart() { const m = document.getElementById('cart-modal'); m.style.display = (m.style.display === 'flex') ? 'none' : 'flex'; }

function openPortal(name) {
    document.getElementById('content-root').style.display = 'none';
    document.getElementById('main-nav').style.display = 'none';
    const overlay = document.getElementById('portal-overlay');
    overlay.style.display = 'flex';
    document.getElementById('portal-title').innerText = name;
    document.getElementById('portal-gallery').innerHTML = `
        <img src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200">
        <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200">
    `;
    window.scrollTo(0,0);
}

function closePortal() {
    document.getElementById('portal-overlay').style.display = 'none';
    document.getElementById('content-root').style.display = 'block';
    document.getElementById('main-nav').style.display = 'flex';
}

// ANIMATION
document.addEventListener('mousemove', e => {
    const ring = document.getElementById('cursor-ring');
    ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
    globe.rotation.y = e.clientX * 0.0002; globe.rotation.x = e.clientY * 0.0002;
    document.getElementById('mouse-x').innerText = e.clientX; document.getElementById('mouse-y').innerText = e.clientY;
});

function animate() { requestAnimationFrame(animate); stars.rotation.y += 0.0001; renderer.render(scene, camera); }
animate();
