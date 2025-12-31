// Register GSAP Scroll Plugin
gsap.registerPlugin(ScrollToPlugin);

// 1. SETUP THREE.JS SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('bg-canvas'), 
    antialias: true, 
    alpha: true 
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. CREATE THE STARFIELD
const starGeom = new THREE.BufferGeometry();
const starPos = [];
for(let i=0; i<7000; i++) {
    starPos.push((Math.random()-0.5)*1800, (Math.random()-0.5)*1800, (Math.random()-0.5)*1800);
}
starGeom.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
const stars = new THREE.Points(starGeom, new THREE.PointsMaterial({color: 0xffffff, size: 0.7}));
scene.add(stars);

// 3. CREATE THE HOLO-GLOBE
const globeGroup = new THREE.Group();
const globeGeometry = new THREE.SphereGeometry(5, 45, 45);
const globeMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00f2ff, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.15 
});
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
globeGroup.add(globe);
scene.add(globeGroup);

camera.position.z = 15;

// 4. ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    
    // Auto-rotation
    globe.rotation.y += 0.0015;
    stars.rotation.y += 0.0002;

    // Scroll-based scaling
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    globeGroup.scale.set(1 + scrollPercent, 1 + scrollPercent, 1 + scrollPercent);
    globeGroup.position.y = scrollPercent * 5;

    renderer.render(scene, camera);
}
animate();

// 5. INTERACTIVITY
window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) - 0.5;
    const mouseY = (e.clientY / window.innerHeight) - 0.5;
    
    gsap.to(globeGroup.rotation, { 
        x: mouseY * 0.4, 
        y: globeGroup.rotation.y + mouseX * 0.1, 
        duration: 2 
    });
});

function scrollToSection(id) {
    gsap.to(window, { duration: 1.5, scrollTo: id, ease: "power4.inOut" });
}

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
