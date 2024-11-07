import * as THREE from "three";
import gsap from "gsap";

/**
 * [Setup]
 */
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "#6c5ce7" });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();

// Animations
const tick = () => {
    // Time & Delta Time
    // ThreeJS has a built in solution called Clock
    const elapsedTime = clock.getElapsedTime();
    console.log(elapsedTime);

    // mesh.rotation.y = elapsedTime;
    // mesh.rotation.z = elapsedTime;
    // mesh.position.y = Math.sin(elapsedTime);
    // mesh.position.x = Math.cos(elapsedTime);
    // mesh.position.z = Math.sin(elapsedTime);

    // GSAP is also cool for animations
    gsap.to(mesh.position, {
        x: Math.cos(elapsedTime),
    });

    // Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

/**
 * Animation must look the same regardless of the framerate. This is why we have to employ delta time.
 * In animation, delta time (often written as Δt or dt) refers to the amount of time elapsed between the last frame and the current frame.
 * By using delta time, you can base your animation calculations on the actual elapsed time between frames instead of assuming a fixed time.
 * This allows you to scale the movement or changes you make to the object based on the actual time passed.
 * We need to update objects and do a render of each frame. We do this with window.requestAnimationFrame()
 * The purpose of this method is to call the function provided on the next frame.
 */
