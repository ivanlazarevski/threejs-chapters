import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

/**
 * [Texture Loading]
 */
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onLoad = () => {
    console.log("Loading...");
};
loadingManager.onProgress = () => {
    console.log("Progress...");
};
loadingManager.onError = () => {
    console.log("Error...");
};

// Loading Textures
const colorTexture = textureLoader.load("./static/textures/door/color.jpg");
const alphaTexture = textureLoader.load("./static/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("./static/textures/door/height.jpg");
const normalTexture = textureLoader.load("./static/textures/door/normal.jpg");
const ambientOcclusion = textureLoader.load("./static/textures/door/ambientOcclusion.jpg");
const metalnessTexture = textureLoader.load("./static/textures/door/metalness.jpg");
const roughnessTexure = textureLoader.load("./static/textures/door/roughness.jpg");

// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;
// colorTexture.rotation = 0.5;

colorTexture.generateMipmaps = false; // Can disable mipmaps
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

// Textures used as map and matcap are supposed to be encoded in sRGB.
colorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * [Object]
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

/**
 * Textures
 * - Color/Albedo (Simplest)
 * - Alpha (grayscale, white visible, black not visible)
 * - Height (Grayscale, moves the vertices to create 3D effect, needs subdivision)
 * - Normal (Adds details, doesn't need subdiv, vertices wont move, better perf)
 * - Ambient Occlusion (Grayscale, add fake shadows, not physically accurate, helps to create contrast)
 * - Metalness (Grayscale white is metallic, black is non-metallic)
 * - Roughness (Grayscale, works alongside metalness, white is rough, black is smooth, mostly for light dissipation)
 *
 * PBR Principles: Physically based rendering.
 *
 * UV Unwrapping
 */

/**
 * Filtering and Mipmapping
 *
 * Mip Mapping is a technique that works by creating half a smaller version of a texture again
 * and again until we get a 1x1 texture.
 *
 * All those texture variations are sent to the GPU, and the GPU chooses the most appropriate version of the texture
 *
 * Minification Filter
 * Happens when the pixels of the texture are smaller than the pixels of the render
 * Aka, the texture is too big for the surface
 */

/**
 * 3 crucial elements
 * Weight, users have to download the texture, you can compress images
 * Size (resolution) each pixel is stored on the GPU, even worse because mipmapping increases the number of pixels to store
 * Data
 */
