const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 30;

const geometry = new THREE.SphereGeometry(10, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  wireframe: true
});

const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

const light = new THREE.PointLight(0xffffff);
light.position.set(20, 20, 20);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.002;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function scrollToPlaces() {
  document.getElementById('places').scrollIntoView({ behavior: 'smooth' });
}
