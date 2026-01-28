// =======================
// SCENE SETUP
// =======================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 32;

// =======================
// LIGHTING
// =======================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(25, 15, 25);
scene.add(pointLight);

// =======================
// EARTH (REALISTIC)
// =======================
const loader = new THREE.TextureLoader();

const earthTexture = loader.load(
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
);
const earthNormal = loader.load(
  "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
);
const earthSpecular = loader.load(
  "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg"
);

const earthGeometry = new THREE.SphereGeometry(10, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({
  map: earthTexture,
  normalMap: earthNormal,
  specularMap: earthSpecular,
  specular: new THREE.Color("grey"),
  shininess: 10
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// =======================
// SPACE BACKGROUND (NEBULA)
// =======================
const spaceTexture = loader.load(
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/space.jpg"
);

const spaceGeometry = new THREE.SphereGeometry(300, 64, 64);
const spaceMaterial = new THREE.MeshBasicMaterial({
  map: spaceTexture,
  side: THREE.BackSide
});

const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
scene.add(space);

// =======================
// STARFIELD (SOFT & CINEMATIC)
// =======================
const starsGeometry = new THREE.BufferGeometry();
const starCount = 3000;
const positions = [];

for (let i = 0; i < starCount; i++) {
  positions.push(
    (Math.random() - 0.5) * 600,
    (Math.random() - 0.5) * 600,
    (Math.random() - 0.5) * 600
  );
}

starsGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);

const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.7,
  transparent: true,
  opacity: 0.8
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// =======================
// ANIMATION LOOP
// =======================
function animate() {
  requestAnimationFrame(animate);

  // Earth rotation
  earth.rotation.y += 0.0015;

  // Subtle space motion
  stars.rotation.y += 0.0002;
  space.rotation.y += 0.00005;

  renderer.render(scene, camera);
}

animate();

// =======================
// RESIZE HANDLING
// =======================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
