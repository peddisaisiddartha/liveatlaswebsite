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

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(30, 20, 30);
scene.add(light);

// Loader
const loader = new THREE.TextureLoader();

// Earth
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(10, 64, 64),
  new THREE.MeshPhongMaterial({
    map: loader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"),
    normalMap: loader.load("https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"),
    specularMap: loader.load("https://threejs.org/examples/textures/planets/earth_specular_2048.jpg"),
    specular: new THREE.Color("grey"),
    shininess: 15
  })
);
earth.position.set(-8, 0, 0);
scene.add(earth);

// Nebula background
const space = new THREE.Mesh(
  new THREE.SphereGeometry(600, 64, 64),
  new THREE.MeshBasicMaterial({
    map: loader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/space.jpg"),
    side: THREE.BackSide
  })
);
scene.add(space);

// Stars
function stars(count, spread, size) {
  const g = new THREE.BufferGeometry();
  const p = [];
  for (let i = 0; i < count; i++) {
    p.push(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread
    );
  }
  g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
  return new THREE.Points(
    g,
    new THREE.PointsMaterial({ color: 0xffffff, size, opacity: 0.8, transparent: true })
  );
}

scene.add(stars(2000, 400, 0.8));
scene.add(stars(3000, 900, 0.4));

// Human astronaut (REAL)
const astronaut = new THREE.Sprite(
  new THREE.SpriteMaterial({
    map: loader.load("https://threejs.org/examples/textures/sprites/astronaut.png"),
    transparent: true
  })
);

astronaut.scale.set(10, 14, 1);
astronaut.position.set(10, 3, 2);
scene.add(astronaut);

// Animation
let t = 0;
function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.0015;
  space.rotation.y += 0.00005;

  t += 0.01;
  astronaut.position.y = 3 + Math.sin(t) * 1.2;
  astronaut.rotation.z = Math.sin(t * 0.5) * 0.1;

  renderer.render(scene, camera);
}

animate();

// Resize fix (CRITICAL)
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
