const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

camera.position.z = 38;

/* LIGHTS */
scene.add(new THREE.AmbientLight(0xffffff, 0.9));
const sun = new THREE.PointLight(0xffffff, 1.6);
sun.position.set(40, 20, 40);
scene.add(sun);

const loader = new THREE.TextureLoader();

/* 🌍 EARTH */
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(10, 64, 64),
  new THREE.MeshPhongMaterial({
    map: loader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"),
    normalMap: loader.load("https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"),
    specularMap: loader.load("https://threejs.org/examples/textures/planets/earth_specular_2048.jpg"),
    shininess: 18
  })
);
earth.position.x = -6;
scene.add(earth);

/* 🌌 NEBULA BACKGROUND (BRIGHT) */
const nebula = new THREE.Mesh(
  new THREE.SphereGeometry(900, 64, 64),
  new THREE.MeshBasicMaterial({
    map: loader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/galaxy_starfield.png"),
    side: THREE.BackSide
  })
);
scene.add(nebula);

/* ⭐ REAL ROUND STARS (NO SQUARES) */
const starTexture = loader.load(
  "https://threejs.org/examples/textures/sprites/disc.png"
);

function createStars(count, spread, size) {
  const geo = new THREE.BufferGeometry();
  const pos = [];

  for (let i = 0; i < count; i++) {
    pos.push(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread
    );
  }

  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));

  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      size: size,
      opacity: 0.9
    })
  );
}

scene.add(createStars(2500, 600, 1.2));
scene.add(createStars(4000, 1200, 0.6));

/* 🧑‍🚀 REAL HUMAN ASTRONAUT (VISIBLE ON LAPTOP) */
const astronaut = new THREE.Sprite(
  new THREE.SpriteMaterial({
    map: loader.load("https://threejs.org/examples/textures/sprites/astronaut.png"),
    transparent: true,
    depthTest: false
  })
);

astronaut.scale.set(12, 18, 1);
astronaut.position.set(12, 4, 6);
scene.add(astronaut);

/* ☄️ SHOOTING STARS */
const meteors = [];
function meteor() {
  const m = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: starTexture,
      color: 0xffffff,
      transparent: true
    })
  );
  m.scale.set(1.2, 1.2, 1);
  m.position.set(80, Math.random() * 40 - 10, -100);
  m.velocity = new THREE.Vector3(-3, -1.5, 1);
  meteors.push(m);
  scene.add(m);
  setTimeout(() => scene.remove(m), 3000);
}
setInterval(meteor, 1400);

/* 🎥 ANIMATION */
let t = 0;
function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.0016;
  nebula.rotation.y += 0.00008;

  t += 0.01;
  astronaut.position.y = 4 + Math.sin(t) * 1.5;
  astronaut.rotation.z = Math.sin(t * 0.4) * 0.1;

  meteors.forEach(m => m.position.add(m.velocity));

  renderer.render(scene, camera);
}
animate();

/* RESIZE */
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
