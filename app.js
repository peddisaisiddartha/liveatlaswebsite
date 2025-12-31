const gateways = [
    { name: 'Dubai_Node', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800' },
    { name: 'Vostok_Station', img: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=800' },
    { name: 'Shibuya_Uplink', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800' }
];

const products = [
    { id: 1, name: "Antarctic Core", price: 250, img: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?auto=format&fit=crop&w=500" },
    { id: 2, name: "Dubai Silk", price: 1200, img: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=500" }
];

// 3D SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const globe = new THREE.Mesh(new THREE.SphereGeometry(6, 60, 60), new THREE.MeshBasicMaterial({ color: 0xbc00ff, wireframe: true, transparent: true, opacity: 0.1 }));
scene.add(globe);
const stars = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(15000 * 3).map(() => (Math.random()-0.5)*2000), 3)), new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 }));
scene.add(stars);
camera.position.z = 15;

// RENDER CONTENT
const gatewayList = document.getElementById('gateway-list');
gateways.forEach(g => {
    gatewayList.innerHTML += `<div class="tech-card" onclick="openPortal('${g.name}')"><img src="${g.img}"><h3>${g.name}</h3><button class="btn-neural">Enter Node</button></div>`;
});

const shopList = document.getElementById('product-list');
products.forEach(p => {
    shopList.innerHTML += `<div class="tech-card"><img src="${p.img}"><h3>${p.name}</h3><p>$${p.price}</p><button class="btn-neural" onclick="addToCart(${p.id})">Procure</button></div>`;
});

// UI LOGIC
let cart = [];
function addToCart(id) { cart.push(products.find(p => p.id === id)); document.getElementById('cart-count').innerText = cart.length; }
function toggleCart() { const modal = document.getElementById('cart-modal'); modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex'; }
function openPortal(name) { document.getElementById('portal-overlay').style.display = 'flex'; document.getElementById('portal-title').innerText = name; }
function closePortal() { document.getElementById('portal-overlay').style.display = 'none'; }

// ANIMATION
document.addEventListener('mousemove', e => {
    const cursor = document.getElementById('cursor-ring');
    cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
    document.getElementById('mouse-x').innerText = (e.clientX / 10).toFixed(2);
    document.getElementById('mouse-y').innerText = (e.clientY / 10).toFixed(2);
});

function animate() { requestAnimationFrame(animate); globe.rotation.y += 0.001; stars.rotation.y += 0.0001; globe.position.y = (window.scrollY / 150); renderer.render(scene, camera); }
animate();
