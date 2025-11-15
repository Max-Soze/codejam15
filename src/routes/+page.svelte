<script lang="ts">
    import { browser } from '$app/environment';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/Addons.js';

    if (browser) {
        console.log("createThree loaded");
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({antialias: true});


        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        camera.position.setZ(30);

        renderer.render(scene, camera);

        const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
        const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
        //const torus = new THREE.Mesh(geometry, material);
        const pillarTexture = new THREE.TextureLoader().load('pillars.avif');
        const earthTexture = new THREE.TextureLoader().load('earth.jpg');
        const torus = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({map: earthTexture}));
        scene.add(torus);

        const pointLight = new THREE.PointLight(0xFFFFFF, 200);
        pointLight.position.set(2, 2, 2);
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 3);
        scene.add(pointLight, ambientLight);

        const lightHelper = new THREE.PointLightHelper(pointLight);
        //const gridHelper = new THREE.GridHelper(200, 50);
        scene.add(lightHelper);//, gridHelper);

        const controls = new OrbitControls(camera, renderer.domElement);

        function addStar() {
            const geometry = new THREE.SphereGeometry(0.25, 24, 24);
            const material = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
            const star = new THREE.Mesh(geometry, material);

            const [x, y, z] = Array(3).fill(undefined).map(() => THREE.MathUtils.randFloatSpread(100));
            star.position.set(x,y,z);
            scene.add(star)
        }

        Array(200).fill(undefined).forEach(addStar);

        const spaceTexture = new THREE.TextureLoader().load('space.jpg');
        scene.background = spaceTexture;

        /*const pillarTexture = new THREE.TextureLoader().load('pillars.avif');
        const pillars = new THREE.Mesh(
            new THREE.BoxGeometry(3,3,3),
            new THREE.MeshBasicMaterial({map: pillarTexture})
        )

        scene.add(pillars);*/

        const moonTexture = new THREE.TextureLoader().load('moon.jpg');
        const bumpyTexture = new THREE.TextureLoader().load('bumpy.avif');
        const moon = new THREE.Mesh(
            new THREE.SphereGeometry(3, 24, 24),
            new THREE.MeshStandardMaterial({
            map: moonTexture,
            normalMap: bumpyTexture
            })
        );
        scene.add(moon);


        function moveCamera() {
            const t = document.body.getBoundingClientRect().top + 3000;

            moon.rotation.x += 0.02;
            moon.rotation.y += 0.03;
            moon.rotation.z += 0.02;

            camera.position.x = t * -0.0002;
            camera.position.y = t * -0.0002;
            camera.position.z = t * -0.01;
        }

        document.body.onscroll = moveCamera;

        function animate() {
            requestAnimationFrame(animate);

            torus.rotation.x += 0.01;
            torus.rotation.y += 0.005;
            torus.rotation.z += 0.01;

            controls.update();
            renderer.render(scene, camera);
        }

        animate();
    }
</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>