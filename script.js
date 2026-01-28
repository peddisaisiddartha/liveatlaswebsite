alert("NEW SCRIPT IS RUNNING");  
// =======================
// SCENE SETUP
// =======================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 40;

// =======================
// LIGHTING
// =======================
scene.add(new THREE.AmbientLight(0xffffff, 0.7));

const pointLight = new THREE.PointLight(0xffffff, 1.4);
pointLight.position.set(40, 20, 40);
scene.add(pointLight);

// =======================
// TEXTURE LOADER
// =======================
const loader = new THREE.TextureLoader();

// =======================
// EARTH (REAL)
// =======================
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(10, 64, 64),
  new THREE.MeshPhongMaterial({
    map: loader.load(
      "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
    ),
    normalMap: loader.load(
      "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
    ),
    specularMap: loader.load(
      "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg"
    ),
    specular: new THREE.Color("grey"),
    shininess: 15
  })
);
scene.add(earth);

// =======================
// NEBULA BACKGROUND
// =======================
const nebula = new THREE.Mesh(
  new THREE.SphereGeometry(600, 64, 64),
  new THREE.MeshBasicMaterial({
    map: loader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/space.jpg"
    ),
    side: THREE.BackSide
  })
);
scene.add(nebula);

// =======================
// STARFIELDS
// =======================
function starField(count, spread, size) {
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
    new THREE.PointsMaterial({ color: 0xffffff, size, opacity: 0.8, transparent: true })
  );
}

const starsNear = starField(2000, 400, 0.9);
const starsFar = starField(3000, 900, 0.4);

scene.add(starsNear);
scene.add(starsFar);

// =======================
// HUMAN ASTRONAUT (REALISTIC)
// =======================

// Astronaut texture (real human, transparent PNG)
const astronautTexture = loader.load(
  "https://threejs.org/examples/textures/sprites/astronaut.png"
);

const astronautMaterial = new THREE.SpriteMaterial({
  map: astronautTexture,
  transparent: true
});

const astronaut = new THREE.Sprite(astronautMaterial);

// Correct human-like scale
astronaut.scale.set(8, 12, 1);

// Position in space (floating beside Earth)
astronaut.position.set(18, 5, -5);

scene.add(astronaut);

// =======================
// SHOOTING STARS
// =======================
const meteors = [];

function spawnMeteor() {
  const meteor = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );

  meteor.position.set(
    Math.random() * 200 - 100,
    Math.random() * 80 + 40,
    -100
  );

  meteor.velocity = new THREE.Vector3(
    -2 - Math.random(),
    -1 - Math.random(),
    1
  );

  meteors.push(meteor);
  scene.add(meteor);

  setTimeout(() => scene.remove(meteor), 3000);
}

setInterval(() => {
  if (meteors.length < 8) spawnMeteor();
}, 1300);

// =======================
// ANIMATION LOOP
// =======================
let floatOffset = 0;

function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.0015;
  nebula.rotation.y += 0.00005;

  starsNear.rotation.y += 0.0003;
  starsFar.rotation.y += 0.00015;

  // Human floating motion (natural)
  floatOffset += 0.01;
  astronaut.position.y = 5 + Math.sin(floatOffset) * 1.2;
  astronaut.rotation.z = Math.sin(floatOffset * 0.5) * 0.05;

  meteors.forEach(m => m.position.add(m.velocity));

  renderer.render(scene, camera);
}

animate();

// =======================
// RESIZE
// =======================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
