const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 25;

// LIGHT
scene.add(new THREE.AmbientLight(0xffffff, 1));
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(10, 10, 10);
scene.add(light);

// EARTH (smaller so astronaut is obvious)
const loader = new THREE.TextureLoader();

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(6, 64, 64),
  new THREE.MeshPhongMaterial({
    map: loader.load(
      "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
    )
  })
);
earth.position.set(-6, 0, 0);
scene.add(earth);

// HUGE ASTRONAUT (IMPOSSIBLE TO MISS)
const astronautTexture = loader.load(
  "https://threejs.org/examples/textures/sprites/astronaut.png"
);

const astronaut = new THREE.Sprite(
  new THREE.SpriteMaterial({ map: astronautTexture, transparent: true })
);

// VERY LARGE SCALE
astronaut.scale.set(14, 20, 1);

// FRONT AND CENTER
astronaut.position.set(6, 0, 5);
scene.add(astronaut);

// ANIMATION
let t = 0;
function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.01;

  t += 0.02;
  astronaut.position.y = Math.sin(t) * 2;
  astronaut.rotation.z = Math.sin(t) * 0.2;

  renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
