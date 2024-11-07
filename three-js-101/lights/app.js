import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * [Setup]
 */
// Debug
const gui = new GUI();
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

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * [Lights]
 */

// const ambientLight = new THREE.AmbientLight('#2980b9', 1);
// scene.add(ambientLight);

// const directionaLight = new THREE.DirectionalLight('#1abc9c', 0.9);
// directionaLight.position.set(1, 0.25, 0);
// scene.add(directionaLight);

// // Comment out upper two to see what this looks like
// const hemisphereLight = new THREE.HemisphereLight('#f1c40f', '#e74c3c', 0.9);
// scene.add(hemisphereLight);

// const pointLight = new THREE.PointLight('#e84393', 1.5, 10, 1);
// pointLight.position.set(2, -0.5, 2);
// scene.add(pointLight);

// const rectLight = new THREE.RectAreaLight('#d63031', 6, 1, 1);
// scene.add(rectLight);

const spotLight = new THREE.SpotLight(
  "#c8d6e5",
  4.5,
  12,
  Math.PI * 0.15,
  0.5,
  1,
);
spotLight.position.set(0, 1, 1);

spotLight.target.position.set(0.75, 0, 0);
scene.add(spotLight.target);
scene.add(spotLight);

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

// Light Performance
/**
 *
 * Add at little lights as possible. They cost a lot in terms of performance.
 * Cheap Lights:
 * - Ambient Light
 * - Hemisphere Light
 *
 * Moderate Lights:
 * - Directional Light
 * - Point Light
 *
 * Expensive Lights:
 * SpotLight
 * RectLight
 *
 * Generally prefer to bake the lights into the textures.
 */

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material,
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
