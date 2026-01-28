// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 30;

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

// Earth Texture Loader
const textureLoader = new THREE.TextureLoader();

// Real Earth textures (stable CDN)
const earthTexture = textureLoader.load(
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
);

const earthNormal = textureLoader.load(
  "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
);

const earthSpecular = textureLoader.load(
  "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg"
);

// Earth Geometry
const earthGeometry = new THREE.SphereGeometry(10, 64, 64);

// Earth Material (REALISTIC)
const earthMaterial = new THREE.MeshPhongMaterial({
  map: earthTexture,
  normalMap: earthNormal,
  specularMap: earthSpecular,
  specular: new THREE.Color("grey")
});

// Earth Mesh
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Slow realistic rotation
  earth.rotation.y += 0.0015;

  renderer.render(scene, camera);
}

animate();

// Resize handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
