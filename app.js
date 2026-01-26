const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), antialias: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

function addParticle() {
    const geometry = new THREE.SphereGeometry(0.12, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0x00f2ff });
    const particle = new THREE.Mesh(geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    particle.position.set(x, y, z);
    scene.add(particle);
}
Array(200).fill().map(addParticle);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(ambientLight, pointLight);

function animate() {
    requestAnimationFrame(animate);
    scene.children.forEach((obj) => {
        if (obj instanceof THREE.Mesh) {
            obj.position.z += 0.05;
            if (obj.position.z > 35) obj.position.z = -50;
        }
    });
    renderer.render(scene, camera);
}
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
animate();
