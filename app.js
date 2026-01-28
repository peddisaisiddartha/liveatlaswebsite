document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('#threejs-container');
    containers.forEach(container => {
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000022);

        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(0, 0, 10); // Adjusted for better view

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.xr.enabled = true; // Enable WebXR
        container.appendChild(renderer.domElement);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Add directional light
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        // Star field for space background
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
        const stars = new Float32Array(5000 * 3);
        for (let i = 0; i < stars.length; i += 3) {
            stars[i] = (Math.random() - 0.5) * 200;
            stars[i + 1] = (Math.random() - 0.5) * 200;
            stars[i + 2] = (Math.random() - 0.5) * 200;
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(stars, 3));
        const starField = new THREE.Points(starGeometry, starMaterial);
        scene.add(starField);

        // Realistic Earth globe
        const loader = new THREE.TextureLoader();
        const earthTexture = loader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
        const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: earthTexture,
            shininess: 10
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        earth.position.set(-3, 0, 0); // Positioned to the side
        scene.add(earth);

        // Load realistic astronaut GLTF model
        const gltfLoader = new THREE.GLTFLoader();
        let astronautGroup;
        gltfLoader.load(
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Astronaut/glTF/Astronaut.gltf',
            (gltf) => {
                astronautGroup = gltf.scene;
                astronautGroup.scale.set(2, 2, 2); // Scale up for visibility
                astronautGroup.position.set(3, -1, 0); // Position in scene
                astronautGroup.rotation.y = Math.PI / 2; // Rotate to face camera
                scene.add(astronautGroup);
            },
            undefined,
            (error) => {
                console.error('Error loading astronaut model:', error);
            }
        );

        // Controls for non-VR mode
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;

        // Add VR button to enter VR mode
        document.body.appendChild(THREE.VRButton.createButton(renderer));

        // Animation loop with motion
        let time = 0;
        renderer.setAnimationLoop(() => {
            time += 0.01;

            // Rotate Earth
            earth.rotation.y += 0.002;

            // Float astronaut with subtle motion if loaded
            if (astronautGroup) {
                astronautGroup.position.y = Math.sin(time) * 0.5 - 1; // Adjust base y
                astronautGroup.rotation.z = Math.sin(time * 0.5) * 0.1;
            }

            // Twinkle stars (subtle scale)
            starField.rotation.y += 0.0005;

            controls.update();
            renderer.render(scene, camera);
        });

        // Resize handler
        window.addEventListener('resize', () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    });
});
