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
 * [Basic Object]
 */
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xffabac }),
);
scene.add(mesh);

/**
 * [Perspective Camera]
 */
let camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);

/**
 * [Orthographic Camera]
 */
// Multiply the aspect ratio by the horizontal axis
const aspectRatio = sizes.width / sizes.height;
camera = new THREE.OrthographicCamera(
  -1 * aspectRatio,
  1 * aspectRatio,
  1,
  -1,
  0.1,
  100,
);
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// [Camera Controls]
// You need to reference the camera, and a DOM element to catch mouse events
const orbitControls = new OrbitControls(camera, canvas);
// You can also enable camera damping
orbitControls.enableDamping = true;

// The focus target of the camera. The default is the center of the scene.
// orbitControls.target.y = 2;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

const tick = () => {
  // Whenever you manually change the camera transform, you must call update()
  orbitControls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

/**
 * - Array camera, renders the scene from multiple cameras on specific areas of the render.
 * - Stereo camera, renders the scene through two cameras that mimic the eyes to create a parallax effect. (Great for VR)
 * - Cube camera, does 6 renders each one facing a different direction. Great for rendering surrounding things like environment maps, reflections, or
 * shadow maps.
 * - Orthographic camera, renders the scene without perspective
 * - Perspective camera, renders with perspective
 */

/**
 * Perspective Camera
 *
 * - Field of view (vertical, in degrees, also called fov). Go between 45-75 to avoid distortions. Distortions are
 * caused by the perspective itself.
 *
 * - Aspect ratio, width / height. We want the renderer size to be the same.
 *
 * - Near and far. Correspond how close and how far the camera can see. Using extreme values can cause z-fighting.
 * */

/**
 * Orthographic Camera
 * - left, right, top, bottom
 * - near, far
 * - The cube looks flat because we are rendering a square area into a rectangle canvas. We need to use the canvas ratio.
 */

/**
 * Camera Controls
 * There are many kinds of native camera controls provided by ThreeJS.
 * Device Orientation Controls (Based on device orientation. Doesnt work on ios.)
 * Fly controls (You can rotate on all 3 axes, go forward and backward)
 * First Person Control
 * Pointer lock controls
 * Orbit Controls (Similar to the custom controls)
 * Trackball controls
 */
