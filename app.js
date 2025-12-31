const gateways = [
    { name: 'DUBAI_HUB', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800' },
    { name: 'VOSTOK_STATION', img: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=800' },
    { name: 'SHIBUYA_NODE', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800' }
];

const products = [
    { id: 1, name: "ATLAS_X1_GOGGLES", price: 899, img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800" },
    { id: 2, name: "HAPTIC_INTERFACE", price: 450, img: "https://images.unsplash.com/photo-1555616635-640973b06010?auto=format&fit=crop&w=800" },
    { id: 3, name: "SENSORY_NODE", price: 1200, img: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800" }
];

// --- 3D ENVIRONMENT ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const globe = new THREE.Mesh(
    new THREE.SphereGeometry(7, 50, 50),
    new THREE.MeshBasicMaterial({ color: 0x00f2ff, wireframe: true, transparent: true, opacity: 0.05 })
);
scene.add(globe);

const starGeom = new THREE.BufferGeometry();
const starPos = new Float32Array(15000 * 3);
for(let i=0; i<45000; i++) starPos[i] = (Math.random()-0.5)*3000;
starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(starGeom, new THREE.PointsMaterial({ color: 0xffffff, size: 0.6, transparent: true, opacity: 0.4 }));
scene.add(stars);

camera.position.z = 20;

// --- RENDER CONTENT ---
const gatewayList = document.getElementById('gateway-list');
gateways.forEach(g => {
    gatewayList.innerHTML += `
        <div class="tech-card" onclick="openPortal('${g.name}')">
            <img src="${g.img}">
            <h3>${g.name}</h3>
            <p style="color:var(--cyan); font-size:10px; margin-top:10px;">LATENCY: 12ms // 8K STREAM</p>
            <button class="btn-neural" style="margin-top:20px; width:100%;">MOUNT HEADSET</button>
        </div>`;
});

const shopList = document.getElementById('product-list');
products.forEach(p => {
    shopList.innerHTML += `
        <div class="tech-card">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p style="color:var(--cyan); margin-top:10px;">PRICE: $${p.price}</p>
            <button class="btn-neural" style="margin-top:20px; width:100%;">PROCURE</button>
        </div>`;
});

// --- UI LOGIC ---
document.addEventListener('mousemove', e => {
    const ring = document.getElementById('cursor-ring');
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
    
    globe.rotation.y = e.clientX * 0.0003;
    globe.rotation.x = e.clientY * 0.0003;
});

function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0001;
    globe.position.y = (window.scrollY / 500);
    renderer.render(scene, camera);
}
animate();

function openPortal(name) {
    document.getElementById('portal-overlay').style.display = 'flex';
    document.getElementById('portal-title').innerText = name;
}
function closePortal() { document.getElementById('portal-overlay').style.display = 'none'; }
