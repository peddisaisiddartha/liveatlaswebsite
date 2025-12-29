// --- SCENE SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('hero-canvas'), 
    antialias: true,
    alpha: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// --- THE GLOW ENGINE (Post-Processing) ---
const renderScene = new THREE.RenderPass(scene, camera);
const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 
    1.5,  // Strength of the glow
    0.4,  // Radius
    0.85  // Threshold (only bright things glow)
);
const composer = new THREE.EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// --- 3D OBJECTS ---

// 1. Starfield (Deep Space)
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
const starVertices = [];
for (let i = 0; i < 15000; i++) {
    starVertices.push((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, -Math.random() * 2000);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// 2. The Holographic Globe
const globeGroup = new THREE.Group();
const geometry = new THREE.SphereGeometry(5, 50, 50);
const material = new THREE.MeshBasicMaterial({
    color: 0x00f2ff,
    wireframe: true,
    transparent: true,
    opacity: 0.4
});
const globe = new THREE.Mesh(geometry, material);
globeGroup.add(globe);

// Add an inner "Core" for extra brightness
const coreGeom = new THREE.SphereGeometry(4.9, 32, 32);
const coreMat = new THREE.MeshBasicMaterial({ color: 0x002244, transparent: true, opacity: 0.5 });
globeGroup.add(new THREE.Mesh(coreGeom, coreMat));

scene.add(globeGroup);
camera.position.z = 15;

// --- MOTION CAPTURE ---
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
    
    // GSAP for liquid-smooth movement
    gsap.to(globeGroup.rotation, { 
        y: mouseX * 2.5, 
        x: mouseY * 1.5, 
        duration: 2, 
        ease: "power2.out" 
    });
    gsap.to(stars.position, { 
        x: mouseX * 50, 
        y: -mouseY * 50, 
        duration: 5 
    });
});

// --- RENDER LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    // Constant rotation for life
    globe.rotation.y += 0.001;
    
    // Use composer instead of renderer for the glow!
    composer.render(); 
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
